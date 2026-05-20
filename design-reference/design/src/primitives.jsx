// primitives.jsx — design tokens + atomic UI primitives for Orogen customer console
// Palette: crust (dark neutrals) · magma (amber accent) · crystal (verified green)
// Style: dense infra console — Linear/Vercel/Cloudflare sober

const C = {
  crust: {
    1000: '#06080a',
    950: '#0b0d10',
    900: '#11141a',
    850: '#161a22',
    800: '#1a1f29',
    700: '#252b38',
    600: '#36404f',
    500: '#4f5b6e',
    400: '#7c8597',
    300: '#a5acbb',
    200: '#cdd1da',
    100: '#e9ebef',
    50:  '#f5f6f8',
  },
  magma: { 600:'#d97706', 500:'#f59e0b', 400:'#fbbf24', 300:'#fcd34d', 200:'#fde68a' },
  crystal: { 600:'#10b981', 500:'#34d399', 400:'#6ee7b7', 300:'#a7f3d0' },
  ruby:   { 600:'#dc2626', 500:'#ef4444', 400:'#f87171', 300:'#fca5a5' },
  sky:    { 600:'#0284c7', 500:'#0ea5e9', 400:'#38bdf8', 300:'#7dd3fc' },
  violet: { 600:'#7c3aed', 500:'#8b5cf6', 400:'#a78bfa' },
};

// Default accent — overridable via Tweaks (see app.jsx)
const Accent = {
  magma:   { hex: C.magma[500],   soft: 'rgba(245,158,11,0.12)',  ring: 'rgba(245,158,11,0.30)' },
  crystal: { hex: C.crystal[500], soft: 'rgba(52,211,153,0.12)',  ring: 'rgba(52,211,153,0.30)' },
  sky:     { hex: C.sky[500],     soft: 'rgba(14,165,233,0.12)',  ring: 'rgba(14,165,233,0.30)' },
  violet:  { hex: C.violet[500],  soft: 'rgba(139,92,246,0.12)',  ring: 'rgba(139,92,246,0.30)' },
};

