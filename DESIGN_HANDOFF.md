# Design handoff — customer-console

The full design handoff lives under [`design-reference/`](./design-reference/). The bundled README inside that directory is authoritative for tokens, atom specs, screen behaviour, and v0 acceptance criteria.

The high-fidelity JSX previews in `design-reference/design/src/*.jsx` are **not lifted directly** into production. They were built in inline-JSX for fast preview; our production code recreates them in Tailwind + TypeScript per the Orogen split-repo stack.

## Preview the design locally

```sh
cd design-reference/design
# Any static server works; the bundle uses Babel standalone + CDN React.
python3 -m http.server 8765
# open http://localhost:8765
```

## Map: design file → production source

| Design reference | Production source | Notes |
|---|---|---|
| `design-reference/design/src/primitives.jsx` | `src/components/primitives.tsx` | Btn / Badge / StatusDot / HashChip / Card / Code / UnavailablePanel / Kbd / OrogenMark |
| `design-reference/design/src/shell.jsx` | `src/components/AppShell.tsx` | Sidebar (220px / 52px collapsed), Topbar, content frame |
| `design-reference/design/src/charts.jsx` | (TBD — `src/components/charts/*`) | Sparkline, Metric, AreaChart, StackedBar, Heatmap, LatencyBars |
| `design-reference/design/src/onboarding.jsx` | `src/routes/onboarding.tsx` | 5-step first-touch flow |
| `design-reference/design/src/receipt.jsx` | `src/routes/usage.$requestId.tsx` | Envelope artifact, attestation seal, evidence rail |
| `design-reference/design/src/screens-core.jsx` | `src/routes/index.tsx`, `keys.*.tsx`, `usage.*.tsx` | Dashboard, keys, usage |
| `design-reference/design/src/screens-money.jsx` | `src/routes/billing.*.tsx` | Billing top-up + checkout return |
| `design-reference/design/src/screens-org.jsx` | `src/routes/team.tsx`, `settings.tsx` | Team and settings |
| `design-reference/design/src/app.jsx` | (canvas wrapper — not shipped) | Pan/zoom artboard wrapper for preview only |
| `design-reference/design/tweaks-panel.jsx` | (preview only — not shipped) | Designer tweaks panel |

## What the implementation must preserve pixel-accurately

Per the design handoff README:

- **Colors, type scale, spacing, and component states are final.**
- **Onboarding interactions** (step nav, auth tabs, OTP entry, key reveal, streaming curl) reflect intended behaviour — match them.
- **Receipt envelope** must stay calm in clean/sampled-clean. The evidence rail expands **below** the envelope on mismatch; the envelope itself never turns red.
- **Upstream unavailable** treatment (subsidy-dashboard pattern) — never fabricate state.

## Tokens — single source of truth

Tailwind config (`tailwind.config.mjs`) is the source. The `crust` / `magma` / `crystal` palettes match `landing-site/tailwind.config.mjs`; the additions (`crust-1000`, `crust-850`, `crust-50`, `ruby`, `sky`, `violet`, `Instrument Serif` display family) follow the handoff's "extra steps" — the landing-site config will be brought up to parity in a later sweep.
