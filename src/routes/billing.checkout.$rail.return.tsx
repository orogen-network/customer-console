import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Card } from "@/components/primitives";

export const Route = createFileRoute("/billing/checkout/$rail/return")({
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { rail } = Route.useParams();
  const railLabel = rail === "stripe" ? "STRIPE" : rail === "coinbase" ? "COINBASE COMMERCE" : "TRANSAK";
  return (
    <div className="mx-auto max-w-[640px] space-y-5 py-12">
      <Card className="text-center">
        <Badge tone="success" dot>payment settled</Badge>
        <h1 className="mt-4 font-display text-display-xl text-crust-100">$ 200.00 credited</h1>
        <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-crystal-400">
          payment settled · {railLabel}
        </p>
        <div className="mt-6 rounded-lg border border-crust-800 bg-crust-1000 p-4 text-left text-[12px]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-crust-500">new balance</span>
            <span className="font-mono text-crust-100">$ 682.10 CUC</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-crust-500">ledger entry</span>
            <span className="font-mono text-crust-300">ldg_2026-05-20-001</span>
          </div>
        </div>
        <Link to="/" className="mx-auto mt-6 inline-flex items-center gap-1.5 rounded-md bg-magma-500 px-4 text-[14px] font-semibold text-crust-950 shadow-btn-primary hover:bg-magma-400" style={{ height: 38 }}>
          Back to dashboard
        </Link>
      </Card>
    </div>
  );
}
