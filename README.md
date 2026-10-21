# Milana Avdashova — Voice Assistant & Executive Portfolio

A minimalist, sophisticated web application and real-time voice assistant representing **Milana Avdashova** — International Business Administration student at the Estonian Business School (EBS) and Audit Assistant at Sirius Audit OÜ.

The interface combines a refined, high-fashion cream editorial aesthetic with real-time, low-latency bidirectional voice conversation powered by **Gemini Live API (`gemini-3.8-live`)**.

---

## ✨ Features

- 🎙️ **Real-Time Gemini Live Audio (`gemini-3.8-live`)**:
  - Full-duplex conversational voice via WebSocket streaming.
  - 16 kHz linear PCM microphone capture with 24 kHz gapless playback.
  - Spoken in a natural woman's tone with an **American accent for English** and an **authentic Russian accent for Russian**, with native Estonian comprehension.
- 🎨 **Minimalist Editorial Design**:
  - Warm cream canvas (`#FDFBF7`), obsidian typography (`#1C1917`), and warm bronze accents (`#9A6735`).
  - High-contrast serif headlines using `Cormorant Garamond` paired with clean `Plus Jakarta Sans` body typography.
  - Strict zero-pill metadata discipline with subtle typographical separators (`·` and `/`).
- 🌊 **Organic Audio Visualizer**:
  - Live animated canvas orb responding dynamically to speech energy and microphone audio amplitude.
- 💬 **Interactive Transcript & Suggested Prompts**:
  - Real-time turn transcripts with replayable speech.
  - One-click recruiter questions covering audit procedures, education, sports discipline, and accounting tools.
- 📄 **Curriculum Vitae Integration**:
  - In-browser interactive preview and direct download of the certified PDF resume (`Milana_Avdashova_CV_eng_2026.pdf`).
- 🛡️ **Universal Dual-Engine Fallback**:
  - If microphone access is denied or restricted, users can seamlessly ask questions via text using **Gemini 3.8 Flash** with immediate **Gemini 3.8 Flash Lite TTS** feminine voice synthesis.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion, Lucide Icons
- **Backend / Server**: Express, WebSockets (`ws`), `@google/genai` TypeScript SDK (Live API & Flash/TTS)
- **Runtime**: Node.js 18+ / `tsx`

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- A [Google Gemini API Key](https://aistudio.google.com/apikey)

### 2. Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/milana-avdashova-voice-portfolio.git
cd milana-avdashova-voice-portfolio
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your Gemini API key in `.env`:

```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000
```

### 4. Running the Development Server

Start the full-stack server (runs Express and Vite concurrently):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

To run the production server:

```bash
npm start
```

---

## 🌐 Deploying to the Web

This full-stack application can be deployed directly to any Node.js hosting platform:

### Deploy to Render or Railway
1. Push your repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npm start`
5. Under Environment Variables, add:
   - `GEMINI_API_KEY`: Your Gemini API Key
   - `NODE_ENV`: `production`

### Deploy with Docker (Optional)
Create a standard `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📁 Project Structure

```
├── public/
│   └── assets/aistudio/
│       └── Milana_Avdashova_CV_eng_2026_adf7ff73.pdf   # Certified CV PDF
├── src/
│   ├── components/
│   │   ├── TopNav.tsx               # Top Bar Contract navigation
│   │   ├── VoiceAssistantOrb.tsx    # Animated canvas waveform visualizer
│   │   ├── PortfolioDossier.tsx     # Editorial CV dossier sections
│   │   ├── ConversationPanel.tsx    # Spoken dialogue transcript & prompts
│   │   └── CVModal.tsx              # PDF preview & download dialog
│   ├── utils/
│   │   └── audio.ts                 # 16kHz PCM recorder & 24kHz player
│   ├── types.ts                     # TypeScript interfaces
│   ├── App.tsx                      # Root application component
│   ├── index.css                    # Tailwind CSS v4 & typography tokens
│   └── main.tsx                     # React DOM entry point
├── server.ts                        # Express server with Gemini Live WebSocket
├── index.html                       # HTML entry point with serif fonts
├── vite.config.ts                   # Vite configuration
├── package.json                     # Dependencies & scripts
└── tsconfig.json                    # TypeScript compiler options
```

---

## 📄 License

MIT License. Designed and engineered for Milana Avdashova.
