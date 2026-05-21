import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Btn, Card, HashChip } from "@/components/primitives";

export const Route = createFileRoute("/keys/")({
  component: KeysList,
});

const SAMPLE_KEYS = [
  {
    id: "preview-default",
    name: "preview-default",
    preview: "orog_test_a4f2",
    tiers: ["frontier", "dc-premium"],
    cap: 500,
    used: 234.51,
    lastUsed: "2 min ago",
    lastIp: "2a01:cb19:8000::1",
    status: "active" as const,
  },
  {
    id: "ci-staging",
    name: "ci-staging",
    preview: "orog_test_99c1",
    tiers: ["edge", "chat-rag"],
    cap: 50,
    used: 4.18,
    lastUsed: "yesterday",
    lastIp: "2a02:cafe:4::ff",
    status: "active" as const,
  },
  {
    id: "scratch-old",
    name: "scratch-rotated-2026-04",
    preview: "orog_test_e7da",
    tiers: ["chat-rag"],
    cap: 25,
    used: 0,
    lastUsed: "11 days ago",
    lastIp: "—",
    status: "paused" as const,
  },
];

function KeysList() {
  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-title font-semibold text-crust-100">API keys</h1>
          <p className="mt-1 text-[13px] text-crust-400">
            Bearer token routing appears here once account APIs are available. Rows below are preview data.
          </p>
        </div>
        <Btn variant="primary" disabled>Create key unavailable</Btn>
      </header>

      <Card title="Preview keys">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-crust-800 text-left font-mono text-[10.5px] uppercase tracking-wider text-crust-500">
              <th className="py-2 font-medium">name</th>
              <th className="py-2 font-medium">token</th>
              <th className="py-2 font-medium">scope</th>
              <th className="py-2 text-right font-medium">used / cap</th>
              <th className="py-2 font-medium">last used</th>
              <th className="py-2 font-medium">last ip</th>
              <th className="py-2 font-medium">status</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_KEYS.map((k) => {
              const pct = Math.min(100, Math.round((k.used / k.cap) * 100));
              return (
                <tr key={k.id} className={`border-b border-crust-900 hover:bg-crust-850 ${k.status === "paused" ? "opacity-60" : ""}`}>
                  <td className="py-2.5">
                    <Link to="/keys/$id" params={{ id: k.id }} className="text-crust-200 hover:text-crust-50">
                      {k.name}
                    </Link>
                  </td>
                  <td className="py-2.5"><HashChip value={k.preview} lead={9} tail={4} /></td>
                  <td className="py-2.5">
                    <div className="flex gap-1">
                      {k.tiers.map((t) => (
                        <Badge key={t} tone="neutral">{t}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-crust-200">
                        $ {k.used.toFixed(2)} / {k.cap.toFixed(2)}
                      </span>
                      <div className="h-1 w-24 rounded-full bg-crust-800">
                        <div
                          className={`h-1 rounded-full ${pct > 80 ? "bg-magma-500" : "bg-crust-600"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-crust-400">{k.lastUsed}</td>
                  <td className="py-2.5"><span className="font-mono text-[11px] text-crust-400">{k.lastIp}</span></td>
                  <td className="py-2.5">
                    {k.status === "active" ? (
                      <Badge tone="warn" dot>preview</Badge>
                    ) : (
                      <Badge tone="mute">preview paused</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
