import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, Mic, MicOff, Sparkles, MessageSquare, CornerDownLeft } from 'lucide-react';
import { ChatMessage, VoiceState } from '../types';

interface ConversationPanelProps {
  messages: ChatMessage[];
  voiceState: VoiceState;
  onSendMessage: (text: string) => void;
  onToggleVoice: () => void;
  onReplayAudio: (text: string, audioBase64?: string) => void;
  isAudioPlaying: boolean;
}

const SUGGESTED_PROMPTS = [
  {
    lang: 'EN',
    text: "Tell me about your audit experience at Sirius Audit OÜ",
  },
  {
    lang: 'RU',
    text: "Расскажи о себе, учебе в EBS и опыте в аудите",
  },
  {
    lang: 'EN',
    text: "What software tools and accounting systems do you use?",
  },
  {
    lang: 'RU',
    text: "Как спорт сформировал твою дисциплину и упорство?",
  },
];

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  voiceState,
  onSendMessage,
  onToggleVoice,
  onReplayAudio,
  isAudioPlaying,
}) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const isLive = voiceState === 'listening' || voiceState === 'speaking' || voiceState === 'connecting';

  return (
    <div className="flex flex-col h-full bg-[#F9F6F0] border border-[#EAE4D9] rounded-xl overflow-hidden">
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-[#EAE4D9] bg-[#FDFBF7] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#9A6735]" />
          <h3 className="font-serif text-lg font-medium text-[#1C1917]">
            Dialogue & Transcript
          </h3>
        </div>
        <div className="text-xs text-[#78716C] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#9A6735]" />
          <span>Feminine Voice · Multilingual</span>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="px-6 py-3 border-b border-[#EAE4D9] bg-[#F8F5EE]/60 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#78716C] uppercase tracking-wider text-[10px] shrink-0 font-medium">
            Ask Milana:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(prompt.text)}
              className="cursor-pointer px-3 py-1 bg-[#FDFBF7] border border-[#D6CFC3] hover:border-[#9A6735] hover:text-[#1C1917] text-[#57534E] text-xs transition-colors rounded-sm whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span className="font-serif italic text-[#9A6735] font-semibold">{prompt.lang}</span>
              <span>{prompt.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#78716C]">
            <p className="font-serif text-xl italic text-[#1C1917] mb-2">
              "Feel free to ask me anything about my experience, education, or goals."
            </p>
            <p className="text-xs max-w-sm leading-relaxed text-[#78716C]">
              You can speak to me in English or Russian by clicking the microphone above, or type your questions below.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px] text-[#78716C]">
                <span className="font-medium text-[#1C1917]">
                  {msg.role === 'user' ? 'You' : 'Milana Avdashova'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{msg.timestamp}</span>
              </div>

              <div
                className={`relative max-w-[85%] px-5 py-3.5 rounded-sm text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#1C1917] text-[#FDFBF7]'
                    : 'bg-[#FDFBF7] text-[#1C1917] border border-[#EAE4D9]'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.role === 'model' && (
                  <div className="mt-2 pt-2 border-t border-[#EAE4D9]/60 flex items-center justify-between text-xs text-[#78716C]">
                    <span className="italic font-serif">Voice Response</span>
                    <button
                      onClick={() => onReplayAudio(msg.text, msg.audioBase64)}
                      className="cursor-pointer inline-flex items-center gap-1 text-[#9A6735] hover:text-[#78350F] transition-colors"
                      title="Play spoken audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Replay Voice</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {voiceState === 'speaking' && (
          <div className="flex items-center gap-2 text-xs text-[#9A6735] italic font-serif">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>Milana is currently speaking...</span>
          </div>
        )}

        {voiceState === 'processing' && (
          <div className="flex items-center gap-2 text-xs text-[#78716C]">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#9A6735]" />
            <span>Formulating response...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="p-4 bg-[#FDFBF7] border-t border-[#EAE4D9]">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleVoice}
            className={`cursor-pointer p-2.5 rounded-sm transition-colors border ${
              isLive
                ? 'bg-[#854D0E] text-white border-[#854D0E]'
                : 'bg-[#F9F6F0] text-[#1C1917] border-[#D6CFC3] hover:border-[#9A6735]'
            }`}
            title={isLive ? 'Mute microphone' : 'Start live voice conversation'}
          >
            {isLive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#9A6735]" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a question for Milana in English or Russian..."
            className="flex-1 bg-[#F9F6F0] border border-[#D6CFC3] focus:border-[#9A6735] focus:outline-hidden px-4 py-2.5 text-sm text-[#1C1917] placeholder-[#A8A29E] rounded-sm transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="cursor-pointer px-4 py-2.5 bg-[#1C1917] text-[#FDFBF7] hover:bg-[#292524] disabled:opacity-40 disabled:cursor-not-allowed text-xs uppercase tracking-wider font-medium rounded-sm transition-colors flex items-center gap-1.5"
          >
            <span>Ask</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
