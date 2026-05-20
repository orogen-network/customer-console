# Handoff — Orogen customer console (`app.orogen.network`)

## Overview

This bundle is the v0 design for the authenticated customer surface of Orogen — the
console builders use to manage API keys, credits, usage, and receipts when consuming
the Orogen verifiable-inference network as an OpenAI-compatible endpoint.

It covers the nine routes in the brief, the interactive first-touch onboarding flow,
the receipt drilldown (with calm/sampled/mismatch states), and a system sketch
documenting the tokens and atoms used throughout.

## About the design files

Everything under `design/` is a **design reference built in HTML + inline-JSX** for
preview and iteration. It is **not production code to lift directly**.

The expected handoff workflow is:

1. **Recreate these designs in the target codebase's stack** — per the brief, that is
   **Vite + React + TypeScript + Tailwind + TanStack Router + TanStack Query**, matching
   the rest of the Orogen split-repo family. The proposed sibling repo name is
   `customer-console`.
2. **Use the landing-site Tailwind config as the source of truth for tokens** — the
   `crust`, `magma`, `crystal`, etc. scales below were lifted from there. Don't reinvent
   the palette; import it.
3. **Replace ad-hoc inline styles with Tailwind utility classes** in your reimplementation.
   The design files use inline `style={{}}` objects because that was the fastest path to a
   high-fidelity preview; do not preserve that pattern in production.
4. **Wire data from the real services**: `gateway-router` (keys, usage), `billing-bridge`
   (Stripe), `gateway-burn-engine` (OROG → CUC), `customer-sdk-ts` (sr25519 receipt
   verification, browser-compatible — no `node:crypto`). When an upstream is unavailable,
   the panel must label itself unavailable — **never show green placeholder data**.

## Fidelity

**High-fidelity.** Colors, type scale, spacing, and component states are final and
should be recreated pixel-accurately. Interactions in the onboarding prototype (step
navigation, auth-method tabs, OTP/keymint reveal, streaming curl output) reflect the
intended behavior — match them.

The static screens (dashboard, keys, usage, receipts, billing, team, settings,
checkout-return) show layout, density, and content treatment. Real data should slot
into the same structure; do not redesign these surfaces during implementation.

---

## Stack & technical constraints (from the brief)

| Concern | Decision |
|---|---|
| Frontend | Vite + React + TypeScript + Tailwind |
| Routing | TanStack Router |
| Data | TanStack Query |
| Auth | sr25519 wallet challenge **or** email magic link — both bind to one org |
| API keys | Bearer tokens minted server-side, accepted by `gateway-router`, **shown once** |
| Credit ledger | Off-chain CUC balance at the gateway for low-latency authz |
| Top-ups | Stripe (card) · Coinbase Commerce / Transak (crypto) · OROG burn (`gateway-burn-engine`) |
| Receipt verification | Client-side sr25519 via `customer-sdk-ts` browser verifier (do **not** import `node:crypto`) |
| Attestation drilldown | Link out to `attestation.orogen.network` — do **not** embed the WASM verifier |
| Config | Production refuses to start without `OROGEN_GATEWAY_URL`, `OROGEN_BILLING_BRIDGE_URL`, `OROGEN_BURN_ENGINE_URL`, `OROGEN_INDEXER_URL` |
| Upstream unavailable | Affected panel labels itself unavailable (subsidy-dashboard pattern). Never fake state. |
| CI | Inherit `scripts/install-per-repo-ci.py` + CODEOWNERS |

**Out of scope for v0:** multi-org switching · self-serve enterprise contracts · slashing
dispute portal (lives in `governance-tools`) · operator/validator views · mobile-first
(desktop-first; tablet-graceful; mobile reduced to "see balance, revoke key").

---

## Information architecture

```
/                         dashboard: balance, spend chart, recent calls, key health
/keys                     list + create
/keys/:id                 single key: usage, cap, scope, revoke
/usage                    analytics with selectable window
/usage/:request_id        receipt + attestation + replay drilldown
/billing                  top-up + invoices + payment methods
/billing/checkout/{stripe|coinbase|transak}/return
/team                     members + roles + invites
/settings                 org, default model, webhooks, danger zone
```

