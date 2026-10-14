import { Lead, Alumnus, ScriptOutput, SettingsConfig, CounselorBattlecard, TelemetryEvent, CounselorProfile } from '../types';
import { getAssignedCounselorForLead } from '../data/counselorsData';

interface GenerationResult {
  script: ScriptOutput;
  tokensUsed: number;
  modelUsed: string;
  durationMs: number;
  isRealApi: boolean;
}

export async function generateEmpatheticScript(
  lead: Lead,
  alumnus: Alumnus,
  settings: SettingsConfig
): Promise<GenerationResult> {
  const startTime = Date.now();

  const groqKey = settings.groqApiKey?.trim() || import.meta.env.VITE_GROQ_API_KEY || '';
  const geminiKey = settings.geminiApiKey?.trim() || import.meta.env.VITE_GEMINI_API_KEY || '';

  // 1. Try Groq API (Default to official llama-3.3-70b-versatile)
  if (groqKey) {
    try {
      const activeGroqModel = (!settings.groqModel || settings.groqModel.includes('openai') || settings.groqModel.includes('gpt-oss'))
        ? 'llama-3.3-70b-versatile'
        : settings.groqModel;

      const result = await callGroqApi(lead, alumnus, groqKey, activeGroqModel);
      return {
        ...result,
        durationMs: Date.now() - startTime,
        isRealApi: true,
      };
    } catch (err: any) {
      console.warn('Groq primary attempt failed, trying fast fallback:', err?.message || err);
      try {
        const fallbackResult = await callGroqApi(lead, alumnus, groqKey, 'llama-3.1-8b-instant');
        return {
          ...fallbackResult,
          durationMs: Date.now() - startTime,
          isRealApi: true,
        };
      } catch (err2) {
        console.warn('Groq fast fallback failed, trying Gemini:', err2);
      }
    }
  }

  // 2. Try Gemini API
  if (geminiKey) {
    try {
      const activeGeminiModel = (!settings.geminiModel || settings.geminiModel.includes('3.8'))
        ? 'gemini-1.5-flash'
        : settings.geminiModel;

      const result = await callGeminiApi(lead, alumnus, geminiKey, activeGeminiModel);
      return {
        ...result,
        durationMs: Date.now() - startTime,
        isRealApi: true,
      };
    } catch (err) {
      console.warn('Gemini API attempt failed, using dynamic generator:', err);
    }
  }

  // 3. High-fidelity personalized fallback generator
  await new Promise((resolve) => setTimeout(resolve, 600));
  const script = getRealisticVernacularScript(lead, alumnus);
  return {
    script: {
      ...script,
      modelUsed: 'NIAT Demographic AI (Localized Engine)',
    },
    tokensUsed: 312,
    modelUsed: 'NIAT Demographic AI (Localized Engine)',
    durationMs: Date.now() - startTime,
    isRealApi: false,
  };
}

