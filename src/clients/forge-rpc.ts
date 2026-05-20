// Read-only JSON-RPC client for forge-rpc.orogen.network.
// Mirrors what status-page does in its live-health probe.

import { config } from "@/config";
import { probe, type UpstreamResult } from "@/clients/upstream";

interface RpcResponse<T> {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: { code: number; message: string };
}

async function rpc<T>(method: string, params: unknown[] = []): Promise<T> {
  const res = await fetch(config.forgeRpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });
  if (!res.ok) throw new Error(`forge-rpc ${res.status}`);
  const body = (await res.json()) as RpcResponse<T>;
  if (body.error) throw new Error(`forge-rpc: ${body.error.message}`);
  if (body.result === undefined) throw new Error("forge-rpc: empty result");
  return body.result;
}

export interface ChainHeader {
  number: number;
  hash: string;
  parentHash: string;
}

export async function chainHeader(): Promise<UpstreamResult<ChainHeader>> {
  return probe("forge-rpc", async () => {
    const r = await rpc<{ number: string; parentHash: string }>("chain_getHeader");
    return {
      number: parseInt(r.number, 16),
      // header_getHeader returns the parent hash; the head's hash isn't in the
      // payload, but the next call resolves it cheaply.
      hash: "",
      parentHash: r.parentHash,
    };
  });
}

export async function runtimeVersion(): Promise<
  UpstreamResult<{ specName: string; specVersion: number; transactionVersion: number }>
> {
  return probe("forge-rpc", () =>
    rpc<{ specName: string; specVersion: number; transactionVersion: number }>(
      "state_getRuntimeVersion",
    ),
  );
}