---

## Design tokens

All token names below match the existing Tailwind config on the landing site. Import,
don't redefine.

### Color — neutrals (`crust`)

| Token | Hex | Use |
|---|---|---|
| `crust-1000` | `#06080a` | Code blocks, deepest sinks |
| `crust-950` | `#0b0d10` | App background |
| `crust-900` | `#11141a` | Cards, sidebar |
| `crust-850` | `#161a22` | Raised surfaces, hashchips, row hover |
| `crust-800` | `#1a1f29` | Borders default |
| `crust-700` | `#252b38` | Button borders, dividers |
| `crust-600` | `#36404f` | Disabled control |
| `crust-500` | `#4f5b6e` | Eyebrow text, mono labels |
| `crust-400` | `#7c8597` | Secondary body |
| `crust-300` | `#a5acbb` | Body |
| `crust-200` | `#cdd1da` | Strong body |
| `crust-100` | `#e9ebef` | Headings, primary text |
| `crust-50`  | `#f5f6f8` | Inverse highlight |

### Color — accents

| Scale | 600 | 500 | 400 | 300 | Meaning |
|---|---|---|---|---|---|
| `magma`   | `#d97706` | `#f59e0b` | `#fbbf24` | `#fcd34d` | Primary CTA, brand accent, active-nav rail, network activity |
| `crystal` | `#10b981` | `#34d399` | `#6ee7b7` | `#a7f3d0` | Verified / success / replay agreement |
| `ruby`    | `#dc2626` | `#ef4444` | `#f87171` | `#fca5a5` | Mismatch, evidence, danger zone |
| `sky`     | `#0284c7` | `#0ea5e9` | `#38bdf8` | `#7dd3fc` | Info, notice, network meta |
| `violet`  | `#7c3aed` | `#8b5cf6` | `#a78bfa` | —         | Reserved (operator/validator surfaces use this) |

### Typography

- **Inter** — UI, body, numerals. Weights 400 / 500 / 600 / 700.
  CSS features `'cv02','cv03','cv04','ss01'` on the root to match landing site.
- **JetBrains Mono** — hashes, IDs, IPs, mono labels, eyebrows. Weights 400 / 500 / 600.
  Disable `liga` and `calt`; enable `zero`, `ss01`.
- **Instrument Serif** — hero/display numerals only (balance, "$200.00 credited",
  receipt seal "✓"). One signature face; use sparingly.

### Type scale

| Role | Family | Size | Weight | Tracking | Notes |
|---|---|---|---|---|---|
| display-xl | Instrument Serif | 48px / 1.05 | 400 | −0.025em | Hero balance, "Verified inference" |
| display-lg | Instrument Serif | 36px / 1.05 | 400 | −0.025em | Section moments |
| display-md | Instrument Serif | 30px / 1.05 | 400 | −0.025em | Inline big numerals |
| title    | Inter | 22px / 1.2  | 600 | −0.02em  | Page headings |
| h2       | Inter | 16–18px / 1.3 | 600 | −0.015em | Section headers |
| h3       | Inter | 15px / 1.3 | 600 | −0.01em | Card titles |
| body     | Inter | 13px / 1.5 | 400 | 0       | Default body |
| body-sm  | Inter | 12px / 1.45 | 400 | 0       | Table cells, dense rows |
| mono     | JetBrains Mono | 11.5px / 1.4 | 500 | −0.01em | IDs, hashes |
| mono-sm  | JetBrains Mono | 10.5px / 1.3 | 500 | 0.12em uppercase | Eyebrows, labels |

### Spacing & radii

- 4px base. Use the Tailwind default 4-step scale.
- Radii: `4` (chips/kbd), `6` (buttons, small chips), `8` (inputs, code blocks),
  `10` (cards), `999` (badges, avatars).
