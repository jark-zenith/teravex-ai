import { FormEvent, useEffect, useRef, useState } from 'react';
import { Activity, AudioLines, Cpu, Menu, Mic, MicOff, Radio, Send, ShieldCheck, Sparkles, Volume2, Wifi, X } from 'lucide-react';
import OrbScene from './OrbScene';

type CoreState = 'idle' | 'listening' | 'processing' | 'speaking';
type SpeechRecognitionLike = { lang: string; interimResults: boolean; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null; start: () => void; stop: () => void };
type SpeechWindow = Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };

const stateCopy: Record<CoreState, string> = { idle: 'AWAITING INPUT', listening: 'LISTENING', processing: 'PROCESSING', speaking: 'RESPONDING' };

export default function App() {
  const [state, setState] = useState<CoreState>('idle');
  const [command, setCommand] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [notice, setNotice] = useState('Core systems initialized. AI gateway connection is pending.');
  const [menuOpen, setMenuOpen] = useState(false);
  const recognition = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => () => recognition.current?.stop(), []);

  const runDemoCommand = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setLastCommand(clean);
    setCommand('');
    setState('processing');
    setNotice('Command received by the interface. The live AI gateway has not been connected yet.');
    window.setTimeout(() => setState('speaking'), 1100);
    window.setTimeout(() => setState('idle'), 2900);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); runDemoCommand(command); };

  const toggleVoice = () => {
    if (state === 'listening') { recognition.current?.stop(); setState('idle'); return; }
    const SpeechAPI = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
    if (!SpeechAPI) { setNotice('Voice input is not supported in this browser. Try a Chromium browser with microphone permission.'); return; }
    const instance = new SpeechAPI();
    recognition.current = instance;
    instance.lang = 'en-KE';
    instance.interimResults = false;
    instance.onresult = (event) => { const text = event.results[0]?.[0]?.transcript ?? ''; setState('processing'); runDemoCommand(text); };
    instance.onerror = () => { setState('idle'); setNotice('Microphone input failed. Check browser microphone permissions.'); };
    instance.onend = () => setState((current) => current === 'listening' ? 'idle' : current);
    setState('listening');
    setNotice('Microphone active. Speak a command.');
    instance.start();
  };

  return (
    <main className="shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#home" aria-label="TERAVEX AI home"><span className="brand-mark">T</span><span>TERAVEX<span className="brand-light"> / AI</span><small>INTELLIGENCE SYSTEMS</small></span></a>
        <div className="top-center"><span className="live-dot" /> LOCAL INTERFACE <span className="top-divider">/</span> PROTOTYPE 0.1</div>
        <div className="top-actions"><span className="secure-label"><ShieldCheck size={14} /> PRIVATE SESSION</span><button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button></div>
      </header>

      {menuOpen && <nav className="mobile-menu"><a href="#core" onClick={() => setMenuOpen(false)}>Intelligence core</a><a href="#systems" onClick={() => setMenuOpen(false)}>System status</a><a href="#command" onClick={() => setMenuOpen(false)}>Command input</a></nav>}

      <section className="workspace" id="home">
        <aside className="side-column left-column" id="systems">
          <div className="section-kicker">01 / SYSTEM OVERVIEW</div>
          <div className="metric-card"><div className="metric-heading"><Cpu size={15} /> CORE PROCESSOR</div><strong>STANDBY</strong><div className="meter"><i style={{ width: state === 'processing' ? '76%' : '18%' }} /></div><small>INTERFACE ENGINE ACTIVE</small></div>
          <div className="metric-card"><div className="metric-heading"><Radio size={15} /> NEURAL LINK</div><strong className="muted-value">NOT CONNECTED</strong><small>AI GATEWAY / PENDING</small></div>
          <div className="metric-card"><div className="metric-heading"><Wifi size={15} /> NETWORK</div><strong>LOCAL</strong><small>NO REMOTE REQUESTS</small></div>
          <div className="side-note"><span className="note-line" /> <p>“Intelligence is not a screen. It is a system that responds.”</p></div>
        </aside>

        <section className="core-stage" id="core">
          <div className="stage-topline"><span>TERAVEX INTELLIGENCE CORE</span><span>TK-01 / {new Date().toISOString().slice(0, 10).replaceAll('-', '.')}</span></div>
          <div className={`orb-wrap state-${state}`}><div className="orb-halo" /><div className="orb-grid" /><OrbScene state={state} /><div className="orb-crosshair crosshair-a" /><div className="orb-crosshair crosshair-b" /></div>
          <div className="core-label"><span className="core-pulse" />{stateCopy[state]}</div>
          <h1>How may I <em>assist?</em></h1>
          <p className="core-subtitle">An adaptive intelligence environment, built to listen, reason and act.</p>
          <div className="capability-row"><span><Activity size={13} /> REACTIVE CORE</span><span><AudioLines size={13} /> VOICE READY</span><span><Sparkles size={13} /> AI GATEWAY PENDING</span></div>
        </section>

        <aside className="side-column right-column">
          <div className="section-kicker">02 / LIVE DIAGNOSTICS</div>
          <div className="diagnostic-row"><span>VISUAL ENGINE</span><b className="status-ok">ONLINE</b></div>
          <div className="diagnostic-row"><span>CORE STATE</span><b>{state.toUpperCase()}</b></div>
          <div className="diagnostic-row"><span>VOICE INPUT</span><b>{state === 'listening' ? 'ACTIVE' : 'READY'}</b></div>
          <div className="diagnostic-row"><span>MODEL ROUTING</span><b className="status-pending">PENDING</b></div>
          <div className="waveform" aria-label="Decorative audio waveform">{Array.from({ length: 34 }).map((_, i) => <i key={i} style={{ height: `${10 + ((i * 17) % 29)}px`, animationDelay: `${i * -0.07}s` }} />)}</div>
          <div className="activity-box"><div className="activity-title"><span>ACTIVITY LOG</span><span>LIVE</span></div><p><i /> {notice}</p>{lastCommand && <p className="last-command">LAST INPUT: “{lastCommand}”</p>}</div>
        </aside>
      </section>

      <section className="command-dock" id="command">
        <div className="dock-label"><span className="dock-index">03</span><span>COMMAND INTERFACE</span></div>
        <form className="command-form" onSubmit={submit}><button type="button" className={`mic-button ${state === 'listening' ? 'mic-active' : ''}`} onClick={toggleVoice} aria-label={state === 'listening' ? 'Stop voice input' : 'Start voice input'}>{state === 'listening' ? <MicOff size={18} /> : <Mic size={18} />}</button><input value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Transmit a command to the intelligence core..." aria-label="Command input" /><button className="send-button" type="submit" disabled={!command.trim()}><span>TRANSMIT</span><Send size={15} /></button></form>
        <div className="dock-footer"><span><span className="live-dot" /> ENCRYPTED UI SESSION</span><span><Volume2 size={13} /> VOICE OUTPUT: NOT CONFIGURED</span><span>TERAVEX AI © 2026</span></div>
      </section>
      <footer className="page-footer"><span>DESIGNED FOR ADAPTIVE INTELLIGENCE</span><span>BUILDING THE NEXT INTERFACE LAYER</span></footer>
    </main>
  );
}
