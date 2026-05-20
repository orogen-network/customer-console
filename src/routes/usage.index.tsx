import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Card, HashChip } from "@/components/primitives";

export const Route = createFileRoute("/usage/")({
  component: Usage,
});

const SAMPLE_LOG = [
  { id: "req_01J9XB4ZQ", time: "12:43:18", model: "frontier", tokensIn: 412, tokensOut: 187, lat: 184, verdict: "ok" as const },
  { id: "req_01J9XB3KX", time: "12:42:51", model: "dc-premium", tokensIn: 1024, tokensOut: 612, lat: 311, verdict: "sampled" as const },
  { id: "req_01J9XB1MT", time: "12:38:02", model: "edge", tokensIn: 80, tokensOut: 32, lat: 92, verdict: "ok" as const },
  { id: "req_01J9XAXX1", time: "12:27:14", model: "frontier", tokensIn: 612, tokensOut: 401, lat: 209, verdict: "mismatch" as const },
];

function Usage() {
  // Replay heatmap: 200 cells, deterministic-ish demo content.
  const cells = Array.from({ length: 200 }).map((_, i) => {
    const r = (i * 17) % 101;
    if (r < 1) return "mismatch" as const;
    if (r < 8) return "sampled" as const;
    return "clean" as const;
  });

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-title font-semibold text-crust-100">Usage</h1>
          <p className="mt-1 text-[13px] text-crust-400">Spend, latency, and replay verdicts across your requests.</p>
        </div>
        <div className="flex gap-1.5 rounded-md border border-crust-800 bg-crust-900 p-1 text-[12px]">
          {(["24h", "7d", "30d", "custom"] as const).map((w, i) => (
            <button
              key={w}
              className={`rounded px-2.5 py-1 ${i === 1 ? "bg-crust-850 text-crust-100" : "text-crust-400 hover:text-crust-200"}`}
            >
              {w}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <Card title="Spend (7d)">
          <div className="font-mono text-[28px] text-crust-100">$ 27.91</div>
          <div className="font-mono text-[11px] text-crystal-400">−4.2%</div>
        </Card>
        <Card title="Tokens (7d)">
          <div className="font-mono text-[28px] text-crust-100">281,402</div>
          <div className="font-mono text-[11px] text-crust-500">in / out 198K / 83K</div>
        </Card>
        <Card title="Latency (7d)">
          <div className="font-mono text-[20px] text-crust-100">184 ms <span className="text-crust-500">/</span> 612 ms</div>
          <div className="font-mono text-[11px] text-crust-500">p50 / p95</div>
        </Card>
      </div>

      <Card title="Replay verdict heatmap" action={<div className="flex gap-3 text-[11px] font-mono"><span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-crystal-500/70" /> clean</span><span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-magma-500/70" /> sampled</span><span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-ruby-500/80" /> mismatch</span></div>}>
        <div className="grid grid-cols-[repeat(50,minmax(0,1fr))] gap-[3px]">
          {cells.map((v, i) => (
            <div
              key={i}
              className={`aspect-square rounded-sm ${
                v === "clean"
                  ? "bg-crystal-500/50"
                  : v === "sampled"
                    ? "bg-magma-500/60"
                    : "bg-ruby-500/80"
              }`}
              title={v}
            />
          ))}
        </div>
      </Card>

      <Card title="Request log">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-crust-800 text-left font-mono text-[10.5px] uppercase tracking-wider text-crust-500">
              <th className="py-2 font-medium">req_id</th>
              <th className="py-2 font-medium">time</th>
              <th className="py-2 font-medium">model</th>
              <th className="py-2 text-right font-medium">tokens</th>
              <th className="py-2 text-right font-medium">latency</th>
              <th className="py-2 text-right font-medium">verdict</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_LOG.map((r) => (
              <tr key={r.id} className="border-b border-crust-900 hover:bg-crust-850">
                <td className="py-2.5">
                  <Link
                    to="/usage/$requestId"
                    params={{ requestId: r.id }}
                    className="inline-block"
                  >
                    <HashChip value={r.id} lead={10} tail={3} />
                  </Link>
                </td>
                <td className="py-2.5 font-mono text-crust-400">{r.time}</td>
                <td className="py-2.5 font-mono text-crust-300">{r.model}</td>
                <td className="py-2.5 text-right font-mono text-crust-300">{(r.tokensIn + r.tokensOut).toLocaleString()}</td>
                <td className="py-2.5 text-right font-mono text-crust-300">{r.lat}ms</td>
                <td className="py-2.5 text-right">
                  {r.verdict === "ok" && <Badge tone="success" dot>clean</Badge>}
                  {r.verdict === "sampled" && <Badge tone="warn" dot>sampled · clean</Badge>}
                  {r.verdict === "mismatch" && <Badge tone="danger" dot>mismatch</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