- Card padding default: `20px`.
- Section header bottom margin: `14px`.
- Table row height: `40px`. Compact: `34px`.

### Shadows

Almost none. The design relies on borders + background contrast, not elevation.
The single exception is the primary button: `inset 0 1px 0 rgba(255,255,255,0.18)`
to suggest tactility on the amber `magma-500` fill.

### Selection

`background: rgba(245,158,11,0.35); color: #fff;` (magma-tinted).

---

## Layout system

- **Desktop-first**, designed at `1440 × 900` artboards.
- **Sidebar:** `220px` wide, collapses to `52px` rail. Sticky org switcher on top,
  network footer on bottom (mainnet · ops/sec · burn rate). Active item gets a `2px`
  left rail in `magma-500` plus `crust-850` background.
- **Topbar:** `52px`, sticky, `rgba(11,13,16,0.85)` + `backdrop-filter: blur(8px)`,
  bottom border `1px crust-800`.
- **Content max-width:** none — the console assumes data benefits from breathing room.
  Use a 12-column implicit grid via CSS Grid where multi-column layouts are needed.
- **Density target:** Vercel/Cloudflare-balanced — comfortable padding, mid-density
  tables. Don't compress to Linear-tight; don't open up to Stripe-airy.

---

## Component vocabulary

The complete set lives in `design/src/primitives.jsx`. Recreate them as typed
React components with Tailwind classes. Headline atoms:

### `Btn`
Variants: `primary` (magma fill, dark text), `secondary` (crust-850 fill,
crust-700 border), `ghost` (transparent), `danger` (transparent + ruby-400 text),
`outline`. Sizes `sm 26px`, `md 32px`, `lg 38px`. Always 6px radius. Supports
`icon` and `iconRight` slots.

### `Badge`
Pill, `2px 8px` padding, `999px` radius, `11px` text, `500` weight. Tones:
`neutral · success · warn · danger · info · accent · mute`. Optional left dot;
pulse animation on `warn`.

### `StatusDot`
Bare colored dot with a `crust * 0x22` halo. Tones map to the same accent scales.

### `HashChip`
Truncates a hash/key/id to `lead…tail`. JetBrains Mono, 11px, `crust-850`
background, `crust-800` border. Used everywhere we display an ID.

### `Tabs`
Underlined-tab strip. Active tab gets `1px magma-500` bottom border, `crust-100`
text. Inactive tabs are `crust-400`. Optional count chip on the right of each
tab label.

### `Card`
`crust-900` background, `crust-800` border, `10px` radius, `20px` padding.
Generic surface — used for metric tiles, table containers, side sheets, etc.

### `Code`
`crust-1000` background, `crust-800` border, `8px` radius, JetBrains Mono `12px`.
Top-right copy affordance. Word-break: break-all.

### `Avatar`
Circular monogram. Deterministic OKLCH hue from name char codes. `1px crust-800`
border. Used in team list, presence chips, recent-actor badges.

### `Kbd`
Inline keyboard hint. `crust-850` + `crust-700` border, 4px radius, 10.5px mono.

### `OrogenMark`
Concentric-arc + anchor-wedge mark (see `primitives.jsx`). Use the existing
landing-site SVG if available; this is a placeholder that captures the silhouette.

### Charts (`src/charts.jsx`)
`Sparkline`, `Metric` (label + display number + delta + spark), `AreaChart`,
`StackedBar`, `Heatmap` (replay verdicts), `LatencyBars` (p50/p95).
These are intentionally non-glossy — thin strokes, soft tint fills, no animation
on initial render in the brief; consider Tailwind's defaults plus a small
`d3-shape` import for path generation in production.

---

## Screens

### 01 · First-touch onboarding (interactive prototype)

**Goal (v0 acceptance):** new visitor signs in → buys $20 of credits → mints one
API key → runs a curl call → sees the call in the log → opens the receipt → sees
operator pubkey + attestation summary, **within 5 minutes**.

