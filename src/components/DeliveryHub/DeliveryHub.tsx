import React from 'react';
import { Smartphone, Radio, Flame } from 'lucide-react';
import { WhatsAppPreview } from './WhatsAppPreview';
import { CounselorEscalation } from './CounselorEscalation';
import type { Lead, Alumnus, ScriptOutput, TelemetryEvent, CounselorBattlecard, CounselorProfile } from '../../types';
import type { WebhookDispatchResult } from '../../services/webhookService';

interface DeliveryHubProps {
  lead: Lead;
  alumnus: Alumnus | null;
  scriptOutput: ScriptOutput | null;
  audioUrl: string | null;
  engagementScore: number;
  telemetryEvents: TelemetryEvent[];
  battlecard: CounselorBattlecard | null;
  isGeneratingBattlecard: boolean;
  onRegenerateBattlecard: () => void;
  onRotateCounselor?: () => void;
  onSelectCounselor?: (counselor: CounselorProfile) => void;
  webhookResult: WebhookDispatchResult | null;
  isWebhookFiring: boolean;
  activeTab: 'whatsapp' | 'telemetry';
  onTabChange: (tab: 'whatsapp' | 'telemetry') => void;
  onOpenPortal: () => void;
  onAudioStarted: () => void;
  onAudioCompleted: () => void;
  onManualTriggerWebhook: () => void;
}

export const DeliveryHub: React.FC<DeliveryHubProps> = ({
  lead,
  alumnus,
  scriptOutput,
  audioUrl,
  engagementScore,
  telemetryEvents,
  battlecard,
  isGeneratingBattlecard,
  onRegenerateBattlecard,
  onRotateCounselor,
  onSelectCounselor,
  webhookResult,
  isWebhookFiring,
  activeTab,
  onTabChange,
  onOpenPortal,
  onAudioStarted,
  onAudioCompleted,
  onManualTriggerWebhook,
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      
      {/* Top Delivery Hub Navigation Tabs (Crisp White & Green/Red) */}
      <div className="p-3 border-b border-neutral-200 bg-neutral-50/70 flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-neutral-200 shadow-xs">
          
          {/* WhatsApp Tab */}
          <button
            id="tab-whatsapp-preview"
            onClick={() => onTabChange('whatsapp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>WhatsApp Preview</span>
          </button>

          {/* Counselor Telemetry & AI Battlecard Tab */}
          <button
            id="tab-counselor-telemetry"
            onClick={() => onTabChange('telemetry')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'telemetry'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Counselor Desk &amp; AI Battlecard</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
              engagementScore >= 75 ? 'bg-red-600 text-white' : 'bg-neutral-100 text-neutral-700'
            }`}>
              {engagementScore}%
            </span>
          </button>

        </div>

        {engagementScore >= 75 && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 border border-red-300 text-red-700 animate-pulse">
            <Flame className="w-3 h-3 text-red-600 fill-red-600" />
            Escalation Active
          </span>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-hidden bg-white">
        {activeTab === 'whatsapp' ? (
          <WhatsAppPreview
            lead={lead}
            alumnus={alumnus}
            scriptOutput={scriptOutput}
            audioUrl={audioUrl}
            onOpenPortal={onOpenPortal}
            onAudioStarted={onAudioStarted}
            onAudioCompleted={onAudioCompleted}
          />
        ) : (
          <CounselorEscalation
            lead={lead}
            alumnus={alumnus}
            engagementScore={engagementScore}
            telemetryEvents={telemetryEvents}
            battlecard={battlecard}
            isGeneratingBattlecard={isGeneratingBattlecard}
            onRegenerateBattlecard={onRegenerateBattlecard}
            onRotateCounselor={onRotateCounselor}
            onSelectCounselor={onSelectCounselor}
            webhookResult={webhookResult}
            isWebhookFiring={isWebhookFiring}
            onManualTriggerWebhook={onManualTriggerWebhook}
            onOpenPortal={onOpenPortal}
          />
        )}
      </div>

    </div>
  );
};
