import React from 'react';
import { Sparkles, Sliders, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import type { SettingsConfig } from '../types';

interface HeaderProps {
  settings: SettingsConfig;
  onOpenSettings: () => void;
  onRunShowcase: () => void;
  isShowcaseRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenSettings,
  onRunShowcase,
  isShowcaseRunning,
}) => {
  const isGroqConfigured = Boolean(settings.groqApiKey?.trim());
  const isGeminiConfigured = Boolean(settings.geminiApiKey?.trim());
  const isWebhookConfigured = Boolean(settings.webhookUrl?.trim());
  const isSupabaseConfigured = Boolean(settings.supabaseUrl?.trim() && settings.supabaseAnonKey?.trim());

  return (
    <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          
          {/* Brand Identity (Refined & Airy) */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs text-emerald-700">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-neutral-900 font-display">
                  NIAT <span className="text-emerald-600 font-extrabold">Project Mirror</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 border border-neutral-200 text-neutral-600">
                  Track B: Bottom-of-Funnel
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50/80 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Engine
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-sans hidden sm:block">
                Demographic Relatability Engine • Post-NAT Conversion Accelerator
              </p>
            </div>
          </div>

          {/* Unified Connected Services Capsule (Sleek, Clean, Un-crowded) */}
          <div className="hidden xl:flex items-center gap-3.5 px-3.5 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs shadow-xs">
            {/* DB */}
            <div className="flex items-center gap-1.5" title="Supabase Database Connection">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
              <span className="text-neutral-500 text-[11px]">DB:</span>
              <span className="text-neutral-800 font-mono text-[11px] font-semibold">
                {isSupabaseConfigured ? 'Supabase Live' : 'Local'}
              </span>
            </div>

            <span className="text-neutral-300 font-light select-none">|</span>

            {/* AI */}
            <div className="flex items-center gap-1.5" title="Active AI Model Engine">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-neutral-500 text-[11px]">AI:</span>
              <span className="text-neutral-800 font-mono text-[11px] font-semibold">
                {isGroqConfigured ? 'Groq Llama-3.3' : isGeminiConfigured ? 'Gemini 1.5' : 'AI Engine'}
              </span>
            </div>

            <span className="text-neutral-300 font-light select-none">|</span>

            {/* Voice */}
            <div className="flex items-center gap-1.5" title="ElevenLabs Vernacular Voice Synthesizer">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-neutral-500 text-[11px]">Voice:</span>
              <span className="text-neutral-800 font-mono text-[11px] font-semibold">
                {settings.elevenLabsApiKey ? 'ElevenLabs' : 'Web Speech'}
              </span>
            </div>

            <span className="text-neutral-300 font-light select-none">|</span>

            {/* Alerts */}
            <div className="flex items-center gap-1.5" title="Counselor Webhook Instant Alert">
              <span className={`w-2 h-2 rounded-full ${isWebhookConfigured ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-neutral-500 text-[11px]">Alerts:</span>
              <span className="text-neutral-800 font-mono text-[11px] font-semibold">
                {isWebhookConfigured ? 'Channel Active' : 'Armed'}
              </span>
            </div>
          </div>

          {/* Header Action Buttons (Spaced & Refined) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* 1-Click Showcase Trigger */}
            <button
              id="btn-run-showcase"
              onClick={onRunShowcase}
              disabled={isShowcaseRunning}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                isShowcaseRunning
                  ? 'bg-neutral-100 text-neutral-400 border border-neutral-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isShowcaseRunning ? 'animate-spin' : 'fill-white'}`} />
              <span>{isShowcaseRunning ? 'Showcase Running...' : 'Run 1-Click Showcase'}</span>
            </button>

            {/* Settings Button */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 transition-colors shadow-xs"
              title="Configure API Keys & Endpoints"
            >
              <Sliders className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
