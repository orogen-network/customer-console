// receipt.jsx — branded receipt envelope artifact
// Variant: envelope (default, distinctive) | chip (minimal) | rail (technical)
// Stays calm visually for clean/sampled-clean; mismatch expands an evidence rail BELOW.

(function(){

// Subtle perforation edge — rendered as dashed border + corner tabs
function PerforatedEdge({ side = 'top', color }) {
  return (
    <svg width="100%" height="6" preserveAspectRatio="none" style={{ display:'block' }}>
      <line x1="0" y1="3" x2="100%" y2="3" stroke={color} strokeWidth="0.8" strokeDasharray="2 4" opacity="0.6"/>
    </svg>
  );
}

// Fingerprint visualization — deterministic ascii-art-y SVG of a signature
// Doesn't actually compute anything; renders a stable pattern from the hash string.
function SignatureFingerprint({ seed = 'a1b2c3', width = 130, height = 56 }) {
  const cols = 16, rows = 8;
  const cellW = width/cols, cellH = height/rows;
  // pseudo-random from seed
  let h = 0;
  for (let i=0;i<seed.length;i++) h = (h*31 + seed.charCodeAt(i)) >>> 0;
  function rnd(){ h = (h*1664525 + 1013904223) >>> 0; return h / 0xffffffff; }
  const cells = [];
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      const v = rnd();
      if (v > 0.45) {
        const intensity = v;
        cells.push({ c, r, intensity });
      }
    }
  }
  return (
    <svg width={width} height={height} style={{ display:'block' }}>
      {cells.map((cell,i)=>(
        <rect key={i}
          x={cell.c*cellW + 0.5} y={cell.r*cellH + 0.5}
          width={cellW-1} height={cellH-1}
          fill={`rgba(245,158,11,${0.18 + cell.intensity*0.55})`}
          rx="1"/>
      ))}
    </svg>
  );
}

// Attestation seal — circular "stamped" badge
function AttestationSeal({ ok = true, model = 'H100', size = 78 }) {
  const accent = ok ? '#34d399' : '#7c8597';
  const r = size/2 - 2;
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ position:'absolute', inset:0 }}>
        <defs>
          <path id={`circ${size}`} d={`M ${size/2} ${size/2} m -${r-9} 0 a ${r-9} ${r-9} 0 1 1 ${2*(r-9)} 0 a ${r-9} ${r-9} 0 1 1 -${2*(r-9)} 0`}/>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={accent} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 3"/>
        <circle cx={size/2} cy={size/2} r={r-4} fill="none" stroke={accent} strokeOpacity="0.6" strokeWidth="0.8"/>
        <text fontSize={size*0.085} fontFamily="JetBrains Mono, monospace" fill={accent} opacity="0.85" letterSpacing="2">
          <textPath href={`#circ${size}`} startOffset="0%">TEE ATTESTED · INTEL SGX · {model} · SIG·OK ·  </textPath>
        </text>
      </svg>
      <div style={{
        position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:1,
      }}>
        <div style={{
          color: accent, fontSize: size*0.34, fontWeight:300,
          fontFamily:'Instrument Serif, serif', lineHeight:1,
        }}>{ok ? '✓' : '?'}</div>
        <div className="mono" style={{ fontSize: size*0.10, color:accent, letterSpacing:'0.1em' }}>VERIFIED</div>
      </div>
    </div>
  );
}

