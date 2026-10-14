import React, { useState } from 'react';
import { 
  Users, Plus, ChevronDown, ChevronUp, MapPin, 
  Sparkles, AlertCircle, Building2
} from 'lucide-react';
import type { Lead, Language, ObjectionType } from '../../types';

interface LeadHubProps {
  leads: Lead[];
  selectedLead: Lead;
  onSelectLead: (lead: Lead) => void;
  onAddCustomLead: (newLead: Omit<Lead, 'id' | 'createdAt' | 'status' | 'daysStagnant'>) => void;
  onTriggerPipeline: () => void;
  isPipelineRunning: boolean;
}

export const LeadHub: React.FC<LeadHubProps> = ({
  leads,
  selectedLead,
  onSelectLead,
  onAddCustomLead,
  onTriggerPipeline,
  isPipelineRunning,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedObjection, setSelectedObjection] = useState<string>('All');
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Custom Lead Creator Form State
  const [customStudent, setCustomStudent] = useState('');
  const [customParent, setCustomParent] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');
  const [customState, setCustomState] = useState('Andhra Pradesh');
  const [customCollege, setCustomCollege] = useState('Mohan Babu University');
  const [customLanguage, setCustomLanguage] = useState<Language>('Telugu');
  const [customObjection, setCustomObjection] = useState<ObjectionType>('Dual-fee expensive');
  const [customObjectionDetail, setCustomObjectionDetail] = useState('');

  const filteredLeads = leads.filter((lead) => {
    const matchesLang = selectedLanguage === 'All' || lead.language === selectedLanguage;
    const matchesObj = selectedObjection === 'All' || lead.objection === selectedObjection;
    return matchesLang && matchesObj;
  });

  const handleCreateCustomLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStudent.trim() || !customParent.trim() || !customDistrict.trim()) {
      alert('Please fill student name, parent name, and district.');
      return;
    }

    onAddCustomLead({
      studentName: customStudent.trim(),
      parentName: customParent.trim(),
      parentRelation: 'Father',
      district: customDistrict.trim(),
      state: customState,
      targetCollege: customCollege,
      language: customLanguage,
      objection: customObjection,
      objectionDetail: customObjectionDetail || `Parent questions value regarding ${customObjection.toLowerCase()}`,
      natScore: 82,
      natPercentile: 91.4,
      phone: '+91 9' + Math.floor(100000000 + Math.random() * 900000000),
    });

    setIsCreatorOpen(false);
    setCustomStudent('');
    setCustomParent('');
    setCustomDistrict('');
    setCustomObjectionDetail('');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200">
      
      {/* Funnel Metrics Banner (White, Green & Red) */}
      <div className="p-4 border-b border-neutral-200 bg-neutral-50/70">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-display">
              1. Stagnant Lead Intake
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-neutral-200 text-neutral-600 shadow-xs">
            Post-NAT Queue
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="p-2.5 rounded-lg bg-white border border-neutral-200 shadow-xs">
            <div className="text-[10px] text-neutral-500 font-medium">Stagnant Leads</div>
            <div className="text-sm font-bold text-neutral-900 font-mono">1,420 Leads</div>
            <div className="text-[9px] text-neutral-500">7+ days pending</div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 shadow-xs">
            <div className="text-[10px] text-emerald-700 font-semibold">Target Conversion</div>
            <div className="text-sm font-bold text-emerald-700 font-mono">2.1% → 5.2%</div>
            <div className="text-[9px] text-emerald-600 font-medium">+₹4.68 Cr Revenue</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Creator */}
      <div className="p-3 border-b border-neutral-200 space-y-2.5 bg-white">
        
        {/* Language Filter */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
            <span>Language Filter</span>
            <span className="text-neutral-500 font-mono text-[10px]">{filteredLeads.length} leads</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {['All', 'Telugu', 'Tamil', 'Hindi', 'Kannada', 'Malayalam'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                  selectedLanguage === lang
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Objection Filter */}
        <div>
          <div className="text-[11px] text-neutral-500 mb-1">Filter by Parent Hesitation</div>
          <select
            value={selectedObjection}
            onChange={(e) => setSelectedObjection(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-neutral-300 text-neutral-900 text-xs focus:outline-none focus:border-emerald-600 shadow-xs"
          >
            <option value="All">All Objections</option>
            <option value="Dual-fee expensive">Dual-fee expensive</option>
            <option value="Doubt placement claims">Doubt placement claims</option>
            <option value="Afraid of coding difficulty">Afraid of coding difficulty</option>
            <option value="Distance / Hostel hesitation">Distance / Hostel hesitation</option>
          </select>
        </div>

        {/* Custom Lead Creator Trigger */}
        <button
          onClick={() => setIsCreatorOpen(!isCreatorOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-semibold text-neutral-800 transition-colors shadow-xs"
        >
          <span className="flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Create Custom Lead for Testing</span>
          </span>
          {isCreatorOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Collapsible Custom Lead Form */}
        {isCreatorOpen && (
          <form onSubmit={handleCreateCustomLead} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-300 space-y-2.5 animate-in slide-in-from-top-2 duration-150 text-xs shadow-sm">
            <div className="font-bold text-neutral-900 text-[11px] uppercase tracking-wider flex items-center justify-between">
              <span>Enter Custom Lead</span>
              <span className="text-emerald-700 font-mono text-[10px]">Evaluator Form</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-600 font-medium">Student Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Reddy"
                  value={customStudent}
                  onChange={(e) => setCustomStudent(e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-white border border-neutral-300 text-neutral-900 text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-600 font-medium">Parent Name</label>
                <input
                  type="text"
                  placeholder="e.g. Venkat Reddy"
                  value={customParent}
                  onChange={(e) => setCustomParent(e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-white border border-neutral-300 text-neutral-900 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-600 font-medium">District / City</label>
                <input
                  type="text"
                  placeholder="e.g. Warangal"
                  value={customDistrict}
                  onChange={(e) => setCustomDistrict(e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-white border border-neutral-300 text-neutral-900 text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-600 font-medium">Language</label>
                <select
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value as Language)}
                  className="w-full px-2 py-1.5 rounded bg-white border border-neutral-300 text-neutral-900 text-xs"
                >
                  <option value="Telugu">Telugu</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-neutral-600 font-medium">State</label>
                <select
                  value={customState}
                  onChange={(e) => setCustomState(e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-white border border-neutral-300 text-neutral-900 text-xs"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Kerala">Kerala</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-neutral-600 font-medium">Target College</label>
                <input
                  type="text"
                  placeholder="e.g. Joy University"
                  value={customCollege}
                  onChange={(e) => setCustomCollege(e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-white border border-neutral-300 text-neutral-900 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-600 font-medium">Parent Objection</label>
              <select
                value={customObjection}
                onChange={(e) => setCustomObjection(e.target.value as ObjectionType)}
                className="w-full px-2 py-1.5 rounded bg-white border border-neutral-300 text-neutral-900 text-xs"
              >
                <option value="Dual-fee expensive">Dual-fee expensive</option>
                <option value="Doubt placement claims">Doubt placement claims</option>
                <option value="Afraid of coding difficulty">Afraid of coding difficulty</option>
                <option value="Distance / Hostel hesitation">Distance / Hostel hesitation</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-neutral-600 font-medium">Specific Detail</label>
              <input
                type="text"
                placeholder="e.g. Parent feels dual fee is not justified"
                value={customObjectionDetail}
                onChange={(e) => setCustomObjectionDetail(e.target.value)}
                className="w-full px-2 py-1.5 rounded bg-white border border-neutral-300 text-neutral-900 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-xs text-xs"
            >
              Add Custom Lead &amp; Select
            </button>
          </form>
        )}
      </div>

      {/* Leads List (Crisp White Cards with Red Objection Badges) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-neutral-50/50">
        {filteredLeads.map((lead) => {
          const isSelected = selectedLead.id === lead.id;
          return (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                    <span>{lead.studentName}</span>
                    <span className="text-[11px] text-neutral-500 font-normal">
                      ({lead.parentRelation}: {lead.parentName})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{lead.district}, {lead.state}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                  {lead.language}
                </span>
              </div>

              {/* Target College */}
              <div className="flex items-center gap-1 text-[11px] text-neutral-600 mt-2 truncate">
                <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="truncate">{lead.targetCollege}</span>
              </div>

              {/* Objection Tag in Crisp RED */}
              <div className="mt-2.5 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-700 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span className="truncate max-w-[170px]">{lead.objection}</span>
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {lead.daysStagnant}d stagnant
                </span>
              </div>

              {/* NAT Score indicator */}
              <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500">
                <span>NAT Score: <strong className="text-neutral-900 font-mono">{lead.natScore}/100</strong></span>
                <span className="text-emerald-700 font-bold">{lead.natPercentile}th %tile</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trigger Action Bar (Big Vibrant Green Button) */}
      <div className="p-3 border-t border-neutral-200 bg-white">
        <div className="text-[11px] text-neutral-500 mb-2 truncate">
          Selected: <strong className="text-neutral-900">{selectedLead.studentName}</strong> ({selectedLead.district})
        </div>
        <button
          id="btn-trigger-pipeline"
          onClick={onTriggerPipeline}
          disabled={isPipelineRunning}
          className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all ${
            isPipelineRunning
              ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${isPipelineRunning ? 'animate-spin' : ''}`} />
          <span>{isPipelineRunning ? 'Orchestrating Agents...' : 'Trigger AI Relatability Pipeline'}</span>
        </button>
      </div>

    </div>
  );
};
