# customer-console

Authenticated customer console for `app.orogen.network` — keys, credits, usage, receipts.

Sibling repo. Per the Orogen split-repo policy, this lives under `~/repos/orogen-network/` and ships as its own GitHub repo. The console is the customer-facing product surface that pairs with `gateway-router` (API), `billing-bridge` (Stripe / Coinbase / Transak), `gateway-burn-engine` (OROG → CUC), and `chain-indexer` (usage history).

## Stack

- Vite + React 18 + TypeScript
- Tailwind (palette imported from landing-site + the extra steps documented in the design handoff)
- TanStack Router (file-based)
- TanStack Query for server state
- Vitest + Testing Library for unit / component tests

## Run locally

```sh
npm install
npm run dev
# open http://localhost:5173
```

By default in dev mode the console talks to the live `forge-rpc.orogen.network` and `indexer.orogen.network` endpoints over CORS. Override per-upstream with env vars below.

## Environment

| Variable | Purpose |
|---|---|
| `VITE_OROGEN_GATEWAY_URL` | OpenAI-compat inference gateway |
| `VITE_OROGEN_BILLING_BRIDGE_URL` | Stripe / Coinbase / Transak shim |
| `VITE_OROGEN_BURN_ENGINE_URL` | OROG → CUC settlement |
| `VITE_OROGEN_INDEXER_URL` | chain-indexer GraphQL (default: `https://indexer.orogen.network/graphql`) |
| `VITE_OROGEN_FORGE_RPC_URL` | Substrate JSON-RPC (default: `https://forge-rpc.orogen.network`) |
| `VITE_OROGEN_ATTESTATION_EXPLORER_URL` | Receipt deep-dive (default: `https://attestation.orogen.network`) |

**Production builds refuse to start** without the first four. The other two have safe defaults.

## Upstream-unavailable pattern

Every panel that depends on a live service surfaces `{ status: 'unavailable', reason }` instead of stale data when the upstream is unreachable. This mirrors the subsidy-dashboard treatment that landed in stream C. **Never fabricate green data.**

## Design

See `design-reference/` for the high-fidelity design handoff (README + JSX previews). The implementation here recreates those screens in our actual stack — do not lift the JSX directly. See [DESIGN_HANDOFF.md](./DESIGN_HANDOFF.md) for the map from design files to source files.

## v0 acceptance

- A new visitor can sign in → buy $20 of credits → mint one API key → run a curl call → see the call in the log → open the receipt → see operator pubkey + attestation summary, **within 5 minutes**.
- Stripe success redirect from `billing-bridge` lands on `/billing/checkout/stripe/return` showing the credited amount.
- Every upstream-unavailable case is labeled, not faked.
- Production refuses to start without all four required env vars.
- API key secret is shown exactly once.
- Receipt verdict states render correctly: clean · sampled-clean · mismatch.

## Out of scope for v0

Multi-org switching · self-serve enterprise contracts · slashing dispute portal (lives in `governance-tools`) · operator/validator views · mobile-first (desktop-first; tablet-graceful).
