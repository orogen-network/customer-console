// onboarding.jsx — interactive first-touch prototype
// Hybrid: stepper for sign-in + top-up, lands on dashboard with quest card.
// Static stages also exposed for design canvas frames.

(function(){

const W = 1440;
const H = 900;

// Steps:
// 0  Land on Sign in (equal tabs: wallet | email)
// 1a Wallet — challenge displayed, "approve in extension"
// 1b Email — magic link sent, OTP entry
// 2  Top-up ($20 via Stripe)
// 3  Payment success → key minted (secret shown once)
// 4  Test curl — copy / paste / live request streaming
// 5  Land in dashboard with quest card complete

function OnboardingPrototype({ accent = Accent.magma, startStep = 'signin' }) {
  const [step, setStep] = React.useState(startStep);
  const [authMethod, setAuthMethod] = React.useState('wallet'); // wallet | email
  const [email, setEmail] = React.useState('katya@orbitallabs.dev');
  const [otp, setOtp] = React.useState('');
  const [topupAmt, setTopupAmt] = React.useState(20);

  // shared chrome
  return (
    <div className="oro-app" style={{
      width: W, height: H, background:C.crust[950],
      display:'flex', flexDirection:'column', overflow:'hidden',
    }}>
      {/* Mini top chrome */}
      <div style={{
        height:52, borderBottom:`1px solid ${C.crust[800]}`,
        display:'flex', alignItems:'center', padding:'0 18px',
        background:'rgba(11,13,16,0.85)', backdropFilter:'blur(8px)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <OrogenMark size={22}/>
          <span style={{ fontSize:14, fontWeight:600, color:C.crust[100] }}>orogen</span>
          <span className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', marginLeft:6 }}>customer console</span>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
          <Btn kind="ghost" size="sm" iconRight={<Icon.ext/>}>docs</Btn>
          <Btn kind="ghost" size="sm" iconRight={<Icon.ext/>}>status</Btn>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, display:'flex', minHeight:0 }}>
        {/* Left rail — vertical stepper */}
        <div style={{ width:280, background:C.crust[900], borderRight:`1px solid ${C.crust[800]}`, padding:'32px 24px', flexShrink:0 }}>
          <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:18 }}>Get started · 5 min</div>

          <Stepper step={step} accent={accent}/>

          <div style={{ marginTop:36, padding:'14px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:8 }}>
            <Mono size={10.5} color={C.crust[500]} style={{ letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:6 }}>Network</Mono>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <StatusDot tone="success" size={6} pulse/>
              <Mono size={11} color={C.crust[200]}>mainnet · 42,118 ops</Mono>
            </div>
            <Mono size={10.5} color={C.crust[500]}>1 OROG = $10.62 · BME ep 1418</Mono>
          </div>
        </div>

        {/* Main stage */}
        <div style={{ flex:1, padding:'48px 40px', overflow:'auto', minWidth:0 }} className="scroll">
          {step === 'signin' && <SignInStage method={authMethod} setMethod={setAuthMethod} email={email} setEmail={setEmail} onNext={()=>setStep(authMethod==='wallet'?'challenge':'verify')} accent={accent}/>}
          {step === 'challenge' && <ChallengeStage onApprove={()=>setStep('topup')} onBack={()=>setStep('signin')} accent={accent}/>}
          {step === 'verify' && <VerifyEmailStage email={email} otp={otp} setOtp={setOtp} onNext={()=>setStep('topup')} onBack={()=>setStep('signin')} accent={accent}/>}
          {step === 'topup' && <TopupStage amount={topupAmt} setAmount={setTopupAmt} onNext={()=>setStep('keymint')} onSkip={()=>setStep('keymint')} accent={accent}/>}
          {step === 'keymint' && <KeyMintStage amount={topupAmt} onNext={()=>setStep('testcall')} accent={accent}/>}
          {step === 'testcall' && <TestCallStage onNext={()=>setStep('done')} accent={accent}/>}
          {step === 'done' && <CompleteStage onContinue={()=>setStep('signin')} accent={accent} amount={topupAmt}/>}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
const STEPS = [
  { id:'signin', label:'Sign in' },
  { id:'challenge', label:'Verify', alt:'verify' },
  { id:'topup', label:'Add credits' },
  { id:'keymint', label:'Mint key' },
  { id:'testcall', label:'First call' },
  { id:'done', label:'Done' },
];

function Stepper({ step, accent }) {
  const activeIdx = (() => {
    const map = { signin:0, challenge:1, verify:1, topup:2, keymint:3, testcall:4, done:5 };
    return map[step] ?? 0;
  })();

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      {STEPS.map((s,i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={s.id} style={{ display:'flex', alignItems:'flex-start', gap:12, position:'relative' }}>
            {/* connector */}
            {i < STEPS.length - 1 && (
              <div style={{
                position:'absolute', left:13, top:24, bottom:-6, width:1.5,
                background: done ? accent.hex : C.crust[700],
              }}/>
            )}
            <div style={{
              width:26, height:26, borderRadius:13, flexShrink:0,
              border: active ? `1.5px solid ${accent.hex}` : `1.5px solid ${done ? accent.hex : C.crust[700]}`,
              background: done ? accent.hex : (active ? C.crust[900] : 'transparent'),
              display:'flex', alignItems:'center', justifyContent:'center',
              color: done ? C.crust[1000] : active ? accent.hex : C.crust[500],
              fontSize:11, fontWeight:600, position:'relative', zIndex:1,
            }}>
              {done ? <Icon.check/> : (active ? <span style={{ width:8, height:8, borderRadius:4, background:accent.hex }} className="pulse"/> : i+1)}
            </div>
            <div style={{ padding:'4px 0 22px' }}>
              <div style={{ fontSize:13, fontWeight: active ? 500 : 400, color: done ? C.crust[200] : active ? C.crust[100] : C.crust[500] }}>{s.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// STAGE: SIGN IN (equal tabs: wallet | email)
function SignInStage({ method, setMethod, email, setEmail, onNext, accent }) {
  return (
    <StageShell
      eyebrow="STEP 1 OF 5"
      title="Sign in to orbital labs"
      sub="Pick either rail — both bind to a single organization at v0. Wallet recommended for ops; email for everyday access."
    >
      <div style={{ display:'flex', gap:14, marginBottom:18 }}>
        <AuthTab id="wallet" active={method==='wallet'} onClick={()=>setMethod('wallet')}
          icon={<Icon.shield/>} title="Wallet" sub="sr25519 challenge · browser extension" accent={accent}/>
        <AuthTab id="email" active={method==='email'} onClick={()=>setMethod('email')}
          icon={<Icon.mail/>} title="Email" sub="6-digit magic link" accent={accent}/>
      </div>

      {method === 'wallet' ? (
        <Card padding={24}>
          <div className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:14 }}>Detected wallets</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <WalletRow name="Talisman" sub="Polkadot, Kusama · sr25519" connected active accent={accent}/>
            <WalletRow name="SubWallet" sub="Polkadot · multi-account"/>
            <WalletRow name="Nova Wallet" sub="Mobile · use QR"/>
            <WalletRow name="Polkadot.js" sub="Browser · legacy"/>
          </div>
          <div style={{ marginTop:14 }}>
            <Btn kind="primary" accent={accent} size="lg" style={{ width:'100%', justifyContent:'center' }} iconRight={<Icon.chev/>} onClick={onNext}>
              Continue with Talisman
            </Btn>
            <div style={{ display:'flex', justifyContent:'center', marginTop:12 }}>
              <Mono size={10.5} color={C.crust[500]}>no wallet? <span style={{ color:accent.hex, cursor:'pointer' }}>install Talisman →</span></Mono>
            </div>
          </div>
        </Card>
      ) : (
        <Card padding={24}>
          <label className="mono" style={{ fontSize:10.5, color:C.crust[500], letterSpacing:'0.12em', textTransform:'uppercase' }}>Email address</label>
          <input value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="you@company.dev"
            style={{
              marginTop:8, padding:'12px 14px', width:'100%',
              background:C.crust[850], border:`1px solid ${C.crust[700]}`, borderRadius:8,
              fontSize:14, color:C.crust[100], fontFamily:'inherit', outline:'none',
            }}/>
          <Btn kind="primary" accent={accent} size="lg" style={{ width:'100%', justifyContent:'center', marginTop:14 }} icon={<Icon.mail/>} onClick={onNext}>
            Email me a sign-in link
          </Btn>
          <div style={{ display:'flex', alignItems:'center', gap:10, margin:'18px 0' }}>
            <div style={{ flex:1, height:1, background:C.crust[800] }}/>
            <Mono size={10.5} color={C.crust[500]}>or</Mono>
            <div style={{ flex:1, height:1, background:C.crust[800] }}/>
          </div>
          <Btn kind="secondary" size="md" style={{ width:'100%', justifyContent:'center' }} icon={<Icon.shield/>} onClick={()=>setMethod('wallet')}>
            Switch to wallet
          </Btn>
        </Card>
      )}

      <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:18 }}>
        <Icon.info color={C.crust[500]}/>
        <Mono size={11} color={C.crust[500]}>
          By signing in you agree to the <span style={{ color:C.crust[200], textDecoration:'underline' }}>customer terms</span> and <span style={{ color:C.crust[200], textDecoration:'underline' }}>privacy policy</span>. Wallet identities are bound 1:1 to org membership.
        </Mono>
      </div>
    </StageShell>
  );
}

function AuthTab({ id, active, onClick, icon, title, sub, accent }) {
  return (
    <div onClick={onClick} style={{
      flex:1, padding:'14px 16px', borderRadius:9, cursor:'pointer',
      background: active ? `rgba(245,158,11,0.04)` : C.crust[900],
      border:`1px solid ${active ? accent.hex : C.crust[800]}`,
      display:'flex', alignItems:'center', gap:12,
    }}>
      <div style={{
        width:30, height:30, borderRadius:7, background:C.crust[850], border:`1px solid ${C.crust[700]}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color: active ? accent.hex : C.crust[300],
      }}>{icon}</div>
      <div>
        <div style={{ fontSize:13.5, fontWeight:600, color: active?C.crust[100]:C.crust[200] }}>{title}</div>
        <Mono size={10.5} color={C.crust[500]}>{sub}</Mono>
      </div>
      {active && <div style={{ marginLeft:'auto', color:accent.hex }}><Icon.check/></div>}
    </div>
  );
}

function WalletRow({ name, sub, connected, active, accent }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12,
      padding:'10px 12px',
      background: active ? `rgba(245,158,11,0.04)` : C.crust[850],
      border:`1px solid ${active ? (accent?.hex || C.magma[500]) : C.crust[800]}`,
      borderRadius:7, cursor:'pointer',
    }}>
      <div style={{
        width:30, height:30, borderRadius:7,
        background:`linear-gradient(135deg, ${C.crust[700]} 0%, ${C.crust[850]} 100%)`,
        border:`1px solid ${C.crust[700]}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:13, fontWeight:600, color:C.crust[200],
      }}>{name[0]}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12.5, fontWeight:500, color:C.crust[100] }}>{name}</div>
        <Mono size={10.5} color={C.crust[500]}>{sub}</Mono>
      </div>
      {connected && <Badge tone="success" dot>detected</Badge>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// STAGE: WALLET CHALLENGE
function ChallengeStage({ onApprove, onBack, accent }) {
  return (
    <StageShell
      eyebrow="STEP 2 OF 5"
      title="Sign the challenge"
      sub="Your wallet extension will prompt to sign a one-time message proving control of the public key. Nothing is broadcast — the signature stays between you and gateway-router."
      onBack={onBack}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 220px', gap:20 }}>
        <Card padding={22}>
          <Mono size={10.5} color={C.crust[500]} style={{ letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:14 }}>Challenge</Mono>
          <div style={{ background:C.crust[1000], border:`1px solid ${C.crust[800]}`, borderRadius:8, padding:'14px 16px' }}>
            <Mono size={11.5} color={C.crust[200]} style={{ display:'block', lineHeight:1.65, wordBreak:'break-all' }}>
{`orogen.network/login
nonce: 0x4Af2 d1c8 b9e3 84A9
issued: 2026-05-20 09:39:42 UTC
expires: 2026-05-20 09:42:42 UTC
binds-to: org_38xqW7nM12`}
            </Mono>
          </div>

          <div style={{ marginTop:18, display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:7, background:C.crust[850], border:`1px solid ${C.crust[700]}`, display:'flex', alignItems:'center', justifyContent:'center', color:accent.hex }}>
              <Icon.shield/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:500, color:C.crust[100] }}>Awaiting signature</div>
              <Mono size={10.5} color={C.crust[500]}>Talisman prompt is open in a system popup</Mono>
            </div>
            <div className="pulse">
              <StatusDot tone="warn" size={9}/>
            </div>
          </div>

          <Btn kind="primary" size="lg" accent={accent} style={{ width:'100%', justifyContent:'center', marginTop:18 }} icon={<Icon.check/>} onClick={onApprove}>
            Approve in Talisman (simulated)
          </Btn>

          <div style={{ display:'flex', justifyContent:'center', marginTop:12 }}>
            <Mono size={10.5} color={C.crust[500]}>didn't see it? <span style={{ color:accent.hex, cursor:'pointer' }}>resend prompt</span></Mono>
          </div>
        </Card>

        <Card padding={20}>
          <Mono size={10.5} color={C.crust[500]} style={{ letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:14 }}>Your identity</Mono>
          <div style={{
            width:48, height:48, borderRadius:24,
            background:`linear-gradient(135deg, ${C.crust[700]} 0%, ${C.crust[800]} 100%)`,
            border:`1px solid ${C.crust[700]}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:C.crystal[400], marginBottom:12,
          }}><Icon.shield/></div>
          <div style={{ fontSize:13, fontWeight:500, color:C.crust[100], marginBottom:6 }}>Talisman primary</div>
          <Mono size={10.5} color={C.crust[300]} style={{ display:'block', lineHeight:1.5, wordBreak:'break-all' }}>
            5GrwvaEF…NoHGKutQY
          </Mono>
          <Divider style={{ margin:'14px 0' }}/>
          <Stat3 label="OROG balance" value="14,210.62"/>
          <Stat3 label="Stake" value="0 OROG"/>
          <Stat3 label="Era" value="ep-1418"/>
        </Card>
      </div>
    </StageShell>
  );
}

function Stat3({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0' }}>
      <Mono size={10.5} color={C.crust[500]}>{label}</Mono>
      <Mono size={11.5} color={C.crust[100]}>{value}</Mono>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// STAGE: EMAIL VERIFY
function VerifyEmailStage({ email, otp, setOtp, onNext, onBack, accent }) {
  // Auto-fill simulation: digits clickable
  const digits = otp.padEnd(6, ' ').split('');
  return (
    <StageShell
      eyebrow="STEP 2 OF 5"
      title="Check your email"
      sub={<>We sent a 6-digit code to <Mono size={12} color={C.crust[200]} style={{ marginLeft:4 }}>{email}</Mono>. The link expires in 10 minutes.</>}
      onBack={onBack}>
      <Card padding={28} style={{ maxWidth:520 }}>
        <Mono size={10.5} color={C.crust[500]} style={{ letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:12 }}>Verification code</Mono>
        <div style={{ display:'flex', gap:8 }}>
          {digits.map((d,i)=>(
            <div key={i} style={{
              flex:1, height:56, borderRadius:8,
              background: d.trim() ? `rgba(245,158,11,0.04)` : C.crust[850],
              border:`1px solid ${d.trim() ? accent.hex : C.crust[700]}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:24, fontFamily:'JetBrains Mono, monospace', fontWeight:500,
              color: d.trim() ? C.crust[100] : C.crust[600],
              letterSpacing:'-0.02em',
            }}>{d.trim() ? d : '·'}</div>
          ))}
        </div>

        {/* Faux numpad */}
        <div style={{ marginTop:18, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6 }}>
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k,i)=>{
            if (!k) return <div key={i}/>;
            return (
              <button key={i} onClick={()=> {
                if (k==='⌫') setOtp(otp.slice(0,-1));
                else if (otp.length<6) setOtp(otp+k);
              }} style={{
                padding:'12px', background:C.crust[850], border:`1px solid ${C.crust[800]}`,
                borderRadius:7, fontSize:14, fontFamily:'JetBrains Mono, monospace',
                color:C.crust[100], cursor:'pointer',
              }}>{k}</button>
            );
          })}
        </div>

        <Btn kind="primary" accent={accent} size="lg" style={{ width:'100%', justifyContent:'center', marginTop:18 }} disabled={otp.length<6} iconRight={<Icon.chev/>} onClick={onNext}>
          {otp.length<6 ? `Enter ${6-otp.length} more` : 'Verify'}
        </Btn>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:14 }}>
          <Mono size={11} color={C.crust[500]}>didn't get it? <span style={{ color:accent.hex, cursor:'pointer' }}>resend</span></Mono>
          <Mono size={11} color={C.crust[500]}>expires in 09:42</Mono>
        </div>
      </Card>
    </StageShell>
  );
}

