import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Btn, HashChip } from "@/components/primitives";
import { config } from "@/config";

export const Route = createFileRoute("/usage/$requestId")({
  component: ReceiptDrilldown,
});

// Receipt envelope artifact per design-reference/design/src/receipt.jsx.
// Calm in the 99% case; expands an evidence rail below when verdict=mismatch.

function ReceiptDrilldown() {
  const { requestId } = Route.useParams();
  // For v0, render a representative envelope. Real receipt fetched via gateway
  // and verified client-side using customer-sdk-ts (browser-compat verifier).
  const isMismatch = requestId.endsWith("XX1");

  return (
    <div className="space-y-5">
      <nav className="text-[12px] text-crust-500">
        <Link to="/usage" className="hover:text-crust-300">Usage</Link>
        <span className="mx-1.5">/</span>
        <span className="font-mono text-crust-300">{requestId}</span>
      </nav>

      <ReceiptEnvelope requestId={requestId} isMismatch={isMismatch} />

      {isMismatch && <EvidenceRail requestId={requestId} />}
    </div>
  );
}

function ReceiptEnvelope({ requestId, isMismatch }: { requestId: string; isMismatch: boolean }) {
  return (
    <article className="relative mx-auto max-w-[680px] overflow-hidden rounded-[10px] border border-crust-800 bg-crust-900">
      <Perforation position="top" />
      <div className="grid grid-cols-[1fr_180px] gap-6 px-7 py-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-wider text-crust-500">orogen receipt preview</div>
              <div className="mt-1 flex items-center gap-2">
                <HashChip value={requestId} lead={12} tail={4} />
                {isMismatch ? (
                  <Badge tone="danger" dot>mismatch</Badge>
                ) : (
                  <Badge tone="success" dot>clean</Badge>
                )}
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-y-3 text-[12px]">
            <Field label="time">2026-05-20 12:43:18 UTC</Field>
            <Field label="model"><span className="font-mono text-crust-300">orogen-frontier</span></Field>
            <Field label="operator pubkey" mono><HashChip value="0xa290d5ec4e4cce6ae5a50ba49c856a13e5729c48a79b96ed5ddf4644fad9ae10" lead={10} tail={6} /></Field>
            <Field label="useful_nonce" mono>0x9f4b2c…7d</Field>
            <Field label="response hash" mono><HashChip value="0x2c8b7d4a91e62f0a9b5d3e7c1f4a8d6e2b9c5d8e1f3a7c4d6e8f0b2c4d6e8f0b2" lead={10} tail={6} /></Field>
            <Field label="tokens in / out">412 / 187</Field>
            <Field label="latency"><span className="font-mono text-crust-300">184ms</span></Field>
            <Field label="CUC cost"><span className="font-mono text-crust-300">$ 0.024</span></Field>
          </dl>

          <div className="flex items-center gap-2 pt-3">
            <Badge tone={isMismatch ? "mute" : "success"} dot={!isMismatch}>
              representative signature state
            </Badge>
            <a
              href={config.attestationExplorerUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11.5px] text-sky-400 hover:text-sky-300 hover:underline"
            >
              Open in attestation explorer ↗
            </a>
          </div>
        </div>

        <AttestationSeal isMismatch={isMismatch} />
      </div>
      <Perforation position="bottom" />
    </article>
  );
}

function Field({ label, mono, children }: { label: string; mono?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-wider text-crust-500">{label}</dt>
      <dd className={`mt-0.5 ${mono ? "font-mono text-crust-300" : "text-crust-200"}`}>{children}</dd>
    </div>
  );
}

function AttestationSeal({ isMismatch }: { isMismatch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 self-center text-center">
      <div className={`relative size-32 rounded-full border-2 ${isMismatch ? "border-crust-700" : "border-crystal-500/60"}`}>
        <div className="absolute inset-2 rounded-full border border-dashed border-crust-700" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-[44px] leading-none ${isMismatch ? "text-crust-500" : "text-crystal-400"}`}>
            ✓
          </span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-crust-400">
            tee attested
          </span>
        </div>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-crust-500">intel sgx · sig·ok</div>
    </div>
  );
}

function Perforation({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      className={`h-3 ${position === "top" ? "border-b" : "border-t"} border-dashed border-crust-800 bg-crust-1000`}
      aria-hidden="true"
    />
  );
}

function EvidenceRail({ requestId: _requestId }: { requestId: string }) {
  return (
    <section className="mx-auto max-w-[680px] rounded-[10px] border border-ruby-600/40 bg-ruby-600/5 p-5">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-ruby-300">Mismatch evidence</h3>
        <Badge tone="danger" dot pulse>open dispute</Badge>
      </header>
      <dl className="grid grid-cols-2 gap-y-3 text-[12px]">
        <Field label="original hash" mono><HashChip value="0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef" lead={10} tail={6} /></Field>
        <Field label="replay hash" mono><HashChip value="0x2c8b7d4a91e62f0a9b5d3e7c1f4a8d6e2b9c5d8e1f3a7c4d6e8f0b2c4d6e8f0b2" lead={10} tail={6} /></Field>
        <Field label="sampling validator" mono><HashChip value="0xval_e2e_2024_signer" lead={10} tail={4} /></Field>
        <Field label="evidence id"><HashChip value="evd_01J9XB7K2" lead={10} tail={3} /></Field>
      </dl>
      <Btn className="mt-4" size="sm" variant="secondary">
        View dispute in governance-tools ↗
      </Btn>
    </section>
  );
}