// ────────────────────────────────────────────────────────────────────
// Inject base CSS once (scoped under .oro-app so it can't leak into canvas chrome)
// ────────────────────────────────────────────────────────────────────
(function injectStyles() {
  if (document.getElementById('oro-styles')) return;
  const s = document.createElement('style');
  s.id = 'oro-styles';
  s.textContent = `
    .oro-app { font-family:'Inter',ui-sans-serif,system-ui,sans-serif; color:${C.crust[100]}; background:${C.crust[950]}; font-feature-settings:'cv02','cv03','cv04','ss01'; }
    .oro-app, .oro-app * { box-sizing:border-box; }
    .oro-app .mono { font-family:'JetBrains Mono', ui-monospace, SFMono-Regular, monospace; font-feature-settings:'liga' 0,'calt' 0,'zero','ss01'; }
    .oro-app .display { font-family:'Instrument Serif', 'Inter', serif; font-weight:400; letter-spacing:-0.01em; }
    .oro-app ::selection { background:rgba(245,158,11,0.35); color:#fff; }
    .oro-app button { font-family:inherit; }
    .oro-app .scroll::-webkit-scrollbar { width:8px; height:8px; }
    .oro-app .scroll::-webkit-scrollbar-thumb { background:${C.crust[700]}; border-radius:4px; }
    .oro-app .row:hover { background:${C.crust[850]}; }
    .oro-app a { color:inherit; }
    @keyframes oroPulse { 0%,100% { opacity:.6 } 50% { opacity:1 } }
    @keyframes oroShimmer { 0% { transform:translateX(-100%) } 100% { transform:translateX(200%) } }
    .oro-app .pulse { animation: oroPulse 1.8s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
})();

// ────────────────────────────────────────────────────────────────────
// Mono — inline monospace fragment
function Mono({ children, size = 12, color = C.crust[300], weight = 500, style }) {
  return <span className="mono" style={{ fontSize:size, color, fontWeight:weight, letterSpacing:'-0.01em', ...style }}>{children}</span>;
}

// Truncated hash/id with copy affordance
function HashChip({ value, lead = 6, tail = 4, prefix = '', size = 11, style }) {
  const short = value.length > lead + tail + 2
    ? `${value.slice(0, lead)}…${value.slice(-tail)}`
    : value;
  return (
    <span className="mono" style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'2px 6px', borderRadius:5,
      background:C.crust[850], border:`1px solid ${C.crust[800]}`,
      color:C.crust[200], fontSize:size, fontWeight:500, letterSpacing:'-0.01em',
      ...style,
    }}>
      {prefix && <span style={{ color:C.crust[500] }}>{prefix}</span>}
      {short}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────
// Card — generic surface
function Card({ children, padding = 20, style, interactive = false, ...rest }) {
  return (
    <div {...rest} style={{
      background:C.crust[900],
      border:`1px solid ${C.crust[800]}`,
      borderRadius:10,
      padding,
      transition: interactive ? 'border-color .12s, background .12s' : undefined,
      ...style,
    }}>{children}</div>
  );
}

// Section header inside a content column
function SectionHeader({ eyebrow, title, action, style }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:14, ...style }}>
      <div>
        {eyebrow && <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:6 }}>{eyebrow}</div>}
        <div style={{ fontSize:15, fontWeight:600, color:C.crust[100], letterSpacing:'-0.01em' }}>{title}</div>
      </div>
      {action}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Button — primary / secondary / ghost / danger
function Btn({ kind = 'secondary', size = 'md', children, icon, iconRight, accent = Accent.magma, onClick, style, disabled }) {
  const sizes = {
    sm: { h:26, px:10, fs:12 },
    md: { h:32, px:13, fs:13 },
    lg: { h:38, px:16, fs:13.5 },
  }[size];
  const styles = {
    primary: {
      background: accent.hex,
      color: C.crust[1000],
      border: `1px solid ${accent.hex}`,
      boxShadow: `0 1px 0 ${accent.hex}, inset 0 1px 0 rgba(255,255,255,0.18)`,
      fontWeight: 600,
    },
    secondary: {
      background: C.crust[850],
      color: C.crust[100],
      border: `1px solid ${C.crust[700]}`,
      fontWeight: 500,
    },
    ghost: {
      background: 'transparent',
      color: C.crust[200],
      border: `1px solid transparent`,
      fontWeight: 500,
    },
    danger: {
      background: 'transparent',
      color: C.ruby[400],
      border: `1px solid ${C.crust[700]}`,
      fontWeight: 500,
    },
    outline: {
      background: 'transparent',
      color: C.crust[100],
      border: `1px solid ${C.crust[700]}`,
      fontWeight: 500,
    }
  }[kind];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display:'inline-flex', alignItems:'center', gap:6,
      height:sizes.h, padding:`0 ${sizes.px}px`,
      borderRadius:6, fontSize:sizes.fs,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      whiteSpace:'nowrap',
      ...styles, ...style,
    }}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────
// Badge / Pill — small status chips
function Badge({ tone = 'neutral', children, dot, style }) {
  const tones = {
    neutral: { bg:C.crust[850], fg:C.crust[200], bd:C.crust[700], dotC:C.crust[400] },
    success: { bg:'rgba(52,211,153,0.08)', fg:C.crystal[400], bd:'rgba(52,211,153,0.22)', dotC:C.crystal[500] },
    warn:    { bg:'rgba(245,158,11,0.08)', fg:C.magma[400],   bd:'rgba(245,158,11,0.22)', dotC:C.magma[500] },
    danger:  { bg:'rgba(239,68,68,0.08)',  fg:C.ruby[400],    bd:'rgba(239,68,68,0.22)',  dotC:C.ruby[500] },
    info:    { bg:'rgba(14,165,233,0.08)', fg:C.sky[400],     bd:'rgba(14,165,233,0.22)', dotC:C.sky[500] },
    accent:  { bg:'rgba(245,158,11,0.08)', fg:C.magma[400],   bd:'rgba(245,158,11,0.22)', dotC:C.magma[500] },
    mute:    { bg:'transparent',          fg:C.crust[400],    bd:C.crust[800],            dotC:C.crust[500] },
  }[tone];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'2px 8px', borderRadius:999,
      background:tones.bg, color:tones.fg, border:`1px solid ${tones.bd}`,
      fontSize:11, fontWeight:500, letterSpacing:'-0.005em',
      ...style,
    }}>
      {dot && <span style={{ width:6, height:6, borderRadius:3, background:tones.dotC, display:'inline-block' }} className={tone==='warn'?'pulse':''} />}
      {children}
    </span>
  );
}

// Status dot — bare colored dot (no chip)
function StatusDot({ tone = 'success', pulse = false, size = 7 }) {
  const c = { success:C.crystal[500], warn:C.magma[500], danger:C.ruby[500], neutral:C.crust[500], info:C.sky[500] }[tone];
  return <span className={pulse?'pulse':''} style={{ width:size, height:size, borderRadius:size/2, background:c, display:'inline-block', boxShadow:`0 0 0 3px ${c}22` }} />;
}

// ────────────────────────────────────────────────────────────────────
// Tab strip
function Tabs({ items, active, onChange, style }) {
  return (
    <div style={{ display:'flex', gap:2, borderBottom:`1px solid ${C.crust[800]}`, ...style }}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <button key={it.id} onClick={()=>onChange&&onChange(it.id)} style={{
            background:'transparent', border:0, cursor:'pointer',
            padding:'10px 14px 11px', fontSize:13, fontWeight:500,
            color: on ? C.crust[100] : C.crust[400],
            borderBottom: on ? `1px solid ${C.magma[500]}` : '1px solid transparent',
            marginBottom:-1,
            display:'inline-flex', alignItems:'center', gap:6,
          }}>
            {it.label}
            {it.count != null && <span className="mono" style={{ fontSize:10.5, padding:'1px 5px', background:C.crust[850], borderRadius:4, color:C.crust[400] }}>{it.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Icons — minimal stroke set, all 16px viewBox
const Icon = {
  search: (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  plus: (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  copy: (p={}) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" {...p}><rect x="5" y="5" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 11V3a1 1 0 0 1 1-1h6" stroke="currentColor" strokeWidth="1.3"/></svg>,
  check: (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><path d="m3.5 8 3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chev: (p={}) => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" {...p}><path d="m6 4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  chevDown: (p={}) => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" {...p}><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  dots: (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" {...p}><circle cx="3.5" cy="8" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="12.5" cy="8" r="1.2"/></svg>,
  ext: (p={}) => <svg width="11" height="11" viewBox="0 0 16 16" fill="none" {...p}><path d="M6 3h7v7M13 3 6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M11 9v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  bolt: (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" {...p}><path d="M9 1 3 9h4l-1 6 6-8H8l1-6Z"/></svg>,
  shield: (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><path d="M8 1.5 3 3v5c0 3 2.2 5.5 5 6.5 2.8-1 5-3.5 5-6.5V3L8 1.5Z" stroke="currentColor" strokeWidth="1.3"/></svg>,
  wallet: (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 7h12M11 10h1" stroke="currentColor" strokeWidth="1.3"/></svg>,
  mail: (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="m3 5 5 4 5-4" stroke="currentColor" strokeWidth="1.3"/></svg>,
  rotate: (p={}) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" {...p}><path d="M13 8a5 5 0 1 1-1.5-3.5M13 2v3h-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trash: (p={}) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" {...p}><path d="M3 4h10M6 4V2.5h4V4M5 4l.5 9h5L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  download: (p={}) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" {...p}><path d="M8 2v8m0 0 3-3m-3 3-3-3M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  filter: (p={}) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" {...p}><path d="M2 3h12l-4.5 6V13L6.5 12V9L2 3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  arrUp: (p={}) => <svg width="11" height="11" viewBox="0 0 16 16" fill="none" {...p}><path d="M8 13V3m0 0 4 4M8 3 4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrDown: (p={}) => <svg width="11" height="11" viewBox="0 0 16 16" fill="none" {...p}><path d="M8 3v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  cmd: (p={}) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" {...p}><path d="M4 4h8v8H4z M2 4a2 2 0 1 1 2 2h0 M14 4a2 2 0 1 0-2 2h0 M2 12a2 2 0 1 0 2-2h0 M14 12a2 2 0 1 1-2-2h0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  link: (p={}) => <svg width="13" height="13" viewBox="0 0 16 16" fill="none" {...p}><path d="M7 9a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5L8 4.5M9 7a2.5 2.5 0 0 0-3.5 0l-2 2A2.5 2.5 0 0 0 7 12.5L8 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  warn: (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><path d="M8 2 1.5 13.5h13L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  info: (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  spark: (p={}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" {...p}><path d="M8 1.5 9.4 6.6 14.5 8 9.4 9.4 8 14.5 6.6 9.4 1.5 8l5.1-1.4L8 1.5Z"/></svg>,
};

// ────────────────────────────────────────────────────────────────────
// Orogen mark — abstract "anchor to physical work"
function OrogenMark({ size = 22, color = C.crust[100] }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* concentric arcs + anchor wedge */}
      <path d="M3 22 L13 6 L19 6 L29 22 Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M9.5 22 L16 11.5 L22.5 22 Z" fill={color} />
      <circle cx="16" cy="26" r="1.4" fill={color} />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────
// KBD — keyboard hint
function Kbd({ children }) {
  return <span className="mono" style={{
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    minWidth:18, height:18, padding:'0 5px', borderRadius:4,
    background:C.crust[850], border:`1px solid ${C.crust[700]}`,
    color:C.crust[300], fontSize:10.5, fontWeight:500,
  }}>{children}</span>;
}

// ────────────────────────────────────────────────────────────────────
// Avatar — 1-char monogram
function Avatar({ name = '?', size = 24, hueSeed }) {
  const ch = name.trim()[0]?.toUpperCase() || '?';
  // deterministic hue from seed/name
  const seed = hueSeed != null ? hueSeed : [...name].reduce((a,c)=>a+c.charCodeAt(0),0);
  const hue = seed * 47 % 360;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      width:size, height:size, borderRadius:size/2,
      background:`oklch(0.32 0.06 ${hue})`, color:`oklch(0.86 0.05 ${hue})`,
      border:`1px solid ${C.crust[800]}`,
      fontSize: size*0.42, fontWeight:600,
    }}>{ch}</span>
  );
}

// Divider
function Divider({ vertical, style }) {
  return vertical
    ? <span style={{ display:'inline-block', width:1, alignSelf:'stretch', background:C.crust[800], ...style }} />
    : <hr style={{ border:0, borderTop:`1px solid ${C.crust[800]}`, margin:0, ...style }} />;
}

// Code block
function Code({ children, style, copyable = true }) {
  return (
    <div style={{
      background:C.crust[1000], border:`1px solid ${C.crust[800]}`, borderRadius:8,
      padding:'12px 14px', position:'relative', ...style,
    }} className="mono">
      <pre style={{ margin:0, fontSize:12, lineHeight:1.65, color:C.crust[200], whiteSpace:'pre-wrap', wordBreak:'break-all' }}>{children}</pre>
      {copyable && (
        <button style={{
          position:'absolute', top:8, right:8,
          background:C.crust[850], border:`1px solid ${C.crust[700]}`,
          color:C.crust[300], padding:'3px 7px', borderRadius:5, fontSize:10.5, cursor:'pointer',
        }}>copy</button>
      )}
    </div>
  );
}

// Tone'd colored swatch for accent display in tweaks
Object.assign(window, {
  C, Accent, Mono, HashChip, Card, SectionHeader, Btn, Badge, StatusDot, Tabs, Icon, OrogenMark, Kbd, Avatar, Divider, Code,
});