**Shape:** hybrid. Left-rail vertical stepper (Sign in → Top-up → Mint key →
First call → Done) + a right-side stage that swaps content per step. After
completion the user lands on the dashboard with a quest card that ticks off
the same five items — covering both the "stepper" and "quest" mental models.

**Sign in:** **equal tabs**, wallet | email. Wallet tab shows "Connect wallet"
button → renders an sr25519 challenge string + "approve in extension" hint and
a spinner waiting for the signature. Email tab shows email input → OTP entry
(6 digits, monospace, auto-advance per digit) + resend timer.

**Top-up:** $20 default, Stripe rail (the other two tabs are present but
visually backgrounded for the onboarding moment). Real-time CUC quote derived
from the live BME rate, shown small under the amount.

**Key mint:** key value displayed **once**, in a `crust-1000` code block with
a single primary CTA "I've copied it — continue". Includes hard-warning copy
("we will never show this value again") and a checkbox the user must tick.

**Test curl:** ready-to-paste `curl` block targeting `gateway-router` with the
freshly minted key prefilled. Below it: a live-streaming response panel that
fills in as the SSE stream arrives. On completion, a "View receipt →" link
opens the receipt drilldown (see below).

**Done:** lands in dashboard with the quest card showing all 5 steps complete
and a "Dismiss" affordance.

### 02.1 · Dashboard (`/`)

- **Hero row:** balance (display-xl, Instrument Serif) + 7-day spend chart
  + key health summary (count by status).
- **Quest card** (toggleable via Tweaks → `showQuest`): five steps from
  onboarding, each with status. Dismissible.
- **Recent calls table:** request_id, time, model, key, tokens, latency,
  status badge. Click row → opens receipt side sheet.
- **Network panel:** live ops/sec, burn rate, operator pool size. If
  `OROGEN_INDEXER_URL` is unavailable, panel labels itself "unavailable" with
  a retry button. **Never green-stub.**

### 02.2 · API Keys (`/keys`)

Table: name · masked preview (`orog_live_4Xq2…m93Z`) · scope chips (model
families + tier) · used-vs-cap progress · last-used timestamp · last-IP ·
created date · status badge · row action (rotate / revoke / open).

"New API key" CTA opens a side sheet: name → model-tier scope → spending cap
slider → create. On create, the resulting key value is revealed **once** in a
code block (same treatment as onboarding) with "I've copied it" confirmation
required before close.

### 02.3 · Key detail (`/keys/:id`)

Per-key usage chart, scope editor, spending cap editor (with current burn rate
projected against cap), last-IP history, rotate (creates new value, old still
valid for 24h with countdown), revoke (immediate, requires typed confirmation).

### 02.4 · Usage analytics (`/usage`)

- **Window picker:** 24h · 7d · 30d · custom.
- **Filters:** key · tier · model.
- **Charts:**
  - Spend over window (stacked area by model family).
  - Tokens in/out per model (stacked bar).
  - p50/p95 latency (paired bar; thin bar overlay).
  - **Replay-disagreement heatmap** — a row of ~200 cells, each a request,
    colored by verdict (clean / sampled-clean / mismatch). The novel chart
    treatment from the brief.
- **Request log table** below charts; click row → 02.5.

### 02.5 · Receipt drilldown (`/usage/:request_id`) — branded **stamp** artifact

The brief called out that this case must not look alarming in the 99% clean
case but must surface mismatch evidence clearly when it happens.

**Default variant (Tweaks → `receiptVariant: 'envelope'`, branded "Stamp"):**

A **receipt envelope** artifact rendered as a card with:
- A perforated top edge (dashed SVG strip).
- A circular **attestation seal** (TEE ATTESTED · INTEL SGX · {model} · SIG·OK)
  with a centered Instrument Serif "✓" — calm crystal-500 in the clean case,
  crust-500 if signature couldn't be verified.
- A **signature fingerprint** rendered as a deterministic 16×8 grid of
  magma-tinted cells derived from the receipt hash (no real crypto — a stable
  visual identity for each receipt).
