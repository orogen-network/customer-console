// screens-core.jsx — Dashboard, Keys list/detail, Usage, Receipt drilldown
// All artboards target 1440×900 (desktop-first, brief explicit).

(function(){

const W = 1440;
const H = 900;

// shared content paddings
const CONTENT_PAD = { px: 28, py: 22 };

// ────────────────────────────────────────────────────────────────────
// 1. DASHBOARD
// ────────────────────────────────────────────────────────────────────
function ScreenDashboard({ showQuest = false, accent = Accent.magma, density = 'cozy', receiptVariant = 'envelope' }) {
  // synthetic data
  const spendSeries = [3.2, 4.8, 4.1, 6.2, 5.4, 7.1, 9.4, 8.2, 10.1, 12.4, 11.8, 14.2, 13.6, 16.1, 14.8, 17.2, 19.4, 18.1, 21.3, 19.6, 22.4, 24.8, 23.1, 27.2, 25.4, 28.9, 30.2, 28.7, 32.1];
  const callsSeries = [120, 180, 165, 240, 210, 290, 380];
  const latencySeries = [820, 840, 780, 920, 860, 810, 790];
  const calendarData = Array.from({length: 18*7}).map(()=>Math.random() > 0.3 ? Math.random() * 100 : 0);

  return (
    <AppShell active="dashboard" user="KS"
      breadcrumbs={[{ label:'Dashboard' }]}
      actions={
        <>
          <Btn kind="ghost" size="sm" icon={<Icon.download/>}>Export</Btn>
          <Btn kind="primary" size="sm" accent={accent} icon={<Icon.plus/>}>Mint key</Btn>
        </>
      }>
      <PageHeader
        eyebrow="ORG · ORBITAL LABS"
        title="Dashboard"
        sub="Last 7 days of inference activity across all keys."
        actions={
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ display:'inline-flex', height:30, borderRadius:7, background:C.crust[850], border:`1px solid ${C.crust[800]}`, padding:2 }}>
              {['24h','7d','30d','90d'].map(p=>(
                <div key={p} style={{
                  padding:'0 12px', display:'flex', alignItems:'center',
                  borderRadius:5, fontSize:12,
                  background: p==='7d' ? C.crust[700] : 'transparent',
                  color: p==='7d' ? C.crust[100] : C.crust[400],
                  fontWeight: p==='7d' ? 500 : 400, cursor:'pointer',
                }}>{p}</div>
              ))}
            </div>
            <Btn kind="secondary" size="sm" icon={<Icon.filter/>}>All keys</Btn>
          </div>
        }
      />

      <div style={{ padding:`${CONTENT_PAD.py}px ${CONTENT_PAD.px}px`, display:'flex', flexDirection:'column', gap:18 }}>

        {/* Quest card — onboarding moment */}
        {showQuest && (
          <Panel style={{
            background:`linear-gradient(135deg, ${C.crust[900]} 0%, rgba(245,158,11,0.04) 100%)`,
            borderColor:'rgba(245,158,11,0.18)',
          }} padding={20}>
            <div style={{ display:'flex', alignItems:'center', gap:18 }}>
              <div style={{
                width:48, height:48, borderRadius:10,
                background:`linear-gradient(135deg, ${accent.hex} 0%, ${C.magma[600]} 100%)`,
                display:'flex', alignItems:'center', justifyContent:'center', color:C.crust[1000],
              }}><Icon.bolt/></div>
              <div style={{ flex:1 }}>
                <div className="mono" style={{ fontSize:10.5, color:accent.hex, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>Welcome to Orogen</div>
                <div style={{ fontSize:16, fontWeight:600, color:C.crust[100], marginBottom:3 }}>Run your first verified inference call</div>
                <div style={{ fontSize:12.5, color:C.crust[400] }}>Your preview key <span className="mono" style={{ color:C.crust[200] }}>orog_test_4Xq...m93Z</span> is ready. Copy the curl and watch it land in your call log.</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:18 }}>
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:C.crystal[400] }}>
                    <Icon.check/> Sign in
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:C.crystal[400] }}>
                    <Icon.check/> First top-up · $20
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:C.crystal[400] }}>
                    <Icon.check/> Starter key minted
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:C.crust[400] }}>
                    <span style={{ width:14, height:14, borderRadius:7, border:`1.5px solid ${C.magma[500]}`, display:'inline-block' }} className="pulse"/>
                    First call
                  </div>
                </div>
                <Btn kind="primary" accent={accent} icon={<Icon.copy/>}>Copy curl</Btn>
              </div>
            </div>
          </Panel>
        )}

        {/* 4 metrics */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
          <Metric label="Credit balance" value={<><span>$487</span><span style={{ fontSize:18, color:C.crust[400] }}>.20</span></>}
            sub="42,118 CUC" delta="+$200" deltaTone="success" spark={spendSeries.slice(-12)} sparkColor={accent.hex} accent={accent.hex}/>
          <Metric label="Calls · 7d" value="184k" sub="↑ 12% vs. prior" delta="+12%" deltaTone="success" spark={callsSeries} sparkColor={C.crystal[500]}/>
          <Metric label="p95 latency" value={<>820<span style={{ fontSize:18, color:C.crust[400] }}> ms</span></>} sub="across 7 models" delta="-4%" deltaTone="success" spark={latencySeries.map(v=>1000-v)} sparkColor={C.crystal[500]}/>
          <Metric label="Replay clean" value="99.97%" sub="3 mismatches · 12d" delta="3" deltaTone="warn" spark={[100,100,99.9,100,99.95,99.97,99.97]} sparkColor={C.magma[500]}/>
        </div>

        {/* spend chart + heatmap */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
          <Panel
            eyebrow="SPEND"
            title="Credit consumption"
            sub="In CUC, per hour"
            action={
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:C.crust[400] }}>
                  <span style={{ width:8, height:8, background:accent.hex, borderRadius:2 }}/> spend
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:C.crust[400] }}>
                  <span style={{ width:8, height:8, background:C.crystal[500], borderRadius:2 }}/> budget
                </div>
              </div>
            }
          >
            <AreaChart
              width={780} height={220}
              series={[
                { name:'spend', color: accent.hex, data: spendSeries.map((v,i)=>({x:i, y:v})) },
                { name:'budget', color: C.crystal[500], data: spendSeries.map((v,i)=>({x:i, y:32})) },
              ]}
              xLabels={['00:00','','','06:00','','','12:00','','','18:00','','24:00','','','30','','','36','','','42','','','48','','','54','','','60:00'].slice(0,29)}
              highlight={22}
            />
          </Panel>

          <Panel eyebrow="ACTIVITY" title="Hourly heatmap" sub="Calls / hour · last 18 weeks">
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <CalendarHeatmap data={calendarData} weeks={14}/>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                <div>
                  <div className="display" style={{ fontSize:30, color:C.crust[100], lineHeight:1 }}>11.4<span style={{ fontSize:16, color:C.crust[400] }}>k/d</span></div>
                  <div className="mono" style={{ fontSize:10.5, color:C.crust[500], marginTop:4 }}>peak Tue · 09:00 UTC</div>
                </div>
                <div style={{ fontSize:11.5, color:C.crust[400], lineHeight:1.5, marginTop:2 }}>
                  Burn tracks weekday traffic; weekends idle below 18% baseline.
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* Recent calls + key health */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
          <Panel
            eyebrow="REQUESTS"
            title="Recent calls"
            action={<Btn kind="ghost" size="sm" iconRight={<Icon.chev/>}>View all</Btn>}
            padding={0}
          >
            <Table
              columns={[
                { label:'ID', w:'150px', cell: r=> <Mono size={11} color={C.crust[100]}>{r.id}</Mono> },
                { label:'Model', w:'160px', cell: r=> <span style={{ fontSize:12.5, color:C.crust[200] }}>{r.model}</span> },
                { label:'Tokens', w:'120px', cell: r=> <Mono size={11.5} color={C.crust[200]}>{r.toks}</Mono> },
                { label:'Latency', w:'90px', cell: r=> <Mono size={11.5} color={r.lat > 1500 ? C.magma[400] : C.crust[200]}>{r.lat} ms</Mono> },
                { label:'Verdict', w:'140px', cell: r=> <Badge tone={r.v==='mismatch'?'danger':r.v==='sampled'?'warn':'success'} dot>{r.v}</Badge> },
                { label:'Cost', w:'90px', align:'right', cell: r=> <Mono size={11.5} color={C.crust[200]}>{r.cost}</Mono> },
                { label:'', w:'30px', cell: ()=> <Icon.chev color={C.crust[500]}/> },
              ]}
              rows={[
                { id:'req_8x3qZ4', model:'llama-3.1-70b-instr', toks:'1,418 → 612', lat:824, v:'clean', cost:'4.62¢' },
                { id:'req_8x3pY1', model:'qwen-2.5-32b', toks:'820 → 1,902', lat:1480, v:'clean', cost:'2.91¢' },
                { id:'req_8x3pX9', model:'llama-3.1-70b-instr', toks:'4,200 → 211', lat:920, v:'sampled', cost:'8.14¢' },
                { id:'req_8x3pW2', model:'mistral-large-2', toks:'382 → 1,180', lat:680, v:'clean', cost:'3.20¢' },
                { id:'req_8x3pV7', model:'llama-3.1-8b', toks:'940 → 408', lat:412, v:'clean', cost:'0.61¢' },
                { id:'req_8x3pU3', model:'deepseek-coder', toks:'2,108 → 1,420', lat:1840, v:'mismatch', cost:'—' },
                { id:'req_8x3pT0', model:'llama-3.1-70b-instr', toks:'612 → 720', lat:1120, v:'clean', cost:'2.84¢' },
              ]}
            />
          </Panel>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <Panel eyebrow="KEYS" title="Key health" action={<Btn kind="ghost" size="sm">Manage</Btn>} padding={0}>
              <div style={{ padding:'4px 0' }}>
                {[
                  { name:'preview', preview:'orog_test_4Xq...m93Z', cap:200, used:142, tone:'warn' },
                  { name:'staging', preview:'orog_test_pK2...xQ8a', cap:50, used:8, tone:'success' },
                  { name:'ci · readonly', preview:'orog_test_zR9...Lm4q', cap:10, used:0.4, tone:'neutral' },
                ].map((k,i)=>(
                  <div key={i} className="row" style={{ padding:'12px 18px', display:'flex', alignItems:'center', gap:12, borderBottom: i<2 ? `1px solid ${C.crust[850]}` : 'none' }}>
                    <StatusDot tone={k.tone} size={7}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:500, color:C.crust[100], marginBottom:2 }}>{k.name}</div>
                      <Mono size={10.5} color={C.crust[500]}>{k.preview}</Mono>
                    </div>
                    <div style={{ width:80 }}>
                      <div style={{ height:3, background:C.crust[800], borderRadius:2, overflow:'hidden', marginBottom:4 }}>
                        <div style={{ width:`${(k.used/k.cap)*100}%`, height:'100%', background: k.used/k.cap > 0.6 ? accent.hex : C.crystal[500] }}/>
                      </div>
                      <Mono size={10} color={C.crust[400]}>${k.used} / ${k.cap}</Mono>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel eyebrow="NETWORK" title="Burn-to-mint rate" sub="OROG → CUC, last hour">
              <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:8 }}>
                <span className="display" style={{ fontSize:30, color:C.crust[100], lineHeight:1 }}>0.0942</span>
                <span className="mono" style={{ fontSize:12, color:C.crust[400] }}>OROG / $1</span>
              </div>
              <div style={{ marginTop:8 }}>
                <Sparkline data={[0.091,0.092,0.094,0.093,0.094,0.0942,0.0935,0.094,0.0942]} width={240} height={36} stroke={C.magma[500]} fill="rgba(245,158,11,0.12)"/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                <Mono size={10.5} color={C.crust[500]}>30d avg 0.0918</Mono>
                <Badge tone="success" dot>+2.6%</Badge>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// 2. KEYS LIST
