# VisionFlow AI

A premium AI Video Generator web application — create stunning HD/4K videos from text prompts.

## 🚀 Quick Start

### Install all dependencies
```bash
cd visionflow-ai
npm install && cd client && npm install && cd ../server && npm install && cd ..
```

### Run development servers
```bash
# From root directory — runs both frontend (port 3000) and backend (port 5000)
npm run dev

# Or separately:
cd client && npm run dev    # Frontend on http://localhost:3000
cd server && node index.js  # Backend on http://localhost:5000
```

### Demo Login (no MongoDB required)
- Email: `demo@visionflow.ai`
- Password: `demo1234`
- Or click **"Try Demo"** on the auth page

## 📁 Structure

```
visionflow-ai/
├── client/          # React + Vite + Tailwind CSS frontend
│   └── src/
│       ├── pages/   # LandingPage, Dashboard, CreateVideo, Editor, Templates, AuthPage
│       ├── components/
│       ├── store/   # Zustand state (auth, video)
│       ├── hooks/   # useSocket (Socket.io)
│       └── services/ # API client (axios)
└── server/          # Node.js + Express backend
    └── src/
        ├── routes/  # auth, videos, generation, export, ai, upload
        ├── models/  # User, Video (Mongoose)
        └── services/ # AI pipeline simulation
```

## 🎯 Features
- **AI Generation Pipeline**: 10-stage async pipeline with real-time WebSocket progress
- **Video Editor**: Timeline, scene management, audio mixer, subtitle editor
- **AI Extras**: Viral title generator, hashtags, SEO description
- **Export**: MP4 download with quality/compression options
- **Templates**: 12 trending templates across all platforms
- **Auth**: JWT login/register with demo mode

## 🔧 Connecting Real APIs
The backend is simulation-ready. To connect real AI APIs, replace functions in:
- `server/src/services/aiPipeline.js` → OpenAI GPT (scripts), Runway/Pika (video)
- Voice generation → ElevenLabs API
- Music generation → Mubert/Suno API

## 🗃️ MongoDB (Optional)
Set `MONGO_URI` in `server/.env`. The app works fully without MongoDB using in-memory storage.
