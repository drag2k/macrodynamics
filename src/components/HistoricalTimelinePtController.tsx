import React, { useState, useEffect } from 'react';
import { 
  HistoricalMacroPoint, 
  HISTORICAL_MACRO_TIMELINE 
} from '../data/historicalTimelineData';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Calendar,
  Layers,
  ArrowRight,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface HistoricalTimelinePtControllerProps {
  currentPointId: string;
  onSelectPoint: (point: HistoricalMacroPoint) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const HistoricalTimelinePtController: React.FC<HistoricalTimelinePtControllerProps> = ({
  currentPointId,
  onSelectPoint,
  isOpen,
  onToggleOpen
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentIndex = Math.max(
    0, 
    HISTORICAL_MACRO_TIMELINE.findIndex(p => p.id === currentPointId)
  );
  const currentPoint = HISTORICAL_MACRO_TIMELINE[currentIndex];

  // Auto-play timer (slides every 6 seconds)
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      const nextIdx = (currentIndex + 1) % HISTORICAL_MACRO_TIMELINE.length;
      onSelectPoint(HISTORICAL_MACRO_TIMELINE[nextIdx]);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, onSelectPoint]);

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + HISTORICAL_MACRO_TIMELINE.length) % HISTORICAL_MACRO_TIMELINE.length;
    onSelectPoint(HISTORICAL_MACRO_TIMELINE[prevIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % HISTORICAL_MACRO_TIMELINE.length;
    onSelectPoint(HISTORICAL_MACRO_TIMELINE[nextIdx]);
  };

  if (!isOpen) {
    return (
      <div className="flex justify-end mb-3">
        <button
          onClick={onToggleOpen}
          className="group px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-500/40 hover:to-blue-500/40 border border-cyan-500/50 text-cyan-200 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
          <span>🎬 최근 미국 실측 타임라인 PT 모드 켜기 (2024~2026)</span>
          <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded-full font-mono text-cyan-300">
            실측 5개 시점
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-5 bg-slate-900/95 rounded-2xl border-2 border-cyan-500/40 p-4 sm:p-5 shadow-2xl shadow-cyan-950/60 transition-all">
      {/* 1. Header Bar: Mode Badge & Play Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                HISTORICAL REPLAY & DIVERGENCE PT
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                {currentIndex + 1} / {HISTORICAL_MACRO_TIMELINE.length}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              최근 미국 실측 시장 변동성 & 이론과의 괴리 분석
            </h3>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
            <button
              onClick={handlePrev}
              title="이전 시점"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? '자동 재생 일시정지' : '자동 재생 (6초 간격)'}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                isPlaying 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? '재생 중' : '자동 재생'}</span>
            </button>
            <button
              onClick={handleNext}
              title="다음 시점"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onToggleOpen}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            접기
          </button>
        </div>
      </div>

      {/* 2. Timeline Step Navigator (Horizontal Rail) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        {HISTORICAL_MACRO_TIMELINE.map((item, idx) => {
          const isActive = item.id === currentPoint.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setIsPlaying(false);
                onSelectPoint(item);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-400/40'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500" />
              )}
              <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                <span className={isActive ? 'text-cyan-300' : 'text-slate-500'}>
                  STEP 0{idx + 1}
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                  isActive ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.period}
                </span>
              </div>
              <div className="text-xs font-extrabold text-white truncate">
                {item.themeBadge}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                <span>GDP {item.realGdp > 0 ? `+${item.realGdp}` : item.realGdp}%</span>
                <span>·</span>
                <span>CPI {item.cpiInflation}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Real Market Snapshot Bar */}
      <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 mb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="font-extrabold text-white text-sm">
            {currentPoint.period} : {currentPoint.title}
          </span>
        </div>

        {/* Fundamental Real Data Chips */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            실질 GDP: <strong className="text-emerald-400">{currentPoint.realGdp > 0 ? `+${currentPoint.realGdp}` : currentPoint.realGdp}%</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            소비자물가 CPI: <strong className="text-rose-400">{currentPoint.cpiInflation}%</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            기준금리: <strong className="text-amber-300">{currentPoint.fedRate.toFixed(2)}%</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            순유동성: <strong className="text-cyan-300">${currentPoint.netLiquidity}T</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            환율: <strong className="text-purple-300">{currentPoint.usdkrw}원</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
            미국채10Y: <strong className="text-amber-400">{currentPoint.treasury10Y}%</strong>
          </span>
        </div>
      </div>

      {/* 4. [Core Value] Theoretical Baseline vs Actual Divergence Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Left: Standard Theory Prediction (Col 4) */}
        <div className="lg:col-span-4 bg-slate-950/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>📘 표준 이론 모델의 교과서적 예측</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentPoint.divergence.standardTheoryPrediction}
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>자산 시장 예측치</span>
            <span className="text-slate-400">금리/유동성 역학 기준</span>
          </div>
        </div>

        {/* Center: Actual Market Phenomenon (Col 3) */}
        <div className="lg:col-span-3 bg-slate-950/90 rounded-xl p-3.5 border border-cyan-900/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>🚀 실제 시장의 반응 (실측치)</span>
            </div>
            <div className="text-sm font-black text-white mb-1">
              {currentPoint.sp500Trend}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentPoint.divergence.actualMarketBehavior}
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-800/80 text-[11px] text-cyan-400/90 font-mono">
            {currentPoint.assetReactionSummary}
          </div>
        </div>

        {/* Right: Why Divergence Happened (Col 5) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-950/20 to-slate-950 rounded-xl p-3.5 border border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300 mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>💡 이론과 실제의 괴리가 발생한 본원적 이유</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
              {currentPoint.divergence.divergenceReason}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-amber-500/20 bg-amber-500/10 -mx-1 px-2.5 py-1.5 rounded-lg flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] font-bold text-amber-200 leading-snug">
              <strong>핵심 시사점:</strong> {currentPoint.divergence.keyTakeaway}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
