import React, { useState } from 'react';
import { 
  Flame, Send, PhoneForwarded, CheckCircle2, 
  Radio, RefreshCw, Copy, Check, Sparkles, HelpCircle,
  ExternalLink, ChevronDown, ChevronRight, ShieldCheck, Zap,
  UserCheck, RotateCcw
} from 'lucide-react';
import type { Lead, Alumnus, TelemetryEvent, CounselorBattlecard, CounselorProfile } from '../../types';
import type { WebhookDispatchResult } from '../../services/webhookService';
import { getAssignedCounselorForLead, getEligibleCounselorsForLead } from '../../data/counselorsData';

interface CounselorEscalationProps {
  lead: Lead;
  alumnus: Alumnus | null;
  engagementScore: number;
  telemetryEvents: TelemetryEvent[];
  battlecard: CounselorBattlecard | null;
  isGeneratingBattlecard: boolean;
  onRegenerateBattlecard: () => void;
  onRotateCounselor?: () => void;
  onSelectCounselor?: (counselor: CounselorProfile) => void;
  webhookResult: WebhookDispatchResult | null;
  isWebhookFiring: boolean;
  onManualTriggerWebhook: () => void;
  onOpenPortal: () => void;
}

export const CounselorEscalation: React.FC<CounselorEscalationProps> = ({
  lead,
  alumnus,
  engagementScore,
  telemetryEvents,
  battlecard,
  isGeneratingBattlecard,
  onRegenerateBattlecard,
  onRotateCounselor,
  onSelectCounselor,
  webhookResult,
  isWebhookFiring,
  onManualTriggerWebhook,
}) => {
  const [showTechnicalPayload, setShowTechnicalPayload] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [callSimulated, setCallSimulated] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const counselor = battlecard?.assignedCounselor || getAssignedCounselorForLead(lead);
  const eligibleCounselors = getEligibleCounselorsForLead(lead);
  const counselorIndex = eligibleCounselors.findIndex((c) => c.id === counselor.id);

  const isEscalated = engagementScore >= 75;

  const hasAudioStarted = telemetryEvents.some((e) => e.eventType === 'audio_started');
  const hasAudioCompleted = telemetryEvents.some((e) => e.eventType === 'audio_completed');
  const hasPortalOpened = telemetryEvents.some((e) => e.eventType === 'portal_opened');
  const hasRoiAdjusted = telemetryEvents.some((e) => e.eventType === 'roi_slider_adjusted');

  const handleCopyPitch = () => {
    if (!battlecard?.openingPitchScript) return;
    navigator.clipboard.writeText(battlecard.openingPitchScript);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 1500);
  };

  const handleSimulateCall = () => {
    setCallSimulated(true);
    setTimeout(() => setCallSimulated(false), 3500);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 text-xs font-sans bg-white">
      
      {/* 1. Value Proposition & Business Context Banner (Clean White & Green) */}
      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900 text-xs">
                AI Counselor Escalation Desk &amp; Instant Webhook Gateway
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Active AI Copilot
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
              <strong>Why This Exists:</strong> When a stagnant parent listens to the regional voice note and tests the ROI calculator, they enter an active buying state. Calling within <strong>15 minutes</strong> yields <strong>3.9x higher admissions conversion</strong>. This desk arms the counselor with an AI Call Battlecard and dispatches an instant alert via Webhook.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Critical Engagement Alert Banner (Only when score >= 75) - Fully Expanded & Un-collapsible */}
      {isEscalated && (
        <div className="shrink-0 w-full rounded-xl p-4 bg-red-50 border-2 border-red-500 shadow-sm animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-red-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Flame className="w-4 h-4 fill-white animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-xs sm:text-sm text-red-900 uppercase tracking-tight block">
                  🔥 HIGH-INTENT CONVERSION WINDOW ACTIVE
                </span>
                <span className="text-[11px] text-red-700 font-medium">
                  Parent of <strong>{lead.studentName}</strong> passed critical engagement threshold
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-red-600 text-white shadow-xs">
                SCORE: {engagementScore}/100
              </span>
            </div>
          </div>

          <div className="pt-2.5 space-y-2">
            <p className="text-xs text-red-900 leading-relaxed font-sans">
              Parent <strong>{lead.parentName}</strong> ({lead.parentRelation} of {lead.studentName}) has actively played the verified regional voice note and explored the tuition ROI breakdown. The <strong>15-minute closing window</strong> is active right now.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
              <span className="inline-flex items-center gap-1.5 font-bold text-red-800 bg-red-100/80 px-2.5 py-1 rounded-md border border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                Counselor SLA: Dial parent within 15 mins (3.9x higher conversion)
              </span>

              <button
                type="button"
                onClick={handleSimulateCall}
                className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {callSimulated ? 'Dialing Connected...' : `Quick Dial (${lead.phone})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assigned Regional Admissions Counselor Card & Roster Selector */}
      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              Assigned Regional Counselor
            </span>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-200/70 px-1.5 py-0.5 rounded">
              {counselorIndex >= 0 ? counselorIndex + 1 : 1}/{eligibleCounselors.length} for {lead.language}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className="text-[11px] font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-neutral-200 hover:border-neutral-300 transition-colors shadow-2xs"
              title="Browse all available regional counselors"
            >
              <span>{isPickerOpen ? 'Hide Roster' : 'Switch Counselor'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isPickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {onRotateCounselor && (
              <button
                type="button"
                onClick={onRotateCounselor}
                disabled={isGeneratingBattlecard}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Assign the next eligible regional counselor"
              >
                <RotateCcw className={`w-3 h-3 ${isGeneratingBattlecard ? 'animate-spin' : ''}`} />
                <span>Rotate Next</span>
              </button>
            )}
          </div>
        </div>

        {counselor && (
          <div className="flex items-center gap-3">
            <img
              src={counselor.avatarUrl}
              alt={counselor.name}
              className="w-12 h-12 rounded-xl object-cover border border-neutral-300 shadow-xs shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-neutral-900 text-xs truncate">{counselor.name}</span>
                <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300 shrink-0">
                  {counselor.closingRatePercent}% Win Rate
                </span>
              </div>
              <div className="text-[11px] text-neutral-700 font-medium truncate mt-0.5">
                {counselor.role} • <span className="font-mono text-neutral-500">{counselor.phoneExtension}</span>
              </div>
              <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                Regional Specialty: <span className="text-neutral-700 font-medium">{counselor.regionSpecialty}</span> ({counselor.languages.join(', ')})
              </div>
            </div>
          </div>
        )}

        {/* Dropdown Roster of Eligible Regional Counselors */}
        {isPickerOpen && (
          <div className="pt-2 border-t border-neutral-200 space-y-2 animate-in fade-in duration-150">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-between">
              <span>Select Admissions Counselor ({eligibleCounselors.length} in {lead.language} Cohort)</span>
              <span className="text-[9px] text-neutral-400">Click to assign instantly</span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {eligibleCounselors.map((c) => {
                const isCurrent = c.id === counselor?.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      if (onSelectCounselor) {
                        onSelectCounselor(c);
                      }
                      setIsPickerOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg border transition-all flex items-center gap-2.5 ${
                      isCurrent
                        ? 'bg-emerald-50/90 border-emerald-400 shadow-2xs'
                        : 'bg-white border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50'
                    }`}
                  >
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      className="w-8 h-8 rounded-lg object-cover border border-neutral-300 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-neutral-900 text-[11px] truncate">{c.name}</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 shrink-0">
                          {c.closingRatePercent}% Win
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        {c.role} • {c.regionSpecialty}
                      </div>
                    </div>
                    {isCurrent && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Real-Time AI Conversion Battlecard (Agent 4 Copilot) */}
      <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-neutral-900 text-xs">
                AI Call Strategy Battlecard ({counselor ? `${counselor.name} • Copilot` : 'Admissions Copilot'})
              </span>
              <span className="text-[10px] text-neutral-500 block">
                {battlecard?.modelUsed ? `Generated by ${battlecard.modelUsed}` : 'Active AI Engine'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {battlecard && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                🎯 {battlecard.winProbabilityPercent}% Win Rate
              </span>
            )}
            <button
              onClick={onRegenerateBattlecard}
              disabled={isGeneratingBattlecard}
              className="px-2.5 py-1 rounded text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 flex items-center gap-1 transition-colors"
              title="Re-run AI model with latest telemetry"
            >
              <RefreshCw className={`w-3 h-3 ${isGeneratingBattlecard ? 'animate-spin' : ''}`} />
              <span>{isGeneratingBattlecard ? 'Analyzing...' : 'Refresh AI'}</span>
            </button>
          </div>
        </div>

        {battlecard ? (
          <div className="space-y-3">
            {/* AI Psychology Analysis */}
            <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Parent Psychology Diagnostic
              </span>
              <p className="text-[11px] text-neutral-800 leading-relaxed font-medium">
                {battlecard.parentPsychologyAnalysis}
              </p>
            </div>

            {/* Word-for-Word Spoken Call Opening */}
            <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                  <PhoneForwarded className="w-3 h-3 text-emerald-700" />
                  Exact Spoken Call Opening Line (Phonetic {lead.language} / English)
                </span>
                <button
                  onClick={handleCopyPitch}
                  className="flex items-center gap-1 text-[10px] font-semibold text-emerald-800 hover:text-emerald-950 px-2 py-0.5 rounded bg-white border border-emerald-300"
                >
                  {copiedPitch ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPitch ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-semibold text-neutral-900 leading-relaxed">
                "{battlecard.openingPitchScript}"
              </p>
            </div>

            {/* Objection Counter & Closing Hook */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                  Direct Objection Counter
                </span>
                <p className="text-neutral-800 leading-snug">
                  {battlecard.customObjectionCounter}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">
                  Urgency Closing Hook
                </span>
                <p className="text-neutral-800 leading-snug font-medium">
                  {battlecard.closingHook}
                </p>
              </div>
            </div>

            {/* Call Action Button */}
            <div className="pt-1">
              <button
                onClick={handleSimulateCall}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  callSimulated
                    ? 'bg-neutral-900 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                <PhoneForwarded className="w-3.5 h-3.5" />
                <span>
                  {callSimulated 
                    ? `Dialing ${lead.parentName} (${lead.phone})... Connected!` 
                    : `Call ${lead.parentName} Now (${lead.phone})`}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-neutral-500">
            Click "Refresh AI" to generate the personalized battlecard for this lead.
          </div>
        )}
      </div>

      {/* 4. Live Telemetry Journey Funnel */}
      <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="font-bold text-neutral-900 text-xs">
              Live Parent Engagement Telemetry
            </span>
          </div>
          <span className="font-mono text-neutral-800 font-bold text-xs">
            {engagementScore} / 100
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              engagementScore >= 75
                ? 'bg-red-500'
                : engagementScore >= 40
                ? 'bg-emerald-500'
                : 'bg-neutral-400'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, engagementScore))}%` }}
          />
        </div>

        {/* Funnel Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
          <div className="p-2 rounded bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <span className="flex items-center gap-1 text-neutral-700 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> WhatsApp
            </span>
            <span className="text-[10px] text-emerald-700 font-mono font-bold">+0</span>
          </div>

          <div className={`p-2 rounded border flex items-center justify-between ${
            hasAudioStarted ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
          }`}>
            <span className="flex items-center gap-1">
              <CheckCircle2 className={`w-3 h-3 ${hasAudioStarted ? 'text-emerald-600' : 'text-neutral-400'}`} /> Audio Play
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700">+20</span>
          </div>

          <div className={`p-2 rounded border flex items-center justify-between ${
            hasPortalOpened ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
          }`}>
            <span className="flex items-center gap-1">
              <CheckCircle2 className={`w-3 h-3 ${hasPortalOpened ? 'text-emerald-600' : 'text-neutral-400'}`} /> ROI Portal
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700">+25</span>
          </div>

          <div className={`p-2 rounded border flex items-center justify-between ${
            hasRoiAdjusted ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
          }`}>
            <span className="flex items-center gap-1">
              <CheckCircle2 className={`w-3 h-3 ${hasRoiAdjusted ? 'text-emerald-600' : 'text-neutral-400'}`} /> ROI Slider
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700">+25</span>
          </div>
        </div>
      </div>

      {/* 5. Webhook Instant Alert Notification (Clean Enterprise Sales View) */}
      <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="font-bold text-neutral-900 text-xs">
                Counselor Channel Alert (Webhook Integration)
              </span>
              <span className="text-[10px] text-neutral-500 block">
                Dispatches instant alert to counselor's Discord / Slack channel
              </span>
            </div>
          </div>

          <button
            onClick={onManualTriggerWebhook}
            disabled={isWebhookFiring}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${isWebhookFiring ? 'animate-spin' : ''}`} />
            <span>{isWebhookFiring ? 'Dispatching...' : 'Dispatch Webhook Alert'}</span>
          </button>
        </div>

        {/* Live Alert Preview Card (What the Counselor Sees on Phone/Slack) */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden text-[11px]">
          <div className="px-3 py-2 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Incoming Alert Preview: #admissions-urgent-hot-leads
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">
              {webhookResult ? `HTTP ${webhookResult.statusCode} DELIVERED` : 'STATUS: ARMED'}
            </span>
          </div>

          <div className="p-3.5 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-600 flex items-center gap-1 text-xs">
                🚨 HOT LEAD CONVERSION DISPATCH: {lead.district.toUpperCase()} DESK
              </span>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-mono text-[10px] font-bold">
                SCORE: {engagementScore}/100
              </span>
            </div>

            <p className="text-neutral-700">
              Parent <strong>{lead.parentName}</strong> ({lead.parentRelation} of {lead.studentName}) is actively viewing verified regional ROI proofs.
            </p>

            <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="text-neutral-800">
                <strong>Contact:</strong> {lead.phone} • <strong>Language:</strong> {lead.language}
              </div>
              <div className="text-neutral-800">
                <strong>Matched Alumnus:</strong> {alumnus?.name || 'Sai Teja'} ({alumnus?.hometown || lead.district}) placed at {alumnus?.currentCompany || 'TCS'} (₹{alumnus?.startingCtc || 7.2} LPA)
              </div>
              <div className="text-neutral-900 font-medium pt-1 border-t border-neutral-200">
                <strong>AI Call Pitch:</strong> "{battlecard?.openingPitchScript || 'Namaskaram, this is counselor from NIAT...'}"
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Technical JSON Payload Inspector */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowTechnicalPayload(!showTechnicalPayload)}
            className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            {showTechnicalPayload ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>Technical Webhook Payload Details (JSON)</span>
          </button>

          {showTechnicalPayload && webhookResult && (
            <div className="mt-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-600">
                <span>Destination: {webhookResult.destination}</span>
                <span>Dispatched: {new Date(webhookResult.dispatchedAt).toLocaleTimeString()}</span>
              </div>
              <pre className="p-2 rounded bg-white border border-neutral-200 text-[10px] text-neutral-800 font-mono overflow-x-auto max-h-48">
{JSON.stringify(webhookResult.payloadSent, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
