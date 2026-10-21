import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Globe, Sparkles } from 'lucide-react';
import { VoiceState } from '../types';

interface VoiceAssistantOrbProps {
  voiceState: VoiceState;
  onToggleVoice: () => void;
  audioAnalyser: AnalyserNode | null;
}

export const VoiceAssistantOrb: React.FC<VoiceAssistantOrbProps> = ({
  voiceState,
  onToggleVoice,
  audioAnalyser,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const dataArray = audioAnalyser ? new Uint8Array(audioAnalyser.frequencyBinCount) : null;

    const render = () => {
      phase += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      let energy = 0;
      if (audioAnalyser && dataArray) {
        audioAnalyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        energy = sum / (dataArray.length * 255);
      }

      const isSpeaking = voiceState === 'speaking';
      const isListening = voiceState === 'listening';
      const isConnecting = voiceState === 'connecting';

      const baseRadius = 56 + (isSpeaking ? energy * 36 : isListening ? energy * 20 : 0);

      // Subtle ambient outer glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.4,
        centerX,
        centerY,
        baseRadius * 1.6
      );

      if (isSpeaking) {
        gradient.addColorStop(0, 'rgba(154, 103, 53, 0.45)');
        gradient.addColorStop(0.5, 'rgba(180, 83, 9, 0.20)');
        gradient.addColorStop(1, 'rgba(253, 251, 247, 0)');
      } else if (isListening) {
        gradient.addColorStop(0, 'rgba(113, 63, 18, 0.35)');
        gradient.addColorStop(0.6, 'rgba(161, 98, 7, 0.15)');
        gradient.addColorStop(1, 'rgba(253, 251, 247, 0)');
      } else if (isConnecting) {
        gradient.addColorStop(0, 'rgba(120, 113, 108, 0.25)');
        gradient.addColorStop(1, 'rgba(253, 251, 247, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(214, 207, 195, 0.30)');
        gradient.addColorStop(1, 'rgba(253, 251, 247, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Fluid orbital contour lines
      const rings = isSpeaking ? 4 : isListening ? 3 : 2;
      for (let r = 0; r < rings; r++) {
        ctx.beginPath();
        const ringRadius = baseRadius + r * 14;
        const points = 64;

        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const waveAmp = (isSpeaking ? 6 : isListening ? 3 : 1) * Math.sin(angle * (3 + r) + phase + r);
          const currentR = ringRadius + waveAmp;
          const x = centerX + Math.cos(angle) * currentR;
          const y = centerY + Math.sin(angle) * currentR;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        const strokeAlpha = (1 - r / (rings + 1)) * (isSpeaking ? 0.6 : isListening ? 0.4 : 0.2);
        ctx.strokeStyle = `rgba(154, 103, 53, ${strokeAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [voiceState, audioAnalyser]);

  const getStateDescription = () => {
    switch (voiceState) {
      case 'connecting':
        return 'Establishing voice link with Milana...';
      case 'listening':
        return 'Listening... speak in English or Russian';
      case 'speaking':
        return 'Milana is speaking...';
      case 'processing':
        return 'Thinking...';
      case 'error':
        return 'Connection issue · Click to retry';
      default:
        return 'Voice standby · Click to start conversation';
    }
  };

  const isLive = voiceState === 'listening' || voiceState === 'speaking' || voiceState === 'connecting';

  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-[#F9F6F0] border border-[#EAE4D9] rounded-xl transition-all">
      {/* Accent Header Ribbon */}
      <div className="w-full flex items-center justify-between pb-6 mb-4 border-b border-[#EAE4D9] text-xs text-[#78716C]">
        <div className="flex items-center gap-2">
          <span className="font-serif italic text-[#1C1917] text-sm font-medium">Milana Avdashova</span>
          <span aria-hidden="true">·</span>
          <span>Voice Persona</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-[#9A6735]" />
          <span>EN (American) / RU (Russian)</span>
        </div>
      </div>

      {/* Visualizer Canvas & Central Orb */}
      <div className="relative w-64 h-64 flex items-center justify-center my-2">
        <canvas
          ref={canvasRef}
          width={256}
          height={256}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Central Clickable Core */}
        <button
          onClick={onToggleVoice}
          className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-md ${
            isLive
              ? 'bg-[#1C1917] text-[#FDFBF7] hover:scale-105'
              : 'bg-[#FDFBF7] text-[#1C1917] border border-[#D6CFC3] hover:border-[#9A6735] hover:scale-105'
          }`}
          title={isLive ? 'End voice call' : 'Start live voice call'}
          aria-label={isLive ? 'End voice conversation' : 'Start voice conversation'}
        >
          {voiceState === 'speaking' ? (
            <Volume2 className="w-8 h-8 text-[#9A6735] animate-pulse" />
          ) : voiceState === 'listening' ? (
            <Mic className="w-8 h-8 text-[#FDFBF7] animate-bounce" />
          ) : voiceState === 'connecting' ? (
            <Sparkles className="w-8 h-8 text-[#9A6735] animate-spin" />
          ) : (
            <Mic className="w-8 h-8 text-[#9A6735]" />
          )}

          <span className="text-[10px] uppercase tracking-widest mt-1 font-medium text-[#78716C]">
            {isLive ? 'Live' : 'Connect'}
          </span>
        </button>
      </div>

      {/* Status prose */}
      <div className="text-center mt-3">
        <p className="font-serif text-lg text-[#1C1917] font-medium tracking-tight">
          {getStateDescription()}
        </p>
        <p className="text-xs text-[#78716C] mt-1 max-w-sm">
          Natural woman tone · Poised American accent for English · Fluent Russian accent for Russian
        </p>
      </div>
    </div>
  );
};
