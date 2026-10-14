-- ==============================================================================
-- NIAT PROJECT MIRROR — SUPABASE DATABASE SETUP & SEED SCRIPT
-- ==============================================================================
-- HOW TO RUN:
--   1. Open your Supabase Dashboard
--   2. Click "SQL Editor" in the left sidebar
--   3. Click "New Query"
--   4. Paste this ENTIRE script
--   5. Click "Run" (or Ctrl+Enter)
-- ==============================================================================


-- ============================================================
-- STEP 1: CLEAN UP — Drop existing tables (safe to re-run)
-- ============================================================
DROP TABLE IF EXISTS niat_telemetry CASCADE;
DROP TABLE IF EXISTS niat_orchestrations CASCADE;
DROP TABLE IF EXISTS niat_leads CASCADE;
DROP TABLE IF EXISTS niat_alumni CASCADE;


-- ============================================================
-- STEP 2: CREATE TABLES
-- ============================================================

-- Table: niat_leads (Post-NAT stagnant leads)
CREATE TABLE niat_leads (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_relation TEXT DEFAULT 'Father',
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    target_college TEXT NOT NULL,
    language TEXT NOT NULL,
    objection TEXT NOT NULL,
    objection_detail TEXT NOT NULL,
    nat_score INTEGER DEFAULT 80,
    nat_percentile NUMERIC(5, 1) DEFAULT 88.5,
    days_stagnant INTEGER DEFAULT 7,
    phone TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: niat_alumni (Verified regional placement proofs)
CREATE TABLE niat_alumni (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    hometown TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    language TEXT NOT NULL,
    college TEXT NOT NULL,
    grad_year INTEGER DEFAULT 2025,
    starting_ctc NUMERIC(4, 1) NOT NULL,
    current_company TEXT NOT NULL,
    role TEXT NOT NULL,
    initial_coding_skill TEXT DEFAULT 'Zero',
    family_background TEXT,
    offer_letter_ref TEXT NOT NULL,
    avatar_url TEXT,
    relatable_story TEXT NOT NULL,
    addressed_objections TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: niat_telemetry (Live parent engagement events)
CREATE TABLE niat_telemetry (
    id TEXT PRIMARY KEY,
    lead_id TEXT REFERENCES niat_leads(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    score_contribution INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE niat_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE niat_alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE niat_telemetry ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- STEP 4: CREATE RLS POLICIES (Public read/write for anon key)
-- ============================================================

-- niat_leads: full public access (select, insert, update, delete)
CREATE POLICY "niat_leads_select" ON niat_leads
    FOR SELECT USING (true);

CREATE POLICY "niat_leads_insert" ON niat_leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "niat_leads_update" ON niat_leads
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "niat_leads_delete" ON niat_leads
    FOR DELETE USING (true);

-- niat_alumni: full public access
CREATE POLICY "niat_alumni_select" ON niat_alumni
    FOR SELECT USING (true);

CREATE POLICY "niat_alumni_insert" ON niat_alumni
    FOR INSERT WITH CHECK (true);

CREATE POLICY "niat_alumni_update" ON niat_alumni
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "niat_alumni_delete" ON niat_alumni
    FOR DELETE USING (true);

-- niat_telemetry: public select + insert (write-only telemetry)
CREATE POLICY "niat_telemetry_select" ON niat_telemetry
    FOR SELECT USING (true);

CREATE POLICY "niat_telemetry_insert" ON niat_telemetry
    FOR INSERT WITH CHECK (true);


-- ============================================================
-- STEP 5: SEED ALUMNI DATA (Verified Regional Placement Proofs)
-- ============================================================

INSERT INTO niat_alumni (
    id, name, hometown, district, state, language, college, grad_year,
    starting_ctc, current_company, role, initial_coding_skill,
    family_background, offer_letter_ref, avatar_url, relatable_story,
    addressed_objections
) VALUES
(
    'alum-ap-guntur-01',
    'Sai Teja Mandava',
    'Tenali',
    'Guntur',
    'Andhra Pradesh',
    'Telugu',
    'Mohan Babu University (Partner Campus)',
    2025,
    7.2,
    'TCS Digital',
    'Associate Software Engineer (Cloud Core)',
    'Zero',
    'Father runs a small fertilizer retail shop in Tenali, Mother is homemaker',
    'TCSD/2025/HYD-88219',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'Joined with zero coding experience from state board Intermediate. Father took an educational loan of 3.8 Lakhs with deep hesitation. Cleared entire loan within 10 months of TCS Digital placement.',
    ARRAY['Dual-fee expensive', 'Afraid of coding difficulty']
),
(
    'alum-tn-madurai-02',
    'Vigneshwaran Pitchai',
    'Melur',
    'Madurai',
    'Tamil Nadu',
    'Tamil',
    'Joy University (Tirunelveli Partner Campus)',
    2025,
    6.8,
    'Zoho Corporation',
    'Member Technical Staff',
    'Beginner',
    'Father is a retired Tamil Nadu state transport bus driver; first graduate in family',
    'ZOHO/MTS/EST-44019',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'Family doubted that a college in Tirunelveli could place in Zoho without recommendation. Practical lab mentors helped build 4 production projects that cleared Zoho technical rounds directly.',
    ARRAY['Doubt placement claims', 'Prefer traditional govt college']
),
(
    'alum-up-meerut-03',
    'Shubham Tyagi',
    'Modinagar',
    'Meerut',
    'Uttar Pradesh',
    'Hindi',
    'Sushant University (Gurugram Partner Campus)',
    2025,
    7.5,
    'Cognizant GenC Next',
    'Full Stack Engineer',
    'Zero',
    'Father is an accountant in a local grain mandi; Hindi-medium school background',
    'CTS/GENC-NX/2025/9912',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    'Did not know Python or terminal syntax on Day 1. NIAT peer mentors in campus tech pods held evening vernacular debugging sessions so no student fell behind.',
    ARRAY['Afraid of coding difficulty', 'Doubt placement claims']
),
(
    'alum-ka-hubballi-04',
    'Prajwal Hegde',
    'Dharwad',
    'Hubballi',
    'Karnataka',
    'Kannada',
    'CMR University (Bengaluru Partner Campus)',
    2025,
    8.4,
    'ThoughtWorks',
    'Graduate Consultant Developer',
    'Non-CS Background',
    'Father runs a photocopying shop outside district court',
    'TW/GRAD/2025/BLR-319',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=250',
    'Calculated every rupee of the dual fee before joining. Paid back family investment within 8 months of starting salary, now funding younger sister''s education.',
    ARRAY['Dual-fee expensive', 'Afraid of coding difficulty']
),
(
    'alum-tg-warangal-05',
    'Divya Sri Ravula',
    'Hanamkonda',
    'Warangal',
    'Telangana',
    'Telugu',
    'KL University (Hyderabad Partner Campus)',
    2025,
    8.0,
    'L and T Technology Services',
    'Embedded Software Engineer',
    'Zero',
    'Father is a primary school teacher, mother teaches tailoring locally',
    'LTTS/OFF/2025/HYD-773',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    'Mother was anxious about coding difficulty and hostel life. Secured summer internship in 3rd year with 25000/month stipend which paid for final year personal expenses.',
    ARRAY['Afraid of coding difficulty', 'Distance / Hostel hesitation']
),
(
    'alum-tn-salem-06',
    'Manoj Kumar',
    'Attur',
    'Salem',
    'Tamil Nadu',
    'Tamil',
    'Joy University (Tirunelveli Partner Campus)',
    2025,
    6.4,
    'Tech Mahindra',
    'Associate Software Specialist',
    'Zero',
    'Father cultivates betel leaves in Salem rural; first engineer in joint family',
    'TM/2025/CHN-1184',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    'Moving to hostel in Tirunelveli created deep family debate. The dedicated proctor network and weekly parent progress updates kept family completely at ease.',
    ARRAY['Distance / Hostel hesitation', 'Dual-fee expensive']
),
(
    'alum-kl-kollam-07',
    'Deepak Varma',
    'Karunagappalli',
    'Kollam',
    'Kerala',
    'Malayalam',
    'Joy University (Tirunelveli Partner Campus)',
    2025,
    7.0,
    'Infosys Wings 1 Specialist',
    'Systems Engineer Specialist',
    'Beginner',
    'Mother runs a homeopathic dispensary in Kollam town',
    'INF/W1/2025/TVM-652',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    'Proved to parents that spending 4.2 Lakhs total on NIAT program yielded more than double the starting package of traditional Kerala private colleges.',
    ARRAY['Dual-fee expensive', 'Doubt placement claims']
);


-- ============================================================
-- STEP 6: SEED LEAD DATA (Post-NAT Stagnant Leads)
-- ============================================================

INSERT INTO niat_leads (
    id, student_name, parent_name, parent_relation, district, state,
    target_college, language, objection, objection_detail, nat_score,
    nat_percentile, days_stagnant, phone, status
) VALUES
(
    'lead-guntur-01',
    'Harish Reddy',
    'Ramesh Reddy',
    'Father',
    'Guntur',
    'Andhra Pradesh',
    'Mohan Babu University (Tirupati Campus)',
    'Telugu',
    'Dual-fee expensive',
    'Parent questions paying an extra 1.2L/yr for NIAT upskilling on top of college tuition when local govt college costs 45000.',
    82,
    91.4,
    9,
    '+91 98480 32114',
    'pending'
),
(
    'lead-madurai-02',
    'Ananya Sundaram',
    'Meenakshi Sundaram',
    'Father',
    'Madurai',
    'Tamil Nadu',
    'Joy University (Tirunelveli)',
    'Tamil',
    'Doubt placement claims',
    'Parent believes advertisements promising high tech salaries from Tier-3 colleges are fabricated marketing gimmicks.',
    88,
    95.2,
    11,
    '+91 94432 78201',
    'pending'
),
(
    'lead-meerut-03',
    'Aryan Verma',
    'Rajesh Verma',
    'Father',
    'Meerut',
    'Uttar Pradesh',
    'Sushant University (Gurugram Campus)',
    'Hindi',
    'Afraid of coding difficulty',
    'Student had PCM in CBSE with zero prior computer science. Father fears Aryan will flunk rigorous practical labs and waste family savings.',
    76,
    84.8,
    8,
    '+91 98371 44520',
    'pending'
),
(
    'lead-hubballi-04',
    'Rohan Kulkarni',
    'Venkatesh Kulkarni',
    'Father',
    'Hubballi',
    'Karnataka',
    'CMR University (Bengaluru Campus)',
    'Kannada',
    'Dual-fee expensive',
    'Father is a retired bank clerk; wants proof of actual loan repayment duration before committing family provident fund.',
    79,
    87.6,
    12,
    '+91 99001 56329',
    'pending'
),
(
    'lead-warangal-05',
    'Bhavana Rao',
    'Sujatha Rao',
    'Mother',
    'Warangal',
    'Telangana',
    'KL University (Hyderabad)',
    'Telugu',
    'Afraid of coding difficulty',
    'Mother worries that tech companies only hire students from elite cities and that regional students cannot handle competitive algorithmic coding.',
    84,
    92.1,
    7,
    '+91 97014 88390',
    'pending'
),
(
    'lead-salem-06',
    'Karthik Subramanian',
    'Subramanian Natarajan',
    'Father',
    'Salem',
    'Tamil Nadu',
    'Joy University (Tirunelveli)',
    'Tamil',
    'Distance / Hostel hesitation',
    'Family wants student to stay within Salem district rather than moving 350km away for an untested campus model.',
    74,
    81.3,
    14,
    '+91 94440 21983',
    'pending'
),
(
    'lead-patna-07',
    'Priya Kumari',
    'Santosh Kumar',
    'Father',
    'Patna',
    'Bihar',
    'Sushant University (Gurugram)',
    'Hindi',
    'Doubt placement claims',
    'Father works in small grocery retail; suspects coaching institutes inflate packages and that real starting salaries are less than 2.5 LPA.',
    85,
    93.5,
    10,
    '+91 99340 76120',
    'pending'
),
(
    'lead-kollam-08',
    'Aravind Nair',
    'Radhika Nair',
    'Mother',
    'Kollam',
    'Kerala',
    'Joy University (Tirunelveli)',
    'Malayalam',
    'Dual-fee expensive',
    'Mother compares NIAT program cost with subsidized state polytechnic; needs crystal clear proof of 1st-year ROI.',
    81,
    89.9,
    9,
    '+91 98471 22904',
    'pending'
);


-- ============================================================
-- DONE! All tables created, RLS configured, and seed data loaded.
-- ============================================================
-- You should now see:
--   niat_alumni:    7 rows (verified regional placement proofs)
--   niat_leads:     8 rows (post-NAT stagnant leads with objections)
--   niat_telemetry: 0 rows (populated live by the web app)
--
-- Next: Copy your Project URL and anon key from
--   Project Settings -> API
-- and paste them into your .env file or the Settings modal.
-- ============================================================