- Labeled fields: `req_id`, `time`, `model`, `key`, `operator pubkey`,
  `useful_nonce`, `response hash`, replay verdict, tokens in/out, latency,
  CUC cost.
- A **perforated bottom edge** + footer chip indicating signature verification
  status (verified locally via `customer-sdk-ts`).

**Clean / sampled-clean:** the envelope is quiet. Verdict chip = `clean`
(crystal) or `sampled · clean` (warn-tinted). No evidence rail visible.

**Mismatch:** an **evidence rail expands below** the envelope, never on top —
the envelope itself stays calm. Rail shows:
- Original response hash vs. validator-replay hash (diff-highlighted).
- Sampling validator pubkey + replay timestamp.
- Linked slashing evidence ID (`evd_…`) → external link to
  `governance-tools` (do not embed dispute UI in this app).
- Verdict chip flips to `mismatch` (ruby).

**Alternate variants exposed via Tweaks:**
- `chip` — minimal: just a verdict chip in the table row, no envelope expansion.
- `rail` — technical: same fields rendered as a raw side-sheet without the
  envelope chrome.

### 03 · Billing (`/billing`)

Three top-up tabs:
- **Card** — Stripe redirect. Amount input, quoted CUC, "Pay with Stripe" CTA.
- **Crypto** — Coinbase Commerce / Transak. QR + address + countdown.
- **Wallet-burn** — OROG → CUC via `gateway-burn-engine`. Shows live BME-derived
  rate; user signs burn tx in their wallet.

Below tabs: invoice history table + saved payment methods.

### 03.4 · Checkout return (`/billing/checkout/{stripe|coinbase|transak}/return`)

The page Stripe redirects to after success. Big celebratory but-sober card:
"$200.00 credited" in display-xl (Instrument Serif) + crystal eyebrow
"PAYMENT SETTLED · STRIPE", new balance, ledger entry preview, primary CTA
"Back to dashboard". This route exists today as a coming-soon placeholder —
v0 acceptance requires it to land on real credited state.

### 04.1 · Team (`/team`)

Member list table: avatar + name + email + role chip + last seen +
row action (change role / remove). Invite drawer: email + role select.

Roles (exact strings): **Owner · Billing · Developer · Read-only**.

### 04.2 · Settings (`/settings`)

Org name, default model, webhook endpoints (URL + signing secret + retry policy +
last-delivery status). **Danger zone** at the bottom: leave org, delete org —
both require typed confirmation.

---

## Interactions & behavior

- **Hover** on table rows: background → `crust-850`, cursor pointer.
- **Hover** on `Btn secondary`: border → `crust-600`.
- **Active nav item**: `2px magma-500` left rail + `crust-850` background +
  `crust-100` text.
- **Status dot pulse**: 1.8s `ease-in-out` infinite alternate, opacity 0.6 ↔ 1.
  Only used for live/active states (mainnet indicator, OTP-waiting, streaming).
- **Quest card check-off**: 240ms fade + check stroke draw-on.
- **Receipt envelope reveal** (from log row): 200ms slide-in from right as a
  side sheet at `560px` width. Backdrop is `rgba(11,13,16,0.6)`.
- **Mismatch evidence rail expand**: 280ms ease-out, height auto.
- **Streaming curl response**: characters append as SSE events arrive. Cursor
  block (`▌`) blinks at 1Hz while stream open.
- **Copy buttons** flash to `crystal-400` + "copied" for 1200ms.
- **All form validation is inline-below-field**, ruby-400 text, 11.5px.
  Don't pop modal errors.

---

## State management

Per the stack, use **TanStack Query** for all server state. Suggested query keys:

```
['org', orgId]
['keys']                           ['key', keyId]
['usage', { window, keyId? }]      ['usage', requestId]   // single receipt
['billing', 'methods']             ['billing', 'invoices']
['billing', 'quote', { rail, amount }]   // live BME rate, refetchInterval ~5s
['team', 'members']                ['team', 'invites']
['network', 'status']              // ops/sec, burn rate — staleTime 2s, retry off
```

