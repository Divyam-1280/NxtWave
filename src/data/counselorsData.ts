import { CounselorProfile, Lead } from '../types';

export const COUNSELORS_DATABASE: CounselorProfile[] = [
  // --- TELUGU COHORT (Andhra Pradesh & Telangana) ---
  {
    id: 'counselor-telugu-1',
    name: 'Kavya Reddy',
    role: 'Senior Admissions Lead (Coastal AP)',
    languages: ['Telugu', 'English'],
    regionSpecialty: 'Guntur, Tenali, Vijayawada & Krishna Belt',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    experienceYears: 5.2,
    closingRatePercent: 94,
    activeStatus: 'Available',
    phoneExtension: 'ext. 402',
  },
  {
    id: 'counselor-telugu-2',
    name: 'Suresh Varma',
    role: 'Technical Admissions Specialist',
    languages: ['Telugu', 'English'],
    regionSpecialty: 'Hyderabad, Warangal & Rayalaseema',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    experienceYears: 4.5,
    closingRatePercent: 91,
    activeStatus: 'Available',
    phoneExtension: 'ext. 409',
  },
  {
    id: 'counselor-telugu-3',
    name: 'Pooja Chowdary',
    role: 'Parent Conversion Lead',
    languages: ['Telugu', 'English'],
    regionSpecialty: 'Visakhapatnam, Kakinada & Godavari Districts',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    experienceYears: 3.8,
    closingRatePercent: 89,
    activeStatus: 'Available',
    phoneExtension: 'ext. 415',
  },
  {
    id: 'counselor-telugu-4',
    name: 'Ramana Rao',
    role: 'Admissions Dean (Rayalaseema Belt)',
    languages: ['Telugu', 'English'],
    regionSpecialty: 'Tirupati, Nellore, Chittoor & Anantapur',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    experienceYears: 6.5,
    closingRatePercent: 96,
    activeStatus: 'Available',
    phoneExtension: 'ext. 422',
  },
  {
    id: 'counselor-telugu-5',
    name: 'Swathi Goud',
    role: 'Student Career Counselor',
    languages: ['Telugu', 'English', 'Hindi'],
    regionSpecialty: 'Nizamabad, Karimnagar, Nalgonda & North Telangana',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250',
    experienceYears: 4.0,
    closingRatePercent: 92,
    activeStatus: 'Available',
    phoneExtension: 'ext. 431',
  },

  // --- TAMIL COHORT (Tamil Nadu) ---
  {
    id: 'counselor-tamil-1',
    name: 'Karthik Sundaram',
    role: 'Regional Admissions Director',
    languages: ['Tamil', 'English'],
    regionSpecialty: 'Madurai, Melur, Dindigul & South TN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    experienceYears: 6.0,
    closingRatePercent: 95,
    activeStatus: 'Available',
    phoneExtension: 'ext. 501',
  },
  {
    id: 'counselor-tamil-2',
    name: 'Deepa Natarajan',
    role: 'Senior Admissions Partner',
    languages: ['Tamil', 'English'],
    regionSpecialty: 'Coimbatore, Salem, Trichy & Kongu Belt',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    experienceYears: 4.2,
    closingRatePercent: 92,
    activeStatus: 'Available',
    phoneExtension: 'ext. 508',
  },
  {
    id: 'counselor-tamil-3',
    name: 'Vigneshwaran K',
    role: 'Tech Career Advisor',
    languages: ['Tamil', 'English'],
    regionSpecialty: 'Chennai, Kanchipuram, Vellore & North TN',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    experienceYears: 3.9,
    closingRatePercent: 90,
    activeStatus: 'Available',
    phoneExtension: 'ext. 514',
  },
  {
    id: 'counselor-tamil-4',
    name: 'Meera Subramanian',
    role: 'Parent Relatability Lead',
    languages: ['Tamil', 'English'],
    regionSpecialty: 'Thanjavur, Cuddalore, Kumbakonam & Delta Region',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
    experienceYears: 4.7,
    closingRatePercent: 93,
    activeStatus: 'Available',
    phoneExtension: 'ext. 520',
  },

  // --- HINDI COHORT (North India / Hindi Belt) ---
  {
    id: 'counselor-hindi-1',
    name: 'Neha Tiwari',
    role: 'Senior Regional Counselor',
    languages: ['Hindi', 'English'],
    regionSpecialty: 'Meerut, Modinagar, Ghaziabad & West UP',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    experienceYears: 4.8,
    closingRatePercent: 93,
    activeStatus: 'Available',
    phoneExtension: 'ext. 204',
  },
  {
    id: 'counselor-hindi-2',
    name: 'Rohan Malhotra',
    role: 'Admissions Strategy Lead',
    languages: ['Hindi', 'English'],
    regionSpecialty: 'Delhi NCR, Gurgaon, Noida & Haryana',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    experienceYears: 5.5,
    closingRatePercent: 92,
    activeStatus: 'Available',
    phoneExtension: 'ext. 211',
  },
  {
    id: 'counselor-hindi-3',
    name: 'Amitabh Saxena',
    role: 'Central Zone Admissions Head',
    languages: ['Hindi', 'English'],
    regionSpecialty: 'Lucknow, Kanpur, Prayagraj, Varanasi & Bihar',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    experienceYears: 6.2,
    closingRatePercent: 95,
    activeStatus: 'Available',
    phoneExtension: 'ext. 218',
  },
  {
    id: 'counselor-hindi-4',
    name: 'Sunita Sharma',
    role: 'Parent Trust Specialist',
    languages: ['Hindi', 'English'],
    regionSpecialty: 'Agra, Mathura, Aligarh, Bareilly & Braj Belt',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    experienceYears: 5.0,
    closingRatePercent: 94,
    activeStatus: 'Available',
    phoneExtension: 'ext. 226',
  },
  {
    id: 'counselor-hindi-5',
    name: 'Vikramaditya Chauhan',
    role: 'Engineering Career Mentor',
    languages: ['Hindi', 'English'],
    regionSpecialty: 'Jaipur, Kota, Udaipur, Jodhpur & Rajasthan',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    experienceYears: 4.1,
    closingRatePercent: 91,
    activeStatus: 'Available',
    phoneExtension: 'ext. 235',
  },

  // --- KANNADA COHORT (Karnataka) ---
  {
    id: 'counselor-kannada-1',
    name: 'Priyanka Rao',
    role: 'North Karnataka Admissions Lead',
    languages: ['Kannada', 'English'],
    regionSpecialty: 'Hubballi-Dharwad, Belagavi, Bagalkot & Uttara Kannada',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
    experienceYears: 4.1,
    closingRatePercent: 93,
    activeStatus: 'Available',
    phoneExtension: 'ext. 603',
  },
  {
    id: 'counselor-kannada-2',
    name: 'Darshan Gowda',
    role: 'Admissions & Placement Counselor',
    languages: ['Kannada', 'English'],
    regionSpecialty: 'Bengaluru, Mysuru, Mandya, Hassan & Tumakuru',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    experienceYears: 3.5,
    closingRatePercent: 88,
    activeStatus: 'Available',
    phoneExtension: 'ext. 612',
  },
  {
    id: 'counselor-kannada-3',
    name: 'Shwetha Hegde',
    role: 'Coastal Karnataka Guidance Officer',
    languages: ['Kannada', 'English'],
    regionSpecialty: 'Mangaluru, Udupi, Shivamogga & Karwar',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    experienceYears: 4.6,
    closingRatePercent: 92,
    activeStatus: 'Available',
    phoneExtension: 'ext. 621',
  },

  // --- MALAYALAM COHORT (Kerala) ---
  {
    id: 'counselor-malayalam-1',
    name: 'Anjali Menon',
    role: 'Kerala Regional Admissions Lead',
    languages: ['Malayalam', 'English'],
    regionSpecialty: 'Kollam, Thiruvananthapuram, Alappuzha & Central Travancore',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    experienceYears: 5.0,
    closingRatePercent: 94,
    activeStatus: 'Available',
    phoneExtension: 'ext. 705',
  },
  {
    id: 'counselor-malayalam-2',
    name: 'Rahul Nair',
    role: 'Student Outreach Officer',
    languages: ['Malayalam', 'English'],
    regionSpecialty: 'Kochi, Thrissur, Palakkad & Malabar',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    experienceYears: 3.9,
    closingRatePercent: 90,
    activeStatus: 'Available',
    phoneExtension: 'ext. 714',
  },
  {
    id: 'counselor-malayalam-3',
    name: 'Gopika Krishnan',
    role: 'Academic Guidance Counselor',
    languages: ['Malayalam', 'English'],
    regionSpecialty: 'Kozhikode, Kannur, Kasaragod & Wayanad',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    experienceYears: 4.3,
    closingRatePercent: 92,
    activeStatus: 'Available',
    phoneExtension: 'ext. 723',
  },

  // --- PAN-INDIA / BILINGUAL COUNSELORS ---
  {
    id: 'counselor-national-1',
    name: 'Aditya Sengupta',
    role: 'Principal Admissions Architect',
    languages: ['English', 'Hindi'],
    regionSpecialty: 'National Technical Programs & Placement Strategy',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    experienceYears: 7.0,
    closingRatePercent: 97,
    activeStatus: 'Available',
    phoneExtension: 'ext. 101',
  },
  {
    id: 'counselor-national-2',
    name: 'Fatima Sheikh',
    role: 'Senior Family Guidance Lead',
    languages: ['English', 'Hindi'],
    regionSpecialty: 'National Merit Grants & Dual-Fee Scholarship Desk',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250',
    experienceYears: 5.8,
    closingRatePercent: 95,
    activeStatus: 'Available',
    phoneExtension: 'ext. 108',
  },
];

