import React, { useState } from 'react';
import { 
  HISTORICAL_ERA_PRESETS, 
  HistoricalEraPreset 
} from '../data/historicalEraData';
import { 
  BookOpen, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  AlertTriangle, 
  TrendingDown, 
  ShieldAlert, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  Landmark,
  Compass,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

interface HistoricalEraBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEraId: string;
  onSelectEra: (eraId: string) => void;
}

export const HistoricalEraBriefingModal: React.FC<HistoricalEraBriefingModalProps> = ({
  isOpen,
  onClose,
  activeEraId,
  onSelectEra
}) => {
  const [selectedTabEraId, setSelectedTabEraId] = useState<string>(activeEraId);
  const [isDeepDiveExpanded, setIsDeepDiveExpanded] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentEra = HISTORICAL_ERA_PRESETS.find(e => e.id === selectedTabEraId) || HISTORICAL_ERA_PRESETS[0];

  const handleApplyAndClose = (eraId: string) => {
    onSelectEra(eraId);
    onClose();
  };

  const getTagBadgeClass = (color: HistoricalEraPreset['tagColor']) => {
    switch (color) {
      case 'rose': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'amber': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'purple': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'emerald': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'blue': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'cyan':
      default: return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  HISTORICAL REGIME ARCHIVE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                  2000년 ~ 2026년 7대 거시 변곡점
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                역사적 시장 위기·전환기 아카이브 개요 & 상세 소개
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Era Selector Tabs Bar */}
        <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800 overflow-x-auto flex items-center gap-2 scrollbar-thin">
          {HISTORICAL_ERA_PRESETS.map((era) => {
            const isSelected = era.id === selectedTabEraId;
            const isCurrentlyActive = era.id === activeEraId;
            return (
              <button
                key={era.id}
                onClick={() => setSelectedTabEraId(era.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{era.shortTitle}</span>
                {isCurrentlyActive && (
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-emerald-400'}`} title="현재 대시보드에 적용 중" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Era Title & Action Banner */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTagBadgeClass(currentEra.tagColor)}`}>
                  {currentEra.coreQuadrant} 국면
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  기간: <b className="text-white">{currentEra.periodRange}</b> ({currentEra.durationMonths}개월)
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                {currentEra.name}
              </h3>
            </div>

            <button
              onClick={() => handleApplyAndClose(currentEra.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 shadow-lg ${
                activeEraId === currentEra.id
                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300 cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {activeEraId === currentEra.id ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>현재 대시보드에 가동 중</span>
                </>
              ) : (
                <>
                  <Sliders className="w-4 h-4" />
                  <span>이 시기 시뮬레이션 적용하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* ────────────────────────────────────────────────────────
              1. 핵심 개요 (Overview) 카드
          ──────────────────────────────────────────────────────── */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>핵심 개요 (Overview)</span>
                <span className="text-[11px] font-normal text-slate-400 font-mono">
                  — 거시 펀더멘털과 핵심 충격
                </span>
              </h4>
            </div>

            {/* Overview Summary */}
            <p className="text-sm leading-relaxed text-slate-200">
              {currentEra.overview.summary}
            </p>

            {/* Quick Context Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px] block mb-1 font-mono">거시 펀더멘털 환경</span>
                <span className="font-semibold text-cyan-300">{currentEra.overview.macroEnvironment}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px] block mb-1 font-mono">주요 촉발 요인 (Trigger)</span>
                <span className="font-semibold text-rose-300">{currentEra.overview.triggerEvent}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px] block mb-1 font-mono">최대 충격 / 변동 기록</span>
                <span className="font-semibold text-amber-300">{currentEra.overview.peakDrop}</span>
              </div>
            </div>

            {/* Key Macro Stats Ribbon */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">당시 핵심 금융 지표 변동 범위</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 text-[10px] block font-mono">S&P 500 최대 낙폭</span>
                  <span className="text-sm font-mono font-bold text-rose-400">{currentEra.stats.sp500MaxDrawdown}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 text-[10px] block font-mono">미국 기준금리 (최고/최저)</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">{currentEra.stats.peakFedRate} ➔ {currentEra.stats.troughFedRate}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 text-[10px] block font-mono">미 국채 10년물 금리</span>
                  <span className="text-sm font-mono font-bold text-amber-400">{currentEra.stats.treasury10YRange}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 text-[10px] block font-mono">원/달러 환율 피크</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">{currentEra.stats.usdkrwPeak}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────
              2. 확장 상세 소개 (Expandable Detailed Deep Dive)
          ──────────────────────────────────────────────────────── */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden">
            {/* Header Accordion Toggle */}
            <button
              onClick={() => setIsDeepDiveExpanded(!isDeepDiveExpanded)}
              className="w-full px-4 py-3 bg-slate-800/60 hover:bg-slate-800 transition flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">
                  상세 소개 (Deep-Dive Analysis)
                </span>
                <span className="text-[11px] text-amber-300/80 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {isDeepDiveExpanded ? '클릭하여 접기' : '클릭하여 상세히 펼쳐보기'}
                </span>
              </div>
              <div className="p-1 rounded bg-slate-900 text-slate-400">
                {isDeepDiveExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Accordion Body */}
            {isDeepDiveExpanded && (
              <div className="p-4 sm:p-5 space-y-4 text-xs divide-y divide-slate-800">
                {/* 1. 발발 배경 & 시장 과열 */}
                <div className="pt-2 first:pt-0 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold font-mono text-[11px]">
                    <Flame className="w-3.5 h-3.5" />
                    <span>1. 발발 배경 및 시장 과열 (Trigger Background)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pl-5">
                    {currentEra.deepDive.triggerBackground}
                  </p>
                </div>

                {/* 2. 연준의 정책 대응 & 유동성 경로 */}
                <div className="pt-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold font-mono text-[11px]">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>2. 연준 정책 대응 및 유동성 경로 (Monetary Policy & Liquidity)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pl-5">
                    {currentEra.deepDive.policyResponse}
                  </p>
                </div>

                {/* 3. 자산시장 파급 효과 */}
                <div className="pt-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-[11px]">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>3. 자산시장 파급 효과 (Asset Class Impact)</span>
                  </div>
                  <div className="text-slate-300 leading-relaxed pl-5 whitespace-pre-line bg-slate-950/60 p-3 rounded-lg border border-slate-850 font-sans">
                    {currentEra.deepDive.assetImpact}
                  </div>
                </div>

                {/* 4. 경제학 이론 vs 실제 시장의 괴리 */}
                <div className="pt-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>4. 전통 경제학 이론 vs 실제 시장 괴리 (Theory vs Reality Divergence)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pl-5 bg-amber-950/15 p-3 rounded-lg border border-amber-500/20 text-amber-100">
                    {currentEra.deepDive.theoreticalDivergence}
                  </p>
                </div>

                {/* 5. 현재 투자자를 위한 핵심 시사점 */}
                <div className="pt-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold font-mono text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>5. 현대 투자자를 위한 핵심 교훈 (Key Lessons for Investors)</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed pl-5 font-semibold bg-purple-950/20 p-3 rounded-lg border border-purple-500/30">
                    💡 {currentEra.deepDive.keyLessons}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>시기를 적용하면 타임라인 슬라이더와 6대 지표 그래프가 해당 연도로 즉시 재스케일링됩니다.</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
            >
              닫기
            </button>
            <button
              onClick={() => handleApplyAndClose(currentEra.id)}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>대시보드에 적용</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
