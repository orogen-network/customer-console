// screens-money.jsx — Billing, Checkout return

(function(){

const W = 1440;
const H = 900;
const CONTENT_PAD = { px: 28, py: 22 };

// ────────────────────────────────────────────────────────────────────
// BILLING — top-up tabs (Card / Crypto / Wallet-burn), invoices, payment methods
// ────────────────────────────────────────────────────────────────────
function ScreenBilling({ method = 'card', accent = Accent.magma }) {
  return (
    <AppShell active="billing" user="KS"
      breadcrumbs={[{ label:'Billing' }]}>
      <PageHeader
        eyebrow="ORG · ORBITAL LABS"
        title="Billing"
        sub="Top up credits, manage payment methods, and download invoices. Three settlement rails, one CUC ledger."
        actions={<Btn kind="secondary" size="sm" iconRight={<Icon.ext/>}>Tax & legal</Btn>}
      />
      <div style={{ padding:`${CONTENT_PAD.py}px ${CONTENT_PAD.px}px`, display:'grid', gridTemplateColumns:'minmax(0, 1fr) 380px', gap:18 }}>

        <div style={{ display:'flex', flexDirection:'column', gap:18, minWidth:0 }}>
          {/* Top-up panel */}
          <Panel eyebrow="TOP UP" title="Add credits" sub="Quoted at the current BME-derived rate · refreshed every 30s.">
            {/* settlement rail tabs */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, marginBottom:18 }}>
              <RailTab id="card" active={method==='card'} title="Card"
                sub="Stripe · 3DS · instant"
                rate="$1.00 → 100 CUC"
                icon={<Icon.wallet/>}/>
              <RailTab id="crypto" active={method==='crypto'} title="Crypto"
                sub="USDC / USDT / ETH · 6 conf"
                rate="$1.00 → 101.2 CUC"
                badge={<Badge tone="success">+1.2%</Badge>}
                icon={<Icon.link/>}/>
              <RailTab id="burn" active={method==='burn'} title="Wallet burn"
                sub="OROG → CUC · gateway-burn"
                rate="1 OROG → 10.6 CUC"
                badge={<Badge tone="accent">native</Badge>}
                icon={<Icon.bolt/>}/>
            </div>

            {/* Active rail content */}
            {method === 'card' && <CardRail accent={accent}/>}
            {method === 'crypto' && <CryptoRail accent={accent}/>}
            {method === 'burn' && <BurnRail accent={accent}/>}
          </Panel>

          {/* Invoices */}
          <Panel eyebrow="INVOICES" title="History · last 12 months" padding={0} action={<Btn kind="ghost" size="sm" icon={<Icon.download/>}>All CSV</Btn>}>
            <Table
              columns={[
                { label:'Invoice', w:'180px', cell: r=> <Mono size={11.5} color={C.crust[100]}>{r.id}</Mono> },
                { label:'Date', w:'130px', cell: r=> <span style={{ fontSize:12.5, color:C.crust[200] }}>{r.date}</span> },
                { label:'Rail', w:'120px', cell: r=>(
                  <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:C.crust[300] }}>
                    {r.rail==='card'?<Icon.wallet/>:r.rail==='crypto'?<Icon.link/>:<Icon.bolt color={accent.hex}/>}
                    {r.rail}
                  </span>
                ) },
                { label:'Amount', w:'120px', align:'right', cell: r=> <Mono size={12} color={C.crust[100]}>{r.amount}</Mono> },
                { label:'Credits', w:'110px', align:'right', cell: r=> <Mono size={11.5} color={C.crystal[400]}>+{r.credits} CUC</Mono> },
                { label:'Status', w:'120px', cell: r=> <Badge tone={r.status==='paid'?'success':r.status==='pending'?'warn':'danger'} dot>{r.status}</Badge> },
                { label:'', w:'60px', align:'right', cell: ()=> <Icon.download color={C.crust[400]}/> },
              ]}
              rows={[
                { id:'in_8x_a4Kp9', date:'May 18, 2026', rail:'card', amount:'$200.00', credits:'20,000', status:'paid' },
                { id:'in_8x_9rNz2', date:'May 02, 2026', rail:'crypto', amount:'$500.00', credits:'50,600', status:'paid' },
                { id:'in_8x_8mLqW', date:'Apr 18, 2026', rail:'burn', amount:'18.4 OROG', credits:'19,504', status:'paid' },
                { id:'in_8x_7kJpV', date:'Apr 02, 2026', rail:'card', amount:'$200.00', credits:'20,000', status:'paid' },
                { id:'in_8x_6hMnT', date:'Mar 22, 2026', rail:'card', amount:'$50.00', credits:'5,000', status:'refunded' },
                { id:'in_8x_5gKlS', date:'Mar 14, 2026', rail:'card', amount:'$20.00', credits:'2,000', status:'paid' },
              ]}
            />
          </Panel>
        </div>

        {/* Side rail */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Big balance card */}
          <Panel padding={20} style={{
            background:`linear-gradient(160deg, ${C.crust[900]} 0%, rgba(245,158,11,0.04) 100%)`,
            borderColor:'rgba(245,158,11,0.18)',
          }}>
            <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8 }}>Credit balance</div>
            <div className="display" style={{ fontSize:48, lineHeight:1.05, letterSpacing:'-0.025em', color:C.crust[100] }}>
              $487<span style={{ fontSize:30, color:C.crust[400] }}>.20</span>
            </div>
            <Mono size={11.5} color={C.crust[400]}>42,118 CUC · burns at ~$11.40 / day</Mono>
            <div style={{ marginTop:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <Mono size={10.5} color={C.crust[500]}>RUNWAY</Mono>
                <Mono size={11} color={accent.hex}>~42 days</Mono>
              </div>
              <div style={{ height:5, background:C.crust[800], borderRadius:3, overflow:'hidden' }}>
                <div style={{
                  width:'72%', height:'100%',
                  background:`linear-gradient(90deg, ${C.crystal[500]} 0%, ${accent.hex} 100%)`,
                }}/>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="PAYMENT METHODS" title="On file" action={<Btn kind="ghost" size="sm" icon={<Icon.plus/>}>Add</Btn>}>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <PMRow type="card" label="Visa" tail="4242" sub="Exp 04/29 · default"/>
              <PMRow type="card" label="Mastercard" tail="0982" sub="Exp 11/27"/>
              <PMRow type="wallet" label="Wallet" tail="5GrwvaEF…NoHGKutQY" sub="sr25519 · primary"/>
            </div>
          </Panel>

          <Panel eyebrow="AUTO TOP-UP" title="Refill below threshold" action={<Toggle on/>}>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <Stat2 label="Trigger when below" value="$100.00"/>
              <Stat2 label="Refill amount" value="$200.00"/>
              <Stat2 label="Pay with" value="visa · 4242"/>
              <Divider/>
              <Mono size={10.5} color={C.crust[500]} style={{ lineHeight:1.5 }}>
                Last fired May 18 · settled in 4 sec via Stripe webhook. Cap $1,000 / 30d.
              </Mono>
            </div>
          </Panel>

          <Notice
            tone="warn"
            icon={<Icon.warn/>}
            title="Coinbase Commerce — degraded"
            body="6-block confirmation lag at 14 min. Card and Wallet-burn unaffected."
          />
        </div>
      </div>
    </AppShell>
  );
}

