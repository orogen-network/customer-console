import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Btn, Card, Code } from "@/components/primitives";

export const Route = createFileRoute("/billing/")({
  component: Billing,
});

type Rail = "card" | "crypto" | "burn";

function Billing() {
  const [rail, setRail] = useState<Rail>("card");
  const [amount, setAmount] = useState(20);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-title font-semibold text-crust-100">Billing</h1>
        <p className="mt-1 text-[13px] text-crust-400">
          Top up CUC credits. CUC is non-transferable, used to pay the gateway for inference.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <Card title="Current balance" className="col-span-1">
          <div className="font-display text-display-lg text-crust-100">$ 482.10</div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-crust-500">CUC available</div>
        </Card>

        <Card className="col-span-2">
          <div className="flex gap-4 border-b border-crust-800 pb-3 text-[13px]">
            {(["card", "crypto", "burn"] as Rail[]).map((r) => (
              <button
                key={r}
                onClick={() => setRail(r)}
                className={`-mb-3.5 border-b-2 pb-3 transition-colors ${
                  rail === r
                    ? "border-magma-500 text-crust-100"
                    : "border-transparent text-crust-400 hover:text-crust-200"
                }`}
              >
                {r === "card" ? "Card" : r === "crypto" ? "Crypto" : "Wallet burn"}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-crust-500">amount (USD)</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="h-9 rounded-md border border-crust-700 bg-crust-1000 px-3 font-mono text-[14px] text-crust-100 outline-none focus:border-magma-500"
              />
            </label>

            <div className="flex items-center justify-between rounded-md border border-crust-800 bg-crust-1000 px-3 py-2 text-[12px]">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-crust-500">quoted CUC</span>
              <span className="font-mono text-crust-100">$ {(amount * 1.0).toFixed(2)} CUC</span>
            </div>

            {rail === "card" && <Btn variant="primary" size="lg" className="w-full justify-center">Pay with Stripe ↗</Btn>}
            {rail === "crypto" && (
              <>
                <p className="text-[12px] text-crust-400">Send the equivalent in USDC / ETH / BTC. We use Coinbase Commerce.</p>
                <Btn variant="primary" size="lg" className="w-full justify-center">Open crypto checkout ↗</Btn>
              </>
            )}
            {rail === "burn" && (
              <>
                <p className="text-[12px] text-crust-400">
                  Burn OROG through <span className="font-mono">gateway-burn-engine</span>. Live BME rate fetched from chain.
                </p>
                <Code>
{`wallet-cli burn \\
  --amount ${(amount / 0.5).toFixed(3)} OROG \\
  --to gateway-burn-engine \\
  --memo cuc-topup-${Date.now()}`}
                </Code>
                <Badge tone="warn" dot>requires wallet-cli or wallet-extension</Badge>
              </>
            )}
          </div>
        </Card>
      </div>

      <Card title="Recent invoices">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-crust-800 text-left font-mono text-[10.5px] uppercase tracking-wider text-crust-500">
              <th className="py-2 font-medium">date</th>
              <th className="py-2 font-medium">rail</th>
              <th className="py-2 text-right font-medium">amount</th>
              <th className="py-2 text-right font-medium">CUC</th>
              <th className="py-2 text-right font-medium">receipt</th>
            </tr>
          </thead>
          <tbody className="font-mono text-crust-300">
            <tr className="border-b border-crust-900"><td className="py-2.5">2026-05-12</td><td>card</td><td className="text-right">$ 200.00</td><td className="text-right">200.00 CUC</td><td className="text-right text-sky-400">↗</td></tr>
            <tr className="border-b border-crust-900"><td className="py-2.5">2026-04-30</td><td>burn</td><td className="text-right">14.2 OROG</td><td className="text-right">7.10 CUC</td><td className="text-right text-sky-400">↗</td></tr>
            <tr><td className="py-2.5">2026-04-08</td><td>card</td><td className="text-right">$ 100.00</td><td className="text-right">100.00 CUC</td><td className="text-right text-sky-400">↗</td></tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
