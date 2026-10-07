import { type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter, Link } from 'wouter';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, AudioLines, BadgeCheck, Camera, Check, ChevronDown,
  CircleAlert, CloudRain, Flame, Info, LocateFixed, MapPin, Menu, Mic, Paperclip,
  Radio, ShieldAlert, ShieldCheck, Signal, Siren, Sparkles, Upload, Waves, Wind, X,
} from 'lucide-react';

const queryClient = new QueryClient();
const DEMO_KEY = 'resqai-demo-reports';

type Incident = {
  id: string; title: string; eventType: string; severity: string; confidenceLevel: string;
  confidenceScore: number; locationName: string; updatedAt: string; summary: string;
  hazards: string[]; actionItems: string[]; observations: { category: string; statement: string }[];
  sourceCount: number;
};

const incidents: Incident[] = [
  {
    id: 'incident-01', title: 'River level rising near the east footpath', eventType: 'Flooding',
    severity: 'Elevated', confidenceLevel: 'Moderate confidence', confidenceScore: 72,
    locationName: 'Riverside Walk · illustrative area', updatedAt: 'Scenario update · 18 min',
    summary: 'Several example reports describe water covering part of the lower riverside path after sustained rain. This scenario is synthetic and does not reflect live conditions.',
    hazards: ['Water over low path', 'Slippery surfaces', 'Reduced visibility'],
    actionItems: ['Avoid the lower riverside path in this scenario.', 'Choose a higher, well-lit route.', 'Do not walk or drive through floodwater.'],
    observations: [
      { category: 'Citizen report', statement: 'Water is reaching the first bench along the lower path.' },
      { category: 'Weather context', statement: 'Illustrative rainfall has continued through the afternoon.' },
      { category: 'Unverified account', statement: 'A second report mentions a blocked drain near the footbridge.' },
    ], sourceCount: 4,
  },
  {
    id: 'incident-02', title: 'Smoke reported near a warehouse block', eventType: 'Smoke',
    severity: 'Use caution', confidenceLevel: 'Low confidence', confidenceScore: 41,
    locationName: 'Foundry Quarter · illustrative area', updatedAt: 'Scenario update · 36 min',
    summary: 'A small number of unverified accounts mention visible smoke in this fictional district. Cause, extent, and current conditions are unknown.',
    hazards: ['Possible airborne smoke', 'Cause not established'],
    actionItems: ['If smoke is present where you are, move away from it.', 'Stay indoors and close windows if outside air is affected.', 'For immediate danger, contact local emergency services.'],
    observations: [
      { category: 'Citizen report', statement: 'One account describes a grey plume beyond the loading area.' },
      { category: 'Unverified account', statement: 'A separate post mentions an unusual smell.' },
    ], sourceCount: 2,
  },
  {
    id: 'incident-03', title: 'Strong gusts reported across the ridge', eventType: 'High winds',
    severity: 'Monitor', confidenceLevel: 'Moderate confidence', confidenceScore: 64,
    locationName: 'North Ridge · illustrative area', updatedAt: 'Scenario update · 1 hr',
    summary: 'Synthetic reports describe loose branches and intermittent strong gusts on exposed streets. No verified damage information is included.',
    hazards: ['Falling branches', 'Loose outdoor objects'],
    actionItems: ['Keep clear of trees and temporary structures.', 'Secure loose items if it is safe to do so.', 'Use extra care on exposed routes.'],
    observations: [
      { category: 'Citizen report', statement: 'A resident noted a fallen branch beside the upper cycle route.' },
      { category: 'Weather context', statement: 'The scenario includes periodic gusts, not an official forecast.' },
    ], sourceCount: 3,
  },
];

