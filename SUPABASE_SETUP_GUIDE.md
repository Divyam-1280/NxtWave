# NIAT Project Mirror — Supabase Database Setup Guide

Follow these 4 simple steps to connect **NIAT Project Mirror** to a real, live PostgreSQL database on Supabase.

---

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and click **"Start your project"** (free tier).
2. Click **"New Project"**, select an organization, name it `niat-project-mirror`, and set a database password.
3. Choose your region (e.g. `South Asia (Mumbai)` or `Singapore`).
4. Wait ~60 seconds for your database to initialize.

---

### Step 2: Run the Database Setup Script
1. In the left sidebar of your Supabase dashboard, click the **SQL Editor** icon (terminal icon `>_`).
2. Click **"New Query"**.
3. Open the file `supabase_setup.sql` in your project folder (or copy its full contents).
4. Paste the SQL script into the query box.
5. Click **"Run"** (or press `Ctrl + Enter`).

> **What this does:**
> - Creates `niat_leads` table and seeds it with authentic stagnant leads.
> - Creates `niat_alumni` table and seeds it with verified regional alumni proofs.
> - Creates `niat_telemetry` table to store live parent actions.
> - Configures Row Level Security (RLS) so the web app can read and write with your public Anon Key.

---

### Step 3: Copy Your Supabase API Keys
1. In your Supabase dashboard, click the **Project Settings** (gear icon) in the bottom-left sidebar.
2. Under Configuration, click **API**.
3. Copy the two values:
   - **Project URL** (e.g., `https://xyzabcdefg.supabase.co`)
   - **anon / public key** (e.g., `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

---

### Step 4: Add to `.env` or in the Settings Modal
You have two options:

#### Option A: In `.env` (Recommended)
Add the two keys to your `.env` file:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```
Restart the Vite dev server (`npm run dev`), and the app will automatically fetch all leads and alumni live from your Supabase tables!

#### Option B: In the Web App UI
1. Open the app at `http://localhost:5173/`.
2. Click **"API Keys & Settings"** in the top-right header.
3. Paste your **Supabase URL** and **Anon Key** into Section 4.
4. Click **"Verify Supabase Connection"** → you'll see a green `"Successfully connected to live Supabase database!"`.
5. Click **"Save & Apply Configuration"**.