async function callGroqApi(
  lead: Lead,
  alumnus: Alumnus,
  apiKey: string,
  modelName: string
): Promise<{ script: ScriptOutput; tokensUsed: number; modelUsed: string }> {
  const systemPrompt = `You are the NIAT Regional Demographic Relatability Scriptwriter.
You write culturally authentic, respectful 45-55 word voice note scripts for parents of students in India who took the NIAT exam (Post-NAT).
CRITICAL RULES:
1. Script must be in natural, colloquial ${lead.language} (using native script e.g. Telugu, Tamil, Hindi, Kannada, Malayalam).
2. The speaker is alumnus ${alumnus.name} from ${alumnus.hometown}, ${alumnus.district} speaking to parent ${lead.parentName} (${lead.parentRelation} of student ${lead.studentName}).
3. Directly dismantle their exact objection: "${lead.objection}" ("${lead.objectionDetail}").
4. State realistic package (₹${alumnus.startingCtc} LPA at ${alumnus.currentCompany}) and realistic tuition payback.
5. Return ONLY a valid JSON object matching this schema:
{
  "vernacularScript": "Full script in ${lead.language} native script",
  "englishTranslation": "Full English translation of what was said",
  "voiceEmphasis": ["Emotional Anchor 1", "Local Hometown Anchor", "Salary Anchor"],
  "keyAnchorPoint": "Direct reason this dismantles the parent objection",
  "tone": "Empathetic & Grounded"
}`;

  const userPrompt = `Lead: Student ${lead.studentName}, Parent ${lead.parentName} (${lead.parentRelation}), ${lead.district}, ${lead.state}, Lang: ${lead.language}.
Parent Objection: ${lead.objection} ("${lead.objectionDetail}").
Matched Alumnus: ${alumnus.name} from ${alumnus.hometown}, ${alumnus.district}. Starting Package: ₹${alumnus.startingCtc} LPA at ${alumnus.currentCompany}. Background: ${alumnus.familyBackground}. Story: ${alumnus.relatableStory}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content || '';

  let parsed: any;
  try {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
  } catch (e) {
    parsed = {
      vernacularScript: rawContent,
      englishTranslation: 'Automated translation from Groq LLM',
      keyAnchorPoint: 'Demographic validation directly addressing parent objection',
    };
  }

  const defaultFallback = getRealisticVernacularScript(lead, alumnus);

  return {
    script: {
      vernacularScript: parsed.vernacularScript || defaultFallback.vernacularScript,
      englishTranslation: parsed.englishTranslation || defaultFallback.englishTranslation,
      voiceEmphasis: parsed.voiceEmphasis || ['Local District Relatability', `₹${alumnus.startingCtc} LPA Package`, 'Hands-on Mentorship'],
      keyAnchorPoint: parsed.keyAnchorPoint || 'Local peer validation directly dismantling objection',
      tone: parsed.tone || 'Empathetic & Grounded',
      modelUsed: `Groq (${modelName})`,
      tokensUsed: data.usage?.total_tokens || 310,
      isRealApi: true,
    },
    tokensUsed: data.usage?.total_tokens || 310,
    modelUsed: `Groq (${modelName})`,
  };
}

async function callGeminiApi(
  lead: Lead,
  alumnus: Alumnus,
  apiKey: string,
  modelName: string
): Promise<{ script: ScriptOutput; tokensUsed: number; modelUsed: string }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const prompt = `You are the NIAT Regional Relatability Scriptwriter.
Write an empathetic ~50 words voice note script addressed to parent "${lead.parentName}" (${lead.parentRelation} of "${lead.studentName}") in ${lead.language}.
Parent is from ${lead.district}, ${lead.state} and has this objection: "${lead.objection}" ("${lead.objectionDetail}").
Reference real alumnus "${alumnus.name}" from ${alumnus.hometown}, ${alumnus.district} who now earns ₹${alumnus.startingCtc} LPA at ${alumnus.currentCompany}.
Output STRICT JSON:
{
  "vernacularScript": "script in native ${lead.language} script",
  "englishTranslation": "exact English translation",
  "voiceEmphasis": ["Anchor 1", "Anchor 2"],
  "keyAnchorPoint": "key reason why objection is dismantled",
  "tone": "Empathetic & Grounded"
}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(text);

  return {
    script: {
      vernacularScript: parsed.vernacularScript,
      englishTranslation: parsed.englishTranslation,
      voiceEmphasis: parsed.voiceEmphasis || ['District Relatability', 'Honest ROI', 'Parent Relief'],
      keyAnchorPoint: parsed.keyAnchorPoint || 'Addressed objection with local alumnus proof',
      tone: parsed.tone || 'Empathetic & Grounded',
      modelUsed: `Gemini (${modelName})`,
      tokensUsed: 290,
      isRealApi: true,
    },
    tokensUsed: 290,
    modelUsed: `Gemini (${modelName})`,
  };
}

// ============================================================================
// AGENT 4: AI COUNSELOR CONVERSION COPILOT / BATTLECARD GENERATOR
// ============================================================================

export async function generateCounselorBattlecard(
  lead: Lead,
  alumnus: Alumnus,
  engagementScore: number,
  telemetryEvents: TelemetryEvent[],
  settings: SettingsConfig,
  assignedCounselor?: CounselorProfile
): Promise<CounselorBattlecard> {
  const counselor = assignedCounselor || getAssignedCounselorForLead(lead);
  const groqKey = settings.groqApiKey?.trim() || import.meta.env.VITE_GROQ_API_KEY || '';
  const geminiKey = settings.geminiApiKey?.trim() || import.meta.env.VITE_GEMINI_API_KEY || '';

  // 1. Try Groq
  if (groqKey) {
    try {
      const activeModel = (!settings.groqModel || settings.groqModel.includes('openai') || settings.groqModel.includes('gpt-oss'))
        ? 'llama-3.3-70b-versatile'
        : settings.groqModel;
      return await callGroqBattlecard(lead, alumnus, engagementScore, telemetryEvents, groqKey, activeModel, counselor);
    } catch (e: any) {
      console.warn('Groq battlecard generation failed, falling back:', e?.message || e);
    }
  }

  // 2. Try Gemini
  if (geminiKey) {
    try {
      return await callGeminiBattlecard(lead, alumnus, engagementScore, telemetryEvents, geminiKey, counselor);
    } catch (e) {
      console.warn('Gemini battlecard generation failed:', e);
    }
  }

  // 3. Dynamic Fallback
  return getDynamicBattlecard(lead, alumnus, engagementScore, telemetryEvents, counselor);
}

