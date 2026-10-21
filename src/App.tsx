import React, { useState, useEffect, useRef } from 'react';
import { TopNav } from './components/TopNav';
import { VoiceAssistantOrb } from './components/VoiceAssistantOrb';
import { PortfolioDossier } from './components/PortfolioDossier';
import { ConversationPanel } from './components/ConversationPanel';
import { CVModal } from './components/CVModal';
import { ProfileData, ChatMessage, VoiceState } from './types';
import { floatTo16BitPCM, LiveAudioPlayer } from './utils/audio';
import { AlertCircle } from 'lucide-react';

const DEFAULT_PROFILE: ProfileData = {
  name: "Milana Avdashova",
  birthDate: "17.08.2005",
  title: "International Business Administration Student & Audit Assistant",
  location: "Tallinn, 10114, Estonia",
  email: "mavdashova@gmail.com",
  phone: "+3725101409",
  about: "Bachelor's degree student who is not afraid to face new challenges, open-minded and eager to learn. A background in sports has developed discipline and perseverance. Looking to gain practical experience.",
  education: [
    {
      institution: "Estonian Business School (EBS)",
      period: "02.09.2024 – present",
      degree: "International Business Administration (in English)",
      details: "Focusing on corporate finance, international management, business economics, and organizational strategy."
    },
    {
      institution: "Võru Gümnaasium",
      period: "01.09.2021 – 19.06.2024",
      degree: "Secondary Education (in Estonian)",
      details: "Rigorous academic curriculum with sports commitment."
    }
  ],
  experience: [
    {
      company: "Sirius Audit OÜ",
      role: "Audit Assistant",
      period: "16.03.2026 – present",
      highlights: [
        "Performed detailed audit test procedures and substantives",
        "Analysed financial statements and corporate data integrity",
        "Extensive practical use of Microsoft Excel and Inflo audit software"
      ]
    },
    {
      company: "Alexela Concert House",
      role: "Waitress & Client Host",
      period: "03.10.2024 – 31.08.2026",
      highlights: [
        "Delivered clear, polite client communication in high-pressure event environments",
        "Demonstrated rapid, effective problem-solving and guest relations"
      ]
    }
  ],
  internship: [
    {
      company: "OG Accounting OÜ",
      role: "Accounting Assistant",
      period: "05.05.2025 – 30.06.2025",
      highlights: [
        "Hands-on experience with incoming invoices, accounting ledgers, and source documents",
        "Executed daily accounting entries and reconciliation tasks",
        "Proficient daily work using Merit Aktiva accounting software"
      ]
    }
  ],
  skills: [
    "Responsible",
    "Detail-oriented",
    "Patient",
    "Accurate",
    "Financial Data Analysis",
    "Audit Testing",
    "Microsoft Excel Advanced",
    "Inflo Audit Software",
    "Merit Aktiva Software"
  ],
  languages: [
    { language: "Estonian", level: "Mother tongue", description: "Native fluency, primary schooling" },
    { language: "Russian", level: "C1", description: "Native Russian accent, near-native proficiency" },
    { language: "English", level: "B2", description: "American accent, university degree medium of instruction" }
  ],
  cvPath: "/assets/aistudio/Milana_Avdashova_CV_eng_2026_adf7ff73.pdf"
};

