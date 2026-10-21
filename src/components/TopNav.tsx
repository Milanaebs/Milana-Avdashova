import React from 'react';
import { Mic, PhoneOff, FileText, Sparkles } from 'lucide-react';
import { VoiceState } from '../types';

interface TopNavProps {
  voiceState: VoiceState;
  onToggleVoice: () => void;
  onOpenCV: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  voiceState,
  onToggleVoice,
  onOpenCV,
  activeSection,
  onNavigate,
}) => {
  const isLive = voiceState === 'listening' || voiceState === 'speaking' || voiceState === 'connecting';

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE4D9] transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="font-serif text-2xl font-semibold tracking-tight text-[#1C1917] hover:opacity-80 transition-opacity whitespace-nowrap shrink-0"
        >
          Milana Avdashova
        </a>

        {/* Zone 2: 4-5 single-line clean text links with hover underline */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#78716C]">
          <button
            onClick={() => onNavigate('overview')}
            className={`cursor-pointer transition-colors hover:text-[#1C1917] whitespace-nowrap shrink-0 ${
              activeSection === 'overview' ? 'text-[#1C1917] underline underline-offset-6 decoration-[#9A6735]' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('experience')}
            className={`cursor-pointer transition-colors hover:text-[#1C1917] whitespace-nowrap shrink-0 ${
              activeSection === 'experience' ? 'text-[#1C1917] underline underline-offset-6 decoration-[#9A6735]' : ''
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => onNavigate('education')}
            className={`cursor-pointer transition-colors hover:text-[#1C1917] whitespace-nowrap shrink-0 ${
              activeSection === 'education' ? 'text-[#1C1917] underline underline-offset-6 decoration-[#9A6735]' : ''
            }`}
          >
            Education
          </button>
          <button
            onClick={() => onNavigate('competencies')}
            className={`cursor-pointer transition-colors hover:text-[#1C1917] whitespace-nowrap shrink-0 ${
              activeSection === 'competencies' ? 'text-[#1C1917] underline underline-offset-6 decoration-[#9A6735]' : ''
            }`}
          >
            Competencies
          </button>
          <button
            onClick={onOpenCV}
            className="cursor-pointer flex items-center gap-1.5 transition-colors hover:text-[#1C1917] whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-[#9A6735]" />
            <span>Curriculum Vitae</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleVoice}
            className={`cursor-pointer flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-wider font-medium transition-all duration-200 rounded-sm whitespace-nowrap shrink-0 shadow-xs ${
              isLive
                ? 'bg-[#854D0E] text-[#FDFBF7] hover:bg-[#713F12]'
                : 'bg-[#1C1917] text-[#FDFBF7] hover:bg-[#292524]'
            }`}
            title={isLive ? 'End voice call' : 'Start real-time voice call'}
          >
            {isLive ? (
              <>
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Call</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-[#EAE4D9]" />
                <span>Start Voice Call</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
