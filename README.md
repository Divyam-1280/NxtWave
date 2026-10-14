# NIAT Project Mirror — Demographic Relatability Engine
> **NxtWave Jr. Growth Manager Challenge — Track B: Bottom-of-Funnel Conversion Engine**  
> A production-ready, fully functional multi-agent AI system turning stagnant post-NAT leads into paid enrollments through hyper-localized social proof and real-time counselor escalation.

---

## 🚀 Live Local Application
The application is currently running at:
`http://localhost:5173/`

To start the dev server at any time:
```bash
npm run dev
```
To create a production bundle:
```bash
npm run build
```

---

## ⚡ Core Architecture: 3 Connected Systems

### 1. Ingestion & Lead Hub (Left Panel)
- **Live Stagnant Lead Pool**: 1,420 post-NAT leads pending payment for 7+ days.
- **Multilingual Filters**: Telugu, Tamil, Hindi, Kannada, Malayalam.
- **Objection Taxonomy**:
  - `Dual-fee expensive` (e.g. ₹1.2L extra over local college)
  - `Doubt placement claims` (e.g. skepticism over non-IIT placement stats)
  - `Afraid of coding difficulty` (e.g. non-CS intermediate background)
  - `Distance / Hostel hesitation` (e.g. fear of relocation)
- **Custom Lead Creator**: Evaluator form allowing testing of ANY prospective student, parent, district, and custom objection.
- **Trigger Button**: "🚀 Trigger AI Relatability Pipeline" executing real coordinated backend agents.

### 2. Multi-Agent AI Orchestration Terminal (Center Panel)
- **Agent 1 (Demographic Alumni Matcher)**:
  - Vector & demographic heuristic search across verified regional alumni.
  - Matches hometown proximity, native language, addressed objection, and realistic starting package (₹6.8 – ₹8.4 LPA).
- **Agent 2 (Psychographic Scriptwriter — Real LLM Call)**:
  - Makes live `fetch()` calls to **Groq API** (`llama-3.3-70b-versatile` or `llama-3.1-8b-instant`) or **Google Gemini API** (`gemini-1.5-flash`).
  - Outputs both the native vernacular script in regional typography AND an audited English translation.
- **Agent 3 (Voice & Dynamic Artifact Synthesizer)**:
  - Generates voice note via **ElevenLabs Multilingual v2 API** or browser **Web Speech API** with acoustic synthesis.
  - Generates dynamic parent portal link with query parameters (`/portal?lead_id=...&match_id=...`).

### 3. Delivery, Parent Microsite & Counselor Telemetry (Right Panel)
- **WhatsApp Mobile Preview**:
  - Incoming vernacular message bubble with verified badge.
  - Playable audio player with scrubbable seek slider, live waveform animation, and real sound output.
  - Clickable dynamic card: "View Local Outcome Certificate & ROI Breakdown".
- **Dynamic Parent ROI Portal (Interactive Modal)**:
  - Verified offer letter badge with official Offer ID.
  - Local College vs. NIAT On-Campus Model Comparison table.
  - Interactive ROI Sliders (Tuition vs. Target CTC) recalculating payback period (e.g. 10.8 months) and 3-year net family surplus (+₹17.4L).
- **Live Counselor Escalation Engine**:
  - Listens to parent telemetry: `Audio Played 100%` → `Portal Visited` → `ROI Adjusted`.
  - Engagement score climbs from 0 to 95/100.
  - **When Score > 75**: Fires a **REAL Webhook POST** request to Discord / Telegram / webhook logger.
  - Displays prominent glowing alert:
    `"🔥 HIGH-INTENT LEAD DETECTED: Dispatched instant notification to regional counselor via Webhook."`

---

## ⚙️ Configuration & API Keys
Click the floating **"⚙️ Settings & Keys"** button in the header to configure:
1. **Groq API Key**: `gsk_...` (or use Google Gemini API key)
2. **ElevenLabs API Key**: `xi-...` (Voice ID: `21m00Tcm4TlvDq8ikWAM`)
3. **Discord / Telegram Webhook URL**: Enter your Discord channel webhook URL and click **"Test Webhook"** for an instant ping.
4. **Supabase URL & Anon Key**: Optional sync to live cloud database tables.
5. **Demo Fallback Mode**: Gracefully simulates responses if keys are omitted, guaranteeing zero runtime crashes.

---

## 🎬 20-Second Automated Showcase for Loom
Click the **"Run 1-Click Showcase"** button at the top header to run an automated walkthrough:
1. Selects Guntur lead (Harish Reddy, Dual-fee objection).
2. Executes Agent 1, 2, and 3 with live latency & token metrics.
3. Plays the WhatsApp voice note.
4. Opens the Parent ROI Portal modal and adjusts the payback slider.
5. Telemetry score crosses 75%, firing the real Webhook and triggering confetti!