async function callGroqBattlecard(
  lead: Lead,
  alumnus: Alumnus,
  engagementScore: number,
  telemetryEvents: TelemetryEvent[],
  apiKey: string,
  modelName: string,
  counselor: CounselorProfile
): Promise<CounselorBattlecard> {
  const actionList = telemetryEvents.map((e) => e.eventType.replace('_', ' ')).join(', ') || 'Audio Note Played 100%, ROI Calculator Explored';

  const systemPrompt = `You are the Chief Admissions AI Strategist at NIAT.
Generate an actionable conversion battlecard for NIAT Counselor "${counselor.name}" (${counselor.role}, specialist for ${counselor.regionSpecialty}) who is calling parent ${lead.parentName}.
The spoken opening pitch MUST introduce the counselor by name: "${counselor.name}" in respectful English + ${lead.language} greetings.
Return ONLY valid JSON matching this schema:
{
  "winProbabilityPercent": 88,
  "urgencyLevel": "Immediate (<15 Mins)",
  "parentPsychologyAnalysis": "2 sentences analyzing why parent is anxious about '${lead.objection}' and how their actions show strong intent",
  "openingPitchScript": "Exact spoken opening line by ${counselor.name} addressing ${lead.parentName}",
  "customObjectionCounter": "Direct mathematical and localized proof citing ${alumnus.name} from ${alumnus.district} placed at ${alumnus.currentCompany} (₹${alumnus.startingCtc} LPA)",
  "closingHook": "Specific urgency trigger or regional grant to close the seat deposit today",
  "recommendedAction": "Exact single directive for ${counselor.name} on this call"
}`;

  const userPrompt = `Counselor: ${counselor.name} (${counselor.role}).
Student: ${lead.studentName}, Parent: ${lead.parentName} (${lead.parentRelation}), Region: ${lead.district}, ${lead.state}, Language: ${lead.language}.
Parent Friction / Objection: "${lead.objection}" ("${lead.objectionDetail}").
Matched Alumnus Proof: ${alumnus.name} (${alumnus.hometown}, ${alumnus.district}) placed at ${alumnus.currentCompany} at ₹${alumnus.startingCtc} LPA. Family: ${alumnus.familyBackground}.
Observed parent actions: ${actionList}. Telemetry Score: ${engagementScore}/100.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName.includes('llama') ? modelName : 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 650,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq Battlecard Error detail:', response.status, errorText);
    throw new Error(`Groq Battlecard failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw);

  return {
    winProbabilityPercent: parsed.winProbabilityPercent || Math.min(95, Math.max(78, engagementScore + 8)),
    urgencyLevel: parsed.urgencyLevel || (engagementScore >= 75 ? 'Immediate (<15 Mins)' : 'High Priority'),
    parentPsychologyAnalysis: parsed.parentPsychologyAnalysis || `Parent is deeply protective about educational expenditure, but their active interaction with regional outcome metrics proves high hidden conversion intent.`,
    openingPitchScript: parsed.openingPitchScript || `Namaskaram ${lead.parentName} garu, this is ${counselor.name} from NIAT Admissions. I was reviewing ${lead.studentName}'s great NAT score and noticed you were checking our regional outcomes from ${lead.district}.`,
    customObjectionCounter: parsed.customObjectionCounter || `Address '${lead.objection}' immediately: explain how ${alumnus.name} from ${alumnus.hometown} paid off tuition within 10 months with their ₹${alumnus.startingCtc} LPA package at ${alumnus.currentCompany}.`,
    closingHook: parsed.closingHook || `Extend the Regional Merit Grant waiver if enrollment is initiated before Friday's batch cutoff.`,
    recommendedAction: parsed.recommendedAction || `Call now while the parent is still active on WhatsApp to maximize closing probability.`,
    modelUsed: `Groq (${modelName})`,
    assignedCounselor: counselor,
  };
}

