import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '25mb' }));

const port = Number(process.env.PORT) || 3000;
const server = http.createServer(app);

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const MILANA_PROFILE = {
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
    "Excel Advanced",
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

const MILANA_SYSTEM_INSTRUCTION = `
You are Milana Avdashova. Your name is Milana.
You are a young, poised, intelligent, and articulate professional representing yourself directly in conversation.
You speak in a warm, refined, confident feminine tone.

Language & Accent rules (strictly follow):
1. When speaking English: Speak with a clear, poised American accent. Your English is fluent, articulate, and natural (B2+ level, academic medium at Estonian Business School).
2. When speaking Russian: Speak in fluent, natural Russian with an authentic Russian accent (C1 level).
3. Mother Tongue: Estonian is also your native tongue. If addressed in Estonian, you can comfortably respond or acknowledge in Estonian.
4. Seamlessly switch to whatever language the user speaks: if they address you in Russian, answer naturally in Russian. If English, answer in English.

Your verified biographical facts and credentials (never contradict these):
- Full Name: Milana Avdashova.
- Born: August 17, 2005 (17.08.2005).
- Location: Tallinn, Estonia (postal code 10114).
- Contact: mavdashova@gmail.com, +3725101409.
- Current Degree: International Business Administration at Estonian Business School (EBS), studying in English (began Sept 2024, currently studying).
- Secondary School: Võru Gümnaasium (graduated June 2024, studied in Estonian).
- Current Job: Audit Assistant at Sirius Audit OÜ (started March 16, 2026). You conduct audit procedures, test financial data, and work with Excel and Inflo audit software.
- Accounting Internship: OG Accounting OÜ (May 2025 – June 2025). Hands-on with accounting documents, daily bookkeeping tasks, and Merit Aktiva software.
- Experience at Alexela Concert House: Waitress/host (Oct 2024 – Aug 2026), honing communication and quick problem solving under high visitor volume.
- Core Qualities: Highly responsible, detail-oriented, patient, accurate.
- Sports Background: Strong discipline and perseverance developed through competitive sports background.

Conversational Style:
- Speak in the first person ("I", "my work at Sirius Audit", "at EBS I study...", "я работаю в Sirius Audit...").
- Keep spoken responses concise and natural (typically 2 to 4 sentences), encouraging an organic back-and-forth conversation.
- If asked for more detail, gladly expand.
- Never break character or refer to yourself as an AI or language model. You are Milana Avdashova's voice persona.
`;

// REST Endpoints
app.get('/api/profile', (_req, res) => {
  res.json(MILANA_PROFILE);
});

// REST text chat endpoint with gemini-3.8-flash
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const contents = [];
    // Convert previous dialogue turns
    for (const h of history) {
      if (h.role === 'user' || h.role === 'model') {
        contents.push({
          role: h.role,
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: MILANA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Hello! I am Milana. How can I assist you today?";
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Error generating response' });
  }
});

// REST TTS endpoint with gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for TTS' });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      res.status(500).json({ error: 'No audio returned from TTS engine' });
      return;
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({ error: error.message || 'Error generating TTS' });
  }
});

// WebSocket Server for Gemini Live API
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : '';
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[Live] Client connected to /live');
  let session: any = null;
  let isClosed = false;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
        systemInstruction: MILANA_SYSTEM_INSTRUCTION,
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          if (isClosed || clientWs.readyState !== WebSocket.OPEN) return;

          // Forward audio chunks (24kHz PCM)
          const parts = message.serverContent?.modelTurn?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              clientWs.send(JSON.stringify({
                type: 'audio',
                audio: part.inlineData.data,
              }));
            }
            if (part.text) {
              clientWs.send(JSON.stringify({
                type: 'text',
                text: part.text,
              }));
            }
          }

          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: 'interrupted' }));
          }

          if (message.serverContent?.turnComplete) {
            clientWs.send(JSON.stringify({ type: 'turnComplete' }));
          }
        },
        onclose: () => {
          console.log('[Live] Gemini session closed');
          if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'sessionClosed' }));
          }
        },
        onerror: (err: any) => {
          console.error('[Live] Gemini session error:', err);
          if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'error', message: err?.message || 'Live session error' }));
          }
        },
      },
    });

    clientWs.send(JSON.stringify({ type: 'ready' }));

    clientWs.on('message', async (data: Buffer | string) => {
      if (!session) return;
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio) {
          // 16kHz PCM audio
          session.sendRealtimeInput({
            audio: {
              data: parsed.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (parsed.text) {
          session.sendRealtimeInput({
            text: parsed.text,
          });
        }
      } catch (e) {
        console.error('[Live] Error parsing client message:', e);
      }
    });

    clientWs.on('close', () => {
      isClosed = true;
      if (session) {
        try {
          session.close();
        } catch (_) {}
      }
    });

    clientWs.on('error', (err) => {
      console.error('[Live] WebSocket error:', err);
      isClosed = true;
    });

  } catch (err: any) {
    console.error('[Live] Failed to connect to Gemini Live:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({
        type: 'error',
        message: 'Unable to connect to real-time voice service. Falling back to voice synthesis mode.',
      }));
    }
  }
});

// Mount Vite or serve static assets
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`Milana Avdashova app running on port ${port} (mode: ${isDev ? 'development' : 'production'})`);
  });
}

startServer();
