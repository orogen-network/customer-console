// screens-org.jsx — Team + Settings

(function(){

const CONTENT_PAD = { px: 28, py: 22 };

// ────────────────────────────────────────────────────────────────────
// TEAM — members + roles + invites
// ────────────────────────────────────────────────────────────────────
function ScreenTeam({ accent = Accent.magma }) {
  return (
    <AppShell active="team" user="KS"
      breadcrumbs={[{ label:'Team' }]}
      actions={
        <>
          <Btn kind="ghost" size="sm" iconRight={<Icon.ext/>}>Audit log</Btn>
          <Btn kind="primary" size="sm" accent={accent} icon={<Icon.plus/>}>Invite</Btn>
        </>
      }>
      <PageHeader
        eyebrow="ORG · ORBITAL LABS"
        title="Team"
        sub="Members and roles. Wallet- or email-bound; one identity per org at v0."
      />
      <div style={{ padding:`${CONTENT_PAD.py}px ${CONTENT_PAD.px}px`, display:'grid', gridTemplateColumns:'minmax(0, 1fr) 320px', gap:18 }}>

        <div style={{ display:'flex', flexDirection:'column', gap:18, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Tabs items={[
              { id:'members', label:'Members', count:8 },
              { id:'invites', label:'Invites', count:2 },
              { id:'audit', label:'Audit log' },
            ]} active="members"/>
            <div style={{ display:'flex', gap:8, paddingBottom:8 }}>
              <Btn kind="secondary" size="sm" icon={<Icon.filter/>}>Role</Btn>
              <Btn kind="secondary" size="sm" icon={<Icon.search/>}>Search</Btn>
            </div>
          </div>

          <Table
            columns={[
              { label:'Member', w:'2fr', cell: r=>(
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Avatar name={r.name} size={28} hueSeed={r.seed}/>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:C.crust[100] }}>{r.name} {r.you && <Badge tone="mute" style={{ marginLeft:6, padding:'1px 5px' }}>you</Badge>}</div>
                    <Mono size={10.5} color={C.crust[500]}>{r.email}</Mono>
                  </div>
                </div>
              ) },
              { label:'Identity', w:'170px', cell: r=>(
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:C.crust[300] }}>
                  {r.id==='wallet' ? <Icon.shield/> : <Icon.mail/>}
                  <Mono size={11} color={C.crust[200]}>{r.id==='wallet'?'wallet · sr25519':'magic link'}</Mono>
                </div>
              ) },
              { label:'Role', w:'140px', cell: r=>(
                <Badge tone={r.role==='Owner'?'accent':r.role==='Billing'?'info':r.role==='Developer'?'success':'mute'} dot>{r.role}</Badge>
              ) },
              { label:'2FA', w:'80px', cell: r=> r.tfa ? <Icon.check color={C.crystal[400]}/> : <span style={{ color:C.crust[600] }}>—</span> },
              { label:'Last active', w:'140px', cell: r=> <Mono size={11} color={C.crust[300]}>{r.last}</Mono> },
              { label:'', w:'50px', align:'right', cell: ()=> <Icon.dots color={C.crust[400]}/> },
            ]}
            rows={[
              { name:'Owner User', email:'owner@example.org', id:'wallet', role:'Owner', tfa:true, last:'now', seed:11, you:true },
              { name:'Ops Admin', email:'ops-admin@example.org', id:'wallet', role:'Owner', tfa:true, last:'2h ago', seed:7 },
              { name:'API Developer', email:'developer@example.org', id:'email', role:'Developer', tfa:true, last:'12 min ago', seed:3 },
              { name:'Platform Engineer', email:'platform@example.org', id:'email', role:'Developer', tfa:false, last:'Yesterday', seed:15 },
              { name:'Billing User', email:'billing@example.org', id:'wallet', role:'Billing', tfa:true, last:'3 days ago', seed:22 },
              { name:'Audit Viewer', email:'audit@example.org', id:'email', role:'Read-only', tfa:true, last:'1 week ago', seed:4 },
              { name:'SDK Maintainer', email:'sdk@example.org', id:'wallet', role:'Developer', tfa:true, last:'4 days ago', seed:18 },
              { name:'Read Only User', email:'readonly@example.org', id:'email', role:'Read-only', tfa:false, last:'2 weeks ago', seed:9 },
            ]}
          />

          <Panel eyebrow="PENDING" title="Open invites" padding={0}>
            <Table
              columns={[
                { label:'Email', w:'2fr', cell: r=> <Mono size={11.5} color={C.crust[100]}>{r.email}</Mono> },
                { label:'Role', w:'140px', cell: r=> <Badge tone="mute" dot>{r.role}</Badge> },
                { label:'Sent', w:'140px', cell: r=> <Mono size={11} color={C.crust[300]}>{r.sent}</Mono> },
                { label:'Expires', w:'140px', cell: r=> <Mono size={11} color={C.crust[300]}>{r.exp}</Mono> },
                { label:'', w:'140px', align:'right', cell: ()=>(
                  <div style={{ display:'flex', justifyContent:'flex-end', gap:6 }}>
                    <Btn kind="ghost" size="sm">Resend</Btn>
                    <Btn kind="danger" size="sm">Revoke</Btn>
                  </div>
                ) },
              ]}
              rows={[
                { email:'ana@orbitallabs.dev', role:'Developer', sent:'2 days ago', exp:'in 5 days' },
                { email:'oliver@orbitallabs.dev', role:'Read-only', sent:'4 hours ago', exp:'in 6 days 20h' },
              ]}
            />
          </Panel>
        </div>

        {/* Right rail — roles legend */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Panel eyebrow="ROLES" title="What can each role do?" padding={16}>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { role:'Owner', tone:'accent', sub:'Full control: keys, billing, members, danger zone.' },
                { role:'Billing', tone:'info', sub:'Top-ups, invoices, payment methods. Read keys/usage.' },
                { role:'Developer', tone:'success', sub:'Mint, rotate, revoke keys. Read usage. No billing.' },
                { role:'Read-only', tone:'mute', sub:'Dashboard + usage. No mutations.' },
              ].map((r,i)=>(
                <div key={i} style={{ padding:'10px 12px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:7 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <Badge tone={r.tone} dot>{r.role}</Badge>
                  </div>
                  <div style={{ fontSize:11.5, color:C.crust[300], lineHeight:1.5 }}>{r.sub}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="QUICK INVITE" title="Add a teammate" padding={16}>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <input placeholder="dev@orbitallabs.dev" style={{
                padding:'9px 12px', fontSize:13, background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:7, color:C.crust[100], fontFamily:'inherit',
              }}/>
              <div style={{ display:'flex', gap:6 }}>
                {['Owner','Billing','Developer','Read-only'].map(r=>(
                  <div key={r} style={{
                    flex:1, padding:'8px 6px', textAlign:'center', fontSize:11, fontWeight:500,
                    border:`1px solid ${r==='Developer'?accent.hex:C.crust[800]}`,
                    color: r==='Developer'?accent.hex:C.crust[300],
                    background: r==='Developer' ? `rgba(245,158,11,0.06)` : 'transparent',
                    borderRadius:5, cursor:'pointer',
                  }}>{r}</div>
                ))}
              </div>
              <Btn kind="primary" size="md" accent={accent} style={{ justifyContent:'center' }}>Send invite</Btn>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

// ────────────────────────────────────────────────────────────────────
// SETTINGS — org, default model, webhooks, danger zone
// ────────────────────────────────────────────────────────────────────
function ScreenSettings({ accent = Accent.magma }) {
  return (
    <AppShell active="settings" user="KS"
      breadcrumbs={[{ label:'Settings' }]}>
      <PageHeader
        eyebrow="ORG · ORBITAL LABS"
        title="Settings"
        sub="Organization, defaults, webhooks, and danger zone."
      />

      <div style={{ padding:`${CONTENT_PAD.py}px ${CONTENT_PAD.px}px`, display:'grid', gridTemplateColumns:'200px minmax(0, 1fr)', gap:24 }}>
        {/* Side nav (within-page) */}
        <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
          {[
            { id:'org', label:'Organization', active:true },
            { id:'defaults', label:'Defaults' },
            { id:'webhooks', label:'Webhooks' },
            { id:'auth', label:'Authentication' },
            { id:'data', label:'Data retention' },
            { id:'danger', label:'Danger zone' },
          ].map(n=>(
            <a key={n.id} style={{
              padding:'7px 10px', borderRadius:6, fontSize:12.5,
              fontWeight: n.active ? 500 : 400,
              color: n.active ? C.crust[100] : C.crust[400],
              background: n.active ? C.crust[850] : 'transparent',
              borderLeft: n.active ? `2px solid ${accent.hex}` : `2px solid transparent`,
              cursor:'pointer',
            }}>{n.label}</a>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:18, minWidth:0 }}>
          {/* Organization */}
          <Panel eyebrow="ORGANIZATION" title="Identity">
            <div style={{ display:'flex', alignItems:'flex-end', gap:18, marginBottom:18 }}>
              <div style={{
                width:64, height:64, borderRadius:12,
                background:`linear-gradient(135deg, ${C.magma[500]} 0%, ${C.magma[600]} 100%)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                color:C.crust[1000], fontSize:26, fontWeight:700,
              }}>O</div>
              <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Field label="Org name" value="orbital labs"/>
                <Field label="Org ID" value="org_38xqW7nM12" mono readOnly/>
                <Field label="Billing email" value="billing@orbitallabs.dev"/>
                <Field label="Tax ID" value="EU·VAT 248 8841 21"/>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <Btn kind="primary" accent={accent} size="md">Save</Btn>
            </div>
          </Panel>

          {/* Defaults */}
          <Panel eyebrow="DEFAULTS" title="Inference defaults">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <Field label="Default model" value="llama-3.1-70b-instruct" select/>
              <Field label="Default tier" value="tier-A · production" select/>
              <Field label="Max context tokens" value="131,072" mono/>
              <Field label="Default temperature" value="0.7" mono/>
              <Field label="System prompt template" value="(none)" muted/>
              <Field label="Region preference" value="us-east → eu-west" select/>
            </div>
          </Panel>

          {/* Webhooks */}
          <Panel eyebrow="WEBHOOKS" title="Event delivery"
            action={<Btn kind="secondary" size="sm" icon={<Icon.plus/>}>Add endpoint</Btn>}
            padding={0}>
            <Table
              columns={[
                { label:'URL', w:'2fr', cell: r=>(
                  <div>
                    <Mono size={11.5} color={C.crust[100]}>{r.url}</Mono>
                    <div style={{ display:'flex', gap:5, marginTop:4 }}>
                      {r.events.map((e,i)=><Badge key={i} tone="mute" style={{ padding:'1px 5px', fontSize:9.5 }}>{e}</Badge>)}
                    </div>
                  </div>
                ) },
                { label:'Status', w:'130px', cell: r=> <Badge tone={r.status==='ok'?'success':'danger'} dot>{r.status==='ok'?'200 OK':'502'}</Badge> },
                { label:'Last delivery', w:'160px', cell: r=> <Mono size={11} color={C.crust[300]}>{r.last}</Mono> },
                { label:'Success 7d', w:'130px', cell: r=>(
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ flex:1, height:3, background:C.crust[800], borderRadius:2, overflow:'hidden' }}>
                      <div style={{ width:`${r.rate}%`, height:'100%', background: r.rate > 95 ? C.crystal[500] : C.magma[500] }}/>
                    </div>
                    <Mono size={10.5} color={C.crust[300]}>{r.rate}%</Mono>
                  </div>
                ) },
                { label:'', w:'40px', cell: ()=> <Icon.dots color={C.crust[400]}/> },
              ]}
              rows={[
                { url:'https://api.orbitallabs.dev/orogen/events', events:['receipt.created','request.completed','key.rotated'], status:'ok', last:'2 min ago', rate:99.6 },
                { url:'https://hooks.slack.com/services/T0…/B0…/x9…', events:['replay.mismatch','spend.cap_warning'], status:'ok', last:'12 min ago', rate:100 },
                { url:'https://internal.orbitallabs.dev/orogen-mirror', events:['invoice.paid','credit.topped_up'], status:'fail', last:'1 hour ago', rate:71.2 },
              ]}
            />
          </Panel>

          {/* Auth */}
          <Panel eyebrow="AUTHENTICATION" title="Sign-in methods">
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <ToggleRow icon={<Icon.shield/>} title="Wallet (sr25519)" sub="Challenge-response signed by browser extension. Recommended." on/>
              <ToggleRow icon={<Icon.mail/>} title="Email magic link" sub="6-digit code, 10-min TTL." on/>
              <ToggleRow icon={<Icon.cmd/>} title="WebAuthn / passkey" sub="Bound to a member identity. Per-member opt-in." on={false}/>
              <ToggleRow icon={<Icon.link/>} title="SAML SSO (Okta, Workspace)" sub="Available on Enterprise. Contact sales." disabled/>
            </div>
          </Panel>

          {/* Danger */}
          <Panel
            eyebrow="DANGER ZONE"
            title="Irreversible actions"
            style={{ borderColor:'rgba(239,68,68,0.18)', background:'rgba(239,68,68,0.02)' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <DangerRow title="Revoke all API keys" sub="Immediately invalidates all live and test keys at gateway-router. New keys must be minted." action="Revoke all"/>
              <DangerRow title="Withdraw remaining credits" sub="Convert CUC back to OROG at the current burn-and-mint rate. 14-day hold for refunds."  action="Withdraw"/>
              <DangerRow title="Close organization" sub="Delete the org, members, and 90-day request log. Receipts remain on-chain." action="Close org" destructive/>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value, mono, select, readOnly, muted, style }) {
  return (
    <div style={style}>
      <label className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase' }}>{label}</label>
      <div style={{
        marginTop:7, padding:'9px 12px',
        background: readOnly ? C.crust[1000] : C.crust[850],
        border:`1px solid ${C.crust[800]}`, borderRadius:7,
        display:'flex', alignItems:'center', gap:8,
        fontSize: 13, color: muted ? C.crust[500] : C.crust[100],
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
        letterSpacing: mono ? '-0.01em' : undefined,
      }}>
        <span style={{ flex:1 }}>{value}</span>
        {select && <Icon.chevDown color={C.crust[400]}/>}
        {readOnly && <span style={{ color:C.crust[500], display:'inline-flex' }}><Icon.copy/></span>}
      </div>
    </div>
  );
}

function ToggleRow({ icon, title, sub, on, disabled }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:14, padding:'12px 14px',
      background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:8,
      opacity: disabled ? 0.55 : 1,
    }}>
      <div style={{
        width:30, height:30, borderRadius:7, background:C.crust[900], border:`1px solid ${C.crust[700]}`,
        display:'flex', alignItems:'center', justifyContent:'center', color:C.crust[300],
      }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:500, color:C.crust[100] }}>{title}</div>
        <div style={{ fontSize:11.5, color:C.crust[400], marginTop:2 }}>{sub}</div>
      </div>
      {disabled
        ? <Badge tone="mute">Enterprise</Badge>
        : <div style={{
            width:32, height:18, borderRadius:9,
            background: on ? Accent.magma.hex : C.crust[700],
            position:'relative',
          }}>
            <div style={{ position:'absolute', top:2, left: on ? 16 : 2, width:14, height:14, borderRadius:7, background:'#fff' }}/>
          </div>
      }
    </div>
  );
}

function DangerRow({ title, sub, action, destructive }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:14, padding:'12px 14px',
      background:C.crust[900], border:`1px solid ${C.crust[800]}`, borderRadius:8,
    }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:500, color:C.crust[100] }}>{title}</div>
        <div style={{ fontSize:11.5, color:C.crust[400], marginTop:2 }}>{sub}</div>
      </div>
      <Btn kind="danger" size="md" style={destructive ? { background: 'rgba(239,68,68,0.08)', color: C.ruby[400], border:`1px solid rgba(239,68,68,0.22)` } : undefined}>{action}</Btn>
    </div>
  );
}

Object.assign(window, { ScreenTeam, ScreenSettings });
})();
