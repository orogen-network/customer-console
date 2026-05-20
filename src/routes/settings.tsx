import { createFileRoute } from "@tanstack/react-router";
import { Btn, Card } from "@/components/primitives";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-title font-semibold text-crust-100">Settings</h1>
        <p className="mt-1 text-[13px] text-crust-400">Org configuration, webhooks, defaults, danger zone.</p>
      </header>

      <Card title="Organization">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Org name" defaultValue="Acme AI" />
          <Field label="Default model" defaultValue="orogen-frontier" mono />
        </div>
      </Card>

      <Card title="Webhooks">
        <p className="mb-3 text-[12px] text-crust-400">Notify your systems on settled receipts, slashing evidence, and low-balance events.</p>
        <Field label="Endpoint URL" defaultValue="https://acme.ai/webhooks/orogen" mono />
        <div className="mt-3 grid grid-cols-3 gap-3 text-[12px]">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-crust-500">retry policy</div>
            <div className="mt-0.5 font-mono text-crust-300">exp · 5 retries</div>
          </div>
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-crust-500">last delivery</div>
            <div className="mt-0.5 font-mono text-crystal-400">200 · 2 min ago</div>
          </div>
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-crust-500">signing secret</div>
            <div className="mt-0.5 font-mono text-crust-300">whsec_…a4f2</div>
          </div>
        </div>
      </Card>

      <Card title="Danger zone" className="border-ruby-600/40">
        <div className="space-y-2 text-[13px] text-crust-300">
          <p>Leave organization or delete it permanently. Either requires typed confirmation.</p>
          <div className="flex gap-2 pt-1">
            <Btn variant="danger">Leave org</Btn>
            <Btn variant="danger">Delete org</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, defaultValue, mono }: { label: string; defaultValue: string; mono?: boolean }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10.5px] uppercase tracking-wider text-crust-500">{label}</span>
      <input
        defaultValue={defaultValue}
        className={`h-9 rounded-md border border-crust-700 bg-crust-1000 px-3 text-[13px] text-crust-100 outline-none focus:border-magma-500 ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}
