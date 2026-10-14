import React, { useState } from 'react';
import { 
  Terminal, Cpu, CheckCircle2, Clock, Zap, ArrowRight, UserCheck, 
  FileText, Volume2, Link as LinkIcon, ExternalLink, Copy, Check
} from 'lucide-react';
import type { Lead, ScriptOutput, AgentExecutionLog } from '../../types';
import type { MatchResult } from '../../services/matcherService';

interface AgentTerminalProps {
  lead: Lead;
  matchResult: MatchResult | null;
  scriptOutput: ScriptOutput | null;
  agentLogs: AgentExecutionLog[];
  currentAgentStep: number;
  executionTimeMs: number;
  totalTokens: number;
  onOpenPortal: () => void;
  onSelectDeliveryTab: (tab: 'whatsapp' | 'telemetry') => void;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  lead,
  matchResult,
  scriptOutput,
  currentAgentStep,
  executionTimeMs,
  totalTokens,
  onOpenPortal,
  onSelectDeliveryTab,
}) => {
  const [activeScriptTab, setActiveScriptTab] = useState<'vernacular' | 'english'>('vernacular');
  const [copiedScript, setCopiedScript] = useState(false);

  const matchedAlum = matchResult?.alumnus;

  const handleCopyScript = () => {
    if (!scriptOutput) return;
    const textToCopy = activeScriptTab === 'vernacular' 
      ? scriptOutput.vernacularScript 
      : scriptOutput.englishTranslation;
    navigator.clipboard.writeText(textToCopy);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200">
      
      {/* Terminal Header (Crisp White & Green) */}
      <div className="p-4 border-b border-neutral-200 bg-neutral-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-900 font-display">
                2. Multi-Agent AI Orchestration Terminal
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                currentAgentStep === 4 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : currentAgentStep > 0 
                  ? 'bg-neutral-900 text-white animate-pulse'
                  : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
              }`}>
                {currentAgentStep === 0 && 'STANDBY'}
                {currentAgentStep === 1 && 'AGENT 1: MATCHING'}
                {currentAgentStep === 2 && 'AGENT 2: SCRIPTWRITER (LLM)'}
                {currentAgentStep === 3 && 'AGENT 3: VOICE & PORTAL'}
                {currentAgentStep === 4 && 'PIPELINE COMPLETE'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Demographic Matcher → Psychographic Scriptwriter → Voice Synthesizer
            </p>
          </div>
        </div>

        {/* Live Metrics: Latency & Tokens */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-2.5 py-1 rounded bg-white border border-neutral-200 flex items-center gap-1.5 text-neutral-700 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{(executionTimeMs / 1000).toFixed(2)}s</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-white border border-neutral-200 flex items-center gap-1.5 text-emerald-700 font-bold shadow-xs">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>{totalTokens} tokens</span>
          </div>
        </div>
      </div>

      {/* Progress Steps (White / Green Minimalist Stepper) */}
      <div className="px-4 py-2 border-b border-neutral-200 bg-white">
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          
          <div className={`p-2 rounded-lg border transition-all ${
            currentAgentStep > 1 
              ? 'bg-emerald-50/50 border-emerald-400 text-emerald-800' 
              : currentAgentStep === 1 
              ? 'bg-neutral-900 border-neutral-900 text-white'
              : 'bg-neutral-50 border-neutral-200 text-neutral-500'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Agent 1: Matcher</span>
              {currentAgentStep > 1 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Demographic Match</div>
          </div>

          <div className={`p-2 rounded-lg border transition-all ${
            currentAgentStep > 2 
              ? 'bg-emerald-50/50 border-emerald-400 text-emerald-800' 
              : currentAgentStep === 2 
              ? 'bg-neutral-900 border-neutral-900 text-white'
              : 'bg-neutral-50 border-neutral-200 text-neutral-500'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Agent 2: Scriptwriter</span>
              {currentAgentStep > 2 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Groq / Gemini LLM</div>
          </div>

          <div className={`p-2 rounded-lg border transition-all ${
            currentAgentStep >= 4 
              ? 'bg-emerald-50/50 border-emerald-400 text-emerald-800' 
              : currentAgentStep === 3 
              ? 'bg-neutral-900 border-neutral-900 text-white'
              : 'bg-neutral-50 border-neutral-200 text-neutral-500'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Agent 3: Synthesizer</span>
              {currentAgentStep >= 4 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">Voice &amp; Portal</div>
          </div>

        </div>
      </div>

      {/* Main Terminal Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans bg-neutral-50/30">
        
        {/* AGENT 1 CARD: DEMOGRAPHIC ALUMNI MATCHER */}
        <div className={`rounded-xl border transition-all ${
          matchResult 
            ? 'bg-white border-neutral-200 shadow-sm' 
            : 'bg-white/40 border-neutral-200 opacity-60'
        }`}>
          <div className="p-3.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-neutral-900">
                Agent 1: Regional Demographic Matcher
              </span>
            </div>
            {matchResult && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono">
                {matchResult.matchScore}% Match
              </span>
            )}
          </div>

          <div className="p-3.5">
            {matchResult && matchedAlum ? (
              <div className="space-y-3">
                
                {/* Match Vector Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-neutral-50 border border-neutral-200">
                    <span className="text-neutral-500 block text-[10px]">District Match</span>
                    <strong className="text-emerald-700 font-semibold">
                      {matchResult.demographicVector.districtMatch ? '✓ Exact Match' : 'Regional Match'}
                    </strong>
                  </div>
                  <div className="p-2 rounded bg-neutral-50 border border-neutral-200">
                    <span className="text-neutral-500 block text-[10px]">Language</span>
                    <strong className="text-emerald-700 font-semibold">✓ {matchedAlum.language}</strong>
                  </div>
                  <div className="p-2 rounded bg-neutral-50 border border-neutral-200">
                    <span className="text-neutral-500 block text-[10px]">Addressed Objection</span>
                    <strong className="text-emerald-700 font-semibold">✓ Overcome</strong>
                  </div>
                  <div className="p-2 rounded bg-neutral-50 border border-neutral-200">
                    <span className="text-neutral-500 block text-[10px]">Starting Salary</span>
                    <strong className="text-emerald-700 font-mono font-bold">₹{matchedAlum.startingCtc} LPA</strong>
                  </div>
                </div>

                {/* Matched Alumnus Profile Card */}
                <div className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-xs flex items-start gap-3.5">
                  <img
                    src={matchedAlum.avatarUrl}
                    alt={matchedAlum.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-neutral-900 text-sm">{matchedAlum.name}</div>
                      <span className="text-[10px] text-neutral-500 font-mono">Class of {matchedAlum.gradYear}</span>
                    </div>
                    <div className="text-xs text-neutral-700 font-medium mt-0.5">
                      {matchedAlum.role} • <span className="text-emerald-700 font-bold">{matchedAlum.currentCompany}</span> (₹{matchedAlum.startingCtc} LPA)
                    </div>
                    <div className="text-[11px] text-neutral-600 mt-1">
                      Hometown: <strong className="text-neutral-900">{matchedAlum.hometown}, {matchedAlum.district} ({matchedAlum.state})</strong>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      Family: <em>{matchedAlum.familyBackground}</em>
                    </div>
                    <div className="mt-2 text-[11px] p-2 rounded bg-neutral-50 border border-neutral-200 text-neutral-700">
                      <strong>Demographic Match Rationale:</strong> {matchResult.rationale}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-neutral-400 py-3 text-center">
                Select a lead and click "Trigger AI Relatability Pipeline" to match alumni.
              </div>
            )}
          </div>
        </div>

        {/* AGENT 2 CARD: PSYCHOGRAPHIC SCRIPTWRITER (REAL LLM CALL) */}
        <div className={`rounded-xl border transition-all ${
          scriptOutput 
            ? 'bg-white border-neutral-200 shadow-sm' 
            : 'bg-white/40 border-neutral-200 opacity-60'
        }`}>
          <div className="p-3.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-neutral-900">
                  Agent 2: Psychographic Scriptwriter (Groq / Gemini LLM)
                </span>
                <span className="text-[10px] text-neutral-500 block">
                  Targeted at {lead.parentRelation} {lead.parentName} in {lead.language}
                </span>
              </div>
            </div>

            {scriptOutput && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {scriptOutput.modelUsed || 'Groq llama-3.3-70b-versatile'}
                </span>
                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-neutral-50 text-[11px] text-neutral-700 border border-neutral-200 shadow-xs"
                >
                  {copiedScript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedScript ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="p-3.5">
            {scriptOutput ? (
              <div className="space-y-3">
                
                {/* Tabs */}
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <button
                    onClick={() => setActiveScriptTab('vernacular')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      activeScriptTab === 'vernacular'
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Vernacular Script ({lead.language})
                  </button>
                  <button
                    onClick={() => setActiveScriptTab('english')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      activeScriptTab === 'english'
                        ? 'bg-neutral-900 text-white font-bold shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    English Translation (Review)
                  </button>
                </div>

                {/* Tab 1: Vernacular Script */}
                {activeScriptTab === 'vernacular' && (
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <p className="text-sm font-semibold text-neutral-900 leading-relaxed font-sans">
                      "{scriptOutput.vernacularScript}"
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
                      <span className="text-neutral-500">Emotional Anchors:</span>
                      {scriptOutput.voiceEmphasis?.map((emp, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-emerald-700 font-mono font-medium">
                          {emp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: English Translation */}
                {activeScriptTab === 'english' && (
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <p className="text-xs text-neutral-800 leading-relaxed font-sans font-medium">
                      "{scriptOutput.englishTranslation}"
                    </p>
                    <div className="mt-3 p-2 rounded bg-white text-[11px] text-neutral-700 border border-neutral-200">
                      <strong className="text-neutral-900">Intent:</strong> {scriptOutput.tone} • {scriptOutput.keyAnchorPoint}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-neutral-400 py-3 text-center">
                Waiting for Agent 2... Will generate personalized vernacular script addressing "{lead.objection}".
              </div>
            )}
          </div>
        </div>

        {/* AGENT 3 CARD: VOICE & DYNAMIC ARTIFACT SYNTHESIZER */}
        <div className={`rounded-xl border transition-all ${
          currentAgentStep >= 4 
            ? 'bg-white border-neutral-200 shadow-sm' 
            : 'bg-white/40 border-neutral-200 opacity-60'
        }`}>
          <div className="p-3.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Volume2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-neutral-900">
                Agent 3: Voice Note &amp; Dynamic Portal Synthesizer
              </span>
            </div>
            {currentAgentStep >= 4 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono">
                Ready
              </span>
            )}
          </div>

          <div className="p-3.5">
            {currentAgentStep >= 4 && matchedAlum ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* Voice Note Artifact */}
                  <div className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                        ElevenLabs Audio
                      </span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">18.2s Duration</span>
                    </div>
                    <p className="text-[11px] text-neutral-600">
                      Generated real speech in {lead.language} via ElevenLabs Multilingual v2.
                    </p>
                    <button
                      onClick={() => onSelectDeliveryTab('whatsapp')}
                      className="mt-2.5 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Preview in WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Dynamic Parent Portal Link */}
                  <div className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-neutral-700" />
                        Dynamic ROI Link
                      </span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">Verified</span>
                    </div>
                    <div className="p-1.5 rounded bg-neutral-50 border border-neutral-200 text-[10px] text-neutral-700 font-mono truncate">
                      niat.edu.in/portal?lead_id={lead.id}&match_id={matchedAlum.id}
                    </div>
                    <button
                      onClick={onOpenPortal}
                      className="mt-2.5 w-full py-2 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Open Verified ROI Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              <div className="text-neutral-400 py-3 text-center">
                Waiting for Agent 3... Will synthesize speech and generate dynamic verified portal link.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Terminal Log Console Footer */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50 font-mono text-[11px] text-neutral-600 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <Terminal className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">
            {currentAgentStep === 4 
              ? `Success: Generated assets for ${lead.studentName} (${lead.district})`
              : currentAgentStep > 0
              ? `Running Agent ${currentAgentStep} for ${lead.parentName}...`
              : `Standing by. Select lead to run pipeline.`}
          </span>
        </div>
        <span className="text-[10px] text-neutral-400 shrink-0">v2.8-mirror</span>
      </div>

    </div>
  );
};
