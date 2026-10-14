import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, Cpu, Smartphone, LayoutGrid, Layers, ArrowRight, ArrowLeft, CheckCircle2, Flame
} from 'lucide-react';
import { Header } from './components/Header';
import { SettingsModal } from './components/SettingsModal';
import { LeadHub } from './components/LeadHub/LeadHub';
import { AgentTerminal } from './components/OrchestrationTerminal/AgentTerminal';
import { DeliveryHub } from './components/DeliveryHub/DeliveryHub';
import { ParentRoiModal } from './components/ParentRoiModal';
import { ShowcaseBanner } from './components/ShowcaseBanner';

import type { Lead, Alumnus, ScriptOutput, AgentExecutionLog, TelemetryEvent, SettingsConfig, CounselorBattlecard, CounselorProfile } from './types';
import { ALUMNI_DATABASE } from './data/alumniData';
import { getAssignedCounselorForLead } from './data/counselorsData';
import { 
  loadSettings, saveSettings, loadLeads, saveLeads, 
  loadTelemetry, saveTelemetryEvent 
} from './services/storageService';
import { matchAlumnusForLead, MatchResult } from './services/matcherService';
import { generateEmpatheticScript, generateCounselorBattlecard } from './services/aiService';
import { synthesizeVoiceNote } from './services/voiceService';
import { dispatchCounselorEscalationWebhook, WebhookDispatchResult } from './services/webhookService';
import { 
  syncLeadToSupabase, 
  syncTelemetryToSupabase,
  fetchLeadsFromSupabase,
  fetchAlumniFromSupabase
} from './services/supabaseService';

