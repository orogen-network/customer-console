// GraphQL client for chain-indexer.
// Returns UpstreamResult<T> so panels can render the "unavailable" treatment
// instead of fabricating a zero or fake placeholder.

import { config } from "@/config";
import { probe, type UpstreamResult } from "@/clients/upstream";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function gql<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<UpstreamResult<T>> {
  return probe<T>("indexer", async () => {
    const res = await fetch(config.indexerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`indexer ${res.status}`);
    const body = (await res.json()) as GraphQLResponse<T>;
    if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join("; "));
    if (!body.data) throw new Error("indexer returned no data");
    return body.data;
  });
}

export async function indexerHead(): Promise<UpstreamResult<{ height: number }>> {
  const res = await gql<{ squidStatus: { height: number } }>("{ squidStatus { height } }");
  if (res.status !== "ok") return res;
  return { status: "ok", data: { height: res.data.squidStatus.height } };
}
