import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Layers, 
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { RateRegime, FxRegime } from '../types';
import { PRESET_SCENARIOS } from '../utils/macroUnifiedEngine';

interface PresentationModeProps {
  onClose: () => void;
  activeSlideIndex: number;
  setActiveSlideIndex: (idx: number) => void;
  onSelectScenario: (r: RateRegime, f: FxRegime, fedRate: number, usdkrw: number) => void;
  renderSlideContent: (idx: number) => React.ReactNode;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  onClose,
  activeSlideIndex,
  setActiveSlideIndex,
  onSelectScenario,
  renderSlideContent
}) => {
  const slideTitles = [
    ...PRESET_SCENARIOS.map(p => `[${p.badge}] ${p.title}`),
    '종합 총괄: 원본 PPT 팩트체크 교정 내역 & 매크로 4대 불변 법칙 결산'
  ];

  const totalSlides = slideTitles.length;

  const goToSlide = (idx: number) => {
    setActiveSlideIndex(idx);
    if (idx < PRESET_SCENARIOS.length) {
      const preset = PRESET_SCENARIOS[idx];
      onSelectScenario(preset.rateRegime, preset.fxRegime, preset.fedRate, preset.usdkrw);
    }
  };

  const handlePrev = () => {
    if (activeSlideIndex > 0) goToSlide(activeSlideIndex - 1);
  };

  const handleNext = () => {
    if (activeSlideIndex < totalSlides - 1) goToSlide(activeSlideIndex + 1);
  };

  const currentPreset = activeSlideIndex < PRESET_SCENARIOS.length ? PRESET_SCENARIOS[activeSlideIndex] : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Top Presentation Bar */}
      <div className="h-16 px-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold">
            SLIDE {activeSlideIndex + 1} / {totalSlides}
          </span>

          {currentPreset && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
              currentPreset.category === 'NORMAL' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            }`}>
              {currentPreset.category === 'NORMAL' ? <ShieldCheck className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {currentPreset.category === 'NORMAL' ? '일반 상황' : '예외 상황'}
            </span>
          )}

          <h2 className="text-sm font-bold text-white tracking-tight truncate max-w-xl">
            {slideTitles[activeSlideIndex]}
          </h2>
        </div>

        {/* Quick Nav Dots */}
        <div className="hidden lg:flex items-center gap-1.5">
          {slideTitles.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                activeSlideIndex === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition border border-slate-700"
        >
          <X className="w-4 h-4" />
          <span>프레젠테이션 종료 (ESC)</span>
        </button>
      </div>

      {/* Main Slide Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {renderSlideContent(activeSlideIndex)}
      </div>

      {/* Bottom Floating Navigation Bar */}
      <div className="h-16 px-6 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={activeSlideIndex === 0}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
            activeSlideIndex === 0
              ? 'opacity-40 cursor-not-allowed text-slate-600 border-slate-800'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>이전 슬라이드</span>
        </button>

        <div className="text-xs text-slate-400 hidden sm:block">
          일반 동행 상황 vs 예외 디커플링 & 고금리/저금리 유지(Level) 입체 시뮬레이션
        </div>

        <button
          onClick={handleNext}
          disabled={activeSlideIndex === totalSlides - 1}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
            activeSlideIndex === totalSlides - 1
              ? 'opacity-40 cursor-not-allowed text-slate-600 border-slate-800'
              : 'bg-cyan-600 text-white hover:bg-cyan-500 border-cyan-500 shadow-md shadow-cyan-600/20'
          }`}
        >
          <span>다음 슬라이드</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
