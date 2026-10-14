import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, CheckCheck, ExternalLink, ChevronRight, 
  Sparkles, PhoneCall, Video, MoreVertical, Paperclip, Smile, Mic, ArrowLeft
} from 'lucide-react';
import type { Lead, Alumnus, ScriptOutput } from '../../types';
import { playNativeSpeech, stopNativeSpeech } from '../../services/voiceService';

interface WhatsAppPreviewProps {
  lead: Lead;
  alumnus: Alumnus | null;
  scriptOutput: ScriptOutput | null;
  audioUrl: string | null;
  onOpenPortal: () => void;
  onAudioStarted: () => void;
  onAudioCompleted: () => void;
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  lead,
  alumnus,
  scriptOutput,
  audioUrl,
  onOpenPortal,
  onAudioStarted,
  onAudioCompleted,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(18);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [audioUrl]);

  const togglePlayAudio = () => {
    if (!audioRef.current && !audioUrl) {
      if (isPlaying) {
        stopNativeSpeech();
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        onAudioStarted();
        if (scriptOutput) {
          playNativeSpeech(scriptOutput.vernacularScript, lead.language);
        }
        const interval = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= 18) {
              clearInterval(interval);
              setIsPlaying(false);
              onAudioCompleted();
              return 18;
            }
            return prev + 1;
          });
        }, 1000);
      }
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        stopNativeSpeech();
      } else {
        audioRef.current.play().catch((err) => {
          console.warn('Audio play error, using speech fallback', err);
          if (scriptOutput) {
            playNativeSpeech(scriptOutput.vernacularScript, lead.language);
          }
        });
        setIsPlaying(true);
        onAudioStarted();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(Math.round(audioRef.current.duration));
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
    onAudioCompleted();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const waveformHeights = [
    30, 60, 45, 80, 100, 65, 40, 75, 90, 50, 85, 95, 40, 70, 85, 60, 45, 90, 75, 55, 65, 40, 30, 20
  ];

  return (
    <div className="flex flex-col h-full items-center justify-center p-3">
      
      {/* Mobile Frame (Sleek Dark Chassis with Green Accents) */}
      <div className="w-full max-w-[340px] bg-[#0c1317] border border-neutral-700 rounded-[30px] shadow-2xl overflow-hidden flex flex-col h-[580px] relative">
        
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnded}
            preload="auto"
          />
        )}

        {/* Top Speaker Notch */}
        <div className="w-full bg-[#1f2c34] pt-2 pb-1 flex justify-center">
          <div className="w-20 h-3 bg-[#0b141a] rounded-full flex items-center justify-end px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
          </div>
        </div>

        {/* WhatsApp Header */}
        <div className="bg-[#1f2c34] px-3 py-2 flex items-center justify-between text-white border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-neutral-300" />
            <div className="relative">
              <img
                src={alumnus?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-emerald-500"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-[#1f2c34]" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs truncate flex items-center gap-1">
                <span>NIAT Alumni Desk</span>
                <span className="text-[10px] text-emerald-400">✓</span>
              </div>
              <div className="text-[10px] text-neutral-400 truncate">
                {alumnus ? `${alumnus.district} Region` : 'Verified Admissions'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-neutral-400">
            <Video className="w-4 h-4" />
            <PhoneCall className="w-4 h-4" />
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        {/* WhatsApp Chat Conversation Area */}
        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#0b141a]">
          {/* Timestamp Pill */}
          <div className="flex justify-center">
            <span className="px-2.5 py-0.5 rounded bg-[#182229] text-[10px] text-neutral-400 font-medium">
              Today
            </span>
          </div>

          {/* Incoming Vernacular Message Bubble */}
          <div className="max-w-[92%] bg-[#1f2c34] rounded-2xl rounded-tl-sm p-3 text-white shadow-md border border-neutral-700/60 space-y-2.5">
            
            {/* Sender Subtitle */}
            <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold border-b border-neutral-700 pb-1">
              <span>{alumnus ? `${alumnus.name} (${alumnus.currentCompany})` : 'NIAT Regional Alumnus'}</span>
              <span className="text-neutral-400 font-mono text-[9px]">
                {scriptOutput?.modelUsed ? `⚡ ${scriptOutput.modelUsed}` : '10:42 AM'}
              </span>
            </div>

            {/* Vernacular Text */}
            <p className="text-xs text-neutral-100 leading-relaxed font-sans">
              {scriptOutput?.vernacularScript || 'నమస్కారం, మీ జిల్లా నుండి NIAT ద్వారా చదివిన విద్యార్థి అనుభవం ఇక్కడ వినండి.'}
            </p>

            {/* Translation Toggle */}
            {scriptOutput?.englishTranslation && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowEnglishTranslation(!showEnglishTranslation)}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
                >
                  <span>{showEnglishTranslation ? 'Hide' : 'Translate to English'}</span>
                </button>
                {showEnglishTranslation && (
                  <p className="text-[11px] text-neutral-300 italic mt-1.5 p-2 rounded bg-neutral-900 border border-neutral-800">
                    "{scriptOutput.englishTranslation}"
                  </p>
                )}
              </div>
            )}

            {/* Playable Voice Note */}
            <div className="p-2 rounded-xl bg-[#111b21] border border-neutral-700 space-y-2">
              <div className="flex items-center gap-2.5">
                
                {/* Play / Pause Circular Button (Sleek Green) */}
                <button
                  id="btn-play-voicenote"
                  type="button"
                  onClick={togglePlayAudio}
                  className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shrink-0 shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-black" />
                  ) : (
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  )}
                </button>

                {/* Animated Waveform Visualizer */}
                <div className="flex-1 flex items-center gap-0.5 h-7 px-1">
                  {waveformHeights.map((h, i) => {
                    const progressRatio = duration > 0 ? currentTime / duration : 0;
                    const barRatio = i / waveformHeights.length;
                    const isPlayed = barRatio <= progressRatio;

                    return (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlayed 
                            ? 'bg-emerald-400' 
                            : 'bg-neutral-700'
                        } ${isPlaying ? 'animate-pulse' : ''}`}
                        style={{ height: `${Math.max(4, (h / 100) * 24)}px` }}
                      />
                    );
                  })}
                </div>

                <div className="text-[10px] text-neutral-400 font-mono shrink-0">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Scrubber slider */}
              <input
                type="range"
                min="0"
                max={duration || 18}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Clickable Outcome & ROI Link Card */}
            <div
              id="card-open-parent-portal"
              onClick={onOpenPortal}
              className="rounded-xl bg-[#111b21] border border-emerald-500/50 p-2.5 hover:border-emerald-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Outcome &amp; ROI Certificate
                </span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-[10px] text-neutral-300">
                Verified offer letter &amp; tuition payback for {lead.district} students.
              </div>
              <div className="mt-2 flex items-center justify-between pt-1 border-t border-neutral-800 text-[9px] text-neutral-400">
                <span>niat.edu.in/portal/roi</span>
                <span className="text-emerald-400 font-bold flex items-center">
                  Open Verified Portal <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Read Receipts */}
            <div className="flex items-center justify-end gap-1 text-[10px] text-neutral-400">
              <span>Read</span>
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>

          </div>
        </div>

        {/* WhatsApp Bottom Mockup */}
        <div className="bg-[#1f2c34] px-2 py-2 flex items-center gap-1.5 border-t border-neutral-800">
          <Smile className="w-5 h-5 text-neutral-400" />
          <Paperclip className="w-5 h-5 text-neutral-400" />
          <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-xs text-neutral-400">
            Reply to counselor...
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold">
            <Mic className="w-4 h-4" />
          </div>
        </div>

      </div>

      <div className="text-center mt-2.5">
        <span className="text-[11px] text-neutral-400">
          Click <strong className="text-emerald-400">Play</strong> or <strong className="text-white">Open Verified Portal</strong> to simulate parent engagement.
        </span>
      </div>

    </div>
  );
};