export default function App() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isCVOpen, setIsCVOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio & WebSocket refs
  const livePlayerRef = useRef<LiveAudioPlayer | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micAudioCtxRef = useRef<AudioContext | null>(null);
  const micProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioElemRef = useRef<HTMLAudioElement | null>(null);

  // Load profile from server if available
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setProfile(data);
        }
      })
      .catch((err) => console.log('Using default profile data', err));

    // Initialize audio element for TTS playback
    const audio = new Audio();
    audioElemRef.current = audio;
    audio.onended = () => {
      setVoiceState('idle');
    };

    return () => {
      cleanupLiveVoice();
    };
  }, []);

  const cleanupLiveVoice = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (micProcessorRef.current) {
      micProcessorRef.current.disconnect();
      micProcessorRef.current = null;
    }
    if (micAudioCtxRef.current && micAudioCtxRef.current.state !== 'closed') {
      micAudioCtxRef.current.close();
      micAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (livePlayerRef.current) {
      livePlayerRef.current.stopAll();
    }
    setVoiceState('idle');
  };

  const startLiveVoice = async () => {
    try {
      setErrorMessage(null);
      setVoiceState('connecting');

      // Initialize player
      if (!livePlayerRef.current) {
        livePlayerRef.current = new LiveAudioPlayer();
      }

      // 1. Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      micStreamRef.current = stream;

      // 2. Open WebSocket connection to /live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      let currentModelMessageId: string | null = null;

      ws.onopen = () => {
        setVoiceState('listening');

        // Setup microphone capture at 16kHz
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const micCtx = new AudioContextClass({ sampleRate: 16000 });
        micAudioCtxRef.current = micCtx;

        const source = micCtx.createMediaStreamSource(stream);
        const processor = micCtx.createScriptProcessor(4096, 1, 1);
        micProcessorRef.current = processor;

        source.connect(processor);
        processor.connect(micCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const base64Pcm = floatTo16BitPCM(inputData);
          ws.send(JSON.stringify({ audio: base64Pcm }));
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'audio') {
            setVoiceState('speaking');
            livePlayerRef.current?.playChunk(msg.audio, () => {
              setVoiceState('listening');
            });
          } else if (msg.type === 'text') {
            // Append spoken text to transcript
            setMessages((prev) => {
              if (currentModelMessageId) {
                return prev.map((m) =>
                  m.id === currentModelMessageId
                    ? { ...m, text: m.text + msg.text }
                    : m
                );
              } else {
                const newId = `msg-${Date.now()}`;
                currentModelMessageId = newId;
                return [
                  ...prev,
                  {
                    id: newId,
                    role: 'model',
                    text: msg.text,
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  },
                ];
              }
            });
          } else if (msg.type === 'turnComplete') {
            currentModelMessageId = null;
            if (!livePlayerRef.current?.isPlaying()) {
              setVoiceState('listening');
            }
          } else if (msg.type === 'interrupted') {
            livePlayerRef.current?.stopAll();
            currentModelMessageId = null;
            setVoiceState('listening');
          } else if (msg.type === 'error') {
            console.error('Server reported Live error:', msg.message);
            setErrorMessage(msg.message);
            cleanupLiveVoice();
          }
        } catch (e) {
          console.error('Error handling WebSocket message:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setErrorMessage('Voice connection could not be established. You can still ask questions via text!');
        cleanupLiveVoice();
      };

      ws.onclose = () => {
        cleanupLiveVoice();
      };

    } catch (err: any) {
      console.error('Error starting live voice:', err);
      setErrorMessage(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone permission denied. Enable microphone in your browser or type questions below.'
          : 'Could not initialize microphone. You can converse with Milana using text.'
      );
      cleanupLiveVoice();
    }
  };

  const handleToggleVoice = () => {
    if (voiceState === 'listening' || voiceState === 'speaking' || voiceState === 'connecting') {
      cleanupLiveVoice();
    } else {
      startLiveVoice();
    }
  };

  // Text inquiry with synthesized voice reply
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setVoiceState('processing');

    try {
      // 1. Get model response from server
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const chatData = await chatRes.json();
      if (!chatRes.ok || !chatData.reply) {
        throw new Error(chatData.error || 'Failed to get answer');
      }

      const modelReply = chatData.reply;

      // 2. Synthesize audio with feminine voice
      let audioBase64: string | undefined;
      try {
        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: modelReply }),
        });
        const ttsData = await ttsRes.json();
        if (ttsRes.ok && ttsData.audioBase64) {
          audioBase64 = ttsData.audioBase64;
        }
      } catch (ttsErr) {
        console.warn('TTS error, will show text only:', ttsErr);
      }

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: modelReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioBase64,
      };

      setMessages((prev) => [...prev, modelMsg]);

      // 3. Play audio if available
      if (audioBase64 && audioElemRef.current) {
        setVoiceState('speaking');
        audioElemRef.current.src = `data:audio/wav;base64,${audioBase64}`;
        audioElemRef.current.play().catch((playErr) => {
          console.warn('Audio auto-play failed:', playErr);
          setVoiceState('idle');
        });
      } else {
        setVoiceState('idle');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: "I apologize, I encountered a temporary connection issue. Please ask again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setVoiceState('idle');
    }
  };

  const handleReplayAudio = async (text: string, audioBase64?: string) => {
    if (!audioElemRef.current) return;

    if (audioBase64) {
      setVoiceState('speaking');
      audioElemRef.current.src = `data:audio/wav;base64,${audioBase64}`;
      audioElemRef.current.play().catch(() => setVoiceState('idle'));
    } else {
      setVoiceState('processing');
      try {
        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        const ttsData = await ttsRes.json();
        if (ttsRes.ok && ttsData.audioBase64) {
          setVoiceState('speaking');
          audioElemRef.current.src = `data:audio/wav;base64,${ttsData.audioBase64}`;
          audioElemRef.current.play().catch(() => setVoiceState('idle'));
        } else {
          setVoiceState('idle');
        }
      } catch {
        setVoiceState('idle');
      }
    }
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] selection:bg-[#9A6735]/20 selection:text-[#1C1917]">
      {/* Top Bar Contract Navigation */}
      <TopNav
        voiceState={voiceState}
        onToggleVoice={handleToggleVoice}
        onOpenCV={() => setIsCVOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 lg:py-14">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-8 p-4 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs flex items-center justify-between rounded-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="cursor-pointer font-medium hover:underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2-Column Split: Left = Voice Assistant Studio, Right = Portfolio Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Voice Orb & Interactive Dialogue Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <VoiceAssistantOrb
              voiceState={voiceState}
              onToggleVoice={handleToggleVoice}
              audioAnalyser={livePlayerRef.current?.analyser || null}
            />

            <div className="h-[460px]">
              <ConversationPanel
                messages={messages}
                voiceState={voiceState}
                onSendMessage={handleSendMessage}
                onToggleVoice={handleToggleVoice}
                onReplayAudio={handleReplayAudio}
                isAudioPlaying={voiceState === 'speaking'}
              />
            </div>
          </div>

          {/* Right Column: Full Editorial Dossier */}
          <div className="lg:col-span-7">
            <PortfolioDossier
              profile={profile}
              onAskQuestion={handleSendMessage}
              onOpenCV={() => setIsCVOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Minimalist Editorial Footer */}
      <footer className="border-t border-[#EAE4D9] bg-[#F9F6F0] mt-20 py-10 text-xs text-[#78716C]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-sm text-[#1C1917] font-medium">Milana Avdashova</span>
            <span aria-hidden="true">·</span>
            <span>Tallinn, Estonia</span>
            <span aria-hidden="true">·</span>
            <span>Estonian Business School</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsCVOpen(true)}
              className="cursor-pointer hover:text-[#1C1917] transition-colors"
            >
              Curriculum Vitae (PDF)
            </button>
            <a
              href={`mailto:${profile.email}`}
              className="hover:text-[#1C1917] transition-colors"
            >
              {profile.email}
            </a>
            <span className="text-[#A8A29E]">© 2026</span>
          </div>
        </div>
      </footer>

      {/* CV Preview & Download Modal */}
      <CVModal
        isOpen={isCVOpen}
        onClose={() => setIsCVOpen(false)}
        pdfUrl={profile.cvPath}
      />
    </div>
  );
}
