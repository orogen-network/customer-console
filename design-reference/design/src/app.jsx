// app.jsx — main wiring: design canvas with all artboards + tweaks panel

(function(){

const W = 1440;
const H = 900;

// Tweak defaults — between markers so host can persist edits
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentHex": "#f59e0b",
  "receiptVariant": "envelope",
  "showQuest": true,
  "sidebarCollapsed": false
}/*EDITMODE-END*/;

// Map a hex string back to one of the curated accent objects (so we keep
// matching soft/ring tints). Falls back to magma.
function accentFromHex(hex) {
  const lookup = {
    [C.magma[500].toLowerCase()]: Accent.magma,
    [C.crystal[500].toLowerCase()]: Accent.crystal,
    [C.sky[500].toLowerCase()]: Accent.sky,
    [C.violet[500].toLowerCase()]: Accent.violet,
  };
  return lookup[(hex||'').toLowerCase()] || Accent.magma;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const accent = accentFromHex(t.accentHex);
  const screenProps = {
    accent,
    receiptVariant: t.receiptVariant,
    collapsed: t.sidebarCollapsed,
  };

  return (
    <SidebarContext.Provider value={{ collapsed: t.sidebarCollapsed }}>
      <DesignCanvas>
        {/* ─── Onboarding ─────────────────────────────────── */}
        <DCSection id="onboarding" title="01 · First-touch onboarding"
          subtitle="Interactive prototype + static stage frames — sign-in is wallet OR email (equal tabs), single org bind">
          <DCArtboard id="onboarding-prototype" label="Interactive prototype · all steps" width={W} height={H}>
            <div data-screen-label="Onboarding prototype" style={{ width:W, height:H }}>
              <OnboardingPrototype accent={accent}/>
            </div>
          </DCArtboard>
          <DCArtboard id="onboarding-signin" label="01.1 · Sign in (wallet)" width={W} height={H}>
            <div data-screen-label="01.1 Onboarding · Sign in (wallet)" style={{ width:W, height:H }}>
              <OnboardingPrototype accent={accent} startStep="signin"/>
            </div>
          </DCArtboard>
          <DCArtboard id="onboarding-challenge" label="01.2 · Wallet challenge" width={W} height={H}>
            <div data-screen-label="01.2 Onboarding · Wallet challenge" style={{ width:W, height:H }}>
              <OnboardingPrototype accent={accent} startStep="challenge"/>
            </div>
          </DCArtboard>
          <DCArtboard id="onboarding-topup" label="01.3 · First top-up" width={W} height={H}>
            <div data-screen-label="01.3 Onboarding · Top-up" style={{ width:W, height:H }}>
              <OnboardingPrototype accent={accent} startStep="topup"/>
            </div>
          </DCArtboard>
          <DCArtboard id="onboarding-keymint" label="01.4 · Key minted · shown once" width={W} height={H}>
            <div data-screen-label="01.4 Onboarding · Key mint" style={{ width:W, height:H }}>
              <OnboardingPrototype accent={accent} startStep="keymint"/>
            </div>
          </DCArtboard>
          <DCArtboard id="onboarding-testcall" label="01.5 · First curl · live" width={W} height={H}>
            <div data-screen-label="01.5 Onboarding · Test call" style={{ width:W, height:H }}>
              <OnboardingPrototype accent={accent} startStep="testcall"/>
            </div>
          </DCArtboard>
        </DCSection>

        {/* ─── Console ─────────────────────────────────── */}
        <DCSection id="console" title="02 · Console · daily use"
          subtitle="Dashboard, keys, usage, receipt drilldown — desktop @ 1440">
          <DCArtboard id="dashboard" label="02.1 · Dashboard · with quest" width={W} height={H}>
            <div data-screen-label="02.1 Dashboard" style={{ width:W, height:H }}>
              <ScreenDashboard accent={accent} showQuest={t.showQuest} receiptVariant={t.receiptVariant}/>
            </div>
          </DCArtboard>
          <DCArtboard id="dashboard-clean" label="02.1b · Dashboard · post-onboarding" width={W} height={H}>
            <div data-screen-label="02.1b Dashboard (clean)" style={{ width:W, height:H }}>
              <ScreenDashboard accent={accent} showQuest={false} receiptVariant={t.receiptVariant}/>
            </div>
          </DCArtboard>
          <DCArtboard id="keys" label="02.2 · API keys · list" width={W} height={H}>
            <div data-screen-label="02.2 API Keys" style={{ width:W, height:H }}>
              <ScreenKeys accent={accent}/>
            </div>
          </DCArtboard>
          <DCArtboard id="key-detail" label="02.3 · Key detail · production" width={W} height={H}>
            <div data-screen-label="02.3 Key Detail" style={{ width:W, height:H }}>
              <ScreenKeyDetail accent={accent}/>
            </div>
          </DCArtboard>
          <DCArtboard id="usage" label="02.4 · Usage analytics" width={W} height={H}>
            <div data-screen-label="02.4 Usage" style={{ width:W, height:H }}>
              <ScreenUsage accent={accent}/>
            </div>
          </DCArtboard>
          <DCArtboard id="receipt-clean" label="02.5 · Receipt · clean (99%)" width={W} height={H}>
            <div data-screen-label="02.5 Receipt (clean)" style={{ width:W, height:H }}>
              <ScreenReceipt verdict="clean" receiptVariant={t.receiptVariant} accent={accent}/>
            </div>
          </DCArtboard>
          <DCArtboard id="receipt-sampled" label="02.5b · Receipt · sampled clean" width={W} height={H}>
            <div data-screen-label="02.5b Receipt (sampled)" style={{ width:W, height:H }}>
              <ScreenReceipt verdict="sampled" receiptVariant={t.receiptVariant} accent={accent}/>
            </div>
          </DCArtboard>
          <DCArtboard id="receipt-mismatch" label="02.5c · Receipt · mismatch · evidence rail" width={W} height={H}>
            <div data-screen-label="02.5c Receipt (mismatch)" style={{ width:W, height:H }}>
              <ScreenReceipt verdict="mismatch" receiptVariant={t.receiptVariant} accent={accent}/>
            </div>
          </DCArtboard>
        </DCSection>

        {/* ─── Money ─────────────────────────────────── */}
        <DCSection id="money" title="03 · Money"
          subtitle="Three settlement rails, one CUC ledger — and the Stripe-redirect landing">
          <DCArtboard id="billing-card" label="03.1 · Billing · Card" width={W} height={H}>
            <div data-screen-label="03.1 Billing · Card" style={{ width:W, height:H }}>
              <ScreenBilling method="card" accent={accent}/>
            </div>
          </DCArtboard>
          <DCArtboard id="billing-crypto" label="03.2 · Billing · Crypto" width={W} height={H}>
            <div data-screen-label="03.2 Billing · Crypto" style={{ width:W, height:H }}>
              <ScreenBilling method="crypto" accent={accent}/>
            </div>
          </DCArtboard>
          <DCArtboard id="billing-burn" label="03.3 · Billing · OROG burn" width={W} height={H}>
            <div data-screen-label="03.3 Billing · Burn" style={{ width:W, height:H }}>
              <ScreenBilling method="burn" accent={accent}/>
            </div>
          </DCArtboard>
          <DCArtboard id="checkout-return" label="03.4 · Checkout return · Stripe redirect" width={W} height={H}>
            <div data-screen-label="03.4 Checkout return" style={{ width:W, height:H }}>
              <ScreenCheckoutReturn rail="stripe" accent={accent}/>
            </div>
          </DCArtboard>
        </DCSection>

        {/* ─── Org ─────────────────────────────────── */}
        <DCSection id="org" title="04 · Organization"
          subtitle="Members + roles + invites · org defaults + webhooks + danger zone">
          <DCArtboard id="team" label="04.1 · Team" width={W} height={H}>
            <div data-screen-label="04.1 Team" style={{ width:W, height:H }}>
              <ScreenTeam accent={accent}/>
            </div>
          </DCArtboard>
          <DCArtboard id="settings" label="04.2 · Settings" width={W} height={H}>
            <div data-screen-label="04.2 Settings" style={{ width:W, height:H }}>
              <ScreenSettings accent={accent}/>
            </div>
          </DCArtboard>
        </DCSection>

        {/* ─── System ─────────────────────────────────── */}
        <DCSection id="system" title="05 · System sketch"
          subtitle="The atomic vocabulary the rest of the console is built from">
          <DCArtboard id="system" label="Tokens + components" width={1320} height={840}>
            <SystemSheet accent={accent}/>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent">
          <TweakColor
            label="Brand accent"
            value={t.accentHex}
            onChange={v=>setTweak('accentHex', v)}
            options={[C.magma[500], C.crystal[500], C.sky[500], C.violet[500]]}
          />
        </TweakSection>
        <TweakSection label="Receipt artifact">
          <TweakRadio
            label="Variant"
            value={t.receiptVariant}
            onChange={v=>setTweak('receiptVariant', v)}
            options={[
              { value:'envelope', label:'Stamp' },
              { value:'chip', label:'Chip' },
              { value:'rail', label:'Raw' },
            ]}
          />
        </TweakSection>
        <TweakSection label="Layout">
          <TweakToggle label="Show onboarding quest card" value={t.showQuest} onChange={v=>setTweak('showQuest', v)}/>
          <TweakToggle label="Collapse sidebar" value={t.sidebarCollapsed} onChange={v=>setTweak('sidebarCollapsed', v)}/>
        </TweakSection>
      </TweaksPanel>
    </SidebarContext.Provider>
  );
}

// ────────────────────────────────────────────────────────────────────
// System sheet — palette + type + components at-a-glance
function SystemSheet({ accent }) {
  return (
    <div className="oro-app" style={{
      width:1320, height:840, padding:'32px 36px',
      background:C.crust[950], color:C.crust[100],
      overflow:'hidden',
    }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', borderBottom:`1px solid ${C.crust[800]}`, paddingBottom:18, marginBottom:24 }}>
        <div>
          <div className="mono" style={{ fontSize:11, color:accent.hex, letterSpacing:'0.18em', marginBottom:8 }}>ORN · DESIGN SYSTEM v0</div>
          <h1 className="display" style={{ margin:0, fontSize:36, letterSpacing:'-0.025em', color:C.crust[100] }}>The console vocabulary</h1>
        </div>
        <Mono size={11.5} color={C.crust[500]}>tailwind tokens · /tokens/colors.css · /tokens/type.css</Mono>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24 }}>
        {/* Palette */}
        <div>
          <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12 }}>Crust · neutrals</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(11, 1fr)', gap:3, marginBottom:18 }}>
            {[1000,950,900,850,800,700,600,500,400,300,200,100,50].map(k=>(
              <div key={k} style={{ aspectRatio:'1/1', background:C.crust[k]||'#fff', borderRadius:3, border:`1px solid ${C.crust[800]}`, display:'flex', alignItems:'flex-end', padding:2, fontSize:8, color: k<500?C.crust[400]:C.crust[800], fontFamily:'JetBrains Mono', }}>{k}</div>
            ))}
          </div>

          <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:10 }}>Accents</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <AccentSwatch name="magma" hex={C.magma[500]} note="primary · CTA · activity"/>
            <AccentSwatch name="crystal" hex={C.crystal[500]} note="verified · success · agreement"/>
            <AccentSwatch name="ruby" hex={C.ruby[500]} note="mismatch · evidence · danger"/>
            <AccentSwatch name="sky" hex={C.sky[500]} note="info · notice · network"/>
          </div>
        </div>

        {/* Type */}
        <div>
          <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12 }}>Type</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <TypeRow tag="display · 48 / 1.05 / Instrument Serif" sample={<span className="display" style={{ fontSize:36, color:C.crust[100] }}>Verified inference</span>}/>
            <TypeRow tag="display · 30 / 1.05" sample={<span className="display" style={{ fontSize:30, color:C.crust[100] }}>$487.20</span>}/>
            <TypeRow tag="title · 22 / 600 / Inter" sample={<span style={{ fontSize:22, fontWeight:600, color:C.crust[100], letterSpacing:'-0.02em' }}>Dashboard</span>}/>
            <TypeRow tag="body · 13 / 400" sample={<span style={{ fontSize:13, color:C.crust[300] }}>Last 7 days of inference activity.</span>}/>
            <TypeRow tag="mono · 11.5 / 500 / JetBrains Mono" sample={<Mono size={11.5}>req_8x3qZ4MnL2</Mono>}/>
            <TypeRow tag="eyebrow · 10.5 · 0.14em tracking" sample={<span className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.14em', textTransform:'uppercase' }}>ORG · ORBITAL LABS</span>}/>
          </div>
        </div>

        {/* Components */}
        <div>
          <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12 }}>Atoms</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <Mono size={9.5} color={C.crust[500]} style={{ letterSpacing:'0.1em', display:'block', marginBottom:6 }}>BUTTONS</Mono>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                <Btn kind="primary" accent={accent} size="sm">Mint key</Btn>
                <Btn kind="secondary" size="sm">Rotate</Btn>
                <Btn kind="ghost" size="sm">Cancel</Btn>
                <Btn kind="danger" size="sm">Revoke</Btn>
              </div>
            </div>
            <div>
              <Mono size={9.5} color={C.crust[500]} style={{ letterSpacing:'0.1em', display:'block', marginBottom:6 }}>BADGES</Mono>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                <Badge tone="success" dot>clean</Badge>
                <Badge tone="warn" dot>sampled</Badge>
                <Badge tone="danger" dot>mismatch</Badge>
                <Badge tone="accent" dot>71% cap</Badge>
                <Badge tone="info" dot>info</Badge>
                <Badge tone="mute">tier-A</Badge>
              </div>
            </div>
            <div>
              <Mono size={9.5} color={C.crust[500]} style={{ letterSpacing:'0.1em', display:'block', marginBottom:6 }}>HASH · KEY · ID</Mono>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                <HashChip value="orog_live_4Xq2WmKxR8tBV9qP3sDf" prefix="key" lead={10} tail={4}/>
                <HashChip value="0x84a9f1d5e8b2c3a7d4f8e9c1b5a2f6d3" lead={6} tail={4}/>
              </div>
            </div>
            <div>
              <Mono size={9.5} color={C.crust[500]} style={{ letterSpacing:'0.1em', display:'block', marginBottom:6 }}>METRIC</Mono>
              <div style={{ width:180 }}>
                <Metric label="Credits" value="$487.20" sub="42,118 CUC" delta="+12%" deltaTone="success" spark={[3,4,6,5,8,9,11,14]} sparkColor={accent.hex}/>
              </div>
            </div>
            <div>
              <Mono size={9.5} color={C.crust[500]} style={{ letterSpacing:'0.1em', display:'block', marginBottom:6 }}>SEAL</Mono>
              <AttestationSeal ok size={64}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccentSwatch({ name, hex, note }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:32, height:32, background:hex, borderRadius:6, border:`1px solid ${C.crust[800]}` }}/>
      <div style={{ flex:1 }}>
        <Mono size={11.5} color={C.crust[100]}>{name}</Mono>
        <Mono size={10} color={C.crust[500]}>{note}</Mono>
      </div>
      <Mono size={10.5} color={C.crust[400]}>{hex}</Mono>
    </div>
  );
}

function TypeRow({ tag, sample }) {
  return (
    <div>
      <Mono size={9.5} color={C.crust[500]} style={{ letterSpacing:'0.1em', display:'block', marginBottom:4 }}>{tag}</Mono>
      <div>{sample}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

})();
