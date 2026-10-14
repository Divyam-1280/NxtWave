export type Language = 'Telugu' | 'Tamil' | 'Hindi' | 'Kannada' | 'Malayalam' | 'English';

export type ObjectionType = 
  | 'Dual-fee expensive' 
  | 'Doubt placement claims' 
  | 'Afraid of coding difficulty' 
  | 'Distance / Hostel hesitation' 
  | 'Prefer traditional govt college';

export interface Lead {
  id: string;
  studentName: string;
  parentName: string;
  parentRelation: 'Father' | 'Mother' | 'Guardian';
  district: string;
  state: string;
  targetCollege: string;
  language: Language;
  objection: ObjectionType;
  objectionDetail: string;
  natScore: number; // e.g. 84/100
  natPercentile: number;
  daysStagnant: number;
  phone: string;
  status: 'pending' | 'matched' | 'dispatched' | 'engaged' | 'escalated';
  createdAt: string;
}

export interface Alumnus {
  id: string;
  name: string;
  hometown: string;
  district: string;
  state: string;
  language: Language;
  college: string;
  gradYear: number;
  startingCtc: number; // in LPA e.g. 7.2
  currentCompany: string;
  role: string;
  initialCodingSkill: 'Zero' | 'Beginner' | 'Non-CS Background';
  familyBackground: string;
  offerLetterRef: string;
  avatarUrl: string;
  relatableStory: string;
  addressedObjections: ObjectionType[];
}

export interface ScriptOutput {
  vernacularScript: string;
  englishTranslation: string;
  voiceEmphasis: string[];
  keyAnchorPoint: string;
  tone: 'Empathetic & Grounded' | 'Reassuring & Respectful' | 'Data-Backed & Warm';
  modelUsed?: string;
  tokensUsed?: number;
  isRealApi?: boolean;
}

export interface CounselorProfile {
  id: string;
  name: string;
  role: string;
  languages: Language[];
  regionSpecialty: string;
  avatarUrl: string;
  experienceYears: number;
  closingRatePercent: number;
  activeStatus: 'Available' | 'On Call' | 'In Consultation';
  phoneExtension: string;
}

export interface CounselorBattlecard {
  winProbabilityPercent: number;
  urgencyLevel: 'Immediate (<15 Mins)' | 'High Priority' | 'Follow-up';
  parentPsychologyAnalysis: string;
  openingPitchScript: string;
  customObjectionCounter: string;
  closingHook: string;
  recommendedAction: string;
  modelUsed?: string;
  assignedCounselor?: CounselorProfile;
}

export interface AgentExecutionLog {
  id: string;
  agentName: string;
  agentIndex: 1 | 2 | 3;
  status: 'idle' | 'running' | 'success' | 'error';
  startedAt?: number;
  completedAt?: number;
  durationMs?: number;
  tokensUsed?: number;
  modelUsed?: string;
  outputSummary?: string;
  rawDetails?: any;
}

export interface TelemetryEvent {
  id: string;
  leadId: string;
  eventType: 'whatsapp_delivered' | 'audio_started' | 'audio_progress' | 'audio_completed' | 'portal_opened' | 'roi_slider_adjusted' | 'counselor_escalated';
  timestamp: number;
  metadata?: Record<string, any>;
  scoreContribution: number;
}

export interface SettingsConfig {
  groqApiKey: string;
  geminiApiKey: string;
  selectedAiProvider: 'groq' | 'gemini' | 'auto';
  groqModel: string;
  geminiModel: string;
  elevenLabsApiKey: string;
  elevenLabsVoiceId: string;
  webhookUrl: string; // Discord / Telegram / Generic
  webhookPlatform: 'discord' | 'telegram' | 'generic';
  supabaseUrl: string;
  supabaseAnonKey: string;
  isDemoFallbackMode: boolean;
}
