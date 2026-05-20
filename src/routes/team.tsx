import { createFileRoute } from "@tanstack/react-router";
import { Badge, Btn, Card } from "@/components/primitives";

export const Route = createFileRoute("/team")({
  component: Team,
});

const ROLES = ["Owner", "Billing", "Developer", "Read-only"] as const;
type Role = (typeof ROLES)[number];

const MEMBERS: Array<{ name: string; email: string; role: Role; lastSeen: string }> = [
  { name: "Workspace Owner", email: "owner@example.test", role: "Owner", lastSeen: "now" },
  { name: "Billing Admin", email: "billing@example.test", role: "Billing", lastSeen: "2 days ago" },
  { name: "API Developer", email: "developer@example.test", role: "Developer", lastSeen: "12 min ago" },
  { name: "Audit Viewer", email: "viewer@example.test", role: "Read-only", lastSeen: "3 weeks ago" },
];

function Team() {
  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-title font-semibold text-crust-100">Team</h1>
          <p className="mt-1 text-[13px] text-crust-400">
            Members of <span className="font-mono">Acme AI</span>. Roles: Owner · Billing · Developer · Read-only.
          </p>
        </div>
        <Btn variant="primary">Invite member</Btn>
      </header>

      <Card>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-crust-800 text-left font-mono text-[10.5px] uppercase tracking-wider text-crust-500">
              <th className="py-2 font-medium">member</th>
              <th className="py-2 font-medium">role</th>
              <th className="py-2 font-medium">last seen</th>
              <th className="py-2 text-right font-medium" />
            </tr>
          </thead>
          <tbody>
            {MEMBERS.map((m) => (
              <tr key={m.email} className="border-b border-crust-900 hover:bg-crust-850">
                <td className="py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-full border border-crust-800 bg-crust-850 text-[11px] font-medium text-crust-200">
                      {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="text-crust-200">{m.name}</div>
                      <div className="font-mono text-[11px] text-crust-500">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2.5"><Badge tone={m.role === "Owner" ? "accent" : "neutral"}>{m.role}</Badge></td>
                <td className="py-2.5 text-crust-400">{m.lastSeen}</td>
                <td className="py-2.5 text-right"><Btn size="sm" variant="ghost">Manage</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
