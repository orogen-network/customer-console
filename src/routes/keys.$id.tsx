import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Btn, Card, HashChip } from "@/components/primitives";

export const Route = createFileRoute("/keys/$id")({
  component: KeyDetail,
});

function KeyDetail() {
  const { id } = Route.useParams();
  return (
    <div className="space-y-5">
      <nav className="text-[12px] text-crust-500">
        <Link to="/keys" className="hover:text-crust-300">API keys</Link>
        <span className="mx-1.5">/</span>
        <span className="font-mono text-crust-300">{id}</span>
      </nav>

      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-title font-semibold text-crust-100">{id}</h1>
          <div className="mt-1 flex items-center gap-3 text-[12px] text-crust-400">
            <HashChip value="orog_live_a4f2" lead={9} tail={4} />
            <Badge tone="warn" dot>preview only</Badge>
            <span>representative key state</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" disabled>Rotate unavailable</Btn>
          <Btn variant="danger" disabled>Revoke unavailable</Btn>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <Card title="Preview spend cap" className="col-span-2">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[28px] text-crust-100">$ 234.51 / 500.00</span>
            <span className="font-mono text-[11px] text-crust-500">monthly</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-crust-800">
            <div className="h-1.5 rounded-full bg-crust-600" style={{ width: "47%" }} />
          </div>
        </Card>
        <Card title="Preview scope">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="accent">frontier</Badge>
            <Badge tone="accent">dc-premium</Badge>
          </div>
          <Btn className="mt-3" size="sm" variant="ghost" disabled>Edit unavailable</Btn>
        </Card>
      </div>

      <Card title="Recent IPs · preview data">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-crust-800 text-left font-mono text-[10.5px] uppercase tracking-wider text-crust-500">
              <th className="py-2 font-medium">when</th>
              <th className="py-2 font-medium">ip</th>
              <th className="py-2 text-right font-medium">requests</th>
            </tr>
          </thead>
          <tbody className="font-mono text-crust-300">
            <tr className="border-b border-crust-900"><td className="py-2">2 min ago</td><td>2a01:cb19:8000::1</td><td className="text-right">12,481</td></tr>
            <tr className="border-b border-crust-900"><td className="py-2">12 min ago</td><td>2a01:cb19:8000::1</td><td className="text-right">8,902</td></tr>
            <tr><td className="py-2">yesterday</td><td>2a02:cafe:4::ff</td><td className="text-right">412</td></tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