export function App() {
  // Persistent State with Environment Keys Preloaded
  const [settings, setSettings] = useState<SettingsConfig>(loadSettings);
  const [leads, setLeads] = useState<Lead[]>(loadLeads);
  const [alumniPool, setAlumniPool] = useState<Alumnus[]>(ALUMNI_DATABASE);
  const [selectedLead, setSelectedLead] = useState<Lead>(() => leads[0]);

  // Navigation State: 'stepper' or 'overview'
  const [viewMode, setViewMode] = useState<'stepper' | 'overview'>('stepper');
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Orchestration Pipeline State
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [scriptOutput, setScriptOutput] = useState<ScriptOutput | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [agentLogs, setAgentLogs] = useState<AgentExecutionLog[]>([]);
  const [currentAgentStep, setCurrentAgentStep] = useState<number>(0);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [executionTimeMs, setExecutionTimeMs] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);

  // Delivery & Telemetry State
  const [activeDeliveryTab, setActiveDeliveryTab] = useState<'whatsapp' | 'telemetry'>('whatsapp');
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>(loadTelemetry);
  const [engagementScore, setEngagementScore] = useState<number>(0);
  const [webhookResult, setWebhookResult] = useState<WebhookDispatchResult | null>(null);
  const [isWebhookFiring, setIsWebhookFiring] = useState(false);
  const [hasWebhookFiredForCurrentLead, setHasWebhookFiredForCurrentLead] = useState(false);
  const [battlecard, setBattlecard] = useState<CounselorBattlecard | null>(null);
  const [isGeneratingBattlecard, setIsGeneratingBattlecard] = useState(false);
  const [counselorCycleOffset, setCounselorCycleOffset] = useState<number>(0);
  const [selectedCounselorOverride, setSelectedCounselorOverride] = useState<CounselorProfile | null>(null);

  // Modals & Showcase
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isShowcaseRunning, setIsShowcaseRunning] = useState(false);
  const [showcaseStep, setShowcaseStep] = useState(0);
  const [showcaseMessage, setShowcaseMessage] = useState('');

  const timerRef = useRef<any>(null);
  const showcaseTimeoutRef = useRef<any[]>([]);

  const updateBattlecard = async (
    targetLead: Lead = selectedLead,
    targetAlum?: Alumnus | null,
    score: number = engagementScore,
    currentEvents: TelemetryEvent[] = telemetryEvents,
    counselorToUse?: CounselorProfile | null,
    cycleOffset: number = counselorCycleOffset
  ) => {
    setIsGeneratingBattlecard(true);
    const alumToUse = targetAlum || matchResult?.alumnus || alumniPool[0];
    const resolvedCounselor = counselorToUse || selectedCounselorOverride || getAssignedCounselorForLead(targetLead, cycleOffset);
    try {
      const card = await generateCounselorBattlecard(targetLead, alumToUse, score, currentEvents, settings, resolvedCounselor);
      setBattlecard(card);
      return card;
    } catch (err) {
      console.warn('Battlecard generation error:', err);
      return null;
    } finally {
      setIsGeneratingBattlecard(false);
    }
  };

  const handleRotateCounselor = () => {
    const nextOffset = counselorCycleOffset + 1;
    setCounselorCycleOffset(nextOffset);
    const nextCounselor = getAssignedCounselorForLead(selectedLead, nextOffset);
    setSelectedCounselorOverride(nextCounselor);
    updateBattlecard(selectedLead, matchResult?.alumnus, engagementScore, telemetryEvents, nextCounselor, nextOffset);
  };

  const handleSelectCounselor = (c: CounselorProfile) => {
    setSelectedCounselorOverride(c);
    updateBattlecard(selectedLead, matchResult?.alumnus, engagementScore, telemetryEvents, c);
  };

  // Seamless Supabase Data Integration: Sync live leads & alumni from Supabase
  useEffect(() => {
    let isCancelled = false;
    async function loadSupabaseData() {
      if (!settings.supabaseUrl || !settings.supabaseAnonKey) return;
      try {
        const [remoteLeads, remoteAlumni] = await Promise.all([
          fetchLeadsFromSupabase(settings),
          fetchAlumniFromSupabase(settings),
        ]);
        if (!isCancelled) {
          if (remoteLeads && remoteLeads.length > 0) {
            setLeads(remoteLeads);
            saveLeads(remoteLeads);
            setSelectedLead((curr) => remoteLeads.find((l) => l.id === curr.id) || remoteLeads[0]);
          }
          if (remoteAlumni && remoteAlumni.length > 0) {
            setAlumniPool(remoteAlumni);
          }
        }
      } catch (e) {
        console.warn('Supabase data loading notice:', e);
      }
    }
    loadSupabaseData();
    return () => {
      isCancelled = true;
    };
  }, [settings.supabaseUrl, settings.supabaseAnonKey]);

  // Reset when selected lead changes
  useEffect(() => {
    setMatchResult(null);
    setScriptOutput(null);
    setAudioUrl(null);
    setCurrentAgentStep(0);
    setEngagementScore(0);
    setWebhookResult(null);
    setHasWebhookFiredForCurrentLead(false);
    setActiveDeliveryTab('whatsapp');
    setCounselorCycleOffset(0);
    setSelectedCounselorOverride(null);
    const initialCounselor = getAssignedCounselorForLead(selectedLead, 0);
    updateBattlecard(selectedLead, null, 0, [], initialCounselor, 0);
  }, [selectedLead.id]);

  // Telemetry Recorder
  const recordTelemetry = (type: TelemetryEvent['eventType'], scoreAdd: number) => {
    const newScore = Math.min(100, engagementScore + scoreAdd);
    setEngagementScore(newScore);

    const event: TelemetryEvent = {
      id: `telem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      leadId: selectedLead.id,
      eventType: type,
      timestamp: Date.now(),
      scoreContribution: scoreAdd,
    };

    setTelemetryEvents((prev) => [event, ...prev]);
    saveTelemetryEvent(event);
    syncTelemetryToSupabase(event, settings);

    if (newScore >= 75 && !hasWebhookFiredForCurrentLead) {
      triggerEscalationWebhook(newScore);
    }
  };

  // Real Webhook Dispatcher
  const triggerEscalationWebhook = async (currentScore: number = engagementScore) => {
    setIsWebhookFiring(true);
    setHasWebhookFiredForCurrentLead(true);

    const alum = matchResult?.alumnus || {
      id: 'alum-default',
      name: 'Sai Teja Mandava',
      hometown: 'Tenali',
      district: selectedLead.district,
      state: selectedLead.state,
      language: selectedLead.language,
      college: selectedLead.targetCollege,
      gradYear: 2025,
      startingCtc: 7.2,
      currentCompany: 'TCS Digital',
      role: 'Associate Software Engineer',
      initialCodingSkill: 'Zero',
      familyBackground: 'Farmer / Small Retailer',
      offerLetterRef: 'TCS/2025/HYD-88219',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      relatableStory: 'Paid back fee loan within 10 months',
      addressedObjections: [selectedLead.objection],
    };

    // Confetti celebration (Green and White)
    try {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#ffffff', '#10b981', '#ef4444'],
      });
    } catch (e) {}

    const actions = telemetryEvents.map((t) => t.eventType.replace('_', ' '));
    const result = await dispatchCounselorEscalationWebhook(
      selectedLead,
      alum,
      currentScore,
      actions.length > 0 ? actions : ['Audio Played 100%', 'ROI Portal Viewed'],
      settings.webhookUrl,
      battlecard
    );

    setWebhookResult(result);
    setIsWebhookFiring(false);

    // Sync status to Supabase & local storage
    const escalatedLead: Lead = { ...selectedLead, status: 'escalated' };
    setSelectedLead(escalatedLead);
    setLeads((prev) => prev.map((l) => (l.id === escalatedLead.id ? escalatedLead : l)));
    syncLeadToSupabase(escalatedLead, settings);
  };

  // Main Multi-Agent Pipeline Execution
  const runPipeline = async () => {
    if (isPipelineRunning) return;
    setIsPipelineRunning(true);
    setExecutionTimeMs(0);
    setTotalTokens(0);
    setCurrentAgentStep(1);

    // If in stepper view, automatically switch to Step 2 so user sees live execution
    setActiveStep(2);

    const startTime = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setExecutionTimeMs(Date.now() - startTime);
    }, 50);

    try {
      // AGENT 1: Matcher
      await new Promise((r) => setTimeout(r, 600));
      const match = matchAlumnusForLead(selectedLead, alumniPool);
      setMatchResult(match);
      updateBattlecard(selectedLead, match.alumnus, 20, telemetryEvents, selectedCounselorOverride || getAssignedCounselorForLead(selectedLead, counselorCycleOffset));

      // AGENT 2: Scriptwriter (Groq / Gemini)
      setCurrentAgentStep(2);
      const aiRes = await generateEmpatheticScript(selectedLead, match.alumnus, settings);
      setScriptOutput(aiRes.script);
      setTotalTokens((prev) => prev + aiRes.tokensUsed);

      // AGENT 3: Voice Note & Artifacts
      setCurrentAgentStep(3);
      const voiceRes = await synthesizeVoiceNote(
        aiRes.script.vernacularScript,
        selectedLead.language,
        settings
      );
      setAudioUrl(voiceRes.audioUrl);
      await new Promise((r) => setTimeout(r, 500));

      // COMPLETE
      setCurrentAgentStep(4);
      clearInterval(timerRef.current);
      setExecutionTimeMs(Date.now() - startTime);

      // Sync matched status to Supabase
      const updatedLead: Lead = { ...selectedLead, status: 'matched' };
      setSelectedLead(updatedLead);
      setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
      syncLeadToSupabase(updatedLead, settings);

      recordTelemetry('whatsapp_delivered', 15);
    } catch (error: any) {
      console.error('Pipeline error:', error);
      alert(`Pipeline Notice: ${error.message || 'Error occurred.'}`);
    } finally {
      setIsPipelineRunning(false);
      clearInterval(timerRef.current);
    }
  };

  // 1-Click Automated Showcase Sequence (20-second Loom helper)
  const runShowcase = () => {
    if (isShowcaseRunning) return;
    setIsShowcaseRunning(true);
    showcaseTimeoutRef.current.forEach(clearTimeout);
    showcaseTimeoutRef.current = [];

    const plan = [
      {
        step: 1,
        message: 'Step 1/7: Selected Guntur lead Harish Reddy (Dual-fee objection)...',
        action: () => {
          setSelectedLead(leads[0]);
          setActiveStep(1);
        },
        delay: 500,
      },
      {
        step: 2,
        message: 'Step 2/7: Triggering AI Pipeline... Matching regional alumni in Guntur...',
        action: () => {
          runPipeline();
        },
        delay: 2000,
      },
      {
        step: 3,
        message: 'Step 3/7: Generated Telugu script via LLM & synthesized vernacular audio...',
        action: () => {},
        delay: 4500,
      },
      {
        step: 4,
        message: 'Step 4/7: Moving to WhatsApp view & playing localized voice note...',
        action: () => {
          setActiveStep(3);
          setActiveDeliveryTab('whatsapp');
          recordTelemetry('audio_started', 20);
          setTimeout(() => recordTelemetry('audio_completed', 25), 1800);
        },
        delay: 7500,
      },
      {
        step: 5,
        message: 'Step 5/7: Parent clicks "View Local Outcome Certificate & ROI Breakdown"...',
        action: () => {
          setIsPortalOpen(true);
          recordTelemetry('portal_opened', 25);
        },
        delay: 11000,
      },
      {
        step: 6,
        message: 'Step 6/7: Parent tweaks ROI slider -> Score reaches 95% -> Webhook escalates!',
        action: () => {
          recordTelemetry('roi_slider_adjusted', 15);
        },
        delay: 14500,
      },
      {
        step: 7,
        message: 'Step 7/7: Showcase complete! Real Webhook alert dispatched to regional counselor.',
        action: () => {
          setIsPortalOpen(false);
          setActiveStep(3);
          setActiveDeliveryTab('telemetry');
          setIsShowcaseRunning(false);
        },
        delay: 18500,
      },
    ];

    plan.forEach((item) => {
      const t = setTimeout(() => {
        setShowcaseStep(item.step);
        setShowcaseMessage(item.message);
        item.action();
      }, item.delay);
      showcaseTimeoutRef.current.push(t);
    });
  };

  const cancelShowcase = () => {
    showcaseTimeoutRef.current.forEach(clearTimeout);
    showcaseTimeoutRef.current = [];
    setIsShowcaseRunning(false);
    setShowcaseStep(0);
    setShowcaseMessage('');
  };

  const handleSaveSettings = (newSettings: SettingsConfig) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleAddCustomLead = (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'status' | 'daysStagnant'>) => {
    const created: Lead = {
      ...newLeadData,
      id: `lead-custom-${Date.now()}`,
      status: 'pending',
      daysStagnant: 8,
      createdAt: new Date().toISOString(),
    };
    const updated = [created, ...leads];
    setLeads(updated);
    setSelectedLead(created);
    saveLeads(updated);
    syncLeadToSupabase(created, settings);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-neutral-900">
      
      {/* Top Application Header */}
      <Header
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRunShowcase={runShowcase}
        isShowcaseRunning={isShowcaseRunning}
      />

      {/* 1-Click Automated Showcase Running Banner */}
      <ShowcaseBanner
        isRunning={isShowcaseRunning}
        currentStep={showcaseStep}
        totalSteps={7}
        stepMessage={showcaseMessage}
        onCancel={cancelShowcase}
      />

      {/* Simplified Top Stepper Navigation Bar */}
      <nav className="border-b border-neutral-200 bg-white/95 backdrop-blur-md px-4 py-2.5 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Stepper Buttons (Step 1, 2, 3) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            
            {/* Step 1 Button */}
            <button
              onClick={() => setActiveStep(1)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeStep === 1
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:text-black border border-neutral-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>1. Lead Intake</span>
              <span className="hidden md:inline text-[10px] opacity-75">({selectedLead.studentName})</span>
            </button>

            {/* Step 2 Button */}
            <button
              onClick={() => setActiveStep(2)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeStep === 2
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:text-black border border-neutral-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>2. AI Orchestrator</span>
              {currentAgentStep === 4 && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </button>

            {/* Step 3 Button */}
            <button
              onClick={() => setActiveStep(3)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeStep === 3
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:text-black border border-neutral-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>3. WhatsApp &amp; Telemetry</span>
              {engagementScore >= 75 && (
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-600 text-white font-bold">
                  {engagementScore}%
                </span>
              )}
            </button>

          </div>

          {/* View Mode Toggle: Stepper vs Unified Command Grid */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 text-[11px] hidden lg:inline">View Mode:</span>
            <div className="flex items-center p-0.5 rounded-lg bg-neutral-100 border border-neutral-200">
              <button
                onClick={() => setViewMode('stepper')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  viewMode === 'stepper'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
                title="Simplified step-by-step navigation"
              >
                <Layers className="w-3 h-3" />
                <span>Guided Step</span>
              </button>
              <button
                onClick={() => setViewMode('overview')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  viewMode === 'overview'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black'
                }`}
                title="All-in-one 3-column view"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>3-Panel Grid</span>
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-h-[calc(100vh-8rem)]">
        
        {/* MODE A: GUIDED STEPPER VIEW (Zero Overwhelm, Focused & Spacious) */}
        {viewMode === 'stepper' ? (
          <div className="max-w-5xl mx-auto p-4 sm:p-6">
            
            {/* STEP 1: LEAD INTAKE */}
            {activeStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 font-display">Step 1: Stagnant Lead Intake &amp; Objection Filter</h2>
                    <p className="text-xs text-neutral-500">Select a post-NAT stagnant lead or create a custom evaluator profile.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (currentAgentStep === 4) {
                        setActiveStep(2);
                      } else {
                        runPipeline();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                  >
                    <span>{currentAgentStep === 4 ? 'View Agent Outputs' : 'Run AI Pipeline'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-[650px] border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <LeadHub
                    leads={leads}
                    selectedLead={selectedLead}
                    onSelectLead={(lead) => setSelectedLead(lead)}
                    onAddCustomLead={handleAddCustomLead}
                    onTriggerPipeline={runPipeline}
                    isPipelineRunning={isPipelineRunning}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: AI ORCHESTRATION TERMINAL */}
            {activeStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 font-display">Step 2: Multi-Agent AI Orchestration Terminal</h2>
                    <p className="text-xs text-neutral-500">
                      Coordinated Vector Matcher → Psychographic Scriptwriter (LLM) → Voice Synthesizer
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-black"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Leads</span>
                    </button>
                    <button
                      onClick={() => setActiveStep(3)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                    >
                      <span>Proceed to WhatsApp &amp; Parent View</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="h-[650px] border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <AgentTerminal
                    lead={selectedLead}
                    matchResult={matchResult}
                    scriptOutput={scriptOutput}
                    agentLogs={agentLogs}
                    currentAgentStep={currentAgentStep}
                    executionTimeMs={executionTimeMs}
                    totalTokens={totalTokens}
                    onOpenPortal={() => {
                      setIsPortalOpen(true);
                      recordTelemetry('portal_opened', 25);
                    }}
                    onSelectDeliveryTab={() => setActiveStep(3)}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: PARENT DELIVERY & COUNSELOR TELEMETRY */}
            {activeStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 font-display">Step 3: WhatsApp Parent Experience &amp; Live Telemetry</h2>
                    <p className="text-xs text-neutral-500">
                      Interactive voice note playback, parent ROI portal, and real Webhook counselor escalation.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveStep(2)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-black"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Agent Terminal</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[650px]">
                  
                  {/* Left: WhatsApp Preview */}
                  <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
                    <div className="p-3 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        Parent WhatsApp Mobile View
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">{selectedLead.language}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <DeliveryHub
                        lead={selectedLead}
                        alumnus={matchResult?.alumnus || null}
                        scriptOutput={scriptOutput}
                        audioUrl={audioUrl}
                        engagementScore={engagementScore}
                        telemetryEvents={telemetryEvents}
                        battlecard={battlecard}
                        isGeneratingBattlecard={isGeneratingBattlecard}
                        onRegenerateBattlecard={() => updateBattlecard(selectedLead, matchResult?.alumnus, engagementScore, telemetryEvents, selectedCounselorOverride || battlecard?.assignedCounselor)}
                        onRotateCounselor={handleRotateCounselor}
                        onSelectCounselor={handleSelectCounselor}
                        webhookResult={webhookResult}
                        isWebhookFiring={isWebhookFiring}
                        activeTab="whatsapp"
                        onTabChange={(tab) => setActiveDeliveryTab(tab)}
                        onOpenPortal={() => {
                          setIsPortalOpen(true);
                          recordTelemetry('portal_opened', 25);
                        }}
                        onAudioStarted={() => recordTelemetry('audio_started', 20)}
                        onAudioCompleted={() => recordTelemetry('audio_completed', 25)}
                        onManualTriggerWebhook={() => triggerEscalationWebhook(engagementScore)}
                      />
                    </div>
                  </div>

                  {/* Right: Counselor Telemetry */}
                  <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
                    <div className="p-3 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                        Counselor Escalation Desk &amp; AI Battlecard
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        engagementScore >= 75 ? 'bg-red-600 text-white' : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        Score: {engagementScore}/100
                      </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <DeliveryHub
                        lead={selectedLead}
                        alumnus={matchResult?.alumnus || null}
                        scriptOutput={scriptOutput}
                        audioUrl={audioUrl}
                        engagementScore={engagementScore}
                        telemetryEvents={telemetryEvents}
                        battlecard={battlecard}
                        isGeneratingBattlecard={isGeneratingBattlecard}
                        onRegenerateBattlecard={() => updateBattlecard(selectedLead, matchResult?.alumnus, engagementScore, telemetryEvents, selectedCounselorOverride || battlecard?.assignedCounselor)}
                        onRotateCounselor={handleRotateCounselor}
                        onSelectCounselor={handleSelectCounselor}
                        webhookResult={webhookResult}
                        isWebhookFiring={isWebhookFiring}
                        activeTab="telemetry"
                        onTabChange={(tab) => setActiveDeliveryTab(tab)}
                        onOpenPortal={() => {
                          setIsPortalOpen(true);
                          recordTelemetry('portal_opened', 25);
                        }}
                        onAudioStarted={() => recordTelemetry('audio_started', 20)}
                        onAudioCompleted={() => recordTelemetry('audio_completed', 25)}
                        onManualTriggerWebhook={() => triggerEscalationWebhook(engagementScore)}
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        ) : (
          /* MODE B: 3-PANEL COMMAND CENTER (All 3 Systems Visible at Once) */
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-8rem)]">
            
            {/* PANEL 1: Lead Intake (Left: 3 cols) */}
            <section className="lg:col-span-3 border-b lg:border-b-0 border-neutral-200">
              <LeadHub
                leads={leads}
                selectedLead={selectedLead}
                onSelectLead={(lead) => setSelectedLead(lead)}
                onAddCustomLead={handleAddCustomLead}
                onTriggerPipeline={runPipeline}
                isPipelineRunning={isPipelineRunning}
              />
            </section>

            {/* PANEL 2: Multi-Agent AI Orchestrator (Center: 5 cols) */}
            <section className="lg:col-span-5 border-b lg:border-b-0 border-neutral-200">
              <AgentTerminal
                lead={selectedLead}
                matchResult={matchResult}
                scriptOutput={scriptOutput}
                agentLogs={agentLogs}
                currentAgentStep={currentAgentStep}
                executionTimeMs={executionTimeMs}
                totalTokens={totalTokens}
                onOpenPortal={() => {
                  setIsPortalOpen(true);
                  recordTelemetry('portal_opened', 25);
                }}
                onSelectDeliveryTab={(tab) => setActiveDeliveryTab(tab)}
              />
            </section>

            {/* PANEL 3: Delivery & Counselor Telemetry (Right: 4 cols) */}
            <section className="lg:col-span-4">
              <DeliveryHub
                lead={selectedLead}
                alumnus={matchResult?.alumnus || null}
                scriptOutput={scriptOutput}
                audioUrl={audioUrl}
                engagementScore={engagementScore}
                telemetryEvents={telemetryEvents}
                battlecard={battlecard}
                isGeneratingBattlecard={isGeneratingBattlecard}
                onRegenerateBattlecard={() => updateBattlecard(selectedLead, matchResult?.alumnus, engagementScore, telemetryEvents, selectedCounselorOverride || battlecard?.assignedCounselor)}
                onRotateCounselor={handleRotateCounselor}
                onSelectCounselor={handleSelectCounselor}
                webhookResult={webhookResult}
                isWebhookFiring={isWebhookFiring}
                activeTab={activeDeliveryTab}
                onTabChange={(tab) => setActiveDeliveryTab(tab)}
                onOpenPortal={() => {
                  setIsPortalOpen(true);
                  recordTelemetry('portal_opened', 25);
                }}
                onAudioStarted={() => recordTelemetry('audio_started', 20)}
                onAudioCompleted={() => recordTelemetry('audio_completed', 25)}
                onManualTriggerWebhook={() => triggerEscalationWebhook(engagementScore)}
              />
            </section>

          </div>
        )}

      </main>

      {/* Dynamic Parent ROI Portal Modal */}
      <ParentRoiModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        lead={selectedLead}
        alumnus={matchResult?.alumnus || null}
        onRoiSliderAdjusted={() => recordTelemetry('roi_slider_adjusted', 15)}
      />

      {/* Settings & API Keys Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

    </div>
  );
}

export default App;