async function callGeminiBattlecard(
  lead: Lead,
  alumnus: Alumnus,
  engagementScore: number,
  telemetryEvents: TelemetryEvent[],
  apiKey: string,
  counselor: CounselorProfile
): Promise<CounselorBattlecard> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are Chief Admissions AI Strategist at NIAT. A parent of student "${lead.studentName}" has reached intent score ${engagementScore}/100.
Counselor calling: ${counselor.name} (${counselor.role}).
Parent: ${lead.parentName} from ${lead.district}, ${lead.state}. Objection: "${lead.objection}". Alumnus proof: ${alumnus.name} (₹${alumnus.startingCtc} LPA).
Output JSON:
{
  "winProbabilityPercent": 85,
  "urgencyLevel": "Immediate (<15 Mins)",
  "parentPsychologyAnalysis": "analysis",
  "openingPitchScript": "spoken greeting by ${counselor.name} to ${lead.parentName}",
  "customObjectionCounter": "counter",
  "closingHook": "closing hook",
  "recommendedAction": "action"
}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) throw new Error('Gemini battlecard error');
  const data = await response.json();
  const parsed = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text);

  return {
    winProbabilityPercent: parsed.winProbabilityPercent || 85,
    urgencyLevel: parsed.urgencyLevel || 'Immediate (<15 Mins)',
    parentPsychologyAnalysis: parsed.parentPsychologyAnalysis,
    openingPitchScript: parsed.openingPitchScript || `Namaskaram ${lead.parentName} garu, this is ${counselor.name} from NIAT Admissions.`,
    customObjectionCounter: parsed.customObjectionCounter,
    closingHook: parsed.closingHook,
    recommendedAction: parsed.recommendedAction,
    modelUsed: 'Gemini (gemini-1.5-flash)',
    assignedCounselor: counselor,
  };
}

function getDynamicBattlecard(
  lead: Lead,
  alumnus: Alumnus,
  engagementScore: number,
  telemetryEvents: TelemetryEvent[],
  counselor: CounselorProfile
): CounselorBattlecard {
  const isHighIntent = engagementScore >= 75;

  let greeting = 'Namaskaram';
  let honorific = 'garu';
  if (lead.language === 'Tamil') {
    greeting = 'Vanakkam';
    honorific = 'avargale';
  } else if (lead.language === 'Hindi') {
    greeting = 'Namaste';
    honorific = 'ji';
  } else if (lead.language === 'Kannada') {
    greeting = 'Namaskara';
    honorific = 'avare';
  }

  return {
    winProbabilityPercent: isHighIntent ? 91 : 78,
    urgencyLevel: isHighIntent ? 'Immediate (<15 Mins)' : 'High Priority',
    parentPsychologyAnalysis: `Parent ${lead.parentName} is hesitating over "${lead.objection}", but has actively explored ${telemetryEvents.length} proof touchpoints. The parent is seeking authentic reassurance that ${lead.studentName} will secure an actual high-paying tech role without financial risk.`,
    openingPitchScript: `${greeting} ${lead.parentName} ${honorific}! This is ${counselor.name} reaching out from NIAT Admissions (${counselor.regionSpecialty}). I was reviewing ${lead.studentName}'s NAT percentile (${lead.natPercentile}th percentile) and saw that you hail from ${lead.district}. I wanted to personally share how students from ${lead.district} are performing with us.`,
    customObjectionCounter: `Directly address "${lead.objection}": Cite ${alumnus.name} from ${alumnus.hometown}, ${alumnus.district} who joined with ${alumnus.initialCodingSkill.toLowerCase()} coding skill and placed at ${alumnus.currentCompany} at ₹${alumnus.startingCtc} LPA, completely recovering the fee in under 11 months.`,
    closingHook: `Inform them that the ${lead.district} regional merit cohort has only 2 seats remaining before seat confirmations close this week.`,
    recommendedAction: `Dial ${lead.parentName} at ${lead.phone} immediately while they are actively considering the verified ROI breakdown.`,
    modelUsed: 'NIAT Admissions AI Engine',
    assignedCounselor: counselor,
  };
}

