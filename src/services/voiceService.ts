import type { Language, SettingsConfig } from '../types';

export interface VoiceSynthesisResult {
  audioUrl: string | null;
  durationSeconds: number;
  engineUsed: 'ElevenLabs API' | 'Web Speech API (Human Voice)';
  voiceName: string;
}

// Recommended active voices on ElevenLabs:
// JBFqnCBsd6RMkjVDRZzb -> George (Warm, Captivating Storyteller)
// EXAVITQu4vr4xnSDxMaL -> Sarah (Mature, Reassuring, Confident)
const DEFAULT_ELEVENLABS_VOICE = 'JBFqnCBsd6RMkjVDRZzb';

export async function synthesizeVoiceNote(
  text: string,
  language: Language,
  settings: SettingsConfig
): Promise<VoiceSynthesisResult> {
  const apiKey = settings.elevenLabsApiKey?.trim() || import.meta.env.VITE_ELEVENLABS_API_KEY || '';
  const voiceId = settings.elevenLabsVoiceId?.trim() || DEFAULT_ELEVENLABS_VOICE;

  // 1. Call REAL ElevenLabs API with user's key
  if (apiKey && apiKey.length > 10) {
    try {
      console.log(`[ElevenLabs] Calling TTS with voiceId: ${voiceId}`);
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.65,
            similarity_boost: 0.8,
            style: 0.2,
          },
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        console.log(`[ElevenLabs] Real audio blob generated successfully (${blob.size} bytes)`);
        return {
          audioUrl,
          durationSeconds: 18,
          engineUsed: 'ElevenLabs API',
          voiceName: 'ElevenLabs Multilingual v2 (George)',
        };
      } else {
        const errText = await response.text();
        console.warn(`[ElevenLabs] Error (${response.status}):`, errText);
      }
    } catch (e) {
      console.warn('[ElevenLabs] Network exception, falling back to Web Speech:', e);
    }
  }

  // 2. Real Human Speech Synthesis Fallback (NO BEEPING SOUNDS)
  const langCodeMap: Record<Language, string> = {
    Telugu: 'te-IN',
    Tamil: 'ta-IN',
    Hindi: 'hi-IN',
    Kannada: 'kn-IN',
    Malayalam: 'ml-IN',
    English: 'en-IN',
  };

  const code = langCodeMap[language] || 'en-IN';
  let matchedVoice = 'Browser Natural Speech';

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices();
    const found = voices.find((v) => v.lang.startsWith(code.slice(0, 2)) || v.lang === code);
    if (found) {
      matchedVoice = `${found.name} (${found.lang})`;
    }
  }

  return {
    audioUrl: null, // Signals audio player to trigger real Web Speech spoken voice out loud
    durationSeconds: 16,
    engineUsed: 'Web Speech API (Human Voice)',
    voiceName: matchedVoice,
  };
}

/**
 * Triggers native SpeechSynthesis speaking actual human words out loud
 */
export function playNativeSpeech(text: string, language: Language, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langCodeMap: Record<Language, string> = {
      Telugu: 'te-IN',
      Tamil: 'ta-IN',
      Hindi: 'hi-IN',
      Kannada: 'kn-IN',
      Malayalam: 'ml-IN',
      English: 'en-IN',
    };
    utterance.lang = langCodeMap[language] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    if (onEnd) {
      utterance.onend = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Native speech playback failed', e);
  }
}

export function stopNativeSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
