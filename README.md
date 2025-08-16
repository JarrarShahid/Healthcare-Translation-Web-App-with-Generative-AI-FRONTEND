# Healthcare Translation Web App

A real-time, multilingual healthcare translation web application that enables seamless communication between patients and healthcare providers.

## Features

- Real-time speech recognition and transcription
- AI-powered medical translation using Groq LLaMA3-8B
- Multi-language support (12 languages)
- Text-to-speech synthesis
- Mobile-first responsive design
- Medical terminology preservation

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: FastAPI + Python
- **AI**: Groq API + LangChain
- **Styling**: Tailwind CSS + Shadcn/ui
- **Speech**: Web Speech API

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- Groq API key

### Frontend Setup
```bash
cd voice-med-speak-frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd voice-med-speak-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## Building

To build the project:

```bash
npm run build
```

## Deployment

The frontend is ready for deployment on Vercel, Netlify, or similar platforms.
The backend is ready for deployment on Railway, Render, or similar platforms.