function RailTab({ id, active, title, sub, rate, icon, badge }) {
  return (
    <div style={{
      padding:'14px', borderRadius:9,
      background: active ? C.crust[850] : C.crust[900],
      border: `1px solid ${active ? Accent.magma.hex : C.crust[800]}`,
      cursor:'pointer', position:'relative', overflow:'hidden',
    }}>
      {active && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:Accent.magma.hex }}/>}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
        <span style={{ color: active ? C.magma[400] : C.crust[400] }}>{icon}</span>
        <span style={{ fontSize:13.5, fontWeight:600, color: active ? C.crust[100] : C.crust[200] }}>{title}</span>
        {badge}
      </div>
      <div style={{ fontSize:11.5, color:C.crust[400], marginBottom:6 }}>{sub}</div>
      <Mono size={10.5} color={active ? C.magma[400] : C.crust[500]}>{rate}</Mono>
    </div>
  );
}

function CardRail({ accent }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
      <div>
        <label className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase' }}>Amount (USD)</label>
        <div style={{ marginTop:8, display:'flex', gap:6 }}>
          {['$20','$50','$200','$1,000','custom'].map((a,i)=>(
            <div key={i} style={{
              flex:1, padding:'10px 8px', textAlign:'center', fontSize:12.5, fontWeight:500,
              border:`1px solid ${a==='$200'?accent.hex:C.crust[800]}`,
              borderRadius:7, cursor:'pointer',
              background: a==='$200' ? `rgba(245,158,11,0.06)` : C.crust[850],
              color: a==='$200' ? accent.hex : C.crust[200],
            }}>{a}</div>
          ))}
        </div>
        <div style={{ marginTop:14, padding:'14px 14px 12px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:9 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontSize:12, color:C.crust[400] }}>Pay</span>
            <span className="display" style={{ fontSize:22, color:C.crust[100] }}>$200.00</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontSize:12, color:C.crust[400] }}>Receive</span>
            <span className="display" style={{ fontSize:22, color:C.crystal[400] }}>20,000 CUC</span>
          </div>
          <Divider/>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
            <Mono size={10.5} color={C.crust[500]}>rate</Mono>
            <Mono size={10.5} color={C.crust[300]}>$1.00 = 100 CUC</Mono>
          </div>
        </div>
      </div>

      <div>
        <label className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase' }}>Pay with</label>
        <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:6 }}>
          <PMSelectRow active type="card" label="Visa" tail="4242" sub="Default"/>
          <PMSelectRow type="card" label="Mastercard" tail="0982" sub="Exp 11/27"/>
          <PMSelectRow type="add" label="+ Add new card" sub=""/>
        </div>
        <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:7, fontSize:12, color:C.crust[300] }}>
            <input type="checkbox" defaultChecked style={{ accentColor: accent.hex }}/>
            Save card for auto-refill
          </label>
          <Btn kind="primary" size="lg" accent={accent} style={{ width:'100%', justifyContent:'center', marginTop:6 }} iconRight={<Icon.chev/>}>
            Pay $200 & top up
          </Btn>
          <Mono size={10.5} color={C.crust[500]} style={{ textAlign:'center', marginTop:4 }}>
            3DS-protected · webhook-idempotent · refund 7d
          </Mono>
        </div>
      </div>
    </div>
  );
}

