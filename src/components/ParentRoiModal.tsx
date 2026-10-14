import React, { useState } from 'react';
import { 
  X, ShieldCheck, TrendingUp, Building2, FileCheck, PhoneCall
} from 'lucide-react';
import type { Lead, Alumnus } from '../types';

interface ParentRoiModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  alumnus: Alumnus | null;
  onRoiSliderAdjusted: () => void;
}

export const ParentRoiModal: React.FC<ParentRoiModalProps> = ({
  isOpen,
  onClose,
  lead,
  alumnus,
  onRoiSliderAdjusted,
}) => {
  const [programFee, setProgramFee] = useState<number>(4.2);
  const [targetPackage, setTargetPackage] = useState<number>(alumnus?.startingCtc || 7.2);
  const [requestedCall, setRequestedCall] = useState(false);

  if (!isOpen) return null;

  const annualSavings = targetPackage * 0.60;
  const paybackMonths = Math.max(6, Number(((programFee / annualSavings) * 12).toFixed(1)));
  const threeYearGross = targetPackage * 3.4;
  const threeYearNetSurplus = Number((threeYearGross - programFee).toFixed(1));
  const familyRoiPercent = Math.round((threeYearNetSurplus / programFee) * 100);

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgramFee(Number(e.target.value));
    onRoiSliderAdjusted();
  };

  const handlePackageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetPackage(Number(e.target.value));
    onRoiSliderAdjusted();
  };

  const handleRequestCall = () => {
    setRequestedCall(true);
    setTimeout(() => setRequestedCall(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 font-display">
                  NIAT Verified Regional Outcome &amp; Family ROI Portal
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 border border-neutral-200 text-emerald-700">
                  Ref #{alumnus?.offerLetterRef || 'NIAT-REF-9921'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Prepared specifically for <strong className="text-neutral-900">{lead.parentName}</strong> ({lead.district}, {lead.state})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-700">
          
          {/* Matched Alumnus Verified Offer Snapshot */}
          {alumnus && (
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-3.5">
                  <img
                    src={alumnus.avatarUrl}
                    alt={alumnus.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shrink-0 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-neutral-900">{alumnus.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold">
                        Verified Alumnus
                      </span>
                    </div>
                    <div className="text-xs text-neutral-800 mt-0.5">
                      {alumnus.role} • <strong className="text-emerald-700">{alumnus.currentCompany}</strong>
                    </div>
                    <div className="text-[11px] text-neutral-600 mt-1">
                      Hometown: <strong className="text-neutral-900">{alumnus.hometown}, {alumnus.district} ({alumnus.state})</strong>
                    </div>
                  </div>
                </div>

                {/* Offer Letter Badge */}
                <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-sm text-right sm:text-right w-full sm:w-auto">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Starting Package</div>
                  <div className="text-xl font-extrabold text-emerald-700 font-mono">
                    ₹{alumnus.startingCtc} LPA
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5 flex items-center justify-end gap-1">
                    <FileCheck className="w-3 h-3 text-emerald-600" />
                    <span>Offer ID: {alumnus.offerLetterRef}</span>
                  </div>
                </div>

              </div>

              {/* Verified Relatable Story */}
              <div className="mt-3.5 pt-3 border-t border-neutral-200 text-[11px] text-neutral-700 italic bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
                "{alumnus.relatableStory}"
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison: Traditional Local College vs NIAT */}
          <div>
            <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Local College vs. NIAT On-Campus Model Comparison
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Legacy Local College (Red Metrics) */}
              <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-200 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-red-200">
                  <span className="font-semibold text-neutral-800">Standard Local Private College</span>
                  <span className="text-[10px] text-neutral-500">Traditional</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Avg Tech Placement:</span>
                    <strong className="text-red-600 font-mono">₹1.8 – ₹2.4 LPA</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Core Placement Rate:</span>
                    <strong className="text-red-600 font-mono">14% (BPO / Support)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Practical Coding Hours:</span>
                    <strong className="text-neutral-700 font-mono">~120 Hours</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Curriculum:</span>
                    <strong className="text-neutral-700">Theory exams &amp; viva</strong>
                  </div>
                </div>
              </div>

              {/* Option B: NIAT Partner Campus (Green Metrics) */}
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border-2 border-emerald-500 space-y-2 relative shadow-sm">
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wide">
                    NIAT Powered
                  </span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200">
                  <span className="font-semibold text-neutral-900">NIAT Partner Campus</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Avg Starting Package:</span>
                    <strong className="text-emerald-700 font-mono">₹6.8 – ₹8.4 LPA</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Core Tech Placement:</span>
                    <strong className="text-emerald-700 font-mono">89.4% in Core Software</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Practical Coding Hours:</span>
                    <strong className="text-emerald-700 font-mono">1,800+ Hours Hands-on</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Degree Security:</span>
                    <strong className="text-neutral-900">Official UGC Accredited B.Tech</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Financial ROI Recovery Slider */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
                  Interactive Family ROI &amp; Payback Calculator
                </span>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 font-mono font-bold">
                Real-Time Recalculation
              </span>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Slider 1: Total Program Fee */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-600">Total Program Investment:</span>
                  <span className="font-mono font-bold text-neutral-900">₹{programFee.toFixed(1)} Lakhs</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="6.0"
                  step="0.1"
                  value={programFee}
                  onChange={handleFeeChange}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                />
                <div className="flex justify-between text-[9px] text-neutral-500">
                  <span>₹3.0L</span>
                  <span>₹4.5L</span>
                  <span>₹6.0L</span>
                </div>
              </div>

              {/* Slider 2: Target Package */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-600">Target Starting Package (CTC):</span>
                  <span className="font-mono font-bold text-emerald-700">₹{targetPackage.toFixed(1)} LPA</span>
                </div>
                <input
                  type="range"
                  min="5.5"
                  max="12.0"
                  step="0.1"
                  value={targetPackage}
                  onChange={handlePackageChange}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[9px] text-neutral-500">
                  <span>₹5.5 LPA (Min)</span>
                  <span>₹8.0 LPA</span>
                  <span>₹12.0 LPA</span>
                </div>
              </div>

            </div>

            {/* Output Metric Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-sm text-center">
                <div className="text-[10px] text-neutral-500">Fee Payback Period</div>
                <div className="text-lg font-extrabold text-emerald-700 font-mono mt-0.5">
                  {paybackMonths} Months
                </div>
                <div className="text-[9px] text-neutral-500 mt-0.5">from first job start</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-sm text-center">
                <div className="text-[10px] text-neutral-500">3-Year Net Family Surplus</div>
                <div className="text-lg font-extrabold text-neutral-900 font-mono mt-0.5">
                  +₹{threeYearNetSurplus} Lakhs
                </div>
                <div className="text-[9px] text-neutral-500 mt-0.5">after tuition deduction</div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-sm text-center">
                <div className="text-[10px] text-neutral-500">Family ROI Multiple</div>
                <div className="text-lg font-extrabold text-emerald-700 font-mono mt-0.5">
                  {familyRoiPercent}%
                </div>
                <div className="text-[9px] text-neutral-500 mt-0.5">return on education</div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-neutral-500 text-center sm:text-left">
            Adjusting sliders triggers live telemetry to regional admissions desk.
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:text-black hover:bg-neutral-200 transition-colors"
            >
              Close Portal
            </button>
            <button
              onClick={handleRequestCall}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{requestedCall ? 'Callback Scheduled!' : `Request Callback in ${lead.language}`}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
