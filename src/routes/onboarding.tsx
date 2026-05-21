// First-touch onboarding — hybrid left-rail stepper + right-side stage.
// Recreated from design-reference/design/src/onboarding.jsx. Auth method tabs
// (wallet sr25519 | email magic-link) on step 1; Stripe-default top-up on
// step 2; one-time key reveal on step 3; live curl + streaming response on
// step 4; landing on dashboard with a quest card on step 5.

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Btn, Code, HashChip } from "@/components/primitives";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const STEPS = [
  { id: "signin", label: "Sign in" },
  { id: "topup", label: "Add credit" },
  { id: "mint", label: "Mint key" },
  { id: "curl", label: "First call" },
  { id: "done", label: "Done" },
] as const;

function Onboarding() {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx].id;

  const next = () => setStepIdx((i) => Math.min(STEPS.length - 1, i + 1));

  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-[260px_1fr] gap-10 py-8">
      <aside>
        <h2 className="font-display text-[26px] text-crust-100">Welcome to Orogen</h2>
        <p className="mt-1 text-[13px] text-crust-400">Preview flow; account actions are disabled on the test edge.</p>
        <ol className="mt-6 space-y-1">
          {STEPS.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <li key={s.id} className="flex items-center gap-2.5 py-1.5">
                <span
                  className={`flex size-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                    done
                      ? "bg-crystal-600/30 text-crystal-300"
                      : active
                        ? "bg-magma-500 text-crust-950"
                        : "border border-crust-700 text-crust-500"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={active ? "text-crust-100" : done ? "text-crust-300" : "text-crust-500"}>{s.label}</span>
              </li>
            );
          })}
        </ol>
      </aside>

      <section className="rounded-[10px] border border-crust-800 bg-crust-900 p-8">
        {step === "signin" && <SignInStep onDone={next} />}
        {step === "topup" && <TopUpStep onDone={next} />}
        {step === "mint" && <MintStep onDone={next} />}
        {step === "curl" && <CurlStep onDone={next} />}
        {step === "done" && (
          <DoneStep
            onDone={() => navigate({ to: "/" })}
          />
        )}
      </section>
    </div>
  );
}

function StepFooter({ onDone, label = "Continue" }: { onDone: () => void; label?: string }) {
  return (
    <footer className="mt-6 flex items-center justify-end">
      <Btn variant="primary" size="lg" onClick={onDone}>
        {label}
      </Btn>
    </footer>
  );
}

function SignInStep({ onDone }: { onDone: () => void }) {
  const [method, setMethod] = useState<"wallet" | "email">("wallet");
  return (
    <>
      <h3 className="text-title font-semibold text-crust-100">Sign in</h3>
      <p className="mt-1 text-[13px] text-crust-400">Wallet (sr25519) or email magic link will bind to one org when auth is available.</p>
      <div className="mt-5 flex border-b border-crust-800">
        {(["wallet", "email"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`-mb-px flex-1 border-b-2 pb-3 text-[13px] ${
              method === m ? "border-magma-500 text-crust-100" : "border-transparent text-crust-400 hover:text-crust-200"
            }`}
          >
            {m === "wallet" ? "Wallet" : "Email"}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-3 text-[13px] text-crust-300">
        {method === "wallet" ? (
          <>
            <p>Approve the sr25519 challenge in your wallet extension.</p>
            <Code>{`challenge: sign("orogen-console-login-2026-05-20T14:00Z")`}</Code>
            <Badge tone="warn" dot pulse>waiting for signature</Badge>
          </>
        ) : (
          <>
            <input
              placeholder="you@company.com"
              className="h-10 w-full rounded-md border border-crust-700 bg-crust-1000 px-3 text-crust-100 outline-none focus:border-magma-500"
            />
            <p className="text-[12px] text-crust-500">We&apos;ll send a 6-digit code.</p>
          </>
        )}
      </div>
      <StepFooter onDone={onDone} />
    </>
  );
}

function TopUpStep({ onDone }: { onDone: () => void }) {
  return (
    <>
      <h3 className="text-title font-semibold text-crust-100">Add credit</h3>
      <p className="mt-1 text-[13px] text-crust-400">Preview the credit step. Stripe, crypto, and burn rails are disabled on this test edge.</p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[20, 50, 200].map((a) => (
          <button key={a} className="rounded-lg border border-crust-700 bg-crust-1000 py-3 text-crust-100 hover:border-magma-500">
            <div className="font-mono text-[20px]">${a}</div>
            <div className="font-mono text-[10px] text-crust-500">{a} CUC</div>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11.5px] text-crust-500">
        Billing and burn rails are unavailable on this test edge.
      </p>
      <StepFooter onDone={onDone} label="Preview next step" />
    </>
  );
}

function MintStep({ onDone }: { onDone: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <h3 className="text-title font-semibold text-crust-100">Mint your first key</h3>
      <p className="mt-1 text-[13px] text-crust-400">Representative one-time reveal. Real key minting is disabled on the test edge.</p>
      <div className="mt-5">
        <Code>{`orog_test_4Xq2_aR9k_8mE3_pV7T_xL5N_b1Cz_nF6dJq_m93Z`}</Code>
      </div>
      <label className="mt-4 flex items-start gap-2 text-[12px] text-crust-300">
        <input type="checkbox" checked={copied} onChange={(e) => setCopied(e.target.checked)} className="mt-0.5" />
        I&apos;ve copied this value somewhere safe. I understand it will not be shown again.
      </label>
      <footer className="mt-6 flex justify-end">
        <Btn variant="primary" size="lg" disabled={!copied} onClick={onDone}>
          Continue
        </Btn>
      </footer>
    </>
  );
}

function CurlStep({ onDone }: { onDone: () => void }) {
  return (
    <>
      <h3 className="text-title font-semibold text-crust-100">Make your first call</h3>
      <p className="mt-1 text-[13px] text-crust-400">Drop-in OpenAI-compatible request shape. This is preview syntax, not a live credential.</p>
      <div className="mt-5 space-y-3">
        <Code>{`curl $OROGEN_GATEWAY_URL/v1/chat/completions \\
  -H "Authorization: Bearer orog_test_4Xq2...m93Z" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"orogen-frontier","messages":[{"role":"user","content":"hello"}]}'`}</Code>
        <Code>{`{
  "id": "chatcmpl-01J9XB4ZQ",
  "object": "chat.completion",
  "model": "orogen-frontier",
  "choices": [{"message":{"role":"assistant","content":"Hi! ▌"}}],
  "orogen": { "receipt_id": "req_01J9XB4ZQ", "operator": "0xa290…ae10" }
        }`}</Code>
        <div className="flex items-center gap-2">
          <Badge tone="warn" dot pulse>preview</Badge>
          <span className="text-[12px] text-crust-400">Example receipt opens as <HashChip value="req_01J9XB4ZQ" lead={10} tail={3} /> in the dashboard preview.</span>
        </div>
      </div>
      <StepFooter onDone={onDone} />
    </>
  );
}

function DoneStep({ onDone }: { onDone: () => void }) {
  return (
    <>
      <h3 className="text-title font-semibold text-crust-100">You&apos;re set</h3>
      <p className="mt-1 text-[13px] text-crust-400">Preview complete. Live receipts appear after account services are enabled.</p>
      <div className="mt-5">
        <Badge tone="warn" dot>test preview only</Badge>
      </div>
      <StepFooter onDone={onDone} label="Open dashboard →" />
    </>
  );
}
