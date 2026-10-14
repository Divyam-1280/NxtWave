import React, { useState } from 'react';
import { X, Key, Send, Database, Volume2, Check, AlertCircle } from 'lucide-react';
import type { SettingsConfig } from '../types';
import { testWebhookEndpoint } from '../services/webhookService';
import { testSupabaseConnection } from '../services/supabaseService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsConfig;
  onSaveSettings: (settings: SettingsConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<SettingsConfig>({ ...settings });
  const [testWebhookStatus, setTestWebhookStatus] = useState<{ loading: boolean; message: string; success?: boolean } | null>(null);
  const [testDbStatus, setTestDbStatus] = useState<{ loading: boolean; message: string; success?: boolean } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleTestWebhook = async () => {
    if (!formData.webhookUrl) {
      setTestWebhookStatus({ loading: false, message: 'Please enter a webhook URL first.', success: false });
      return;
    }
    setTestWebhookStatus({ loading: true, message: 'Sending test ping...' });
    const res = await testWebhookEndpoint(formData.webhookUrl);
    setTestWebhookStatus({ loading: false, message: res.message, success: res.success });
  };

  const handleTestSupabase = async () => {
    setTestDbStatus({ loading: true, message: 'Verifying connection...' });
    const res = await testSupabaseConnection(formData.supabaseUrl, formData.supabaseAnonKey);
    setTestDbStatus({ loading: false, message: res.message, success: res.isConnected });
  };

  const handleSave = () => {
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 font-display">System Settings &amp; API Configuration</h2>
              <p className="text-xs text-neutral-500">Live API keys for Groq, ElevenLabs, Gemini &amp; Webhooks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-700 bg-white">
          
          {/* Section 1: AI Engine (Groq / Gemini) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-600" />
                1. AI Model Engine (Groq / Gemini API)
              </label>
              <span className="text-[11px] text-emerald-700 font-mono font-bold">Active in .env</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">Groq API Key</label>
                <input
                  type="password"
                  placeholder="gsk_..."
                  value={formData.groqApiKey}
                  onChange={(e) => setFormData({ ...formData, groqApiKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">Groq Model</label>
                <select
                  value={formData.groqModel}
                  onChange={(e) => setFormData({ ...formData, groqModel: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
                  <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Fast)</option>
                  <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy... / Gemini Key"
                  value={formData.geminiApiKey}
                  onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">Gemini Model</label>
                <select
                  value={formData.geminiModel}
                  onChange={(e) => setFormData({ ...formData, geminiModel: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Recommended)</option>
                  <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Voice Engine */}
          <div className="space-y-3 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                2. Voice Engine (ElevenLabs API / Web Speech Fallback)
              </label>
              <span className="text-[11px] text-emerald-700 font-mono font-bold">Verified Key in .env</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">ElevenLabs API Key</label>
                <input
                  type="password"
                  placeholder="sk_..."
                  value={formData.elevenLabsApiKey}
                  onChange={(e) => setFormData({ ...formData, elevenLabsApiKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">Voice ID</label>
                <input
                  type="text"
                  placeholder="JBFqnCBsd6RMkjVDRZzb"
                  value={formData.elevenLabsVoiceId}
                  onChange={(e) => setFormData({ ...formData, elevenLabsVoiceId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Webhook Gateway */}
          <div className="space-y-3 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                3. Real Alert Integration (Discord / Telegram Webhook)
              </label>
              <span className="text-[11px] text-red-600 font-bold">Fires when score &gt; 75</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                Discord Webhook URL or Webhook Tester (e.g. Discord Channel)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={testWebhookStatus?.loading}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shrink-0 shadow-sm"
                >
                  {testWebhookStatus?.loading ? 'Testing...' : 'Test Webhook'}
                </button>
              </div>
              {testWebhookStatus && (
                <div className={`mt-2 p-2 rounded text-xs flex items-center gap-1.5 ${
                  testWebhookStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-700 border border-red-300'
                }`}>
                  {testWebhookStatus.success ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{testWebhookStatus.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Supabase State Store */}
          <div className="space-y-3 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-neutral-600" />
                4. Database &amp; State Store (Supabase)
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                {formData.supabaseUrl ? 'Supabase Configured in .env' : 'Local persistent storage active'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">Supabase URL</label>
                <input
                  type="text"
                  placeholder="https://xyz.supabase.co"
                  value={formData.supabaseUrl}
                  onChange={(e) => setFormData({ ...formData, supabaseUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">Publishable / Anon Key</label>
                <input
                  type="password"
                  placeholder="sb_publishable_... or eyJhbGciOi..."
                  value={formData.supabaseAnonKey}
                  onChange={(e) => setFormData({ ...formData, supabaseAnonKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs font-mono"
                />
              </div>
            </div>

            {formData.supabaseUrl && (
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleTestSupabase}
                  className="text-xs text-emerald-700 hover:underline font-semibold"
                >
                  Verify Supabase Connection
                </button>
                {testDbStatus && (
                  <span className={`text-xs ${testDbStatus.success ? 'text-emerald-700' : 'text-red-600'}`}>
                    {testDbStatus.message}
                  </span>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
          >
            {isSaved ? <Check className="w-4 h-4" /> : null}
            <span>{isSaved ? 'Saved!' : 'Save & Apply Configuration'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
