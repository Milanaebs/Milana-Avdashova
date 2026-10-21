export interface ProfileData {
  name: string;
  birthDate: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  about: string;
  education: Array<{
    institution: string;
    period: string;
    degree: string;
    details: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    highlights: string[];
  }>;
  internship: Array<{
    company: string;
    role: string;
    period: string;
    highlights: string[];
  }>;
  skills: string[];
  languages: Array<{
    language: string;
    level: string;
    description: string;
  }>;
  cvPath: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  audioBase64?: string;
  isStreaming?: boolean;
}

export type VoiceState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'processing' | 'error';