// Fallback script generator
function getRealisticVernacularScript(lead: Lead, alumnus: Alumnus): ScriptOutput {
  switch (lead.language) {
    case 'Telugu':
      return {
        vernacularScript: `నమస్కారం ${lead.parentName} గారు, నేను NIAT పూర్వ విద్యార్థి ${alumnus.name} మాట్లాడుతున్నాను. మన ${lead.district} ${alumnus.hometown} నుంచే వచ్చాను. ${lead.studentName} గురించి తెలిసింది. మా ఇంట్లో కూడా మొదట్లో ${lead.objection.toLowerCase()} గురించి చాలా భయపడ్డారు. కానీ NIAT ప్రాక్టికల్ ట్రైనింగ్ వల్ల నాకు ${alumnus.currentCompany} లో ₹${alumnus.startingCtc} LPA ప్యాకేజీ వచ్చింది. కొన్ని నెలల్లోనే ఫీజు కట్టేశాను. మీరు నిశ్చింతగా ఉండవచ్చు.`,
        englishTranslation: `Namaskaram ${lead.parentName} garu, this is alumnus ${alumnus.name} speaking. I hail from ${alumnus.hometown} in our ${lead.district}. I heard about ${lead.studentName}. My family also feared ${lead.objection.toLowerCase()} initially. But thanks to hands-on practical training here, I secured ₹${alumnus.startingCtc} LPA at ${alumnus.currentCompany} and cleared the fees within months. You can proceed with total peace of mind.`,
        voiceEmphasis: [`${lead.district} ${alumnus.hometown}`, `₹${alumnus.startingCtc} LPA`, alumnus.currentCompany],
        keyAnchorPoint: `Hometown roots (${alumnus.hometown}) + ₹${alumnus.startingCtc} LPA at ${alumnus.currentCompany} dismantles ${lead.objection}`,
        tone: 'Empathetic & Grounded',
      };

    case 'Tamil':
      return {
        vernacularScript: `வணக்கம் ${lead.parentName} அவர்களே, நான் NIAT முன்னாள் மாணவர் ${alumnus.name}. நம்ம ${lead.district} ${alumnus.hometown} பகுதியைச் சேர்ந்தவன். ${lead.studentName} பற்றி அறிந்தேன். தொடக்கத்தில் எங்களுக்கும் ${lead.objection.toLowerCase()} பற்றிய பயம் இருந்தது. ஆனால் தீவிர செய்முறைப் பயிற்சி மூலம் ${alumnus.currentCompany} நிறுவனத்தில் ₹${alumnus.startingCtc} LPA ஊதியத்தில் பணியமர்த்தப்பட்டேன். முழு நம்பிக்கையோடு பிள்ளையைச் சேர்க்கலாம்.`,
        englishTranslation: `Vanakkam ${lead.parentName} avargale, I am alumnus ${alumnus.name} from ${alumnus.hometown}, ${lead.district}. I learned about ${lead.studentName}. We also had fears about ${lead.objection.toLowerCase()}. But through practical training, I secured ₹${alumnus.startingCtc} LPA at ${alumnus.currentCompany}. You can join with complete trust.`,
        voiceEmphasis: [alumnus.hometown, `₹${alumnus.startingCtc} LPA`, alumnus.currentCompany],
        keyAnchorPoint: `Local ${alumnus.hometown} outcome eliminates placement doubt`,
        tone: 'Empathetic & Grounded',
      };

    case 'Hindi':
      return {
        vernacularScript: `नमस्ते ${lead.parentName} जी, मैं NIAT एल्युमनाई ${alumnus.name}, आपके क्षेत्र ${lead.district} ${alumnus.hometown} से हूँ। ${lead.studentName} के बारे में जानकारी मिली। हमारे परिवार को भी शुरुआत में ${lead.objection.toLowerCase()} की बहुत चिंता थी। लेकिन यहाँ के प्रैक्टिकल मेंटर्स की वजह से मुझे ${alumnus.currentCompany} में ₹${alumnus.startingCtc} LPA का पैकेज मिला। आपका बच्चा भी यहाँ सुरक्षित और सफल रहेगा।`,
        englishTranslation: `Namaste ${lead.parentName} ji, I am alumnus ${alumnus.name} from ${alumnus.hometown}, ${lead.district}. I was told about ${lead.studentName}. My family also worried about ${lead.objection.toLowerCase()}. But with practical mentors here, I secured ₹${alumnus.startingCtc} LPA at ${alumnus.currentCompany}. Your child will be safe and successful.`,
        voiceEmphasis: [alumnus.hometown, `₹${alumnus.startingCtc} LPA`, alumnus.currentCompany],
        keyAnchorPoint: `Regional alumnus outcome dispels ${lead.objection}`,
        tone: 'Empathetic & Grounded',
      };

    case 'Kannada':
      return {
        vernacularScript: `ನಮಸ್ಕಾರ ${lead.parentName} ಅವರೇ, ನಾನು ನಿಮ್ಮ ${lead.district} ${alumnus.hometown}ದ NIAT ಹಳೆಯ ವಿದ್ಯಾರ್ಥಿ ${alumnus.name}. ${lead.studentName} ಬಗ್ಗೆ ತಿಳಿಯಿತು. ನನ್ನ ಪೋಷಕರಿಗೂ ಮೊದಲು ${lead.objection.toLowerCase()} ಬಗ್ಗೆ ಆತಂಕವಿತ್ತು. ಆದರೆ ಪ್ರಾಕ್ಟಿಕಲ್ ತರಬೇತಿಯಿಂದ ${alumnus.currentCompany}ನಲ್ಲಿ ₹${alumnus.startingCtc} LPA ಉದ್ಯೋಗ ದೊರೆತಿದೆ. ಧೈರ್ಯವಾಗಿ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳಿ.`,
        englishTranslation: `Namaskara ${lead.parentName} avare, I am alumnus ${alumnus.name} from ${alumnus.hometown}, ${lead.district}. I heard about ${lead.studentName}. My parents also worried about ${lead.objection.toLowerCase()}. But practical training landed me ₹${alumnus.startingCtc} LPA at ${alumnus.currentCompany}. You can decide with full confidence.`,
        voiceEmphasis: [alumnus.hometown, `₹${alumnus.startingCtc} LPA`, alumnus.currentCompany],
        keyAnchorPoint: `Demonstrated recovery at ${alumnus.currentCompany} eliminates objection`,
        tone: 'Empathetic & Grounded',
      };

    case 'Malayalam':
      return {
        vernacularScript: `നമസ്കാരം ${lead.parentName}, ഞാൻ ${lead.district} ${alumnus.hometown}ൽ നിന്നുള്ള NIAT അലുമ്നൈ ${alumnus.name} ആണ്. ${lead.studentName}ന്റെ കാര്യത്തിൽ ആശങ്ക വേണ്ട. എനിക്കും തുടക്കത്തിൽ ${lead.objection.toLowerCase()} ഉണ്ടായിരുന്നു. എന്നാൽ ${alumnus.currentCompany}യിൽ ₹${alumnus.startingCtc} LPA ലഭിച്ചതോടെ കുടുംബത്തിന്റെ സാമ്പത്തിക ഭാരം മാറി. പൂർണ്ണ ധൈര്യത്തോടെ മുന്നോട്ട് പോകാം.`,
        englishTranslation: `Namaskaram ${lead.parentName}, I am alumnus ${alumnus.name} from ${alumnus.hometown}, ${lead.district}. Don't worry regarding ${lead.studentName}. I also had hesitation regarding ${lead.objection.toLowerCase()}. But securing ₹${alumnus.startingCtc} LPA at ${alumnus.currentCompany} changed everything. You can proceed with total faith.`,
        voiceEmphasis: [alumnus.hometown, `₹${alumnus.startingCtc} LPA`, alumnus.currentCompany],
        keyAnchorPoint: `Direct regional success story removes hesitation`,
        tone: 'Empathetic & Grounded',
      };

    default:
      return {
        vernacularScript: `Hello ${lead.parentName}, this is alumnus ${alumnus.name} from ${alumnus.hometown}, ${lead.district}. I understand your concern regarding ${lead.objection.toLowerCase()}. Through NIAT practical labs, I secured ₹${alumnus.startingCtc} LPA at ${alumnus.currentCompany}, clearing fees in under a year. You can trust this path for ${lead.studentName}.`,
        englishTranslation: `Hello ${lead.parentName}, this is alumnus ${alumnus.name} from ${alumnus.hometown}, ${lead.district}. I understand your concern regarding ${lead.objection.toLowerCase()}. Through NIAT practical labs, I secured ₹${alumnus.startingCtc} LPA at ${alumnus.currentCompany}, clearing fees in under a year. You can trust this path for ${lead.studentName}.`,
        voiceEmphasis: [alumnus.district, `₹${alumnus.startingCtc} LPA`, alumnus.currentCompany],
        keyAnchorPoint: `Demonstrated direct localized outcome at ${alumnus.currentCompany}`,
        tone: 'Empathetic & Grounded',
      };
  }
}
