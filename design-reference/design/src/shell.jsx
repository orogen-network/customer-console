// shell.jsx — Sidebar + Topbar + AppShell wrapper
// Frame width: 1440 (desktop-first per brief)

(function(){

function NavItem({ icon, label, active, badge, indent = 0 }) {
  return (
    <a style={{
      display:'flex', alignItems:'center', gap:10,
      padding: `7px 10px 7px ${10 + indent*16}px`,
      borderRadius:6, fontSize:13, fontWeight: active ? 500 : 400,
      color: active ? C.crust[100] : C.crust[300],
      background: active ? C.crust[850] : 'transparent',
      cursor:'pointer', position:'relative',
    }}>
      {active && <span style={{ position:'absolute', left:-1, top:8, bottom:8, width:2, background:C.magma[500], borderRadius:1 }}/>}
      <span style={{ width:14, color: active ? C.crust[100] : C.crust[400], display:'inline-flex' }}>{icon}</span>
      <span style={{ flex:1 }}>{label}</span>
      {badge}
    </a>
  );
}

function NavGroup({ label, children }) {
  return (
    <div style={{ marginTop:14 }}>
      <div className="mono" style={{ fontSize:9.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase', padding:'0 10px 6px' }}>{label}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:1 }}>{children}</div>
    </div>
  );
}

function Sidebar({ active = 'dashboard', collapsed = false }) {
  if (collapsed) {
    return (
      <div style={{ width:52, background:C.crust[900], borderRight:`1px solid ${C.crust[800]}`, display:'flex', flexDirection:'column', alignItems:'center', padding:'14px 0', gap:8 }}>
        <OrogenMark size={24}/>
        <div style={{ width:24, height:1, background:C.crust[800], margin:'8px 0' }}/>
        {['dashboard','keys','usage','billing','team','settings'].map(k=>(
          <div key={k} style={{
            width:36, height:36, borderRadius:6,
            background: active===k ? C.crust[850] : 'transparent',
            display:'flex', alignItems:'center', justifyContent:'center',
            color: active===k ? C.crust[100] : C.crust[400],
          }}>{({
            dashboard:Icon.spark, keys:Icon.bolt, usage:Icon.arrUp, billing:Icon.wallet, team:Icon.shield, settings:Icon.dots
          }[k])()}</div>
        ))}
      </div>
    );
  }
  return (
    <div style={{
      width:220, background:C.crust[900], borderRight:`1px solid ${C.crust[800]}`,
      display:'flex', flexDirection:'column', flexShrink:0,
    }}>
      {/* org switcher */}
      <div style={{ padding:'12px 12px 10px', borderBottom:`1px solid ${C.crust[800]}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, padding:'6px 8px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:7, cursor:'pointer' }}>
          <div style={{
            width:22, height:22, borderRadius:5,
            background:`linear-gradient(135deg, ${C.magma[500]} 0%, ${C.magma[600]} 100%)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:C.crust[1000], fontSize:11, fontWeight:700,
          }}>O</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12.5, fontWeight:500, color:C.crust[100], overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>orbital labs</div>
            <div className="mono" style={{ fontSize:10, color:C.crust[500] }}>org_38xq · pro</div>
          </div>
          <Icon.chev color={C.crust[400]}/>
        </div>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'12px 8px' }} className="scroll">
        <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
          <NavItem icon={<Icon.spark/>} label="Dashboard" active={active==='dashboard'}/>
          <NavItem icon={<Icon.bolt/>} label="API Keys" active={active==='keys'} badge={<span className="mono" style={{ fontSize:10, color:C.crust[400] }}>4</span>}/>
          <NavItem icon={<Icon.arrUp/>} label="Usage" active={active==='usage'}/>
          <NavItem icon={<Icon.wallet/>} label="Billing" active={active==='billing'} badge={<Badge tone="warn" style={{ padding:'1px 6px' }}>$8.40</Badge>}/>
        </div>

        <NavGroup label="Organization">
          <NavItem icon={<Icon.shield/>} label="Team" active={active==='team'}/>
          <NavItem icon={<Icon.dots/>} label="Settings" active={active==='settings'}/>
        </NavGroup>

        <NavGroup label="Reference">
          <NavItem icon={<Icon.link/>} label="Docs" badge={<Icon.ext color={C.crust[500]}/>}/>
          <NavItem icon={<Icon.shield/>} label="Attestation explorer" badge={<Icon.ext color={C.crust[500]}/>}/>
          <NavItem icon={<Icon.info/>} label="Status" badge={<StatusDot tone="success" pulse size={6}/>}/>
        </NavGroup>
      </div>

      {/* network footer */}
      <div style={{ padding:'10px 12px', borderTop:`1px solid ${C.crust[800]}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <StatusDot tone="success" pulse size={6}/>
          <span style={{ fontSize:11.5, color:C.crust[200], fontWeight:500 }}>network</span>
          <span className="mono" style={{ fontSize:10, color:C.crust[500], marginLeft:'auto' }}>mainnet</span>
        </div>
        <div className="mono" style={{ fontSize:10, color:C.crust[500], display:'flex', justifyContent:'space-between' }}>
          <span>42,118 ops</span>
          <span>burn 0.142 OROG/s</span>
        </div>
      </div>
    </div>
  );
}

function Topbar({ title, breadcrumbs, actions, search = true, env = 'mainnet', user }) {
  return (
    <div style={{
      height:52, borderBottom:`1px solid ${C.crust[800]}`,
      display:'flex', alignItems:'center', padding:'0 18px',
      background:'rgba(11,13,16,0.85)', backdropFilter:'blur(8px)',
      gap:12,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        {breadcrumbs ? breadcrumbs.map((b,i)=>(
          <React.Fragment key={i}>
            {i>0 && <span style={{ color:C.crust[600], fontSize:13 }}>/</span>}
            <span style={{
              fontSize:13.5, color: i === breadcrumbs.length-1 ? C.crust[100] : C.crust[400],
              fontWeight: i === breadcrumbs.length-1 ? 500 : 400,
              fontFamily: b.mono ? 'JetBrains Mono, monospace' : undefined,
              letterSpacing: b.mono ? '-0.01em' : undefined,
            }}>{b.label}</span>
          </React.Fragment>
        )) : (
          <span style={{ fontSize:14, fontWeight:500, color:C.crust[100] }}>{title}</span>
        )}
      </div>

      {search && (
        <div style={{
          marginLeft:24, flex:1, maxWidth:380,
          display:'flex', alignItems:'center', gap:8,
          height:30, padding:'0 10px',
          background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:7,
          color:C.crust[500], fontSize:12.5, cursor:'pointer',
        }}>
          <Icon.search/>
          <span>Search requests, keys, transactions…</span>
          <span style={{ marginLeft:'auto', display:'flex', gap:3 }}>
            <Kbd>⌘</Kbd><Kbd>K</Kbd>
          </span>
        </div>
      )}

      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
        {actions}
        <div style={{
          display:'flex', alignItems:'center', gap:6, padding:'4px 8px',
          background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:6,
        }}>
          <StatusDot tone="success" size={5} pulse/>
          <span className="mono" style={{ fontSize:11, color:C.crust[300] }}>{env}</span>
        </div>
        <Avatar name={user || 'KS'} size={26}/>
      </div>
    </div>
  );
}

// AppShell — full chrome for a screen. Width/height are explicit so screens
// drop cleanly into DCArtboard.
const SidebarContext = React.createContext({ collapsed: false });

function AppShell({ active = 'dashboard', title, breadcrumbs, actions, user, children, width = 1440, height = 900, collapsed }) {
  const ctx = React.useContext(SidebarContext);
  const c = collapsed !== undefined ? collapsed : ctx.collapsed;
  return (
    <div className="oro-app" style={{
      width, height,
      display:'flex', background:C.crust[950],
      overflow:'hidden',
      borderRadius: 0,
    }}>
      <Sidebar active={active} collapsed={c}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <Topbar title={title} breadcrumbs={breadcrumbs} actions={actions} user={user}/>
        <div style={{ flex:1, overflow:'auto', background:C.crust[950] }} className="scroll">
          {children}
        </div>
      </div>
    </div>
  );
}

// Page heading inside content
function PageHeader({ eyebrow, title, sub, actions, style }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'24px 28px 18px', borderBottom:`1px solid ${C.crust[850]}`, ...style }}>
      <div>
        {eyebrow && <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
        <h1 style={{ margin:0, fontSize:22, fontWeight:600, letterSpacing:'-0.02em', color:C.crust[100] }}>{title}</h1>
        {sub && <div style={{ marginTop:6, fontSize:13, color:C.crust[400], maxWidth:620, lineHeight:1.5 }}>{sub}</div>}
      </div>
      {actions && <div style={{ display:'flex', gap:8, alignItems:'center' }}>{actions}</div>}
    </div>
  );
}

// Metric tile — big number, label, sparkline footer
function Metric({ label, value, sub, delta, deltaTone, spark, sparkColor = C.magma[500], style, accent }) {
  return (
    <div style={{
      padding:'16px 18px 14px', background:C.crust[900], border:`1px solid ${C.crust[800]}`, borderRadius:10,
      display:'flex', flexDirection:'column', gap:6, position:'relative', overflow:'hidden',
      ...style,
    }}>
      {accent && <div style={{ position:'absolute', left:0, top:0, bottom:0, width:2, background:accent }}/>}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</div>
        {delta && <Badge tone={deltaTone || 'neutral'} style={{ padding:'1px 6px' }}>{delta}</Badge>}
      </div>
      <div className="display" style={{ fontSize:30, lineHeight:1.05, letterSpacing:'-0.02em', color:C.crust[100] }}>{value}</div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto', paddingTop:8 }}>
        {sub && <div className="mono" style={{ fontSize:10.5, color:C.crust[400] }}>{sub}</div>}
        {spark && <Sparkline data={spark} width={70} height={22} stroke={sparkColor} fill={sparkColor+'22'}/>}
      </div>
    </div>
  );
}

// Notice / unavailable banner — per brief, never fake state
function Notice({ tone = 'info', icon, title, body, action }) {
  const tones = {
    info:   { fg:C.sky[400], bd:'rgba(14,165,233,0.22)', bg:'rgba(14,165,233,0.05)' },
    warn:   { fg:C.magma[400], bd:'rgba(245,158,11,0.22)', bg:'rgba(245,158,11,0.05)' },
    danger: { fg:C.ruby[400], bd:'rgba(239,68,68,0.22)', bg:'rgba(239,68,68,0.05)' },
    neutral:{ fg:C.crust[300], bd:C.crust[800], bg:C.crust[900] },
  }[tone];
  return (
    <div style={{
      display:'flex', gap:12, padding:'12px 14px',
      border:`1px solid ${tones.bd}`, background:tones.bg, borderRadius:8,
      alignItems:'flex-start',
    }}>
      <div style={{ color:tones.fg, marginTop:1 }}>{icon || <Icon.info/>}</div>
      <div style={{ flex:1, minWidth:0 }}>
        {title && <div style={{ fontSize:12.5, fontWeight:500, color:C.crust[100], marginBottom:body?3:0 }}>{title}</div>}
        {body && <div style={{ fontSize:12, color:C.crust[400], lineHeight:1.5 }}>{body}</div>}
      </div>
      {action}
    </div>
  );
}

// Table — sortable header, dense rows
function Table({ columns, rows, onRowClick, selectedRow, style }) {
  return (
    <div style={{ background:C.crust[900], border:`1px solid ${C.crust[800]}`, borderRadius:10, overflow:'hidden', ...style }}>
      <div style={{
        display:'grid', gridTemplateColumns: columns.map(c=>c.w||'1fr').join(' '),
        padding:'9px 16px', borderBottom:`1px solid ${C.crust[800]}`,
        background:C.crust[850],
      }}>
        {columns.map((c,i)=>(
          <div key={i} className="mono" style={{
            fontSize:10.5, color:C.crust[400], letterSpacing:'0.08em', textTransform:'uppercase',
            textAlign: c.align || 'left',
            display:'flex', alignItems:'center', gap:4,
            justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start',
          }}>{c.label}{c.sort && <Icon.chevDown color={C.crust[500]}/>}</div>
        ))}
      </div>
      {rows.map((row,i)=>(
        <div key={i}
          onClick={()=>onRowClick&&onRowClick(row,i)}
          className="row"
          style={{
            display:'grid', gridTemplateColumns: columns.map(c=>c.w||'1fr').join(' '),
            padding:'11px 16px', borderBottom: i===rows.length-1?'none':`1px solid ${C.crust[850]}`,
            cursor: onRowClick ? 'pointer' : 'default',
            background: selectedRow === i ? C.crust[850] : 'transparent',
            transition:'background .08s',
            alignItems:'center',
          }}>
          {columns.map((c,ci)=>(
            <div key={ci} style={{ textAlign: c.align || 'left', minWidth:0, overflow:'hidden' }}>
              {c.cell ? c.cell(row, i) : row[c.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Section panel — used to chunk content vertically
function Panel({ eyebrow, title, sub, action, children, padding = 20, style }) {
  return (
    <div style={{
      background:C.crust[900], border:`1px solid ${C.crust[800]}`, borderRadius:10,
      overflow:'hidden', ...style,
    }}>
      {(title || action) && (
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'14px 18px', borderBottom:`1px solid ${C.crust[850]}`,
          gap:12,
        }}>
          <div>
            {eyebrow && <div className="mono" style={{ fontSize:10, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>{eyebrow}</div>}
            <div style={{ fontSize:13.5, fontWeight:600, color:C.crust[100] }}>{title}</div>
            {sub && <div style={{ fontSize:12, color:C.crust[400], marginTop:3 }}>{sub}</div>}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, AppShell, PageHeader, Metric, Notice, Table, Panel, NavItem, NavGroup, SidebarContext });
})();
