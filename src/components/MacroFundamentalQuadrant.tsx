import React, { useRef, useState, useCallback, useMemo } from 'react';
import { MacroQuadrant, AssetMetric } from '../types';
import { MACRO_QUADRANT_INFO, scoreToMacroFundamentals } from '../utils/macroUnifiedEngine';
import { 
  HistoricalMacroPoint, 
  HISTORICAL_MACRO_TIMELINE 
} from '../data/historicalTimelineData';
import { MonthlyMacroTimeSeriesPoint, MONTHLY_MACRO_SERIES } from '../data/monthlyMacroTimeSeries';
import { Sparkles, Flame, CloudLightning, Snowflake, Move, ArrowRight, ArrowUp, ArrowDown, ArrowLeft, Target, MapPin, Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface MacroFundamentalQuadrantProps {
  growthScore: number;       // -100 to +100
  inflationScore: number;    // -100 to +100
  currentQuadrant: MacroQuadrant;
  onQuadrantSelect: (quadrant: MacroQuadrant) => void;
  onCoordinatesChange: (growth: number, inflation: number) => void;
  selectedHistoricalPointId?: string;
  onSelectHistoricalPoint?: (point: HistoricalMacroPoint) => void;
  timeSeriesIndex?: number;
  onTimeSeriesIndexChange?: (index: number) => void;
  activeSeries?: MonthlyMacroTimeSeriesPoint[];
  isSimulationMode?: boolean;
  activeEraId?: string;
  activeEraTitle?: string;
  rateValue?: number;
  liquidityValue?: number;
  fxValue?: number;
  sp500Asset?: AssetMetric;
  kospiAsset?: AssetMetric;
}

export const MacroFundamentalQuadrant: React.FC<MacroFundamentalQuadrantProps> = ({
  growthScore,
  inflationScore,
  currentQuadrant,
  onQuadrantSelect,
  onCoordinatesChange,
  selectedHistoricalPointId,
  onSelectHistoricalPoint,
  timeSeriesIndex,
  onTimeSeriesIndexChange,
  activeSeries,
  isSimulationMode = true,
  activeEraId = 'recent-pivot-2024',
  activeEraTitle,
  rateValue,
  liquidityValue,
  fxValue,
  sp500Asset,
  kospiAsset,
}) => {
  const padRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Dynamic series based on active historical crisis era
  const currentSeries = useMemo(() => {
    return activeSeries && activeSeries.length > 0 ? activeSeries : MONTHLY_MACRO_SERIES;
  }, [activeSeries]);

  // Position percentage inside pad (0% ~ 100%)
  // growth: -100 (left 0%) to +100 (right 100%)
  // inflation: +100 (top 0%) to -100 (bottom 100%)
  const posX = Math.max(0, Math.min(100, ((growthScore + 100) / 200) * 100));
  const posY = Math.max(0, Math.min(100, ((100 - inflationScore) / 200) * 100));

  // Current real-world fundamental values
  const fundamentals = scoreToMacroFundamentals(growthScore, inflationScore);
  const info = MACRO_QUADRANT_INFO[currentQuadrant];

  // Continuous pointer tracker
  const updateCoordinatesFromPointer = useCallback((clientX: number, clientY: number) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    // Map pixel position to score range -100 to +100
    const newGrowth = Math.round(((x / rect.width) * 200) - 100);
    const newInflation = Math.round(100 - ((y / rect.height) * 200));

    onCoordinatesChange(
      Math.max(-100, Math.min(100, newGrowth)),
      Math.max(-100, Math.min(100, newInflation))
    );
  }, [onCoordinatesChange]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateCoordinatesFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateCoordinatesFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsDragging(false);
    }
  };

  // Y-axis tick mark definitions (CPI Inflation %)
  const yTicks = [
    { label: '6.0%+', desc: '고물가/긴축', top: '10%' },
    { label: '4.0%', desc: '경계 영역', top: '30%' },
    { label: '2.0%', desc: '★Fed 목표', top: '50%', isBenchmark: true },
    { label: '1.0%', desc: '저물가/안정', top: '70%' },
    { label: '0.0%', desc: '디플레이션', top: '90%' },
  ];

  // X-axis tick mark definitions (Real GDP Growth %)
  const xTicks = [
    { label: '-1.5%', desc: '역성장/침체', left: '10%' },
    { label: '0.5%', desc: '저성장 둔화', left: '30%' },
    { label: '2.0%', desc: '★잠재성장률', left: '50%', isBenchmark: true },
    { label: '3.5%', desc: '경기 확장', left: '70%' },
    { label: '5.0%', desc: '강한 호황', left: '90%' },
  ];

  // Dynamic milestone pins for the active era
  const milestonePins = useMemo(() => {
    // In free simulation mode, hide milestones completely to avoid phantom badges and keep canvas clean
    if (!isSimulationMode) return [];

    // For 2024~2026 era, use the detailed HISTORICAL_MACRO_TIMELINE points
    if (!activeEraId || activeEraId === 'recent-pivot-2024') {
      return HISTORICAL_MACRO_TIMELINE.map((p) => {
        const pinX = ((p.growthScore + 100) / 200) * 100;
        const pinY = ((100 - p.inflationScore) / 200) * 100;
        const isSelected = selectedHistoricalPointId === p.id;
        const labelShort = p.period.replace('년', '').replace('상반기', 'H1').replace('4분기', 'Q4').trim();
        return {
          id: p.id,
          pinX,
          pinY,
          isSelected,
          label: labelShort,
          title: `[실측] ${p.period}: ${p.title} (GDP ${p.realGdp}%, CPI ${p.cpiInflation}%)`,
          onClick: () => onSelectHistoricalPoint && onSelectHistoricalPoint(p),
        };
      });
    }

    // For other historical crises (2000 Dot-com, 2008 GFC, 2020 COVID), compute key milestones dynamically
    if (!currentSeries || currentSeries.length === 0) return [];

    const indices: number[] = [0]; // Start month

    // Inflection: min growth (crisis trough)
    let minGIdx = 0;
    let minGVal = 999;
    currentSeries.forEach((pt, i) => {
      if (pt.growthScore < minGVal) {
        minGVal = pt.growthScore;
        minGIdx = i;
      }
    });
    if (!indices.includes(minGIdx) && minGIdx > 0 && minGIdx < currentSeries.length - 1) {
      indices.push(minGIdx);
    }

    // Inflection: midpoint
    const midIdx = Math.floor(currentSeries.length / 2);
    if (!indices.includes(midIdx) && midIdx > 0 && midIdx < currentSeries.length - 1) {
      indices.push(midIdx);
    }

    // End month
    if (!indices.includes(currentSeries.length - 1)) {
      indices.push(currentSeries.length - 1);
    }

    indices.sort((a, b) => a - b);

    return indices.map((idx) => {
      const pt = currentSeries[idx];
      const pinX = ((pt.growthScore + 100) / 200) * 100;
      const pinY = ((100 - pt.inflationScore) / 200) * 100;
      const isSelected = timeSeriesIndex === idx;
      return {
        id: pt.id,
        pinX,
        pinY,
        isSelected,
        label: pt.label || pt.dateStr,
        title: `[실측] ${pt.dateStr}: ${pt.phaseTitle} (GDP ${pt.realGdp}%, CPI ${pt.cpiInflation}%)`,
        onClick: () => onTimeSeriesIndexChange && onTimeSeriesIndexChange(idx),
      };
    });
  }, [
    isSimulationMode,
    activeEraId,
    currentSeries,
    selectedHistoricalPointId,
    timeSeriesIndex,
    onSelectHistoricalPoint,
    onTimeSeriesIndexChange
  ]);

  return (
    <div id="macro-quadrant-panel" className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl select-none">
      {/* 1. Header: Primary Goal & Instructions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                STEP 1 : FUNDAMENTAL CAUSAL MAP
              </span>
              <span className="text-[9px] sm:text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full font-mono">
                드래그 조작
              </span>
            </div>
            <h2 className="text-xs sm:text-base font-extrabold text-white flex items-center gap-1.5 truncate">
              <span>거시경제 펀더멘털 좌표계 (실질GDP × CPI)</span>
              {activeEraTitle && isSimulationMode && (
                <span className="hidden md:inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  {activeEraTitle} 궤적 연동
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Current Active Quadrant Diagnosis Badge */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <span className="text-[11px] sm:text-xs text-slate-400 font-mono">현재 국면:</span>
          <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 shadow-sm ${
            currentQuadrant === 'GOLDILOCKS'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : currentQuadrant === 'REFLATION'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : currentQuadrant === 'STAGFLATION'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
          }`}>
            {currentQuadrant === 'GOLDILOCKS' && <Sparkles className="w-3.5 h-3.5" />}
            {currentQuadrant === 'REFLATION' && <Flame className="w-3.5 h-3.5" />}
            {currentQuadrant === 'STAGFLATION' && <CloudLightning className="w-3.5 h-3.5" />}
            {currentQuadrant === 'DEFLATION_RECESSION' && <Snowflake className="w-3.5 h-3.5" />}
            {info.title}
          </span>
        </div>
      </div>

      {/* 2. Step-by-Step User Action Guide Bar (Responsive) */}
      {/* Mobile single-row compact guide */}
      <div className="sm:hidden bg-slate-950/80 rounded-xl px-2.5 py-1.5 border border-slate-800/80 flex items-center justify-between text-[10px] font-mono mb-3">
        <span className="text-cyan-400 flex items-center gap-0.5">↔ GDP(침체↔호황)</span>
        <span className="text-slate-600">·</span>
        <span className="text-rose-400 flex items-center gap-0.5">↕ CPI(디플레↕인플레)</span>
      </div>

      {/* Desktop 2-column detailed guide */}
      <div className="hidden sm:grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-950/80 rounded-xl px-3.5 py-2 border border-slate-800/80 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            ↔ 가로축 (GDP 성장률 조작):
          </span>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-0.5"><ArrowLeft className="w-3 h-3 text-cyan-400" /> 왼쪽=침체</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 flex items-center gap-0.5">오른쪽=호황 <ArrowRight className="w-3 h-3 text-emerald-400" /></span>
          </div>
        </div>

        <div className="bg-slate-950/80 rounded-xl px-3.5 py-2 border border-slate-800/80 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            ↕ 세로축 (CPI 물가상승률 조작):
          </span>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-rose-400 flex items-center gap-0.5"><ArrowUp className="w-3 h-3 text-rose-400" /> 위=인플레</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 flex items-center gap-0.5">아래=디플레 <ArrowDown className="w-3 h-3 text-cyan-400" /></span>
          </div>
        </div>
      </div>

      {/* 3. The Precision Coordinate Plane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Main Chart Area with Real Axes & Numbers (Col 8) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-stretch gap-1.5 sm:gap-2">
            {/* Y-Axis (Vertical Left Column): CPI Numbers & Ticks */}
            <div className="w-11 sm:w-24 shrink-0 flex flex-col justify-between py-2 text-right pr-1 sm:pr-2 select-none border-r border-slate-800/80 relative">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-rose-400 block pb-1 border-b border-slate-800">
                물가(CPI)
              </span>

              {/* Ticks on Y-axis */}
              <div className="relative flex-1">
                {yTicks.map((tick, idx) => (
                  <div
                    key={idx}
                    className="absolute right-0 -translate-y-1/2 flex items-center gap-1 sm:gap-1.5"
                    style={{ top: tick.top }}
                  >
                    <div className="text-right leading-none">
                      <span className={`font-mono text-[10px] sm:text-xs font-black block ${tick.isBenchmark ? 'text-amber-300' : 'text-slate-300'}`}>
                        {tick.label}
                      </span>
                      <span className="text-[9px] text-slate-500 font-sans hidden sm:block">{tick.desc}</span>
                    </div>
                    <div className={`w-1.5 sm:w-2 h-0.5 ${tick.isBenchmark ? 'bg-amber-400' : 'bg-slate-700'}`} />
                  </div>
                ))}

                {/* Live Dynamic Y-Indicator Marker (Follows Puck) */}
                <div
                  className="absolute right-0 -translate-y-1/2 flex items-center gap-1 transition-all duration-75 pointer-events-none z-20"
                  style={{ top: `${posY}%` }}
                >
                  <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-rose-500 text-white font-mono text-[9px] sm:text-[10px] font-black shadow-lg">
                    {fundamentals.cpiInflation}%
                  </span>
                  <div className="w-1.5 sm:w-2.5 h-1 bg-rose-400 rounded-l" />
                </div>
              </div>
            </div>

            {/* Interactive Graph Surface (Canvas) */}
            <div className="flex-1 flex flex-col min-w-0">
              <div
                ref={padRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`relative w-full h-48 sm:h-72 bg-slate-950 rounded-2xl border ${
                  isDragging 
                    ? 'border-cyan-400 shadow-2xl shadow-cyan-500/20 ring-2 ring-cyan-400/40' 
                    : 'border-slate-700 hover:border-slate-600'
                } cursor-grab active:cursor-grabbing overflow-hidden touch-none`}
              >
                {/* 4-Quadrant Subtle Color Atmosphere (Clean, No Bloated Text) */}
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-rose-950/15 border-r border-b border-slate-800/80 pointer-events-none flex items-start p-2">
                  <span className="text-[10px] font-mono font-bold text-rose-400/40 tracking-wider">
                    STAGFLATION (스태그플레이션)
                  </span>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-amber-950/15 border-b border-slate-800/80 pointer-events-none flex items-start justify-end p-2">
                  <span className="text-[10px] font-mono font-bold text-amber-400/40 tracking-wider">
                    REFLATION (리플레이션)
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-950/15 border-r border-slate-800/80 pointer-events-none flex items-end p-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400/40 tracking-wider">
                    RECESSION (경기침체/디플레)
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-emerald-950/15 pointer-events-none flex items-end justify-end p-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400/40 tracking-wider">
                    GOLDILOCKS (골디락스)
                  </span>
                </div>

                {/* Benchmark Reference Grid Lines */}
                {/* Horizontal: Fed 2.0% Target Line */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-400/60 border-t border-dashed border-amber-400/80 pointer-events-none z-0" />
                {/* Vertical: Real Potential GDP 2.0% Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-400/60 border-l border-dashed border-emerald-400/80 pointer-events-none z-0" />

                {/* Equilibrium Center Point Tag */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[9px] font-mono text-slate-400 pointer-events-none z-10 shadow">
                  이상적 균형점 (GDP 2.0% / CPI 2.0%)
                </div>

                {/* CONTINUOUS 2D TRAJECTORY PATH (Active Era Real-World Trajectory Curve) */}
                <svg
                  className={`absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible transition-opacity duration-300 ${
                    isSimulationMode ? 'opacity-90' : 'opacity-25'
                  }`}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="trajectoryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Complete Trajectory Path */}
                  <path
                    d={currentSeries.reduce((acc, pt, idx) => {
                      const px = ((pt.growthScore + 100) / 200) * 100;
                      const py = ((100 - pt.inflationScore) / 200) * 100;
                      return `${acc} ${idx === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
                    }, '')}
                    fill="none"
                    stroke="url(#trajectoryGrad)"
                    strokeWidth={isSimulationMode ? "1.4" : "1.0"}
                    strokeDasharray={isSimulationMode ? "2,1.5" : "3,3"}
                    filter={isSimulationMode ? "url(#glow)" : undefined}
                  />

                  {/* Trajectory Traversed Segment Highlight (up to current index if defined and simulation mode) */}
                  {isSimulationMode && timeSeriesIndex !== undefined && timeSeriesIndex > 0 && (
                    <path
                      d={currentSeries.slice(0, timeSeriesIndex + 1).reduce((acc, pt, idx) => {
                        const px = ((pt.growthScore + 100) / 200) * 100;
                        const py = ((100 - pt.inflationScore) / 200) * 100;
                        return `${acc} ${idx === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
                      }, '')}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Trajectory Directional Waypoint Dots */}
                  {currentSeries.map((pt, idx) => {
                    const px = ((pt.growthScore + 100) / 200) * 100;
                    const py = ((100 - pt.inflationScore) / 200) * 100;
                    const isPassed = isSimulationMode && timeSeriesIndex !== undefined && idx <= timeSeriesIndex;
                    const isCurrent = isSimulationMode && timeSeriesIndex === idx;
                    const isKeyDot = idx === 0 || idx === Math.floor(currentSeries.length / 2) || idx === currentSeries.length - 1;

                    return (
                      <circle
                        key={pt.id || idx}
                        cx={px}
                        cy={py}
                        r={isCurrent ? 2.5 : isKeyDot ? 1.6 : 0.8}
                        fill={isCurrent ? '#ffffff' : isPassed ? '#22d3ee' : '#94a3b8'}
                        opacity={isCurrent ? 1 : isKeyDot ? 0.9 : 0.4}
                      />
                    );
                  })}
                </svg>

                {/* Dynamic Milestone Waypoint Pins (Active Scenario Only, Hidden in Free Simulation) */}
                {milestonePins.map((pin) => (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      pin.onClick();
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer transition-all ${
                      pin.isSelected ? 'scale-120 z-25' : 'hover:scale-110 opacity-75 hover:opacity-100'
                    }`}
                    style={{ left: `${pin.pinX}%`, top: `${pin.pinY}%` }}
                    title={pin.title}
                  >
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-md border ${
                      pin.isSelected 
                        ? 'bg-cyan-400 text-slate-950 border-white ring-2 ring-cyan-400/60 font-black' 
                        : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-cyan-400 hover:text-white'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pin.isSelected ? 'bg-slate-950 animate-ping' : 'bg-cyan-400'}`} />
                      <span>{pin.label}</span>
                    </div>
                  </button>
                ))}

                {/* Dynamic Crosshair Projection Lines from Puck */}
                {/* Vertical projection line down to X-axis */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-cyan-400/50 border-r border-dashed border-cyan-400 pointer-events-none z-10"
                  style={{ left: `${posX}%` }}
                />
                {/* Horizontal projection line left to Y-axis */}
                <div
                  className="absolute left-0 right-0 h-px bg-rose-400/50 border-b border-dashed border-rose-400 pointer-events-none z-10"
                  style={{ top: `${posY}%` }}
                />

                {/* Interactive Puck (The Central Draggable Knob) */}
                <div
                  className="absolute w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-2xl pointer-events-none flex items-center justify-center z-30 transition-transform duration-75"
                  style={{
                    left: `${posX}%`,
                    top: `${posY}%`,
                    backgroundColor: 
                      currentQuadrant === 'GOLDILOCKS' ? '#10b981' :
                      currentQuadrant === 'REFLATION' ? '#f59e0b' :
                      currentQuadrant === 'STAGFLATION' ? '#f43f5e' : '#06b6d4',
                    boxShadow: `0 0 24px ${
                      currentQuadrant === 'GOLDILOCKS' ? '#10b981' :
                      currentQuadrant === 'REFLATION' ? '#f59e0b' :
                      currentQuadrant === 'STAGFLATION' ? '#f43f5e' : '#06b6d4'
                    }`,
                    transform: isDragging ? 'translate(-50%, -50%) scale(1.25)' : 'translate(-50%, -50%) scale(1.0)'
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-white shadow" />
                  <Move className="w-4 h-4 text-white absolute opacity-80" />
                </div>
              </div>

              {/* X-Axis (Horizontal Bottom Row): GDP Numbers & Ticks */}
              <div className="relative h-10 sm:h-12 pt-2 select-none">
                {xTicks.map((tick, idx) => (
                  <div
                    key={idx}
                    className="absolute -translate-x-1/2 flex flex-col items-center"
                    style={{ left: tick.left }}
                  >
                    <div className={`w-0.5 h-1.5 sm:h-2 ${tick.isBenchmark ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                    <span className={`font-mono text-[10px] sm:text-xs font-black block mt-0.5 ${tick.isBenchmark ? 'text-emerald-300' : 'text-slate-300'}`}>
                      {tick.label}
                    </span>
                    <span className="text-[9px] text-slate-500 font-sans hidden sm:block whitespace-nowrap">{tick.desc}</span>
                  </div>
                ))}

                {/* Live Dynamic X-Indicator Marker (Follows Puck) */}
                <div
                  className="absolute -translate-x-1/2 flex flex-col items-center transition-all duration-75 pointer-events-none z-20"
                  style={{ left: `${posX}%` }}
                >
                  <div className="w-1 h-2 bg-cyan-400 rounded-b" />
                  <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded bg-cyan-500 text-slate-950 font-mono text-[9px] sm:text-[10px] font-black shadow-lg whitespace-nowrap">
                    GDP {fundamentals.realGdpGrowth > 0 ? `+${fundamentals.realGdpGrowth}` : fundamentals.realGdpGrowth}%
                  </span>
                </div>
              </div>

              {/* X-Axis Main Label */}
              <div className="text-center text-[9px] sm:text-[10px] font-mono font-bold text-cyan-400 -mt-1">
                ▲ 가로 X축 : 실질 GDP 성장률 (연율 %)
              </div>

              {/* LIVE TRANSMISSION LINK (Layer 1 ➔ Layer 2 & 3 세로 슬림 연동 피드백 바) */}
              {rateValue !== undefined && liquidityValue !== undefined && fxValue !== undefined && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950/95 border border-slate-800 space-y-2 select-none shadow-md">
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800/80">
                    <span className="font-extrabold text-cyan-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>[LAYER 2] 3대 정책 전달계 실시간 연동 (금리·통화량·환율)</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      사분면 퍽 위치 즉각 연동
                    </span>
                  </div>

                  {/* 세로 슬림 행 1: 미국 기준금리 (Fed Rate) */}
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-cyan-950/60 space-y-1 transition-all">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-400 font-bold">① 미국 기준금리</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                          {rateValue >= 5.25 ? '고금리 긴축' : rateValue >= 4.0 ? '중고금리' : rateValue >= 2.5 ? '중립금리' : '저금리 부양'}
                        </span>
                      </div>
                      <span className="font-black font-mono text-cyan-300 text-sm">
                        {rateValue.toFixed(2)}%
                      </span>
                    </div>
                    {/* Full-width slim animated bar */}
                    <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-150 ease-out"
                        style={{ width: `${Math.min(100, Math.max(2, (rateValue / 7.0) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* 세로 슬림 행 2: 달러 통화량/순유동성 (Net Liquidity) */}
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-950/60 space-y-1 transition-all">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-purple-400 font-bold">② 달러 통화량 (순유동성)</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/50">
                          {liquidityValue <= 6.0 ? '긴축 가뭄' : liquidityValue <= 7.0 ? '완만 QT' : liquidityValue <= 8.0 ? '중립 균형' : '유동성 확대'}
                        </span>
                      </div>
                      <span className="font-black font-mono text-purple-300 text-sm">
                        ${liquidityValue.toFixed(1)}T
                      </span>
                    </div>
                    {/* Full-width slim animated bar */}
                    <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 via-purple-400 to-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-150 ease-out"
                        style={{ width: `${Math.min(100, Math.max(2, ((liquidityValue - 5.5) / 4.0) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* 세로 슬림 행 3: 원/달러 환율 (USD/KRW) */}
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-emerald-950/60 space-y-1 transition-all">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">③ 원/달러 환율</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                          {fxValue >= 1410 ? '고환율 경계' : fxValue >= 1320 ? '원화 약세' : fxValue >= 1250 ? '평균 박스권' : '원화 강세'}
                        </span>
                      </div>
                      <span className="font-black font-mono text-emerald-300 text-sm">
                        {fxValue.toLocaleString()}원
                      </span>
                    </div>
                    {/* Full-width slim animated bar */}
                    <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-150 ease-out"
                        style={{ width: `${Math.min(100, Math.max(2, ((fxValue - 900) / 750) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* 세로 슬림 행 4: 미국 & 한국 주식 파급 (Layer 3) */}
                  {sp500Asset && kospiAsset && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-amber-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span>[LAYER 3] 주식시장 실시간 파급</span>
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">동시 연동</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {/* S&P 500 */}
                        <div className={`p-2 rounded-lg border transition-all duration-150 ${sp500Asset.direction === 'UP' ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300' : sp500Asset.direction === 'DOWN' ? 'bg-rose-950/25 border-rose-500/40 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[10px] text-white">🇺🇸 미국 주식</span>
                            <span className={`text-[11px] font-black ${sp500Asset.score >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {sp500Asset.direction === 'UP' ? '▲' : sp500Asset.direction === 'DOWN' ? '▼' : '─'} {sp500Asset.score > 0 ? `+${sp500Asset.score}` : sp500Asset.score}pt
                            </span>
                          </div>
                          <span className="text-[10px] font-bold block truncate mt-0.5">{sp500Asset.badge}</span>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-150 rounded-full ${sp500Asset.score >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                              style={{ width: `${Math.min(100, Math.max(10, Math.abs(sp500Asset.score)))}%` }}
                            />
                          </div>
                        </div>

                        {/* KOSPI */}
                        <div className={`p-2 rounded-lg border transition-all duration-150 ${kospiAsset.direction === 'UP' ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300' : kospiAsset.direction === 'DOWN' ? 'bg-rose-950/25 border-rose-500/40 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[10px] text-white">🇰🇷 한국 주식</span>
                            <span className={`text-[11px] font-black ${kospiAsset.score >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {kospiAsset.direction === 'UP' ? '▲' : kospiAsset.direction === 'DOWN' ? '▼' : '─'} {kospiAsset.score > 0 ? `+${kospiAsset.score}` : kospiAsset.score}pt
                            </span>
                          </div>
                          <span className="text-[10px] font-bold block truncate mt-0.5">{kospiAsset.badge}</span>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-150 rounded-full ${kospiAsset.score >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                              style={{ width: `${Math.min(100, Math.max(10, Math.abs(kospiAsset.score)))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Sequential Cause-and-Effect Panel (Col 4) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
          {/* Current Coordinates Exact Readout */}
          <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              REAL-TIME INPUT READOUT (현재 조작 좌표값)
            </span>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">실질 GDP 성장률</span>
                <span className={`text-base font-black font-mono ${fundamentals.realGdpGrowth >= 2.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {fundamentals.realGdpGrowth > 0 ? `+${fundamentals.realGdpGrowth}` : fundamentals.realGdpGrowth}%
                </span>
                <span className="text-[9px] text-slate-500 block">PMI {fundamentals.ismPmi}</span>
              </div>

              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">소비자물가 CPI</span>
                <span className={`text-base font-black font-mono ${fundamentals.cpiInflation > 3.0 ? 'text-rose-400' : fundamentals.cpiInflation < 1.5 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                  {fundamentals.cpiInflation}%
                </span>
                <span className="text-[9px] text-slate-500 block">목표 2.0% 대비</span>
              </div>
            </div>

            {/* Trajectory Mini-Graphs for GDP & CPI */}
            {timeSeriesIndex !== undefined && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    펀더멘털 시계열 실측 변동 궤적
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {MONTHLY_MACRO_SERIES[timeSeriesIndex]?.label || ''}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                      <span>GDP 트렌드</span>
                      <span className="text-emerald-400 font-bold">{MONTHLY_MACRO_SERIES[timeSeriesIndex]?.realGdp}%</span>
                    </div>
                    {/* SVG Sparkline for GDP */}
                    <svg viewBox="0 0 100 24" className="w-full h-6 overflow-visible">
                      <path
                        d={MONTHLY_MACRO_SERIES.map((pt, i) => {
                          const x = (i / (MONTHLY_MACRO_SERIES.length - 1)) * 100;
                          // GDP ranges ~ 1.5 to 3.5
                          const y = 22 - ((pt.realGdp - 1.5) / 2.0) * 20;
                          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx={(timeSeriesIndex / (MONTHLY_MACRO_SERIES.length - 1)) * 100}
                        cy={22 - ((MONTHLY_MACRO_SERIES[timeSeriesIndex]?.realGdp - 1.5) / 2.0) * 20}
                        r="3"
                        fill="#34d399"
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>

                  <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                      <span>CPI 트렌드</span>
                      <span className="text-rose-400 font-bold">{MONTHLY_MACRO_SERIES[timeSeriesIndex]?.cpiInflation}%</span>
                    </div>
                    {/* SVG Sparkline for CPI */}
                    <svg viewBox="0 0 100 24" className="w-full h-6 overflow-visible">
                      <path
                        d={MONTHLY_MACRO_SERIES.map((pt, i) => {
                          const x = (i / (MONTHLY_MACRO_SERIES.length - 1)) * 100;
                          // CPI ranges ~ 2.0 to 3.8
                          const y = 22 - ((pt.cpiInflation - 2.0) / 1.8) * 20;
                          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx={(timeSeriesIndex / (MONTHLY_MACRO_SERIES.length - 1)) * 100}
                        cy={22 - ((MONTHLY_MACRO_SERIES[timeSeriesIndex]?.cpiInflation - 2.0) / 1.8) * 20}
                        r="3"
                        fill="#fb7185"
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Sequential Causal Impact Briefing */}
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                단계적 시장 파급 결과:
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {info.description}
              </p>
            </div>
          </div>

          {/* Preset Quick Snap Buttons (Clean & Compact) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 block font-mono">
              ⚡ 주요 거시경제 4대 정형 국면 빠른 이동:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onQuadrantSelect('GOLDILOCKS')}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center justify-between transition ${
                  currentQuadrant === 'GOLDILOCKS'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🌟 골디락스</span>
                <span className="text-[9px] font-mono opacity-80">성장↑·물가↓</span>
              </button>

              <button
                onClick={() => onQuadrantSelect('REFLATION')}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center justify-between transition ${
                  currentQuadrant === 'REFLATION'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🔥 리플레이션</span>
                <span className="text-[9px] font-mono opacity-80">성장↑·물가↑</span>
              </button>

              <button
                onClick={() => onQuadrantSelect('STAGFLATION')}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center justify-between transition ${
                  currentQuadrant === 'STAGFLATION'
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🌪️ 스태그플레이션</span>
                <span className="text-[9px] font-mono opacity-80">성장↓·물가↑</span>
              </button>

              <button
                onClick={() => onQuadrantSelect('DEFLATION_RECESSION')}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center justify-between transition ${
                  currentQuadrant === 'DEFLATION_RECESSION'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>❄️ 경기 침체</span>
                <span className="text-[9px] font-mono opacity-80">성장↓·물가↓</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
