// charts.jsx — SVG primitives for Orogen analytics
// Distinctive: stepped area + tick rail; latency histogram with p50/p95 markers;
// disagreement strip; sparkline.

(function(){

// ─────────────────────────────────────────────────────────────
// Sparkline — minimal trend line, optional fill
function Sparkline({ data, width = 120, height = 32, stroke = '#f59e0b', fill, strokeWidth = 1.4 }) {
  if (!data || !data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v,i)=>[i*stepX, height - 2 - ((v-min)/range)*(height-4)]);
  const path = pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const areaPath = `${path} L${width} ${height} L0 ${height} Z`;
  return (
    <svg width={width} height={height} style={{ display:'block', overflow:'visible' }}>
      {fill && <path d={areaPath} fill={fill} />}
      <path d={path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2" fill={stroke}/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// AreaChart — stepped + smooth toggle, with axis grid and hover crosshair
function AreaChart({
  series,                // [{ name, color, data: [{ x, y } ...] }]
  width = 600, height = 220,
  padding = { top:16, right:16, bottom:28, left:36 },
  yTicks = 4, xLabels,    // optional array of labels at series[0].data length
  stacked = false,
  stepped = true,
  gridColor = '#1a1f29',
  axisColor = '#36404f',
  textColor = '#7c8597',
  highlight,             // { x: index } to show crosshair
}) {
  const pad = padding;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  if (!series || !series.length) return null;
  const n = series[0].data.length;
  const stepX = innerW / Math.max(1, n - 1);
  // y range
  let yMax = 0;
  if (stacked) {
    for (let i=0;i<n;i++){ let s=0; series.forEach(sr=>{s+=sr.data[i].y;}); if(s>yMax) yMax=s; }
  } else {
    series.forEach(s=>s.data.forEach(d=>{ if(d.y>yMax) yMax=d.y; }));
  }
  yMax = yMax || 1; yMax = yMax * 1.12;
  const yScale = v => pad.top + innerH - (v / yMax) * innerH;
  // build accumulated stacks
  const stackPrev = new Array(n).fill(0);
  const paths = series.map((s, si) => {
    const tops = s.data.map((d,i)=>{
      const baseV = stacked ? stackPrev[i] : 0;
      return { x: pad.left + i*stepX, y: yScale(baseV + d.y), base: yScale(baseV) };
    });
    if (stacked) s.data.forEach((d,i)=>{ stackPrev[i]+=d.y; });
    let line = '';
    if (stepped) {
      tops.forEach((p,i)=>{
        if (i===0) line += `M${p.x} ${p.y}`;
        else line += ` L${tops[i].x} ${tops[i-1].y} L${p.x} ${p.y}`;
      });
    } else {
      tops.forEach((p,i)=>{ line += `${i?' L':'M'}${p.x} ${p.y}`; });
    }
    // area path (close down to series base)
    let area = line;
    for (let i = tops.length-1; i >= 0; i--) {
      const p = tops[i];
      if (stepped && i < tops.length-1) area += ` L${tops[i].x} ${tops[i].base}`;
      area += ` L${p.x} ${p.base}`;
    }
    area += ' Z';
    return { line, area, tops, color: s.color, name: s.name };
  });
  const ticks = [];
  for (let i = 0; i <= yTicks; i++) {
    const v = (yMax / yTicks) * i;
    ticks.push({ y: yScale(v), v });
  }
  return (
    <svg width={width} height={height} style={{ display:'block', overflow:'visible' }}>
      {/* grid */}
      {ticks.map((t,i)=>(
        <g key={i}>
          <line x1={pad.left} x2={width-pad.right} y1={t.y} y2={t.y} stroke={gridColor} strokeWidth="1" strokeDasharray={i===0?undefined:'2 3'}/>
          <text x={pad.left-8} y={t.y+3.5} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono, monospace" fill={textColor}>
            {formatN(t.v)}
          </text>
        </g>
      ))}
      {/* x labels */}
      {xLabels && xLabels.map((l,i)=>(
        <text key={i} x={pad.left + i*stepX} y={height - pad.bottom + 16} textAnchor="middle"
          fontSize="10" fontFamily="JetBrains Mono, monospace" fill={textColor}>{l}</text>
      ))}
      {/* areas first */}
      {paths.map((p,i)=><path key={'a'+i} d={p.area} fill={p.color} opacity="0.14"/>)}
      {paths.map((p,i)=><path key={'l'+i} d={p.line} fill="none" stroke={p.color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>)}
      {/* highlight */}
      {highlight!=null && (() => {
        const x = pad.left + highlight*stepX;
        return (
          <g>
            <line x1={x} x2={x} y1={pad.top} y2={pad.top+innerH} stroke={axisColor} strokeWidth="1" strokeDasharray="2 2"/>
            {paths.map((p,i)=>(
              <circle key={'h'+i} cx={x} cy={p.tops[highlight].y} r="3.2" fill="#0b0d10" stroke={p.color} strokeWidth="1.6"/>
            ))}
          </g>
        );
      })()}
    </svg>
  );
}

function formatN(v) {
  if (v >= 1000000) return (v/1000000).toFixed(1)+'M';
  if (v >= 1000) return (v/1000).toFixed(v>=10000?0:1)+'k';
  if (v >= 100) return v.toFixed(0);
  if (v >= 10) return v.toFixed(1);
  return v.toFixed(2);
}

// ─────────────────────────────────────────────────────────────
// LatencyHistogram — bins of latency in ms, with p50/p95 markers
function LatencyHistogram({ bins, p50, p95, width = 320, height = 96, color = '#34d399' }) {
  // bins: [{label, count}]
  const max = Math.max(...bins.map(b=>b.count)) || 1;
  const w = width / bins.length;
  return (
    <svg width={width} height={height} style={{ display:'block', overflow:'visible' }}>
      {bins.map((b,i)=>{
        const h = (b.count/max) * (height - 22);
        const isP95 = b.p95;
        return (
          <g key={i}>
            <rect x={i*w + 1} y={height - 18 - h} width={w-2} height={h}
              fill={isP95 ? '#f59e0b' : color} opacity={isP95?0.9:0.7} rx="1.5"/>
          </g>
        );
      })}
      {/* axis */}
      <line x1="0" x2={width} y1={height-18} y2={height-18} stroke="#252b38" strokeWidth="1"/>
      {/* markers */}
      {p50 != null && (
        <g>
          <line x1={p50*width} x2={p50*width} y1={2} y2={height-18} stroke="#7c8597" strokeWidth="1" strokeDasharray="3 2"/>
          <text x={p50*width+4} y={10} fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill="#a5acbb">p50</text>
        </g>
      )}
      {p95 != null && (
        <g>
          <line x1={p95*width} x2={p95*width} y1={2} y2={height-18} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2"/>
          <text x={p95*width+4} y={10} fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill="#fbbf24">p95</text>
        </g>
      )}
      <text x="0" y={height-5} fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#4f5b6e">0</text>
      <text x={width-2} y={height-5} textAnchor="end" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#4f5b6e">5s</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// DisagreementStrip — vertical ticks across a window; majority green, sampled magma, mismatch ruby
function DisagreementStrip({ events, width = 320, height = 36 }) {
  // events: [{ x: 0-1, kind: 'clean'|'sampled'|'mismatch' }]
  const colors = { clean: '#34d39933', sampled: '#fbbf24', mismatch: '#ef4444' };
  return (
    <svg width={width} height={height} style={{ display:'block', overflow:'visible' }}>
      <line x1="0" x2={width} y1={height/2} y2={height/2} stroke="#252b38" strokeWidth="1"/>
      {events.map((e,i)=>{
        const x = e.x*width;
        const h = e.kind === 'clean' ? 8 : (e.kind === 'sampled' ? 16 : 24);
        return <line key={i} x1={x} x2={x} y1={(height-h)/2} y2={(height+h)/2}
          stroke={colors[e.kind]} strokeWidth={e.kind==='mismatch'?1.6:1.2}/>;
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// DonutMeter — credit usage / budget cap
function DonutMeter({ value, max, size = 96, stroke = 9, color = '#f59e0b', track = '#1a1f29', label, sub }) {
  const r = (size - stroke)/2;
  const c = 2*Math.PI*r;
  const dash = c * Math.min(1, value/max);
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1 }}>
        {label && <div style={{ fontSize:size*0.18, fontWeight:600, letterSpacing:'-0.02em' }}>{label}</div>}
        {sub && <div className="mono" style={{ fontSize:size*0.10, color:'#7c8597' }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ColumnBars — per-model token stack
function ColumnBars({ groups, width = 540, height = 200, colors = ['#f59e0b', '#34d399'], labels }) {
  // groups: [{name, values:[in, out]}]
  const max = Math.max(...groups.map(g=>g.values.reduce((a,b)=>a+b,0))) || 1;
  const gw = width / groups.length;
  const barW = Math.min(28, gw - 16);
  return (
    <svg width={width} height={height} style={{ display:'block', overflow:'visible' }}>
      {/* axis */}
      <line x1="0" x2={width} y1={height-22} y2={height-22} stroke="#252b38"/>
      {groups.map((g,i)=>{
        const x = i*gw + (gw-barW)/2;
        let yCursor = height - 22;
        return (
          <g key={i}>
            {g.values.map((v,vi)=>{
              const h = (v / max) * (height - 38);
              yCursor -= h;
              return <rect key={vi} x={x} y={yCursor} width={barW} height={h} fill={colors[vi]} opacity={vi===0?0.95:0.7} rx="2"/>;
            })}
            <text x={i*gw + gw/2} y={height-8} textAnchor="middle"
              fontSize="10.5" fontFamily="JetBrains Mono, monospace" fill="#7c8597">{g.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// CalendarHeatmap — day-of-week × week grid, useful on dashboard
function CalendarHeatmap({ data, cell = 11, gap = 2, weeks = 18 }) {
  // data: array of values length = weeks*7
  const max = Math.max(...data, 1);
  const w = weeks*(cell+gap), h = 7*(cell+gap);
  return (
    <svg width={w} height={h}>
      {Array.from({length: weeks}).map((_,wi) =>
        Array.from({length: 7}).map((_,di) => {
          const v = data[wi*7+di] ?? 0;
          const t = v / max;
          const fill = v === 0 ? '#161a22' : `rgba(245,158,11,${0.15 + t*0.75})`;
          return <rect key={wi+'_'+di} x={wi*(cell+gap)} y={di*(cell+gap)} width={cell} height={cell} fill={fill} rx="2"/>;
        })
      )}
    </svg>
  );
}

Object.assign(window, { Sparkline, AreaChart, LatencyHistogram, DisagreementStrip, DonutMeter, ColumnBars, CalendarHeatmap });
})();