// ────────────────────────────────────────────────────────────────────
function ScreenKeys({ accent = Accent.magma }) {
  return (
    <AppShell active="keys" user="KS"
      breadcrumbs={[{ label:'API Keys' }]}
      actions={
        <>
          <Btn kind="ghost" size="sm" iconRight={<Icon.ext/>}>Docs</Btn>
          <Btn kind="primary" size="sm" accent={accent} icon={<Icon.plus/>}>New key</Btn>
        </>
      }>
      <PageHeader
        eyebrow="ORG · ORBITAL LABS"
        title="API Keys"
        sub="Bearer tokens accepted by gateway-router. Scoped to model tiers + spending cap. Secrets shown once at mint."
      />
      <div style={{ padding:`${CONTENT_PAD.py}px ${CONTENT_PAD.px}px`, display:'flex', flexDirection:'column', gap:18 }}>
        {/* tabs + filter row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Tabs
            items={[
              { id:'all', label:'All keys', count:4 },
              { id:'preview', label:'Preview', count:2 },
              { id:'test', label:'Test', count:2 },
              { id:'revoked', label:'Revoked', count:1 },
            ]}
            active="all"
            style={{ flex:1 }}
          />
          <div style={{ display:'flex', gap:8, alignItems:'center', paddingBottom:8 }}>
            <Btn kind="secondary" size="sm" icon={<Icon.filter/>}>Filter</Btn>
            <Btn kind="secondary" size="sm" icon={<Icon.search/>}>Search</Btn>
          </div>
        </div>

        <Table
          columns={[
            { label:'Name', w:'1.4fr', sort:true, cell: r=>(
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <StatusDot tone={r.status} size={7}/>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:C.crust[100] }}>{r.name}</div>
                  <Mono size={10.5} color={C.crust[500]} style={{ marginTop:2 }}>{r.preview}</Mono>
                </div>
              </div>
            )},
            { label:'Scope', w:'1.3fr', cell: r=>(
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                {r.scope.map((s,i)=><Badge key={i} tone="neutral" style={{ padding:'1px 7px' }}>{s}</Badge>)}
              </div>
            )},
            { label:'Cap', w:'130px', cell: r=>(
              <div>
                <div style={{ height:3, background:C.crust[800], borderRadius:2, width:90, marginBottom:3, overflow:'hidden' }}>
                  <div style={{ width:`${Math.min(100,(r.used/r.cap)*100)}%`, height:'100%', background: r.used/r.cap > 0.7 ? accent.hex : C.crystal[500] }}/>
                </div>
                <Mono size={10.5} color={C.crust[300]}>${r.used} / ${r.cap}</Mono>
              </div>
            )},
            { label:'Last used', w:'160px', cell: r=>(
              <div>
                <div style={{ fontSize:12, color:C.crust[200] }}>{r.lastUsed}</div>
                <Mono size={10.5} color={C.crust[500]} style={{ marginTop:2 }}>{r.lastIp}</Mono>
              </div>
            )},
            { label:'Created', w:'110px', cell: r=> <Mono size={11.5} color={C.crust[300]}>{r.created}</Mono> },
            { label:'', w:'80px', align:'right', cell: ()=>(
              <div style={{ display:'flex', gap:4, justifyContent:'flex-end' }}>
                <button style={{ width:24, height:24, background:'transparent', border:0, color:C.crust[400], cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center' }}><Icon.rotate/></button>
                <button style={{ width:24, height:24, background:'transparent', border:0, color:C.crust[400], cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center' }}><Icon.dots/></button>
              </div>
            )},
          ]}
          rows={[
            { name:'preview', preview:'orog_test_4Xq2WmKx...m93Z', scope:['llama','qwen','mistral','tier-A'], used:142, cap:200, lastUsed:'2 min ago', lastIp:'2001:db8::104', created:'Mar 14, 2026', status:'warn' },
            { name:'staging', preview:'orog_test_pK2RdNQa...xQ8a', scope:['llama','qwen','tier-A'], used:8.2, cap:50, lastUsed:'3 hours ago', lastIp:'2001:db8::52', created:'Apr 02, 2026', status:'success' },
            { name:'ci · readonly', preview:'orog_test_zR9wKpLm...Lm4q', scope:['llama-8b','tier-C'], used:0.4, cap:10, lastUsed:'Yesterday', lastIp:'2001:db8::140', created:'Apr 19, 2026', status:'success' },
            { name:'eval · spot', preview:'orog_test_aP3xC8Bn...RrZ7', scope:['all', 'tier-A','tier-S'], used:22.6, cap:100, lastUsed:'12 min ago', lastIp:'2001:db8::130', created:'May 02, 2026', status:'success' },
          ]}
        />

        <Notice
          tone="info"
          icon={<Icon.shield/>}
          title="Secrets are shown once at mint."
          body="Use rotate to issue a new secret while keeping the same key ID, scope, and dependent webhooks. Revoking is immediate at gateway-router."
          action={<Btn kind="ghost" size="sm" iconRight={<Icon.ext/>}>Rotation guide</Btn>}
        />
      </div>
    </AppShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// 3. KEY DETAIL
// ────────────────────────────────────────────────────────────────────
function ScreenKeyDetail({ accent = Accent.magma }) {
  const spend = [3.2, 4.1, 5.4, 4.8, 7.2, 8.1, 9.4, 11.2, 10.4, 12.4, 14.2, 13.1, 16.4, 18.2, 17.1, 19.4, 21.2, 19.8, 22.4, 24.1, 23.4, 26.2, 25.1, 28.4];
  return (
    <AppShell active="keys" user="KS"
      breadcrumbs={[
        { label:'API Keys' },
        { label:'preview', mono: true },
      ]}
      actions={
        <>
          <Btn kind="secondary" size="sm" icon={<Icon.rotate/>}>Rotate secret</Btn>
          <Btn kind="danger" size="sm" icon={<Icon.trash/>}>Revoke</Btn>
        </>
      }>
      <div style={{ padding:`22px ${CONTENT_PAD.px}px 18px`, borderBottom:`1px solid ${C.crust[850]}` }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:24 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <StatusDot tone="warn" size={9} pulse/>
              <h1 style={{ margin:0, fontSize:22, fontWeight:600, letterSpacing:'-0.02em', color:C.crust[100] }}>preview</h1>
              <Badge tone="warn" dot>71% of cap</Badge>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:8 }}>
              <HashChip value="orog_test_4Xq2WmKxR8tBV9qP3sDfm93Z" lead={20} tail={6} prefix="key" size={11}/>
              <Mono size={11} color={C.crust[500]}>id <span style={{ color:C.crust[200] }}>key_kx8q19m</span></Mono>
              <Mono size={11} color={C.crust[500]}>created <span style={{ color:C.crust[200] }}>Mar 14, 2026 09:42 UTC by user@example.org</span></Mono>
            </div>
          </div>
          <div style={{ display:'flex', gap:14 }}>
            <div style={{ textAlign:'right' }}>
              <div className="mono" style={{ fontSize:10, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase' }}>Spent · 30d</div>
              <div className="display" style={{ fontSize:28, color:C.crust[100], lineHeight:1.1 }}>$142.18</div>
              <Mono size={10.5} color={C.crust[400]}>of $200 cap</Mono>
            </div>
            <DonutMeter value={142} max={200} size={70} color={accent.hex} label="71%" sub="cap"/>
          </div>
        </div>
      </div>

      <div style={{ padding:`${CONTENT_PAD.py}px ${CONTENT_PAD.px}px`, display:'flex', flexDirection:'column', gap:18 }}>
        {/* Spend chart */}
        <Panel eyebrow="USAGE" title="This key · last 30 days"
          action={
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <Badge tone="accent" style={{ padding:'2px 8px' }}>$142.18 spend</Badge>
              <Badge tone="success" style={{ padding:'2px 8px' }}>184k calls</Badge>
              <Badge tone="neutral" style={{ padding:'2px 8px' }}>92.4 MTok in</Badge>
            </div>
          }>
          <AreaChart
            width={1340} height={200}
            series={[{ name:'spend', color: accent.hex, data: spend.map((v,i)=>({x:i, y:v})) }]}
            xLabels={Array.from({length:24}).map((_,i)=>i%4===0?`d-${24-i}`:'')}
          />
        </Panel>

        {/* 3-col config */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
          <Panel eyebrow="SCOPE" title="Model tier access" action={<Btn kind="ghost" size="sm">Edit</Btn>}>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { tier:'tier-S', label:'Frontier · 70B+', allowed:true },
                { tier:'tier-A', label:'Production · 30-70B', allowed:true },
                { tier:'tier-B', label:'Efficient · 7-30B', allowed:true },
                { tier:'tier-C', label:'Edge · ≤7B', allowed:true },
                { tier:'tier-X', label:'Experimental', allowed:false },
              ].map((t,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 10px', background: t.allowed ? C.crust[850] : 'transparent', border:`1px solid ${C.crust[800]}`, borderRadius:6 }}>
                  <Mono size={11} color={t.allowed?C.crust[100]:C.crust[500]} weight={600}>{t.tier}</Mono>
                  <span style={{ fontSize:12, color: t.allowed?C.crust[300]:C.crust[500] }}>{t.label}</span>
                  <span style={{ marginLeft:'auto', color: t.allowed ? C.crystal[500] : C.crust[600] }}>
                    {t.allowed ? <Icon.check/> : <span style={{ width:12, height:1, background:C.crust[600], display:'inline-block' }}/>}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="LIMITS" title="Spending & rate" action={<Btn kind="ghost" size="sm">Edit</Btn>}>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <Mono size={10.5} color={C.crust[500]}>MONTHLY SPEND CAP</Mono>
                  <Mono size={11} color={C.crust[100]}>$200.00</Mono>
                </div>
                <div style={{ height:6, background:C.crust[800], borderRadius:3, overflow:'hidden' }}>
                  <div style={{ width:'71%', height:'100%', background:accent.hex }}/>
                </div>
                <Mono size={10.5} color={C.crust[500]} style={{ marginTop:6, display:'block' }}>$57.82 remaining · resets Jun 1</Mono>
              </div>
              <Divider/>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color:C.crust[400] }}>Requests / min</span>
                  <Mono size={11.5} color={C.crust[100]}>3,000</Mono>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color:C.crust[400] }}>Tokens / min</span>
                  <Mono size={11.5} color={C.crust[100]}>2.4 M</Mono>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12, color:C.crust[400] }}>Max context</span>
                  <Mono size={11.5} color={C.crust[100]}>131,072 tok</Mono>
                </div>
              </div>
            </div>
          </Panel>

          <Panel eyebrow="LAST USED" title="Recent activity">
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:12, color:C.crust[400] }}>Last call</span>
                <span style={{ fontSize:12, color:C.crust[100] }}>2 min ago</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:12, color:C.crust[400] }}>Last IP</span>
                <Mono size={11} color={C.crust[100]}>104.18.32.41</Mono>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:12, color:C.crust[400] }}>User agent</span>
                <Mono size={10.5} color={C.crust[200]}>openai-py/1.40</Mono>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:12, color:C.crust[400] }}>Region</span>
                <span style={{ fontSize:12, color:C.crust[100] }}>us-east · CDN</span>
              </div>
              <Divider/>
              <Notice
                tone="warn"
                icon={<Icon.warn/>}
                title="Approaching cap"
                body="At current burn this key trips its $200 cap in ~8 days. Raise it or split traffic."
              />
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// 4. USAGE ANALYTICS
// ────────────────────────────────────────────────────────────────────
function ScreenUsage({ accent = Accent.magma }) {
  return (
    <AppShell active="usage" user="KS"
      breadcrumbs={[{ label:'Usage' }]}
      actions={<><Btn kind="ghost" size="sm" icon={<Icon.download/>}>CSV</Btn></>}
      >
      <PageHeader eyebrow="ANALYTICS" title="Usage" sub="Spend, tokens, latency, and replay agreement across keys and tiers." actions={
        <div style={{ display:'flex', gap:8 }}>
          <Btn kind="secondary" size="sm" iconRight={<Icon.chevDown/>}>All keys</Btn>
          <Btn kind="secondary" size="sm" iconRight={<Icon.chevDown/>}>All tiers</Btn>
          <Btn kind="secondary" size="sm">7d</Btn>
        </div>
      }/>
      <div style={{ padding:`${CONTENT_PAD.py}px ${CONTENT_PAD.px}px`, display:'flex', flexDirection:'column', gap:18 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12 }}>
          <Metric label="Spend" value="$487.20" sub="7d" delta="+12%" deltaTone="warn" spark={[12,14,18,22,28,32,36]} sparkColor={accent.hex}/>
          <Metric label="Calls" value="184,118" sub="7d" delta="+8%" deltaTone="success" spark={[18,22,21,26,28,30,38]} sparkColor={C.crystal[500]}/>
          <Metric label="Tokens in" value="92.4M" sub="7d" delta="+11%" deltaTone="success" spark={[8,9,9,11,11,12,14]} sparkColor={C.crystal[500]}/>
          <Metric label="Tokens out" value="41.2M" sub="7d" delta="+6%" deltaTone="success" spark={[3,3.4,3.6,4.1,4.3,4.6,5.2]} sparkColor={C.crystal[500]}/>
          <Metric label="Replay disagreement" value="0.03%" sub="3 escalations" delta="3" deltaTone="warn" spark={[0,0,0,0.02,0,0.03,0]} sparkColor={C.magma[500]}/>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
          <Panel eyebrow="TOKENS" title="Per model · stacked in/out" action={
            <div style={{ display:'flex', gap:10 }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:11.5, color:C.crust[400] }}><span style={{ width:8,height:8,background:accent.hex, borderRadius:2 }}/>in</span>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:11.5, color:C.crust[400] }}><span style={{ width:8,height:8,background:C.crystal[500], borderRadius:2, opacity:0.8 }}/>out</span>
            </div>
          }>
            <ColumnBars
              width={780} height={220}
              colors={[accent.hex, C.crystal[500]]}
              groups={[
                { name:'llama-70b', values:[42, 18] },
                { name:'llama-8b', values:[18, 8] },
                { name:'qwen-32b', values:[14, 9] },
                { name:'mistral-l', values:[8, 4] },
                { name:'deepseek-c', values:[6, 1.4] },
                { name:'sonnet-3.5', values:[3, 0.6] },
                { name:'gpt-4o-mini', values:[1, 0.2] },
              ]}
            />
          </Panel>

          <Panel eyebrow="LATENCY" title="p50 / p95 distribution"
            sub="Across 184,118 calls"
            action={<Mono size={11} color={C.crust[300]}>820 ms · 1,840 ms</Mono>}>
            <LatencyHistogram
              width={310} height={140}
              p50={0.16} p95={0.62}
              bins={[
                {label:'0', count:8}, {label:'',count:32}, {label:'',count:92}, {label:'',count:148},
                {label:'',count:120}, {label:'',count:80}, {label:'',count:64}, {label:'',count:48},
                {label:'',count:38}, {label:'',count:28},  {label:'',count:24, p95:true},  {label:'',count:18},
                {label:'',count:11}, {label:'',count:9},  {label:'',count:6},  {label:'',count:3},  {label:'',count:2},  {label:'5s',count:1},
              ]}
            />
            <Divider style={{ margin:'12px 0' }}/>
            <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:8 }}>Replay agreement</div>
            <DisagreementStrip width={310} height={28} events={
              Array.from({length:200}).map(()=>({
                x: Math.random(),
                kind: Math.random() < 0.985 ? 'clean' : (Math.random() < 0.8 ? 'sampled' : 'mismatch'),
              }))
            }/>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
              <Mono size={10.5} color={C.crystal[400]}>{('99.97% clean')}</Mono>
              <Mono size={10.5} color={C.magma[400]}>0.03% sampled</Mono>
              <Mono size={10.5} color={C.ruby[400]}>3 mismatch</Mono>
            </div>
          </Panel>
        </div>

        <Panel
          eyebrow="REQUESTS"
          title="Recent · 184k calls"
          padding={0}
          action={
            <div style={{ display:'flex', gap:8 }}>
              <Btn kind="ghost" size="sm" icon={<Icon.filter/>}>Filter</Btn>
              <Btn kind="ghost" size="sm" icon={<Icon.search/>}>Search</Btn>
            </div>
          }>
          <Table
            columns={[
              { label:'Time', w:'120px', cell: r=> <Mono size={11} color={C.crust[300]}>{r.time}</Mono> },
              { label:'Request', w:'170px', cell: r=> <Mono size={11} color={C.crust[100]}>{r.id}</Mono> },
              { label:'Key', w:'140px', cell: r=> <Mono size={11} color={C.crust[200]}>{r.key}</Mono> },
              { label:'Model', w:'1fr', cell: r=> <span style={{ fontSize:12, color:C.crust[200] }}>{r.model}</span> },
              { label:'Tokens', w:'130px', cell: r=> <Mono size={11.5} color={C.crust[200]}>{r.toks}</Mono> },
              { label:'Latency', w:'90px', align:'right', cell: r=> <Mono size={11.5} color={r.lat>1500?C.magma[400]:C.crust[200]}>{r.lat}</Mono> },
              { label:'Verdict', w:'130px', cell: r=> <Badge tone={r.v==='mismatch'?'danger':r.v==='sampled'?'warn':'success'} dot>{r.v}</Badge> },
              { label:'Cost', w:'90px', align:'right', cell: r=> <Mono size={11.5} color={r.cost==='—'?C.crust[500]:C.crust[100]}>{r.cost}</Mono> },
            ]}
            rows={[
              { time:'09:42:18', id:'req_8x3qZ4MnL2', key:'preview', model:'llama-3.1-70b-instr', toks:'1,418 → 612', lat:'824 ms', v:'clean', cost:'preview' },
              { time:'09:42:11', id:'req_8x3qZ3kY1q', key:'preview', model:'qwen-2.5-32b', toks:'820 → 1,902', lat:'1,480 ms', v:'clean', cost:'preview' },
              { time:'09:42:04', id:'req_8x3qZ2pW9d', key:'staging', model:'llama-3.1-70b-instr', toks:'4,200 → 211', lat:'920 ms', v:'sampled', cost:'8.14¢' },
              { time:'09:41:58', id:'req_8x3qZ1zB4r', key:'preview', model:'mistral-large-2', toks:'382 → 1,180', lat:'680 ms', v:'clean', cost:'preview' },
              { time:'09:41:51', id:'req_8x3qZ0qA8w', key:'preview', model:'llama-3.1-8b', toks:'940 → 408', lat:'412 ms', v:'clean', cost:'preview' },
              { time:'09:41:42', id:'req_8x3qY9tR1m', key:'eval · spot', model:'deepseek-coder', toks:'2,108 → 1,420', lat:'1,840 ms', v:'mismatch', cost:'—' },
              { time:'09:41:35', id:'req_8x3qY8wE0c', key:'preview', model:'llama-3.1-70b-instr', toks:'612 → 720', lat:'1,120 ms', v:'clean', cost:'preview' },
              { time:'09:41:29', id:'req_8x3qY7sP4v', key:'preview', model:'qwen-2.5-32b', toks:'1,808 → 902', lat:'1,240 ms', v:'clean', cost:'preview' },
              { time:'09:41:21', id:'req_8x3qY6jQ7n', key:'ci · readonly', model:'llama-3.1-8b', toks:'140 → 88', lat:'310 ms', v:'clean', cost:'0.12¢' },
            ]}
          />
        </Panel>
      </div>
    </AppShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// 5. RECEIPT (request) DRILLDOWN
