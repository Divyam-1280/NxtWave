import { SettingsConfig, Lead, TelemetryEvent } from '../types';
import { INITIAL_LEADS } from '../data/leadsData';

const SETTINGS_KEY = 'niat_project_mirror_settings_v2';
const LEADS_KEY = 'niat_project_mirror_leads_v2';
const TELEMETRY_KEY = 'niat_project_mirror_telemetry_v2';

// Read API keys from environment
const envGroqKey = import.meta.env.VITE_GROQ_API_KEY || '';
const envElevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
const envGeminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envSupabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const DEFAULT_SETTINGS: SettingsConfig = {
  groqApiKey: envGroqKey,
  geminiApiKey: envGeminiKey,
  selectedAiProvider: 'groq',
  groqModel: 'llama-3.3-70b-versatile',
  geminiModel: 'gemini-1.5-flash',
  elevenLabsApiKey: envElevenLabsKey,
  elevenLabsVoiceId: 'JBFqnCBsd6RMkjVDRZzb', // George - Warm Storyteller (Active)
  webhookUrl: '',
  webhookPlatform: 'discord',
  supabaseUrl: envSupabaseUrl,
  supabaseAnonKey: envSupabaseKey,
  isDemoFallbackMode: false, // Real API mode active with user keys!
};

export const loadSettings = (): SettingsConfig => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    
    // Sanitize obsolete or invalid model names
    const groqModel = !parsed.groqModel || parsed.groqModel.includes('openai') || parsed.groqModel.includes('gpt-oss')
      ? 'llama-3.3-70b-versatile'
      : parsed.groqModel;

    const geminiModel = !parsed.geminiModel || parsed.geminiModel.includes('3.8')
      ? 'gemini-1.5-flash'
      : parsed.geminiModel;

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      groqApiKey: parsed.groqApiKey || envGroqKey,
      geminiApiKey: parsed.geminiApiKey || envGeminiKey,
      elevenLabsApiKey: parsed.elevenLabsApiKey || envElevenLabsKey,
      supabaseUrl: parsed.supabaseUrl || envSupabaseUrl,
      supabaseAnonKey: parsed.supabaseAnonKey || envSupabaseKey,
      groqModel,
      geminiModel,
    };
  } catch (e) {
    console.warn('Failed to load settings from localStorage, using defaults', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: SettingsConfig): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
};

export const loadLeads = (): Lead[] => {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) return INITIAL_LEADS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_LEADS;
  } catch (e) {
    return INITIAL_LEADS;
  }
};

export const saveLeads = (leads: Lead[]): void => {
  try {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error('Failed to save leads', e);
  }
};

export const loadTelemetry = (): TelemetryEvent[] => {
  try {
    const raw = localStorage.getItem(TELEMETRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveTelemetryEvent = (event: TelemetryEvent): void => {
  try {
    const events = loadTelemetry();
    events.unshift(event);
    localStorage.setItem(TELEMETRY_KEY, JSON.stringify(events.slice(0, 100)));
  } catch (e) {
    console.error('Failed to save telemetry', e);
  }
};