// ──────────────────────────────────────────────────────────
// STAGE: TOP-UP
function TopupStage({ amount, setAmount, onNext, onSkip, accent }) {
  return (
    <StageShell
      eyebrow="STEP 3 OF 5"
      title="Drop in your first credits"
      sub="Twenty dollars is enough for ~50,000 calls against tier-A models. You can refill later through Card, Crypto, or by burning OROG."
    >
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>
        <Card padding={24}>
          <Mono size={10.5} color={C.crust[500]} style={{ letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:12 }}>Amount</Mono>
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {[20, 50, 200, 1000].map(a=>(
              <div key={a} onClick={()=>setAmount(a)} style={{
                flex:1, padding:'14px', textAlign:'center', cursor:'pointer',
                background: amount===a ? `rgba(245,158,11,0.04)` : C.crust[850],
                border:`1px solid ${amount===a ? accent.hex : C.crust[800]}`,
                borderRadius:7,
              }}>
                <div style={{ fontSize:16, fontWeight:600, color: amount===a?accent.hex:C.crust[100] }}>${a}</div>
                <Mono size={10.5} color={C.crust[500]} style={{ display:'block', marginTop:2 }}>{(a*100).toLocaleString()} CUC</Mono>
              </div>
            ))}
          </div>

          <Mono size={10.5} color={C.crust[500]} style={{ letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:12 }}>Rail</Mono>
          <div style={{ display:'flex', gap:8 }}>
            <RailMini icon={<Icon.wallet/>} title="Card" sub="Stripe · instant" active accent={accent}/>
            <RailMini icon={<Icon.link/>} title="Crypto" sub="+1.2% bonus" badge={<Badge tone="success">+1.2%</Badge>}/>
            <RailMini icon={<Icon.bolt color={accent.hex}/>} title="Burn OROG" sub="native rail"/>
          </div>

          <div style={{ marginTop:18, padding:'14px 16px', background:C.crust[850], border:`1px solid ${C.crust[800]}`, borderRadius:9 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:12.5, color:C.crust[400] }}>Pay</span>
              <span className="display" style={{ fontSize:22, color:C.crust[100] }}>${amount}.00</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:12.5, color:C.crust[400] }}>Receive</span>
              <span className="display" style={{ fontSize:22, color:C.crystal[400] }}>{(amount*100).toLocaleString()} CUC</span>
            </div>
            <Divider/>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, alignItems:'center' }}>
              <Mono size={10.5} color={C.crust[500]}>rate (live)</Mono>
              <Mono size={10.5} color={C.crust[300]}>$1.00 → 100 CUC</Mono>
            </div>
          </div>

          <Btn kind="primary" accent={accent} size="lg" style={{ width:'100%', justifyContent:'center', marginTop:16 }} iconRight={<Icon.chev/>} onClick={onNext}>
            Pay ${amount} → unlock console
          </Btn>
          <Mono size={10.5} color={C.crust[500]} style={{ textAlign:'center', marginTop:10, display:'block' }}>
            you'll be redirected to Stripe in a new window · funds settle in &lt; 5 sec
          </Mono>
        </Card>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Card padding={20} style={{
            background:`linear-gradient(160deg, ${C.crust[900]} 0%, rgba(52,211,153,0.04) 100%)`,
            borderColor:'rgba(52,211,153,0.18)',
          }}>
            <Mono size={10.5} color={C.crystal[400]} style={{ letterSpacing:'0.12em', textTransform:'uppercase' }}>What ${amount} gets you</Mono>
            <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:10 }}>
              <CalcRow model="llama-3.1-70b" calls={amount===20?51234:Math.floor(amount*2561)} note="@ 1.4k in / 600 out · avg"/>
              <CalcRow model="llama-3.1-8b" calls={amount===20?420000:amount*21000} note="@ 1.4k in / 600 out · avg"/>
              <CalcRow model="mistral-large" calls={amount===20?22018:amount*1100} note="@ 1.4k in / 600 out · avg"/>
            </div>
          </Card>
          <Notice tone="info" icon={<Icon.info/>}
            title="No subscription. No floor."
            body="Pay only for what you call. Unused credits never expire; refunds available for 14 days."/>
        </div>
      </div>

      <div style={{ marginTop:18, display:'flex', justifyContent:'center' }}>
        <Mono size={11} color={C.crust[500]} style={{ cursor:'pointer' }} onClick={onSkip}>
          Skip — explore on $0 sandbox (rate-limited, no receipt verification)
        </Mono>
      </div>
    </StageShell>
  );
}