// ────────────────────────────────────────────────────────────────────
function ScreenReceipt({ verdict = 'clean', receiptVariant = 'envelope', accent = Accent.magma }) {
  const request = {
    id: 'req_8x3qZ4MnL2',
    time: '2026-05-20 09:42:18.142 UTC',
    model: 'llama-3.1-70b-instr',
    key: 'preview',
  };
  const receipt = {
    serial: 'OR-2026.05.20-8X3QZ4',
    operator: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    kernel: 'orogen-llama-70b.0.4.1 · sha-2c41…f8e2',
    useful_nonce: '0x4af2d1c8b9e3 · ep-1418',
    response_hash: '0x84a9f1d5e8b2c3a7d4f8e9c1b5a2f6d3c8e1b4a7d2f5e9c3b6a1f4d8e2c5',
    signature: 'sig_8b3a1c…d4e7f9',
  };
  const evidenceId = verdict === 'mismatch' ? 'ev_2026.05.20-MR-08714' : null;

  return (
    <AppShell active="usage" user="KS"
      breadcrumbs={[
        { label:'Usage' },
        { label:'Requests' },
        { label: request.id, mono: true },
      ]}
      actions={
        <>
          <Btn kind="ghost" size="sm" iconRight={<Icon.ext/>}>attestation.orogen.network</Btn>
          <Btn kind="secondary" size="sm" icon={<Icon.download/>}>Receipt JSON</Btn>
        </>
      }>
      <div style={{ padding:`22px ${CONTENT_PAD.px}px 18px`, borderBottom:`1px solid ${C.crust[850]}` }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:24 }}>
          <div>
            <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8 }}>REQUEST</div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <h1 className="mono" style={{ margin:0, fontSize:22, color:C.crust[100], letterSpacing:'-0.02em' }}>{request.id}</h1>
              <Badge tone={verdict==='mismatch'?'danger':verdict==='sampled'?'warn':'success'} dot>
                {verdict==='mismatch'?'replay mismatch · escalated':verdict==='sampled'?'sampled · clean':'verified · clean'}
              </Badge>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:8 }}>
              <Mono size={11} color={C.crust[500]}>at <span style={{ color:C.crust[200] }}>{request.time}</span></Mono>
              <Mono size={11} color={C.crust[500]}>via <span style={{ color:C.crust[200] }}>{request.key}</span></Mono>
              <Mono size={11} color={C.crust[500]}>104.18.32.41</Mono>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:`${CONTENT_PAD.py}px ${CONTENT_PAD.px}px`, display:'grid', gridTemplateColumns:'minmax(0, 1fr) 360px', gap:18 }}>
        {/* LEFT — envelope + content */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, minWidth:0 }}>
          <ReceiptEnvelope variant={receiptVariant} request={request} receipt={receipt} verdict={verdict} evidenceId={evidenceId}/>

          {/* I/O preview */}
          <Panel eyebrow="REQUEST" title="Conversation" sub="Stored hash only — content not retained">
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ padding:'10px 12px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:7 }}>
                <Mono size={9.5} color={C.crust[500]} style={{ letterSpacing:'0.12em' }}>SYSTEM · 142 tok</Mono>
                <div style={{ fontSize:12.5, color:C.crust[300], marginTop:6, lineHeight:1.55 }}>
                  You are a helpful research assistant. Cite primary sources when claims are quantitative…
                </div>
              </div>
              <div style={{ padding:'10px 12px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:7 }}>
                <Mono size={9.5} color={C.crust[500]}>USER · 1,276 tok</Mono>
                <div style={{ fontSize:12.5, color:C.crust[300], marginTop:6, lineHeight:1.55 }}>
                  Summarize the attached paper "Scaling laws for sparse mixture-of-experts" and contrast with…
                </div>
              </div>
              <div style={{ padding:'10px 12px', background:'rgba(245,158,11,0.04)', border:`1px solid ${C.crust[800]}`, borderRadius:7 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <Mono size={9.5} color={accent.hex}>ASSISTANT · 612 tok</Mono>
                  <Mono size={9.5} color={C.crust[500]}>response hash <span style={{ color:C.crust[200] }}>0x84a9f1…e2c5</span></Mono>
                </div>
                <div style={{ fontSize:12.5, color:C.crust[300], marginTop:6, lineHeight:1.55 }}>
                  Three findings stand out. First, the routing entropy collapses sharply between 8 and 16 experts when…
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* RIGHT — operator + economics */}
        <div style={{ display:'flex', flexDirection:'column', gap:14, minWidth:0 }}>
          <Panel eyebrow="OPERATOR" title="ORN-4af2 · alaska-north" padding={16}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{
                width:36, height:36, borderRadius:8,
                background:`linear-gradient(135deg, ${C.crust[700]} 0%, ${C.crust[850]} 100%)`,
                border:`1px solid ${C.crust[700]}`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}><Icon.shield color={C.crystal[400]}/></div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:C.crust[100] }}>ORN-4af2</div>
                <Mono size={10.5} color={C.crust[500]}>tier-A · GPU H100 ×4</Mono>
              </div>
              <Badge tone="success" dot>SLA 99.94%</Badge>
            </div>
            <Divider/>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:12 }}>
              <Stat label="Stake" value="142,000 OROG"/>
              <Stat label="Region" value="us-east · Anchorage"/>
              <Stat label="Onboarded" value="Feb 02, 2026"/>
              <Stat label="Slashes (90d)" value="0" tone="success"/>
            </div>
          </Panel>

          <Panel eyebrow="ECONOMICS" title="Settlement">
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <Stat label="Compute" value="4.18¢"/>
              <Stat label="Verification fee" value="0.32¢"/>
              <Stat label="Network burn" value="0.12¢"/>
              <Divider/>
              <Stat label="Total" value={verdict==='mismatch'?'$0.00':'4.62¢'} bold/>
              <Mono size={10.5} color={C.crust[500]}>
                {verdict==='mismatch' ? 'Refunded · evidence escalated' : 'Settled · CUC ledger 09:42:19 UTC'}
              </Mono>
            </div>
          </Panel>

          <Panel eyebrow="WITNESSES" title="Validator sample">
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {[
                { v:'val-Ku8z', vote:'agree', region:'eu-west' },
                { v:'val-9pXr', vote:'agree', region:'ap-east' },
                { v:'val-Rm2q', vote:'agree', region:'us-west' },
                { v:'val-Bk4n', vote: verdict==='mismatch'?'disagree':'agree', region:'sa-east' },
              ].map((w,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'5px 0' }}>
                  <Mono size={11} color={C.crust[200]}>{w.v}</Mono>
                  <Mono size={10.5} color={C.crust[500]} style={{ marginLeft:'auto' }}>{w.region}</Mono>
                  <Badge tone={w.vote==='agree'?'success':'danger'} style={{ padding:'1px 6px', fontSize:10 }}>{w.vote}</Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, tone, bold }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <span style={{ fontSize:12, color:C.crust[400] }}>{label}</span>
      <span style={{
        fontSize: bold ? 13 : 12.5, fontWeight: bold ? 600 : 500,
        color: tone === 'success' ? C.crystal[400] : tone === 'warn' ? C.magma[400] : C.crust[100],
        fontFamily: typeof value === 'string' && (value.includes(',') || value.includes('OROG') || value.includes('¢') || value.includes('$') || value.includes('-')) ? 'JetBrains Mono, monospace' : undefined,
        letterSpacing: '-0.01em',
      }}>{value}</span>
    </div>
  );
}

Object.assign(window, { ScreenDashboard, ScreenKeys, ScreenKeyDetail, ScreenUsage, ScreenReceipt });
})();