Local state (Zustand or Context):
- Sidebar collapsed (persisted)
- Open side sheet (receipt id | null)
- Active tweak prefs (dev-only; not shipped)

**Upstream-unavailable pattern** (subsidy-dashboard parity): every query that
backs a "live" panel exposes `{ status: 'unavailable', reason }` when the
upstream service is unreachable. The panel renders an "Unavailable" treatment
(crust-500 text, retry button) — **not** a stale snapshot, **not** a zero.

---

## Tweaks (design-time only)

The bundled HTML exposes a tweaks panel for the designer/PM to evaluate
alternates. These are not shipped:

- **Accent** — `magma` (default) / `crystal` / `sky` / `violet`.
- **Receipt variant** — `Stamp` (default, branded envelope) / `Chip` / `Raw`.
- **Show onboarding quest card** — toggle.
- **Collapse sidebar** — toggle.

The reviewer settled on **Stamp** as the default receipt treatment.

---

## Assets

- **Fonts:** Inter, JetBrains Mono, Instrument Serif — all via Google Fonts.
  Already in the Tailwind config on the landing site; reuse that loader.
- **Logo:** `OrogenMark` in `src/primitives.jsx` is a placeholder rendering of
  the silhouette. Replace with the canonical SVG from the landing-site repo.
- **No external imagery.** All visual interest is type, color, and the
  receipt fingerprint/seal SVGs (deterministic — see `src/receipt.jsx`).
- **Icons:** the `Icon` object in `src/primitives.jsx` is a hand-rolled
  16-viewBox stroke set covering the ~24 glyphs used. In production, prefer
  `lucide-react` with the same names where possible — the visual weight
  matches.

---

## Files in this bundle

```
design_handoff_customer_console/
├── README.md                          ← you are here
└── design/
    ├── index.html                     ← entry point, loads everything below
    ├── design-canvas.jsx              ← pan/zoom canvas wrapper (preview only)
    ├── tweaks-panel.jsx               ← tweaks UI (preview only — do not ship)
    └── src/
        ├── primitives.jsx             ← tokens (C, Accent) + atoms (Btn, Badge, …)
        ├── charts.jsx                 ← Sparkline, AreaChart, Heatmap, LatencyBars, Metric
        ├── shell.jsx                  ← Sidebar, Topbar, AppShell
        ├── receipt.jsx                ← Envelope artifact + AttestationSeal + Fingerprint
        ├── screens-core.jsx           ← Dashboard, Keys, KeyDetail, Usage, Receipt
        ├── screens-money.jsx          ← Billing (card/crypto/burn), Checkout return
        ├── screens-org.jsx            ← Team, Settings
        ├── onboarding.jsx             ← Interactive 5-step prototype
        └── app.jsx                    ← Wires all artboards into the design canvas
```

To preview the design, open `design/index.html` in a browser. All artboards
are laid out side-by-side on a pan/zoom canvas; the onboarding prototype is
the first interactive artboard.

---

## v0 acceptance — verifier checklist

Lift these as e2e tests:

- [ ] A new visitor can sign in (wallet or email) → buy $20 of credits → mint
      one API key → run a curl call → see the call in the log → open the
      receipt → see operator pubkey + attestation summary, **within 5 minutes**.
- [ ] Stripe success redirect from `billing-bridge` lands on `/billing/checkout/stripe/return`
      showing the credited amount.
- [ ] Every upstream-unavailable case is labeled, **not faked**. (Manually
      kill `OROGEN_INDEXER_URL` in staging and confirm.)
- [ ] Production refuses to start without all four `OROGEN_*_URL` env vars.
- [ ] API key secret is shown exactly once. Reload the key-detail page and
      confirm the value is no longer retrievable from any client surface.
- [ ] Receipt verdict states render correctly: clean (calm) · sampled-clean
      (calm) · mismatch (evidence rail expands below, envelope stays calm).
- [ ] Role enforcement: Read-only cannot rotate/revoke keys; Developer cannot
      manage billing; only Owner can access danger zone.