function CryptoRail({ accent }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
      <div>
        <label className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase' }}>Asset</label>
        <div style={{ marginTop:8, display:'flex', gap:6 }}>
          {['USDC','USDT','ETH','BTC'].map((a,i)=>(
            <div key={i} style={{
              flex:1, padding:'10px 8px', textAlign:'center', fontSize:12.5, fontWeight:500,
              border:`1px solid ${a==='USDC'?accent.hex:C.crust[800]}`,
              borderRadius:7, cursor:'pointer',
              background: a==='USDC' ? `rgba(245,158,11,0.06)` : C.crust[850],
              color: a==='USDC' ? accent.hex : C.crust[200],
            }}>{a}</div>
          ))}
        </div>
        <div style={{ marginTop:14, padding:'14px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:9 }}>
          <Mono size={10.5} color={C.crust[500]} style={{ letterSpacing:'0.12em', textTransform:'uppercase' }}>Send to</Mono>
          <div style={{ display:'flex', gap:14, marginTop:10, alignItems:'center' }}>
            <div style={{ width:80, height:80, background:C.crust[900], border:`1px solid ${C.crust[700]}`, borderRadius:6, padding:6, display:'grid', gridTemplateColumns:'repeat(10,1fr)', gridTemplateRows:'repeat(10,1fr)', gap:1 }}>
              {Array.from({length:100}).map((_,i)=>(
                <div key={i} style={{ background: Math.random()>0.5 ? C.crust[100] : 'transparent' }}/>
              ))}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <Mono size={10.5} color={C.crust[500]}>USDC · base mainnet</Mono>
              <Mono size={11} color={C.crust[100]} style={{ marginTop:6, display:'block', wordBreak:'break-all', lineHeight:1.5 }}>
                0x4A2c8d…fE91 (uniq · expires 30 min)
              </Mono>
              <Btn kind="ghost" size="sm" icon={<Icon.copy/>} style={{ marginTop:6, padding:0 }}>Copy address</Btn>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase' }}>Quote</label>
        <div style={{ marginTop:8, padding:'14px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:9 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:12, color:C.crust[400] }}>Send</span>
            <Mono size={14} color={C.crust[100]}>500.00 USDC</Mono>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:12, color:C.crust[400] }}>Rate bonus</span>
            <Mono size={12} color={C.crystal[400]}>+1.2%</Mono>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:12, color:C.crust[400] }}>Gas (base)</span>
            <Mono size={12} color={C.crust[200]}>0.06 USDC</Mono>
          </div>
          <Divider style={{ margin:'10px 0' }}/>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:12, color:C.crust[400] }}>Receive</span>
            <span className="display" style={{ fontSize:20, color:C.crystal[400] }}>50,600 CUC</span>
          </div>
          <Mono size={10.5} color={C.crust[500]} style={{ display:'block', marginTop:4 }}>
            credited after 6 confirmations · ~10 min
          </Mono>
        </div>
        <Notice
          tone="warn" icon={<Icon.warn/>}
          title="Coinbase Commerce — degraded"
          body="Transak failover armed. ETH path unaffected."
          style={{ marginTop:10 }}
        />
      </div>
    </div>
  );
}