// Field row inside envelope
function EField({ label, value, mono = true, copy = false, color, style }) {
  return (
    <div style={{ display:'flex', gap:14, alignItems:'baseline', padding:'4px 0', ...style }}>
      <div className="mono" style={{
        fontSize:9.5, color:'#4f5b6e', letterSpacing:'0.12em', textTransform:'uppercase',
        width:96, flexShrink:0,
      }}>{label}</div>
      <div className={mono?'mono':''} style={{
        fontSize: mono ? 11.5 : 12, color: color || '#cdd1da',
        fontWeight: 500, letterSpacing:'-0.01em',
        flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        display:'flex', alignItems:'center', gap:8,
      }}>
        <span style={{ overflow:'hidden', textOverflow:'ellipsis' }}>{value}</span>
        {copy && <button style={{
          background:'transparent', border:0, color:'#7c8597', cursor:'pointer', padding:0, display:'inline-flex',
        }}><Icon.copy/></button>}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Main ReceiptEnvelope component
function ReceiptEnvelope({
  variant = 'envelope', // envelope | chip | rail
  request,              // { id, time, model, key, tokens_in, tokens_out, cost_cuc, status }
  receipt,              // { operator, attestation_quote, useful_nonce, response_hash, signature, serial, kernel }
  verdict,              // 'clean' | 'sampled' | 'mismatch'
  evidenceId,           // when mismatch
  style,
}) {
  if (variant === 'chip') return <ReceiptChip request={request} receipt={receipt} verdict={verdict}/>;
  if (variant === 'rail') return <ReceiptRail request={request} receipt={receipt} verdict={verdict} evidenceId={evidenceId}/>;
  return <ReceiptStampedEnvelope request={request} receipt={receipt} verdict={verdict} evidenceId={evidenceId} style={style}/>;
}

// — VARIANT 1: stamped envelope (default)
function ReceiptStampedEnvelope({ request, receipt, verdict, evidenceId, style }) {
  const verdictMap = {
    clean: { label:'CLEAN', tone:'success', sub:'majority quorum · full replay', accent: '#34d399' },
    sampled: { label:'SAMPLED · CLEAN', tone:'success', sub:'validator sample matched', accent: '#34d399' },
    mismatch: { label:'MISMATCH', tone:'danger', sub:'evidence escalated', accent: '#ef4444' },
  }[verdict];

  return (
    <div style={{ ...style }}>
      {/* The envelope itself */}
      <div style={{
        background: `linear-gradient(180deg, #0f1218 0%, #11141a 100%)`,
        border:`1px solid ${C.crust[800]}`,
        borderRadius:12, overflow:'hidden',
        boxShadow:'0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 60px rgba(0,0,0,0.4)',
        position:'relative',
      }}>
        {/* postage stripe along top */}
        <div style={{
          height:6, background: `repeating-linear-gradient(135deg, ${C.magma[600]} 0 8px, ${C.crust[900]} 8px 16px)`,
          opacity:0.5,
        }}/>

        {/* Header band — serial, timestamp, verdict stamp */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'14px 22px 12px', borderBottom:`1px dashed ${C.crust[800]}`,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <OrogenMark size={18} color={C.crust[200]}/>
            <div>
              <div className="mono" style={{ fontSize:9.5, color:C.crust[500], letterSpacing:'0.16em', textTransform:'uppercase' }}>Signed Receipt</div>
              <div className="mono" style={{ fontSize:11, color:C.crust[200], letterSpacing:'-0.01em' }}>{receipt.serial}</div>
            </div>
          </div>
          {/* verdict stamp */}
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'4px 10px',
            border:`1px solid ${verdictMap.accent}55`,
            borderRadius:4, background:`${verdictMap.accent}10`,
            transform:'rotate(-1.5deg)',
          }}>
            <StatusDot tone={verdictMap.tone === 'danger' ? 'danger' : 'success'} size={6}/>
            <div className="mono" style={{ fontSize:10, color:verdictMap.accent, letterSpacing:'0.18em', fontWeight:600 }}>{verdictMap.label}</div>
          </div>
        </div>

        {/* Main body — two columns */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 96px', gap:0 }}>
          <div style={{ padding:'18px 22px 16px' }}>
            <EField label="Request" value={request.id} copy/>
            <EField label="Issued" value={request.time}/>
            <EField label="Model" value={request.model}/>
            <EField label="Operator" value={receipt.operator} copy/>
            <EField label="Kernel" value={receipt.kernel}/>
            <EField label="Useful nonce" value={receipt.useful_nonce}/>
            <EField label="Response hash" value={receipt.response_hash} copy/>
          </div>

          <div style={{
            padding:'18px 12px 16px 0',
            borderLeft:`1px dashed ${C.crust[800]}`,
            display:'flex', flexDirection:'column', alignItems:'center', gap:14,
          }}>
            <AttestationSeal ok={verdict !== 'mismatch'} model={request.model.includes('70')?'H200':'H100'} size={78}/>
            <div className="mono" style={{ fontSize:9, color:C.crust[500], letterSpacing:'0.1em', textAlign:'center', writingMode:'horizontal-tb' }}>
              SGX·DCAP<br/>quote ✓
            </div>
          </div>
        </div>

        {/* Signature band */}
        <div style={{
          padding:'14px 22px 18px', borderTop:`1px dashed ${C.crust[800]}`,
          display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:18,
        }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="mono" style={{ fontSize:9.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:6 }}>sr25519 signature</div>
            <SignatureFingerprint seed={receipt.signature} width={200} height={48}/>
          </div>
          <div style={{ textAlign:'right' }}>
            <div className="mono" style={{ fontSize:9.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:6 }}>verified by</div>
            <div style={{ display:'flex', flexDirection:'column', gap:2, alignItems:'flex-end' }}>
              <div className="mono" style={{ fontSize:11, color:C.crystal[400] }}>operator ✓</div>
              <div className="mono" style={{ fontSize:11, color:verdict==='mismatch'?C.ruby[400]:C.crystal[400] }}>chain anchor ✓</div>
              <div className="mono" style={{ fontSize:11, color:verdict==='mismatch'?C.ruby[400]:C.crystal[400] }}>{verdict==='mismatch'?'replay ✗':'replay ✓'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence rail — only when mismatch. Lives BELOW the envelope so the
          envelope itself stays calm. */}
      {verdict === 'mismatch' && (
        <div style={{
          marginTop:14, background:'rgba(239,68,68,0.04)', border:`1px solid rgba(239,68,68,0.2)`,
          borderRadius:10, overflow:'hidden',
        }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(239,68,68,0.15)', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ color:C.ruby[400], display:'inline-flex' }}><Icon.warn/></div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12.5, fontWeight:500, color:C.crust[100] }}>Replay disagreement — escalated to slashing evidence</div>
              <div className="mono" style={{ fontSize:10.5, color:C.crust[400], marginTop:2 }}>This call is excluded from your spend. Your billing is unaffected.</div>
            </div>
            <Btn kind="secondary" size="sm" iconRight={<Icon.ext/>}>Open evidence</Btn>
          </div>
          <div style={{ padding:'12px 16px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
            <div>
              <div className="mono" style={{ fontSize:9.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>Evidence ID</div>
              <Mono size={11.5} color={C.crust[100]}>{evidenceId}</Mono>
            </div>
            <div>
              <div className="mono" style={{ fontSize:9.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>Disagreement</div>
              <Mono size={11.5} color={C.ruby[400]}>tok[14..18] divergent</Mono>
            </div>
            <div>
              <div className="mono" style={{ fontSize:9.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>Witness</div>
              <Mono size={11.5} color={C.crust[100]}>3 of 4 validators</Mono>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// — VARIANT 2: minimal chip
function ReceiptChip({ request, receipt, verdict }) {
  const ok = verdict !== 'mismatch';
  return (
    <Card padding={18}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <StatusDot tone={ok?'success':'danger'} size={9}/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13.5, fontWeight:600, color:C.crust[100] }}>{ok ? 'Verified receipt' : 'Replay mismatch'}</div>
          <div className="mono" style={{ fontSize:11, color:C.crust[400], marginTop:2 }}>{receipt.serial} · {request.time}</div>
        </div>
        <Btn kind="secondary" size="sm">Inspect</Btn>
      </div>
    </Card>
  );
}

// — VARIANT 3: technical rail (raw signed envelope JSON)
function ReceiptRail({ request, receipt, verdict, evidenceId }) {
  return (
    <Card padding={18}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
        <div>
          <div className="mono" style={{ fontSize:10, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase' }}>Signed envelope</div>
          <div style={{ fontSize:13.5, fontWeight:600, color:C.crust[100] }}>{receipt.serial}</div>
        </div>
        <Badge tone={verdict==='mismatch'?'danger':'success'} dot>{verdict.toUpperCase()}</Badge>
      </div>
      <Code copyable={false} style={{ marginTop:6 }}>{`{
  "operator":  "${receipt.operator}",
  "useful_nonce": "${receipt.useful_nonce}",
  "response_hash": "${receipt.response_hash}",
  "kernel":  "${receipt.kernel}",
  "signature":   "${receipt.signature}",
  "attestation": "TEE.DCAP.${request.model.includes('70')?'H200':'H100'}.OK",
  "verdict": "${verdict.toUpperCase()}"${evidenceId?',\n  "evidence":   "'+evidenceId+'"':''}
}`}</Code>
    </Card>
  );
}

Object.assign(window, { ReceiptEnvelope, SignatureFingerprint, AttestationSeal });
})();
