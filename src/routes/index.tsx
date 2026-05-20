import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, HashChip, StatusDot, UnavailablePanel } from "@/components/primitives";
import { indexerHead } from "@/clients/indexer";
import { runtimeVersion } from "@/clients/forge-rpc";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const SAMPLE_CALLS = [
  {
    id: "req_01J9XB4ZQ",
    time: "2 min ago",
    model: "orogen-frontier",
    keyPrev: "sk_live_a4f2",
    tokensIn: 412,
    tokensOut: 187,
    p50: 184,
    verdict: "ok" as const,
  },
  {
    id: "req_01J9XB3KX",
    time: "4 min ago",
    model: "orogen-dc-premium",
    keyPrev: "sk_live_a4f2",
    tokensIn: 1024,
    tokensOut: 612,
    p50: 311,
    verdict: "sampled" as const,
  },
  {
    id: "req_01J9XB1MT",
    time: "11 min ago",
    model: "orogen-edge",
    keyPrev: "sk_live_99c1",
    tokensIn: 80,
    tokensOut: 32,
    p50: 92,
    verdict: "ok" as const,
  },
];

function Dashboard() {
  const indexer = useQuery({
    queryKey: ["network", "indexer-head"],
    queryFn: indexerHead,
    refetchInterval: 6_000,
    staleTime: 2_000,
  });

  const runtime = useQuery({
    queryKey: ["network", "runtime"],
    queryFn: runtimeVersion,
  });

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-title font-semibold text-crust-100">Dashboard</h1>
          <p className="mt-1 text-[13px] text-crust-400">
            OpenAI-compatible inference, verifiable on-chain. Account usage below is preview data until customer APIs are public-live.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Preview CUC balance" value="$ 482.10" />
        <StatCard label="Preview spend · 30d" value="$ 117.40" delta="+12.4%" deltaTone="warn" />
        <StatCard label="Preview requests · 30d" value="1,204,802" deltaLabel="tokens" />
        <StatCard label="Replay disagreement" value="0.02%" deltaTone="success" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2" title="Recent calls · preview data">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-crust-800 text-left font-mono text-[10.5px] uppercase tracking-wider text-crust-500">
                <th className="py-2 font-medium">req_id</th>
                <th className="py-2 font-medium">when</th>
                <th className="py-2 font-medium">model</th>
                <th className="py-2 font-medium">key</th>
                <th className="py-2 text-right font-medium">tokens in/out</th>
                <th className="py-2 text-right font-medium">p50</th>
                <th className="py-2 text-right font-medium">verdict</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_CALLS.map((r) => (
                <tr key={r.id} className="border-b border-crust-900 hover:bg-crust-850 cursor-pointer">
                  <td className="py-2.5"><HashChip value={r.id} lead={10} tail={3} /></td>
                  <td className="py-2.5 text-crust-400">{r.time}</td>
                  <td className="py-2.5 font-mono text-crust-300">{r.model}</td>
                  <td className="py-2.5"><HashChip value={r.keyPrev} lead={8} tail={4} /></td>
                  <td className="py-2.5 text-right font-mono text-crust-300">
                    {r.tokensIn.toLocaleString()} / {r.tokensOut.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-mono text-crust-300">{r.p50}ms</td>
                  <td className="py-2.5 text-right">
                    {r.verdict === "ok" && <Badge tone="success" dot>clean</Badge>}
                    {r.verdict === "sampled" && <Badge tone="warn" dot>sampled · clean</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Network">
          {indexer.data?.status === "ok" ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-crust-500">indexer head</span>
                <span className="font-mono text-[14px] text-crust-100">#{indexer.data.data.height}</span>
              </div>
              {runtime.data?.status === "ok" && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-crust-500">runtime</span>
                  <span className="font-mono text-[13px] text-crust-200">
                    {runtime.data.data.specName} v{runtime.data.data.specVersion}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <StatusDot tone="success" />
                <span className="text-[12px] text-crust-400">forge testnet · live</span>
              </div>
            </div>
          ) : indexer.data?.status === "unavailable" ? (
            <UnavailablePanel
              upstream="chain-indexer"
              reason={indexer.data.reason}
              onRetry={() => indexer.refetch()}
            />
          ) : (
            <div className="text-[12px] text-crust-500">Loading…</div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  deltaTone = "neutral",
}: {
  label: string;
  value: string;
  delta?: string;
  deltaLabel?: string;
  deltaTone?: "success" | "warn" | "neutral";
}) {
  return (
    <div className="rounded-[10px] border border-crust-800 bg-crust-900 p-4">
      <div className="font-mono text-[10.5px] uppercase tracking-wider text-crust-500">{label}</div>
      <div className="mt-2 font-mono text-[24px] tracking-tight text-crust-100">{value}</div>
      {(delta || deltaLabel) && (
        <div className="mt-1 flex items-center gap-1.5 text-[11px]">
          {delta && (
            <span
              className={
                deltaTone === "success"
                  ? "font-mono text-crystal-400"
                  : deltaTone === "warn"
                    ? "font-mono text-magma-400"
                    : "font-mono text-crust-400"
              }
            >
              {delta}
            </span>
          )}
          {deltaLabel && <span className="font-mono text-crust-500">{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
}