function BurnRail({ accent }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
      <div>
        <label className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase' }}>OROG to burn</label>
        <div style={{ marginTop:8, padding:'18px 14px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:9, position:'relative' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
            <span className="display" style={{ fontSize:36, color:C.crust[100], lineHeight:1 }}>1,840.00</span>
            <Mono size={13} color={accent.hex}>OROG</Mono>
          </div>
          <Mono size={11} color={C.crust[500]} style={{ display:'block', marginTop:6 }}>
            wallet balance · 14,210.62 OROG
          </Mono>
          <div style={{ display:'flex', gap:5, marginTop:14 }}>
            {['10%','25%','50%','max'].map(s=>(
              <div key={s} style={{ flex:1, padding:'6px 8px', textAlign:'center', border:`1px solid ${C.crust[800]}`, borderRadius:5, fontSize:11.5, color:C.crust[300], cursor:'pointer', background:C.crust[900] }}>{s}</div>
            ))}
          </div>
        </div>
        <Notice tone="info" icon={<Icon.info/>}
          title="Burn is irreversible."
          body="OROG → CUC permanently removes tokens from supply via gateway-burn-engine. Quote held for 60s."
          style={{ marginTop:10 }}/>
      </div>

      <div>
        <label className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase' }}>Receive</label>
        <div style={{ marginTop:8, padding:'18px 14px', background:`rgba(52,211,153,0.04)`, border:`1px solid rgba(52,211,153,0.18)`, borderRadius:9 }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
            <span className="display" style={{ fontSize:36, color:C.crystal[400], lineHeight:1 }}>19,504</span>
            <Mono size={13} color={C.crystal[400]}>CUC</Mono>
          </div>
          <Mono size={11} color={C.crust[500]} style={{ display:'block', marginTop:6 }}>
            ≈ $195.04 — settles in ~12 s
          </Mono>
        </div>
        <div style={{ marginTop:14, padding:'14px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:9 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:12, color:C.crust[400] }}>Rate (live)</span>
            <Mono size={12} color={C.crust[100]}>1 OROG = 10.6 CUC</Mono>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:12, color:C.crust[400] }}>BME window</span>
            <Mono size={12} color={C.crust[200]}>epoch 1,418</Mono>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, color:C.crust[400] }}>Network fee</span>
            <Mono size={12} color={C.crust[200]}>0.018 OROG</Mono>
          </div>
        </div>
        <Btn kind="primary" size="lg" accent={accent} style={{ width:'100%', justifyContent:'center', marginTop:14 }} icon={<Icon.bolt/>}>
          Burn 1,840 OROG · sign with wallet
        </Btn>
      </div>
    </div>
  );
}