function RailMini({ icon, title, sub, active, badge, accent }) {
  return (
    <div style={{
      flex:1, padding:'10px 12px', borderRadius:7, cursor:'pointer',
      background: active ? `rgba(245,158,11,0.04)` : C.crust[850],
      border:`1px solid ${active ? (accent?.hex || C.magma[500]) : C.crust[800]}`,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
        <span style={{ color: active ? (accent?.hex || C.magma[500]) : C.crust[400] }}>{icon}</span>
        <span style={{ fontSize:12.5, fontWeight:500, color:C.crust[100] }}>{title}</span>
        {badge}
      </div>
      <Mono size={10} color={C.crust[500]}>{sub}</Mono>
    </div>
  );
}

function CalcRow({ model, calls, note }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
      <div>
        <Mono size={11.5} color={C.crust[100]}>{model}</Mono>
        <Mono size={10} color={C.crust[500]} style={{ display:'block', marginTop:2 }}>{note}</Mono>
      </div>
      <Mono size={13} color={C.crystal[400]}>≈ {calls.toLocaleString()} calls</Mono>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// STAGE: KEY MINT
function KeyMintStage({ amount, onNext, accent }) {
  const [revealed, setRevealed] = React.useState(false);
  const SECRET = 'orog_live_4Xq2WmKxR8tBV9qP3sDf7nLb2cYg8jH1zQpWm93Z';
  return (
    <StageShell
      eyebrow="STEP 4 OF 5"
      title={<span><span style={{ color: C.crystal[400] }}>✓</span> Paid · ${amount} credited</span>}
      sub="Your starter key is minted. The secret below is shown ONCE — copy it now. We've stored a hash so we can verify but never display it again."
    >
      <Card padding={28}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <Mono size={10.5} color={C.crust[500]} style={{ letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:6 }}>Starter key · production</Mono>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <StatusDot tone="success" size={7}/>
              <Mono size={11.5} color={C.crust[100]}>id key_kx8q19m</Mono>
              <Mono size={11.5} color={C.crust[400]}>· tier-A · cap $200/mo</Mono>
            </div>
          </div>
          <Badge tone="warn" dot>shown once</Badge>
        </div>

        <div style={{
          padding:'16px 18px', borderRadius:10,
          background:C.crust[1000], border:`1px solid ${C.crust[700]}`,
          display:'flex', alignItems:'center', gap:12, position:'relative', overflow:'hidden',
        }}>
          <Icon.bolt color={accent.hex}/>
          <Mono size={13} color={revealed?C.crust[100]:C.crust[500]} style={{
            flex:1, letterSpacing: revealed?'-0.01em':'0.05em',
            filter: revealed?'none':'blur(5px)', transition:'filter .2s',
          }}>{revealed ? SECRET : SECRET}</Mono>
          {!revealed ? (
            <Btn kind="primary" size="sm" accent={accent} onClick={()=>setRevealed(true)}>Reveal once</Btn>
          ) : (
            <>
              <Btn kind="secondary" size="sm" icon={<Icon.copy/>}>Copy</Btn>
              <Btn kind="ghost" size="sm" onClick={()=>setRevealed(false)}>Hide</Btn>
            </>
          )}
          {revealed && (
            <div style={{
              position:'absolute', top:0, left:0, right:0, height:2,
              background:`linear-gradient(90deg, transparent, ${accent.hex}, transparent)`,
              animation:'oroShimmer 1.6s ease-out',
            }}/>
          )}
        </div>

        <Notice tone="warn" icon={<Icon.warn/>}
          title="You won't see this secret again."
          body="Paste it into your environment as OROGEN_API_KEY. If you lose it, rotate the key from the console — your apps keep working."
          style={{ marginTop:14 }}/>

        <div style={{ marginTop:18, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', gap:8 }}>
            <Btn kind="secondary" size="md" icon={<Icon.download/>}>Download as .env</Btn>
            <Btn kind="secondary" size="md" icon={<Icon.copy/>}>Copy bash export</Btn>
          </div>
          <Btn kind="primary" accent={accent} size="md" disabled={!revealed} iconRight={<Icon.chev/>} onClick={onNext}>
            {revealed ? 'I saved it — continue' : 'Reveal to continue'}
          </Btn>
        </div>
      </Card>
    </StageShell>
  );
}

// ──────────────────────────────────────────────────────────
// STAGE: TEST CALL — live curl with simulated streaming response
function TestCallStage({ onNext, accent }) {
  const [phase, setPhase] = React.useState('ready'); // ready | running | streaming | done
  const [streamed, setStreamed] = React.useState('');
  const FULL_RESPONSE = `Routing entropy collapses sharply between 8 and 16 experts — agreement with the original work holds, but at 32 experts the per-token cost ceases to amortize over latency. Three findings stand out.\n\n1.  Sparse routing reduces effective compute by 4.2× at the cost of a ~12% perplexity penalty on out-of-distribution prompts.\n2.  Load-balancing collapse, when it occurs, ...`;

  React.useEffect(() => {
    if (phase !== 'streaming') return;
    let i = 0;
    const tick = () => {
      i += Math.floor(Math.random() * 4) + 2;
      if (i >= FULL_RESPONSE.length) {
        setStreamed(FULL_RESPONSE);
        setPhase('done');
      } else {
        setStreamed(FULL_RESPONSE.slice(0, i));
        setTimeout(tick, 24);
      }
    };
    setTimeout(tick, 200);
  }, [phase]);

  const run = () => {
    setStreamed('');
    setPhase('running');
    setTimeout(()=>setPhase('streaming'), 600);
  };

  return (
    <StageShell
      eyebrow="STEP 5 OF 5"
      title="Run your first verified call"
      sub="Copy the curl, run it locally — or hit Send below to fire one through gateway-router. You'll see it appear in the call log within a second, alongside its signed receipt."
    >
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card padding={0}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:`1px solid ${C.crust[850]}` }}>
            <Mono size={10.5} color={C.crust[500]} style={{ letterSpacing:'0.12em', textTransform:'uppercase' }}>Request · curl</Mono>
            <Btn kind="ghost" size="sm" icon={<Icon.copy/>}>copy</Btn>
          </div>
          <pre className="mono" style={{
            margin:0, padding:'14px 16px', fontSize:11.5, lineHeight:1.65, color:C.crust[200],
            whiteSpace:'pre-wrap', wordBreak:'break-all',
          }}>{`curl https://gateway.orogen.network/v1/chat/completions \\
  -H "Authorization: Bearer $OROGEN_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.1-70b-instruct",
    "messages": [
      {"role": "system", "content": "Be concise."},
      {"role": "user",   "content": "Summarize MoE scaling laws."}
    ]
  }'`}</pre>
          <div style={{ padding:'12px 16px', borderTop:`1px solid ${C.crust[850]}`, display:'flex', alignItems:'center', gap:10 }}>
            <Btn kind="primary" accent={accent} size="md" icon={phase==='running'?undefined:<Icon.bolt/>} onClick={run}>
              {phase==='running' ? 'Sending…' : phase==='streaming' ? 'Streaming…' : phase==='done' ? 'Send again' : 'Send through gateway'}
            </Btn>
            <Mono size={10.5} color={C.crust[500]}>gateway-router · us-east</Mono>
            {phase!=='ready' && <div style={{ marginLeft:'auto' }}><StatusDot tone={phase==='done'?'success':'warn'} size={7} pulse={phase!=='done'}/></div>}
          </div>
        </Card>

        <Card padding={0}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:`1px solid ${C.crust[850]}` }}>
            <Mono size={10.5} color={C.crust[500]} style={{ letterSpacing:'0.12em', textTransform:'uppercase' }}>Response</Mono>
            {phase==='done' && (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Badge tone="success" dot>verified</Badge>
                <Mono size={10.5} color={C.crust[400]}>820 ms · 612 tok</Mono>
              </div>
            )}
          </div>
          <div style={{ padding:'14px 16px', minHeight:280, fontSize:12.5, color:C.crust[200], lineHeight:1.65, whiteSpace:'pre-wrap', position:'relative' }}>
            {phase === 'ready' && <Mono size={11} color={C.crust[500]}>response will appear here…</Mono>}
            {phase === 'running' && <Mono size={11} color={C.crust[300]}>← resolving operator · attesting H100 · SGX·DCAP …</Mono>}
            {(phase === 'streaming' || phase === 'done') && (
              <>
                {streamed}{phase==='streaming' && <span style={{ display:'inline-block', width:7, height:14, background:accent.hex, marginLeft:2, verticalAlign:'middle' }} className="pulse"/>}
              </>
            )}
          </div>
          {phase === 'done' && (
            <div style={{ padding:'12px 16px', borderTop:`1px solid ${C.crust[850]}`, display:'flex', alignItems:'center', gap:10 }}>
              <HashChip value="req_8x3qZ4MnL2" prefix="req" lead={10} tail={4}/>
              <Mono size={10.5} color={C.crust[500]}>signed by ORN-4af2</Mono>
              <Btn kind="ghost" size="sm" iconRight={<Icon.chev/>} style={{ marginLeft:'auto' }} onClick={onNext}>Inspect receipt</Btn>
            </div>
          )}
        </Card>
      </div>

      <div style={{ marginTop:18, display:'flex', justifyContent:'flex-end' }}>
        <Btn kind="primary" accent={accent} size="lg" disabled={phase!=='done'} iconRight={<Icon.chev/>} onClick={onNext}>
          {phase==='done' ? 'Land in dashboard' : 'Run a call to continue'}
        </Btn>
      </div>
    </StageShell>
  );
}

// ──────────────────────────────────────────────────────────
// STAGE: COMPLETE — quick recap
function CompleteStage({ onContinue, accent, amount }) {
  return (
    <div style={{ maxWidth:680, margin:'40px auto 0', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
      <div style={{
        width:104, height:104, borderRadius:52,
        border:`1px solid rgba(52,211,153,0.3)`,
        background:`radial-gradient(circle at center, rgba(52,211,153,0.1), transparent 70%)`,
        display:'flex', alignItems:'center', justifyContent:'center', marginBottom:22,
      }}>
        <div style={{ width:68, height:68, borderRadius:34, background:'rgba(52,211,153,0.08)', border:`1.5px solid ${C.crystal[500]}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="m5 12 5 5 9-12" stroke={C.crystal[500]} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <Mono size={11} color={C.crystal[400]} style={{ letterSpacing:'0.18em', marginBottom:14 }}>YOU'RE LIVE</Mono>
      <h1 className="display" style={{ margin:0, fontSize:42, color:C.crust[100], letterSpacing:'-0.025em' }}>
        Verified inference, ready to ship.
      </h1>
      <div style={{ marginTop:14, fontSize:14, color:C.crust[400], lineHeight:1.55, maxWidth:540 }}>
        ${amount} credited · starter key minted · first call signed by <Mono size={12} color={C.crust[200]}>ORN-4af2</Mono>.
      </div>
      <div style={{ marginTop:28, display:'flex', gap:10 }}>
        <Btn kind="primary" accent={accent} size="lg" iconRight={<Icon.chev/>} onClick={onContinue}>Open dashboard</Btn>
        <Btn kind="secondary" size="lg" iconRight={<Icon.ext/>}>Read the SDK quickstart</Btn>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// StageShell — header + back button
function StageShell({ eyebrow, title, sub, onBack, children }) {
  return (
    <div style={{ maxWidth:920 }}>
      {onBack && (
        <button onClick={onBack} style={{
          display:'inline-flex', alignItems:'center', gap:6, padding:'4px 8px 4px 6px',
          background:'transparent', border:`1px solid ${C.crust[800]}`, borderRadius:6,
          color:C.crust[300], fontSize:11.5, cursor:'pointer', marginBottom:18,
        }}>
          <span style={{ transform:'scaleX(-1)', display:'inline-flex' }}><Icon.chev/></span>
          Back
        </button>
      )}
      <div className="mono" style={{ fontSize:10.5, color:Accent.magma.hex, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:12 }}>{eyebrow}</div>
      <h1 className="display" style={{ margin:0, fontSize:34, color:C.crust[100], letterSpacing:'-0.025em', lineHeight:1.1 }}>{title}</h1>
      {sub && <div style={{ marginTop:14, fontSize:14, color:C.crust[400], lineHeight:1.55, maxWidth:640 }}>{sub}</div>}
      <div style={{ marginTop:28 }}>{children}</div>
    </div>
  );
}

Object.assign(window, { OnboardingPrototype });
})();