/**
 * Deterministic hash function for consistent initial distribution across leads.
 */
function getLeadHash(lead: Lead): number {
  const str = `${lead.id}-${lead.studentName}-${lead.phone || ''}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns all counselors capable of handling the specified lead based on language and region.
 */
export function getEligibleCounselorsForLead(lead: Lead): CounselorProfile[] {
  const languageMatches = COUNSELORS_DATABASE.filter((c) =>
    c.languages.some((l) => l.toLowerCase() === lead.language.toLowerCase())
  );

  const pool = languageMatches.length > 0 ? languageMatches : COUNSELORS_DATABASE;

  // Sort so district / region matching counselors appear at the very top
  return [...pool].sort((a, b) => {
    const aDistrict = a.regionSpecialty.toLowerCase().includes(lead.district.toLowerCase()) ? 1 : 0;
    const bDistrict = b.regionSpecialty.toLowerCase().includes(lead.district.toLowerCase()) ? 1 : 0;
    return bDistrict - aDistrict;
  });
}

/**
 * Selects an assigned counselor for a lead, supporting rotation/index cycling and custom selection.
 * Automatically hashes lead attributes so different leads get different counselors by default.
 */
export function getAssignedCounselorForLead(
  lead: Lead,
  cycleOffset: number = 0,
  specificCounselorId?: string
): CounselorProfile {
  if (specificCounselorId) {
    const specific = COUNSELORS_DATABASE.find((c) => c.id === specificCounselorId);
    if (specific) return specific;
  }

  const eligible = getEligibleCounselorsForLead(lead);
  if (eligible.length === 0) return COUNSELORS_DATABASE[0];

  const baseHash = getLeadHash(lead);
  const baseIndex = baseHash % eligible.length;
  const targetIndex = (baseIndex + Math.abs(cycleOffset)) % eligible.length;

  return eligible[targetIndex];
}