function PMRow({ type, label, tail, sub }) {
  return (
    <div className="row" style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:7 }}>
      <div style={{
        width:30, height:22, borderRadius:4, background:C.crust[900], border:`1px solid ${C.crust[700]}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color:C.crust[300],
      }}>{type==='card'?<Icon.wallet/>:<Icon.shield/>}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', gap:6 }}>
          <span style={{ fontSize:12, fontWeight:500, color:C.crust[100] }}>{label}</span>
          <Mono size={10.5} color={C.crust[400]}>•••• {tail.length>6 ? `${tail.slice(0,4)}…${tail.slice(-4)}` : tail}</Mono>
        </div>
        <Mono size={10} color={C.crust[500]}>{sub}</Mono>
      </div>
      <Icon.dots color={C.crust[500]}/>
    </div>
  );
}

function PMSelectRow({ type, label, tail, sub, active }) {
  if (type === 'add') {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'10px', border:`1px dashed ${C.crust[700]}`, borderRadius:7, color:C.crust[400], fontSize:12.5, cursor:'pointer' }}>{label}</div>
    );
  }
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
      background: active ? `rgba(245,158,11,0.04)` : C.crust[850],
      border:`1px solid ${active ? Accent.magma.hex : C.crust[800]}`,
      borderRadius:7, cursor:'pointer',
    }}>
      <span style={{ width:14, height:14, borderRadius:7, border:`1.5px solid ${active?Accent.magma.hex:C.crust[600]}`, position:'relative' }}>
        {active && <span style={{ position:'absolute', inset:3, borderRadius:4, background:Accent.magma.hex }}/>}
      </span>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', gap:6 }}>
          <span style={{ fontSize:12.5, fontWeight:500, color:C.crust[100] }}>{label}</span>
          <Mono size={11} color={C.crust[400]}>•••• {tail}</Mono>
        </div>
        <Mono size={10} color={C.crust[500]}>{sub}</Mono>
      </div>
    </div>
  );
}

function Toggle({ on }) {
  return (
    <div style={{
      width:32, height:18, borderRadius:9,
      background: on ? Accent.magma.hex : C.crust[700],
      position:'relative', cursor:'pointer',
    }}>
      <div style={{
        position:'absolute', top:2, left: on ? 16 : 2,
        width:14, height:14, borderRadius:7, background:'#fff',
        transition:'left .15s',
      }}/>
    </div>
  );
}

function Stat2({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0' }}>
      <span style={{ fontSize:12, color:C.crust[400] }}>{label}</span>
      <Mono size={11.5} color={C.crust[100]}>{value}</Mono>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// CHECKOUT RETURN — Stripe success redirect
// ────────────────────────────────────────────────────────────────────
function ScreenCheckoutReturn({ accent = Accent.magma, rail = 'stripe' }) {
  return (
    <AppShell active="billing" user="KS"
      breadcrumbs={[{ label:'Billing' },{ label:'Checkout' },{ label:'Return', mono: true }]}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'40px 28px', minHeight:830 }}>

        {/* big confirmation */}
        <div style={{ maxWidth:560, width:'100%', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>

          {/* animated ring */}
          <div style={{
            width:120, height:120, borderRadius:60, border:`1px solid rgba(52,211,153,0.3)`,
            display:'flex', alignItems:'center', justifyContent:'center', position:'relative', marginBottom:24,
            background:`radial-gradient(circle at center, rgba(52,211,153,0.1) 0%, transparent 70%)`,
          }}>
            <div style={{
              width:80, height:80, borderRadius:40, background:`rgba(52,211,153,0.08)`,
              border:`1.5px solid ${C.crystal[500]}`,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                <path d="m5 12 5 5 9-12" stroke={C.crystal[500]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="mono" style={{ fontSize:11, color:C.crystal[400], letterSpacing:'0.18em', marginBottom:14 }}>PAYMENT SETTLED · {rail.toUpperCase()}</div>
          <h1 className="display" style={{ margin:0, fontSize:48, letterSpacing:'-0.025em', color:C.crust[100], lineHeight:1.05 }}>
            $200.00 credited
          </h1>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:14 }}>
            <Mono size={12.5} color={C.crystal[400]}>+ 20,000 CUC</Mono>
            <span style={{ color:C.crust[600] }}>•</span>
            <Mono size={12.5} color={C.crust[400]}>balance now <span style={{ color:C.crust[100] }}>$487.20</span></Mono>
          </div>

          {/* receipt strip */}
          <div style={{ width:'100%', marginTop:32, padding:'18px 22px', background:C.crust[900], border:`1px solid ${C.crust[800]}`, borderRadius:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <Mono size={10.5} color={C.crust[500]} style={{ letterSpacing:'0.14em' }}>RECEIPT</Mono>
              <Btn kind="ghost" size="sm" icon={<Icon.download/>}>PDF</Btn>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              <Stat2 label="Invoice" value="in_8x_a4Kp9"/>
              <Stat2 label="Paid via" value="visa · 4242"/>
              <Stat2 label="Settled" value="2026-05-20 09:31:08 UTC"/>
              <Stat2 label="Rail" value="stripe · webhook id evt_3OqK1…"/>
              <Stat2 label="Reference" value="cs_test_a1Kq8WzN…"/>
            </div>
          </div>

          <div style={{ marginTop:24, display:'flex', gap:10 }}>
            <Btn kind="primary" accent={accent} size="lg" iconRight={<Icon.chev/>}>Continue to dashboard</Btn>
            <Btn kind="secondary" size="lg">View invoice</Btn>
          </div>

          <Mono size={10.5} color={C.crust[500]} style={{ marginTop:28 }}>
            Auto-redirect in 8s — or stay here to download the receipt.
          </Mono>
        </div>
      </div>
    </AppShell>
  );
}

Object.assign(window, { ScreenBilling, ScreenCheckoutReturn });
})();