function App() {
  const [lowBandwidth, setLowBandwidth] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('low-bandwidth', lowBandwidth);
  }, [lowBandwidth]);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <div className={`grain resq-shell ${lowBandwidth ? 'low-bandwidth' : ''}`}>
            <RoutedErrorBoundary>
              <Switch>
                <Route path="/" component={() => <Home lowBandwidth={lowBandwidth} setLowBandwidth={setLowBandwidth} />} />
                <Route path="/report" component={() => <ReportPage lowBandwidth={lowBandwidth} setLowBandwidth={setLowBandwidth} />} />
                <Route component={NotFound} />
              </Switch>
            </RoutedErrorBoundary>
            <DemoFooter />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Header({ lowBandwidth, setLowBandwidth }: { lowBandwidth: boolean; setLowBandwidth: (value: boolean) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  return (
    <header className="relative z-30 border-b border-[#d8d5c9] bg-[#f7f5ee]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1220px] items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" data-testid="link-home" className="flex items-center gap-3 text-[#173b3b] no-underline">
          <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#174c46] text-[#f7f5ee]"><Radio size={20} strokeWidth={1.8} /></span>
          <span className="leading-tight"><span className="block font-serif text-[19px] font-extrabold tracking-[-.05em]">ResQ<span className="text-[#df683e]">AI</span></span><span className="mono block pt-0.5 text-[9px] uppercase tracking-[.2em] text-[#61706a]">Community signal</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <Link href="/" data-testid="link-incidents" className={`text-[13px] font-semibold no-underline transition-colors hover:text-[#d35d38] ${location === '/' ? 'text-[#174c46]' : 'text-[#68716b]'}`}>Situation overview</Link>
          <Link href="/report" data-testid="link-report" className={`text-[13px] font-semibold no-underline transition-colors hover:text-[#d35d38] ${location === '/report' ? 'text-[#174c46]' : 'text-[#68716b]'}`}>Share an observation</Link>
          <div className="flex items-center gap-2 border-l border-[#d8d5c9] pl-5">
            <Signal size={15} className="text-[#66766f]" />
            <span className="text-[11px] font-semibold text-[#53615b]">Low bandwidth</span>
            <button type="button" role="switch" aria-checked={lowBandwidth} aria-label="Toggle low bandwidth mode" data-testid="toggle-low-bandwidth" onClick={() => setLowBandwidth(!lowBandwidth)} className={`relative h-[22px] w-[39px] rounded-full transition-colors ${lowBandwidth ? 'bg-[#174c46]' : 'bg-[#c6c8bd]'}`}><span className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${lowBandwidth ? 'translate-x-[20px]' : 'translate-x-[3px]'}`} /></button>
          </div>
        </nav>
        <button type="button" aria-label="Open navigation" data-testid="button-open-menu" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-[#234844] hover:bg-[#e8e7dd] md:hidden"><Menu size={21} /></button>
      </div>
      {menuOpen && <div className="absolute inset-x-0 top-full border-b border-[#d8d5c9] bg-[#f7f5ee] px-5 py-4 shadow-lg md:hidden">
        <div className="flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-[#174c46] no-underline">Situation overview</Link>
          <Link href="/report" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-[#174c46] no-underline">Share an observation</Link>
          <button type="button" onClick={() => setLowBandwidth(!lowBandwidth)} className="flex items-center gap-2 self-start text-sm text-[#53615b]"><Signal size={15} />Low bandwidth: {lowBandwidth ? 'On' : 'Off'}</button>
        </div>
      </div>}
    </header>
  );
}

function DemoFlag({ compact = false }: { compact?: boolean }) {
  return <div className={`flex items-center gap-2 text-[#7b441f] ${compact ? 'text-[10px]' : 'text-[11px]'}`}><span className="h-2 w-2 rounded-full bg-[#df683e]" /><span className="mono font-semibold uppercase tracking-[.12em]">Synthetic demo · not live</span></div>;
}

function Home({ lowBandwidth, setLowBandwidth }: { lowBandwidth: boolean; setLowBandwidth: (value: boolean) => void }) {
  const [expanded, setExpanded] = useState<string | null>(incidents[0].id);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantText, setAssistantText] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<{ start: () => void; stop: () => void; onresult: ((event: any) => void) | null; onend: (() => void) | null; onerror: (() => void) | null } | null>(null);
  const hasSpeechRecognition = typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const sendAssistant = (text: string) => {
    if (!text.trim()) return;
    setAssistantText(text);
    setAssistantReply('This is a ResQAI demo, not live guidance. The example reports are synthetic and may not reflect current conditions. If anyone is in immediate danger, contact local emergency services.');
    if (hasSpeechSynthesis) {
      const utterance = new SpeechSynthesisUtterance('This is a Res Q A I demo, not live guidance. The example reports are synthetic and may not reflect current conditions. If anyone is in immediate danger, contact local emergency services.');
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };
  const toggleListening = () => {
    if (!hasSpeechRecognition) return;
    if (listening) { recognitionRef.current?.stop(); return; }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      setAssistantText(transcript);
      sendAssistant(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  return <>
    <Header lowBandwidth={lowBandwidth} setLowBandwidth={setLowBandwidth} />
    <main className="mx-auto max-w-[1220px] px-5 pb-24 md:px-8">
      <section className="load-in relative mt-8 overflow-hidden rounded-[26px] bg-[#153f3c] text-[#f5f2e9] md:mt-11">
        <div className="decorative-art pointer-events-none absolute inset-y-0 right-0 w-[48%] opacity-80" aria-hidden="true">
          <svg viewBox="0 0 520 390" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            <path d="M80 390 157 330l-21-50 43-24-12-64 59-7 24-58 58 21 37-61 58 48 46-5 10 70 61 29-24 53 31 40-55 68Z" fill="#d6dfc5" fillOpacity=".07" stroke="#dce2d3" strokeOpacity=".18" />
            <path d="m42 359 84-72 42-87 68-29 55-98m-224 237 90-44 59-3 83-59 103 6m-244 149 85-59 31-87 69-42 52-75m-175 281 6-97 63-69 98-28 56-75" fill="none" stroke="#e9e7d8" strokeOpacity=".25" strokeWidth="1.2" />
            <path d="M20 130c105 35 131 4 221 32s148 2 265-41M15 199c75-7 149 48 246 17s165-16 255 20M34 290c112-36 172 35 256-2s144-47 215-20" fill="none" stroke="#e9e7d8" strokeOpacity=".12" />
            <circle cx="301" cy="161" r="8" fill="#e7774b" /><circle cx="301" cy="161" r="21" fill="none" stroke="#e7774b" strokeOpacity=".55" /><circle cx="301" cy="161" r="39" fill="none" stroke="#e7774b" strokeOpacity=".2" />
          </svg>
        </div>
        <div className="relative z-10 max-w-[690px] px-6 py-8 md:px-12 md:py-12">
          <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2"><DemoFlag /><span className="mono text-[10px] uppercase tracking-[.16em] text-[#c5d1c5]">Public information prototype</span></div>
          <h1 className="serif-heading max-w-[650px] text-[39px] font-bold leading-[1.05] md:text-[58px]">A clearer picture.<br /><span className="text-[#c9d8c6]">A steadier next step.</span></h1>
          <p className="mt-5 max-w-[540px] text-[14px] leading-7 text-[#d1dbd2] md:text-[16px]">ResQAI brings community observations into focus—showing what’s reported, what’s uncertain, and practical ways to stay aware.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/report" data-testid="link-hero-report" className="inline-flex items-center gap-2 rounded-full bg-[#e8794d] px-5 py-3 text-[13px] font-bold text-[#2b2721] no-underline transition-transform hover:-translate-y-0.5">Share an observation <ArrowRight size={16} /></Link>
            <span className="flex items-center gap-2 px-2 text-[11px] font-medium text-[#c3d0c6]"><ShieldCheck size={16} /> Reports are not verified dispatches</span>
          </div>
        </div>
        <div className="absolute bottom-5 right-6 hidden items-center gap-2 rounded-full border border-white/15 bg-[#0e3331]/60 px-3 py-2 text-[10px] text-[#d4ded2] md:flex"><MapPin size={12} />Illustrative scenarios only</div>
      </section>

      <section className="load-in-delay grid gap-8 pb-12 pt-10 md:grid-cols-[1fr_285px] md:gap-12 md:pt-14">
        <div>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div><div className="mono mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-[#b45a36]">01 / Situation overview</div><h2 className="serif-heading text-[29px] font-bold leading-tight md:text-[36px]">Illustrative incident summaries</h2></div>
            <span className="mono rounded-full border border-[#d7d3c8] px-3 py-1.5 text-[10px] uppercase tracking-[.09em] text-[#66716b]">3 sample scenarios</span>
          </div>
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#ded7c4] bg-[#f1eddf] p-4 text-[12px] leading-5 text-[#555d55]"><Info size={17} className="mt-0.5 shrink-0 text-[#9b6c3c]" /><p><strong className="text-[#273c37]">How to read this:</strong> Every item below is fabricated for demonstration. Reports from residents are not independently verified or an official advisory.</p></div>
          <div className="space-y-4">
            {incidents.map((incident, index) => <IncidentCard key={incident.id} incident={incident} index={index} open={expanded === incident.id} onToggle={() => setExpanded(expanded === incident.id ? null : incident.id)} />)}
          </div>
        </div>
        <aside className="space-y-5 md:pt-[66px]">
          <div className="rounded-[21px] border border-[#d9d6ca] bg-[#f2f0e8] p-5">
            <div className="mb-4 flex items-center gap-2 text-[#174c46]"><ShieldCheck size={18} /><h3 className="serif-heading text-[18px] font-bold">Use your own judgement</h3></div>
            <p className="text-[12px] leading-5 text-[#59635c]">Information here is illustrative, may be incomplete, and is not a substitute for instructions from local authorities.</p>
            <div className="my-5 h-px bg-[#d9d6ca]" />
            <div className="space-y-4">
              <AdviceLine icon={<CircleAlert size={16} />} label="If there is immediate danger" text="Move to safety and contact local emergency services." />
              <AdviceLine icon={<Wind size={16} />} label="Protect yourself first" text="Do not approach hazards to verify a report." />
              <AdviceLine icon={<BadgeCheck size={16} />} label="Check before sharing" text="Separate what you saw from what you heard." />
            </div>
          </div>
          <button type="button" data-testid="button-open-assistant" onClick={() => setAssistantOpen(true)} className="group flex w-full items-center justify-between rounded-[21px] bg-[#dfebe1] p-5 text-left transition-transform hover:-translate-y-0.5">
            <span><span className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#417065]"><Sparkles size={13} />Demo conversation</span><span className="block font-serif text-[19px] font-bold text-[#183f3a]">Ask what a report means</span><span className="mt-1 block text-[11px] text-[#60736b]">Text or speech, if supported</span></span><ArrowDownRight className="text-[#477368] transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
          </button>
          <div className="rounded-[21px] border border-[#e7c9b5] bg-[#faeee4] p-5"><div className="mono mb-2 text-[10px] font-semibold uppercase tracking-[.14em] text-[#a35232]">A note on confidence</div><p className="text-[12px] leading-5 text-[#66554c]">Confidence describes how much example reporting aligns. It does not confirm an event, measure danger, or predict outcomes.</p></div>
        </aside>
      </section>
      <section className="mb-10 flex flex-col justify-between gap-5 border-t border-[#d8d5c9] py-7 md:flex-row md:items-center">
        <div><p className="mono text-[10px] uppercase tracking-[.16em] text-[#a25232]">02 / Community signal</p><h2 className="serif-heading mt-1 text-[23px] font-bold">Have something to share?</h2><p className="mt-1 max-w-xl text-[12px] text-[#626d65]">A useful report is specific, firsthand, and safe to submit. Your report stays on this device in this demo.</p></div>
        <Link href="/report" data-testid="link-footer-report" className="inline-flex w-fit items-center gap-2 rounded-full border border-[#174c46] px-5 py-3 text-[12px] font-bold text-[#174c46] no-underline transition-colors hover:bg-[#174c46] hover:text-[#f7f5ee]">Open report form <ArrowRight size={15} /></Link>
      </section>
    </main>
    {assistantOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#142d2b]/45 p-0 backdrop-blur-sm md:items-center md:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAssistantOpen(false); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="assistant-title" className="w-full max-w-[520px] rounded-t-[25px] border border-[#d8d5c9] bg-[#f8f6ef] p-5 shadow-2xl md:rounded-[25px] md:p-7">
        <div className="flex items-start justify-between"><div><div className="mono text-[10px] uppercase tracking-[.16em] text-[#ad5836]">ResQAI · demo only</div><h2 id="assistant-title" className="serif-heading mt-1 text-[25px] font-bold">A little more context</h2></div><button type="button" aria-label="Close assistant" data-testid="button-close-assistant" onClick={() => setAssistantOpen(false)} className="rounded-full p-2 hover:bg-[#e9e6dc]"><X size={18} /></button></div>
        <p className="mt-3 rounded-xl bg-[#f1eddf] p-3 text-[11px] leading-5 text-[#62665d]">This assistant uses a fixed demo response. It does not access live incidents or provide emergency guidance.</p>
        <form className="mt-5" onSubmit={(event) => { event.preventDefault(); sendAssistant(assistantText); }}>
          <label htmlFor="assistant-question" className="mb-2 block text-[12px] font-semibold">What would you like clarified?</label>
          <textarea id="assistant-question" data-testid="input-assistant-question" value={assistantText} onChange={(event) => setAssistantText(event.target.value)} rows={3} placeholder="Ask about confidence, source labels, or safety…" className="w-full resize-y rounded-xl border border-[#d8d5c9] bg-[#fffdf7] p-3 text-[13px] outline-none placeholder:text-[#999990] focus:border-[#174c46]" />
          <div className="mt-3 flex flex-wrap justify-between gap-3">
            {hasSpeechRecognition ? <button type="button" data-testid="button-assistant-mic" onClick={toggleListening} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold ${listening ? 'border-[#c45336] bg-[#f8e6dc] text-[#943f2c]' : 'border-[#d8d5c9] text-[#355750]'}`}><Mic size={15} />{listening ? 'Listening… tap to stop' : 'Speak a question'}</button> : <span className="py-2 text-[10px] text-[#777c73]">Speech input unavailable in this browser.</span>}
            <button type="submit" data-testid="button-assistant-send" className="inline-flex items-center gap-2 rounded-full bg-[#174c46] px-4 py-2 text-[12px] font-bold text-white">Ask demo <ArrowRight size={14} /></button>
          </div>
        </form>
        {assistantReply && <div role="status" data-testid="text-assistant-response" className="mt-4 flex gap-3 rounded-xl border border-[#c6d8c8] bg-[#e7f0e6] p-4 text-[12px] leading-5 text-[#304c43]"><AudioLines size={17} className="mt-0.5 shrink-0" /><div><strong>Demo response</strong><p className="mt-1">{assistantReply}</p>{!hasSpeechSynthesis && <span className="mt-2 block text-[10px]">Spoken response unavailable in this browser.</span>}</div></div>}
      </section>
    </div>}
  </>;
}

function IncidentCard({ incident, index, open, onToggle }: { incident: Incident; index: number; open: boolean; onToggle: () => void }) {
  const icon = incident.eventType === 'Flooding' ? <Waves size={18} /> : incident.eventType === 'Smoke' ? <Flame size={18} /> : <Wind size={18} />;
  return <article data-testid={`card-incident-${incident.id}`} className="overflow-hidden rounded-[20px] border border-[#dcd9ce] bg-[#fbfaf5] transition-shadow hover:shadow-[0_12px_30px_rgba(29,55,46,.07)]">
    <button type="button" data-testid={`button-expand-${incident.id}`} aria-expanded={open} onClick={onToggle} className="block w-full p-5 text-left md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3.5">
          <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-[13px] ${incident.eventType === 'Smoke' ? 'bg-[#f9e7d9] text-[#a34b2e]' : incident.eventType === 'Flooding' ? 'bg-[#dcece7] text-[#286c66]' : 'bg-[#efe9d9] text-[#806c37]'}`}>{icon}</span>
          <div><div className="mb-1.5 flex flex-wrap items-center gap-2"><span className="mono text-[9px] font-semibold uppercase tracking-[.13em] text-[#7b827a]">Scenario {String(index + 1).padStart(2, '0')} / {incident.eventType}</span><span className="rounded-full bg-[#f0e8d7] px-2 py-0.5 text-[9px] font-semibold text-[#755d31]">{incident.severity}</span></div><h3 className="serif-heading text-[18px] font-bold leading-snug text-[#203b36] md:text-[20px]">{incident.title}</h3><div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#70776e]"><span className="flex items-center gap-1"><MapPin size={11} />{incident.locationName}</span><span>{incident.updatedAt}</span></div></div>
        </div>
        <ChevronDown size={18} className={`mt-1 shrink-0 text-[#788078] transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      <p className="ml-[54px] mt-4 max-w-[650px] text-[12px] leading-5 text-[#56625a]">{incident.summary}</p>
      <div className="ml-[54px] mt-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c8d8cc] bg-[#edf3eb] px-2.5 py-1.5 text-[10px] font-semibold text-[#355d4d]"><span className="h-1.5 w-1.5 rounded-full bg-[#579276]" />{incident.confidenceLevel}</span>
        <span className="mono text-[10px] text-[#727970]">{incident.confidenceScore}% · {incident.sourceCount} sample sources</span>
        <span className="ml-auto hidden text-[10px] text-[#7d8179] sm:block">Sources are not official verification</span>
      </div>
    </button>
    {open && <div className="border-t border-[#e2dfd4] bg-[#f7f5ee] px-5 pb-5 pt-4 md:px-6 md:pb-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div><h4 className="mono mb-3 text-[9px] font-semibold uppercase tracking-[.16em] text-[#a25232]">Reported observations</h4><div className="space-y-3">{incident.observations.map((observation, i) => <div key={i} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d16a43]" /><div><span className="text-[9px] font-bold uppercase tracking-[.06em] text-[#777d73]">{observation.category}</span><p className="text-[11px] leading-5 text-[#46534b]">{observation.statement}</p></div></div>)}</div><p className="mt-4 border-t border-[#dfdcd1] pt-3 text-[10px] leading-4 text-[#73786f]"><strong className="text-[#45554b]">Source categories:</strong> Citizen reports and contextual data are illustrative examples, not official sources.</p></div>
        <div><h4 className="mono mb-3 text-[9px] font-semibold uppercase tracking-[.16em] text-[#a25232]">Practical safety steps</h4><div className="mb-3 flex flex-wrap gap-1.5">{incident.hazards.map((hazard) => <span key={hazard} className="rounded-md bg-[#f3e5d9] px-2 py-1 text-[9px] font-medium text-[#81513a]">{hazard}</span>)}</div><ul className="space-y-2.5">{incident.actionItems.map((item) => <li key={item} className="flex gap-2.5 text-[11px] leading-5 text-[#45534b]"><Check size={14} className="mt-0.5 shrink-0 text-[#367668]" />{item}</li>)}</ul></div>
      </div>
    </div>}
  </article>;
}

function AdviceLine({ icon, label, text }: { icon: ReactNode; label: string; text: string }) {
  return <div className="flex gap-3"><span className="mt-0.5 text-[#b75e3b]">{icon}</span><div><p className="text-[11px] font-bold text-[#344d43]">{label}</p><p className="mt-0.5 text-[10px] leading-4 text-[#677168]">{text}</p></div></div>;
}

type SavedReport = { inputType: 'text' | 'voice'; rawText: string; files: string[]; latitude?: number; longitude?: number; savedAt: string };

function ReportPage({ lowBandwidth, setLowBandwidth }: { lowBandwidth: boolean; setLowBandwidth: (value: boolean) => void }) {
  const [inputType, setInputType] = useState<'text' | 'voice'>('text');
  const [rawText, setRawText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [savedCount, setSavedCount] = useState(0);
  const [listening, setListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ start: () => void; stop: () => void; onresult: ((event: any) => void) | null; onend: (() => void) | null; onerror: (() => void) | null } | null>(null);
  const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : undefined;

  useEffect(() => {
    try { const stored = JSON.parse(localStorage.getItem(DEMO_KEY) || '[]'); setSavedCount(Array.isArray(stored) ? stored.length : 0); } catch { setSavedCount(0); }
  }, []);
  const requestLocation = () => {
    setLocationMessage('');
    if (!navigator.geolocation) { setLocationMessage('Location is not available in this browser. You can still submit without it.'); return; }
    setLocationMessage('Waiting for your permission…');
    navigator.geolocation.getCurrentPosition(
      (position) => { setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude }); setLocationMessage('Approximate device coordinates attached.'); },
      () => { setLocationMessage('Location was not shared. You can still submit without it.'); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };
  const toggleVoice = () => {
    if (!SpeechRecognition) return;
    if (listening) { recognitionRef.current?.stop(); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      setRawText((previous) => previous ? `${previous} ${transcript}` : transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); setError('Speech input ended. You can continue by typing.'); };
    recognitionRef.current = recognition;
    setInputType('voice');
    setListening(true);
    setError('');
    recognition.start();
  };
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rawText.trim().length < 8) { setError('Add a few more details before saving this demo report.'); return; }
    const report: SavedReport = { inputType, rawText: rawText.trim(), files: files.map((file) => file.name), ...(coords ?? {}), savedAt: new Date().toISOString() };
    try {
      const current = JSON.parse(localStorage.getItem(DEMO_KEY) || '[]');
      const next = Array.isArray(current) ? [...current, report] : [report];
      localStorage.setItem(DEMO_KEY, JSON.stringify(next));
      setSavedCount(next.length);
      setNotice('Demo report saved on this device only. It was NOT sent to emergency services or any responder.');
      setError('');
    } catch {
      setError('This browser could not save locally. Your report was not sent anywhere.');
    }
  };
  return <>
    <Header lowBandwidth={lowBandwidth} setLowBandwidth={setLowBandwidth} />
    <main className="mx-auto max-w-[1220px] px-5 pb-24 md:px-8">
      <div className="load-in py-7 md:py-10"><Link href="/" data-testid="link-back-home" className="mb-7 inline-flex items-center gap-2 text-[11px] font-semibold text-[#617068] no-underline hover:text-[#174c46]"><ArrowLeft size={14} />Back to overview</Link>
        <div className="grid gap-9 md:grid-cols-[minmax(0,1fr)_340px] md:gap-16">
          <div>
            <DemoFlag />
            <h1 className="serif-heading mt-3 text-[38px] font-bold leading-[1.05] text-[#1d3e39] md:text-[51px]">Share what<br className="hidden sm:block" /> you’re seeing.</h1>
            <p className="mt-4 max-w-[560px] text-[13px] leading-6 text-[#5d6961]">A clear, firsthand observation can add context to this demonstration. Share only what you can safely observe. Do not approach a hazard to collect details.</p>
            {notice && <div role="status" data-testid="status-report-saved" className="mt-6 flex gap-3 rounded-2xl border border-[#b8d2bd] bg-[#e7f2e8] p-4 text-[12px] leading-5 text-[#315442]"><Check size={18} className="mt-0.5 shrink-0" /><div><strong>Saved locally</strong><p>{notice}</p><button type="button" onClick={() => setNotice('')} className="mt-2 text-[10px] font-bold underline underline-offset-2">Dismiss</button></div></div>}
            {error && <div role="alert" data-testid="status-report-error" className="mt-5 rounded-xl border border-[#e7bca9] bg-[#fff0e9] p-3 text-[12px] text-[#8a3f2d]">{error}</div>}
            <form onSubmit={submit} className="mt-7 space-y-6">
              <fieldset><legend className="mb-2 text-[12px] font-bold text-[#28453e]">How would you like to describe it?</legend><div className="flex w-fit rounded-full border border-[#d7d4c8] bg-[#efede4] p-1">
                <button type="button" data-testid="button-input-text" aria-pressed={inputType === 'text'} onClick={() => setInputType('text')} className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${inputType === 'text' ? 'bg-[#174c46] text-white shadow-sm' : 'text-[#5d6961]'}`}>Write a report</button>
                <button type="button" data-testid="button-input-voice" aria-pressed={inputType === 'voice'} onClick={() => { setInputType('voice'); if (SpeechRecognition) toggleVoice(); }} className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${inputType === 'voice' ? 'bg-[#174c46] text-white shadow-sm' : 'text-[#5d6961]'}`}>Use speech</button>
              </div></fieldset>
              <div><div className="mb-2 flex items-baseline justify-between gap-3"><label htmlFor="report-description" className="text-[12px] font-bold text-[#28453e]">What did you observe?</label><span className="text-[10px] text-[#85877e]">Firsthand details are most useful</span></div>
                <textarea id="report-description" data-testid="input-report-description" required minLength={8} maxLength={1200} rows={6} value={rawText} onChange={(event) => setRawText(event.target.value)} placeholder="Describe what you saw, where it was, and when. Avoid sharing names or personal details." className="w-full resize-y rounded-2xl border border-[#d7d4c8] bg-[#fbfaf5] p-4 text-[13px] leading-6 text-[#263d37] outline-none placeholder:text-[#92948c] focus:border-[#438174]" />
                <div className="mt-1 flex justify-between text-[10px] text-[#85877e]"><span>{listening ? 'Speech capture is active. Speak clearly.' : 'Be specific. Separate what you saw from what you heard.'}</span><span className="mono">{rawText.length}/1200</span></div>
                {inputType === 'voice' && <div className="mt-3 flex items-center gap-3">{SpeechRecognition ? <button type="button" data-testid="button-toggle-voice" onClick={toggleVoice} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-bold ${listening ? 'border-[#d8896d] bg-[#fff0e8] text-[#8e422c]' : 'border-[#cad3c9] text-[#33594e]'}`}><Mic size={15} />{listening ? 'Stop listening' : 'Start voice capture'}</button> : <span className="rounded-lg bg-[#f0ede3] px-3 py-2 text-[10px] text-[#72796f]">Speech recognition is not available here. Type your observation instead.</span>}</div>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#dedacf] bg-[#f6f4ec] p-4"><div className="flex items-center gap-2 text-[12px] font-bold text-[#28453e]"><MapPin size={15} />Add approximate location</div><p className="mt-1.5 text-[10px] leading-4 text-[#777b72]">Optional. Your browser will ask for permission; coordinates stay on this device.</p><button type="button" data-testid="button-request-location" onClick={requestLocation} className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#aabdb2] bg-[#fbfaf5] px-3 py-2 text-[10px] font-bold text-[#31574c] hover:bg-[#e9f0e8]"><LocateFixed size={13} />{coords ? 'Location attached' : 'Request device location'}</button>{locationMessage && <p role="status" className="mt-2 text-[10px] text-[#597169]">{locationMessage}</p>}</div>
                <div className="rounded-2xl border border-[#dedacf] bg-[#f6f4ec] p-4"><div className="flex items-center gap-2 text-[12px] font-bold text-[#28453e]"><Paperclip size={15} />Add media or documents (optional)</div><p className="mt-1.5 text-[10px] leading-4 text-[#777b72]">Choose photos, voice clips, video, or documents. Files stay on this device.</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" data-testid="button-select-files" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-[#aabdb2] bg-[#fbfaf5] px-3 py-2 text-[10px] font-bold text-[#31574c] hover:bg-[#e9f0e8]"><Upload size={13} />Choose files</button><button type="button" data-testid="button-capture-photo" onClick={() => cameraInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-[#aabdb2] bg-[#fbfaf5] px-3 py-2 text-[10px] font-bold text-[#31574c] hover:bg-[#e9f0e8]"><Camera size={13} />Take a photo</button></div><input ref={fileInputRef} data-testid="input-report-files" type="file" accept="image/*,audio/*,video/*,.pdf,.txt" multiple className="sr-only" onChange={(event) => setFiles((previous) => [...previous, ...Array.from(event.target.files ?? [])])} /><input ref={cameraInputRef} data-testid="input-camera-capture" type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => setFiles((previous) => [...previous, ...Array.from(event.target.files ?? [])])} />{files.length > 0 && <ul className="mt-2 space-y-1">{files.map((file, index) => <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-2 text-[10px] text-[#53675e]"><span className="truncate">{file.name}</span><button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles(files.filter((_, i) => i !== index))} className="rounded p-1 hover:bg-[#e7e4da]"><X size={12} /></button></li>)}</ul>}</div>
              </div>
              {coords && <div className="mono rounded-lg bg-[#eeece3] px-3 py-2 text-[10px] text-[#657067]">Coordinates attached · {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}</div>}
              <div className="rounded-xl border border-[#e5c7b5] bg-[#fbefe5] p-4 text-[11px] leading-5 text-[#6d5143]"><div className="flex gap-2 font-bold text-[#874833]"><ShieldAlert size={15} className="mt-0.5 shrink-0" />This demo does not send reports to anyone.</div><p className="mt-1.5">Submissions are saved only in this browser’s local storage. They are not reviewed, transmitted, or sent to emergency services. For real emergencies, contact your local emergency services directly.</p></div>
              <button type="submit" data-testid="button-save-report" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#174c46] px-6 py-3.5 text-[13px] font-bold text-[#f8f5ec] transition-transform hover:-translate-y-0.5 hover:bg-[#23635a]">Save demo report on this device <ArrowRight size={16} /></button>
            </form>
          </div>
          <aside className="space-y-5 md:pt-8">
            <div className="relative overflow-hidden rounded-[22px] bg-[#153f3c] p-5 text-[#f5f2e9]">
              <div className="decorative-art absolute -right-4 -top-2 opacity-40" aria-hidden="true"><svg width="150" height="150" viewBox="0 0 150 150"><circle cx="80" cy="70" r="30" fill="none" stroke="#dfe7d8" /><circle cx="80" cy="70" r="55" fill="none" stroke="#dfe7d8" strokeOpacity=".5" /><circle cx="80" cy="70" r="75" fill="none" stroke="#dfe7d8" strokeOpacity=".3" /><circle cx="80" cy="70" r="5" fill="#e8794d" /></svg></div>
              <div className="relative"><div className="mono text-[9px] uppercase tracking-[.18em] text-[#bbd0c1]">Reporting, made safer</div><h2 className="serif-heading mt-3 text-[23px] font-bold leading-tight">A good report<br />starts with you.</h2><div className="mt-5 space-y-4">{[['01', 'Be precise', 'Describe what you directly observed.'], ['02', 'Stay safe', 'Never put yourself at risk to get details.'], ['03', 'Respect privacy', 'Avoid faces, names, and identifying information.']].map(([number, title, text]) => <div key={number} className="flex gap-3"><span className="mono text-[10px] text-[#e78b63]">{number}</span><div><p className="text-[11px] font-bold">{title}</p><p className="mt-0.5 text-[10px] leading-4 text-[#c5d5c8]">{text}</p></div></div>)}</div></div>
            </div>
            <div className="rounded-[22px] border border-[#dcd9ce] bg-[#f4f2ea] p-5"><div className="flex items-center justify-between"><h3 className="serif-heading text-[17px] font-bold">On this device</h3><span className="grid h-8 w-8 place-items-center rounded-full bg-[#e0e9df] text-[#30675b]"><Check size={16} /></span></div><p className="mt-2 text-[11px] leading-5 text-[#697168]">Reports are stored locally for this demo only. Nothing is sent to ResQAI, an agency, or a responder.</p><div className="mt-4 flex items-center justify-between border-t border-[#dddacf] pt-3"><span className="mono text-[9px] uppercase tracking-[.1em] text-[#7a8077]">Local demo reports</span><span data-testid="text-saved-count" className="mono text-[13px] font-semibold text-[#174c46]">{savedCount}</span></div></div>
            <div className="rounded-[22px] border border-[#ead1bf] bg-[#fbefe5] p-5"><div className="flex items-center gap-2 text-[#9b4c31]"><Siren size={16} /><h3 className="text-[12px] font-bold">Need help now?</h3></div><p className="mt-2 text-[11px] leading-5 text-[#68564c]">This form is not monitored. For a real emergency, contact local emergency services directly.</p></div>
          </aside>
        </div>
      </div>
    </main>
  </>;
}

function DemoFooter() {
  return <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ddab8c] bg-[#f8e8d9] shadow-[0_-6px_24px_rgba(42,49,40,.08)]">
    <div className="mx-auto flex max-w-[1220px] items-center gap-3 px-5 py-3 md:px-8">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#db6b43] text-white"><ShieldAlert size={16} /></span>
      <p data-testid="text-persistent-demo-notice" className="text-[10px] leading-4 text-[#5d4437] md:text-[11px]"><strong className="font-bold text-[#773f29]">DEMO — NOT LIVE.</strong> This information is synthetic and not monitored. For a real emergency, contact your local emergency services.</p>
      <span className="mono ml-auto hidden shrink-0 text-[9px] uppercase tracking-[.12em] text-[#805b48] md:block">ResQAI prototype</span>
    </div>
  </footer>;
}

export default App;
