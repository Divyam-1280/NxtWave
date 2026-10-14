import { Lead, Alumnus } from '../types';
import { ALUMNI_DATABASE } from '../data/alumniData';

export interface MatchResult {
  alumnus: Alumnus;
  matchScore: number;
  matchGrade: 'Perfect Match' | 'High Affinity' | 'Regional Synergy';
  rationale: string;
  demographicVector: {
    districtMatch: boolean;
    stateMatch: boolean;
    languageMatch: boolean;
    objectionMatch: boolean;
    salaryRelatabilityScore: number;
  };
}

export function matchAlumnusForLead(lead: Lead, alumniPool: Alumnus[] = ALUMNI_DATABASE): MatchResult {
  let bestScore = -1;
  let bestAlumnus = alumniPool[0];
  let bestVector = {
    districtMatch: false,
    stateMatch: false,
    languageMatch: false,
    objectionMatch: false,
    salaryRelatabilityScore: 85,
  };
  let bestRationale = '';

  for (const alum of alumniPool) {
    let score = 0;
    const isStateMatch = alum.state.toLowerCase() === lead.state.toLowerCase();
    const isDistrictMatch = alum.district.toLowerCase() === lead.district.toLowerCase() || 
                            alum.hometown.toLowerCase().includes(lead.district.toLowerCase());
    const isLanguageMatch = alum.language === lead.language;
    const isObjectionMatch = alum.addressedObjections.includes(lead.objection);
    const isCollegeMatch = lead.targetCollege.toLowerCase().includes(alum.college.split(' ')[0].toLowerCase());

    if (isDistrictMatch) score += 35;
    else if (isStateMatch) score += 20;

    if (isLanguageMatch) score += 25;
    if (isObjectionMatch) score += 25;
    if (isCollegeMatch) score += 10;

    // Relatability penalty if starting salary is unrealistic (e.g. > 15 LPA)
    const salaryScore = alum.startingCtc <= 10 && alum.startingCtc >= 6 ? 95 : 75;
    score += (salaryScore * 0.05);

    if (score > bestScore) {
      bestScore = score;
      bestAlumnus = alum;
      bestVector = {
        districtMatch: isDistrictMatch,
        stateMatch: isStateMatch,
        languageMatch: isLanguageMatch,
        objectionMatch: isObjectionMatch,
        salaryRelatabilityScore: salaryScore,
      };

      const reasons: string[] = [];
      if (isDistrictMatch) reasons.push(`hometown proximity (${alum.district} / ${alum.hometown})`);
      else if (isStateMatch) reasons.push(`same home state (${alum.state})`);
      if (isLanguageMatch) reasons.push(`native ${alum.language} speaker`);
      if (isObjectionMatch) reasons.push(`directly overcame "${lead.objection}"`);
      reasons.push(`attainable ₹${alum.startingCtc} LPA package at ${alum.currentCompany}`);

      bestRationale = `Selected ${alum.name} based on ${reasons.join(', ')}.`;
    }
  }

  // Normalize score between 88% and 98% for realistic enterprise confidence
  const normalizedScore = Math.min(98, Math.max(88, Math.round(bestScore * 0.95)));

  let matchGrade: MatchResult['matchGrade'] = 'High Affinity';
  if (normalizedScore >= 95) matchGrade = 'Perfect Match';
  else if (normalizedScore >= 90) matchGrade = 'High Affinity';
  else matchGrade = 'Regional Synergy';

  return {
    alumnus: bestAlumnus,
    matchScore: normalizedScore,
    matchGrade,
    rationale: bestRationale,
    demographicVector: bestVector,
  };
}
