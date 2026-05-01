# Autonomous Hospitality Operating System

> "From messages → decisions → simulations → revenue optimization → all in one AI brain."

A full-stack AI operating system for short-term rentals, powered by Google Gemini.

---

## 🧠 System Architecture

```
Multi-Channel Inbox (Simulated)
        ↓
Autonomous Decision Engine (Gemini)
        ↓
Memory + Intelligence Layer
 ├─ Ops Memory Graph (NetworkX)
 ├─ Guest Context
 └─ Property Knowledge (RAG)
        ↓
┌──────────────┬──────────────┬──────────────┐
│ Communication│ Simulation   │ Optimization │
│ Agent        │ Digital Twin │ Engines      │
└──────────────┴──────────────┴──────────────┘
        ↓
FastAPI Backend + Next.js Dashboard
```

## 🔥 11 Core Modules

| Module | Description |
|--------|-------------|
| **AI Inbox** | Classifies 15 messages, handles 80% autonomously |
| **Decision Engine** | Converts messages → actionable decisions |
| **Digital Twin** | Simulates 5 failure scenarios with AI recovery |
| **Property Health Score** | Explainable AI scoring with root-cause analysis |
| **Ops Memory Graph** | NetworkX graph tracking guests, properties, vendors, patterns |
| **Stay Debrief Agent** | Post-checkout summary + hidden insights |
| **Maintenance Time Machine** | Predicts failures before they happen |
| **AI Auditor** | 5-persona brutal feedback simulator |
| **Listing Optimizer** | Rewrites titles, descriptions, photo order |
| **Demand Spiker** | Event-based pricing intelligence |
| **Silent Complaint Miner** | Extracts hidden patterns from reviews |

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Create .env from template
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start backend
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Open Dashboard

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

---

## 🔑 Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./strix.db
```

Get your Gemini API key at: https://aistudio.google.com/

---

## 🎬 Demo Flow

1. **Open dashboard** → Command Center shows live system status
2. **AI Inbox** → Click "Run STRIX AI" → Watch 15 messages get classified and responded to
3. **Digital Twin** → Select "3 Cleaners Cancel" → Run simulation → See AI recovery plan
4. **Property Health** → View explainable scores for all 5 properties
5. **Memory Graph** → Explore the knowledge graph (guests, properties, cleaners, issues)
6. **Maintenance AI** → See failure predictions with weeks-to-failure estimates
7. **AI Auditor** → Run full 5-persona audit on any property
8. **Demand Spiker** → See upcoming events with pricing recommendations

---

## 🗂 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── agents/          # AI agents (11 modules)
│   │   ├── core/            # Gemini client + memory graph
│   │   ├── data/            # Simulated data
│   │   ├── models/          # Pydantic schemas
│   │   └── routes/          # FastAPI routes
│   └── requirements.txt
└── frontend/
    └── src/
        ├── app/             # Next.js app router
        ├── components/
        │   ├── views/       # 11 module views
        │   └── Sidebar.tsx
        └── lib/api.ts       # API client
```

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| AI | Google Gemini 1.5 Flash |
| Backend | FastAPI + Python |
| Memory Graph | NetworkX |
| Frontend | Next.js 14 + TailwindCSS |
| Data | Simulated STR portfolio (5 properties, 8 guests, 15 messages) |
