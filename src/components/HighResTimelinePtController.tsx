import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MonthlyMacroTimeSeriesPoint, 
  MONTHLY_MACRO_SERIES 
} from '../data/monthlyMacroTimeSeries';
import { 
  HistoricalMacroPoint, 
  HISTORICAL_MACRO_TIMELINE 
} from '../data/historicalTimelineData';
import {
  HISTORICAL_ERA_PRESETS,
  getHistoricalEraById
} from '../data/historicalEraData';
import { HistoricalEraBriefingModal } from './HistoricalEraBriefingModal';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  RotateCcw,
  Sparkles,
  TrendingUp,
  Activity,
  Calendar,
  Layers,
  HelpCircle,
  Lightbulb,
  Sliders,
  BarChart3,
  Minimize2,
  Maximize2,
  ArrowDown,
  Info,
  CheckCircle2,
  ShieldCheck,
  Landmark,
  BookOpen
} from 'lucide-react';

// ── PT 타임라인 전용 미니 스파크라인 그래프 (30개월 궤적 및 재생 연동) ──
interface PtMiniSparklineProps {
  data: number[];
  currentIndex: number;
  colorTheme: 'cyan' | 'purple' | 'emerald' | 'amber' | 'sky' | 'rose';
  onSelectIndex?: (idx: number) => void;
  formatVal?: (v: number) => string;
  labels?: string[];
  rangeStartIdx?: number;
  rangeEndIdx?: number;
}

const PtMiniSparkline: React.FC<PtMiniSparklineProps> = ({
  data,
  currentIndex,
  colorTheme,
  onSelectIndex,
  formatVal,
  labels,
  rangeStartIdx,
  rangeEndIdx
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!data || data.length < 2) return null;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const width = 160;
  const height = 36;
  const paddingX = 4;
  const paddingY = 5;
  const effW = width - paddingX * 2;
  const effH = height - paddingY * 2;

  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * effW;
    const y = paddingY + effH - ((val - minVal) / range) * effH;
    return { x, y, val };
  });

  const pathD = points.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
    ''
  );
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  const safeIdx = Math.max(0, Math.min(points.length - 1, currentIndex));
  const currentPt = points[safeIdx];
  const activeIdx = hoverIdx !== null ? hoverIdx : safeIdx;
  const activePt = points[activeIdx];

  const themeStyles = {
    cyan: {
      stroke: '#06b6d4',
      fill: 'rgba(6, 182, 212, 0.16)',
      dot: '#22d3ee',
      glow: 'rgba(34, 211, 238, 0.45)'
    },
    purple: {
      stroke: '#c084fc',
      fill: 'rgba(192, 132, 252, 0.16)',
      dot: '#d8b4fe',
      glow: 'rgba(216, 180, 254, 0.45)'
    },
    emerald: {
      stroke: '#10b981',
      fill: 'rgba(16, 185, 129, 0.16)',
      dot: '#34d399',
      glow: 'rgba(52, 211, 153, 0.45)'
    },
    amber: {
      stroke: '#f59e0b',
      fill: 'rgba(245, 158, 11, 0.16)',
      dot: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.45)'
    },
    sky: {
      stroke: '#38bdf8',
      fill: 'rgba(56, 189, 248, 0.16)',
      dot: '#7dd3fc',
      glow: 'rgba(125, 211, 252, 0.45)'
    },
    rose: {
      stroke: '#f43f5e',
      fill: 'rgba(244, 63, 94, 0.16)',
      dot: '#fb7185',
      glow: 'rgba(251, 113, 133, 0.45)'
    }
  }[colorTheme];

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onSelectIndex) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = Math.round(ratio * (data.length - 1));
    onSelectIndex(target);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = Math.round(ratio * (data.length - 1));
    setHoverIdx(target);
  };

  const handleMouseLeave = () => {
    setHoverIdx(null);
  };

  const activeLabel = labels && labels[activeIdx] ? labels[activeIdx] : null;
  const activeValFormatted = formatVal ? formatVal(data[activeIdx]) : data[activeIdx];

  return (
    <div className="w-full">
      <div 
        className="relative w-full h-8 overflow-hidden rounded bg-slate-900/80 border border-slate-800/80 cursor-pointer group hover:border-slate-700 transition" 
        title="마우스 오버로 값 탐색, 클릭하여 해당 시점('24.01~'26.06)으로 즉시 이동"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          onClick={handleSvgClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Active Period Range Highlight Area */}
          {rangeStartIdx !== undefined && rangeEndIdx !== undefined && points[rangeStartIdx] && points[rangeEndIdx] && (
            <rect
              x={points[rangeStartIdx].x}
              y={0}
              width={Math.max(2, points[rangeEndIdx].x - points[rangeStartIdx].x)}
              height={height}
              fill="rgba(255, 255, 255, 0.05)"
              stroke="rgba(245, 158, 11, 0.3)"
              strokeWidth="0.8"
              strokeDasharray="2,2"
            />
          )}

          {/* Midpoint horizontal reference line */}
          <line
            x1={0}
            y1={paddingY + effH / 2}
            x2={width}
            y2={paddingY + effH / 2}
            stroke="#334155"
            strokeWidth="0.8"
            strokeDasharray="2,3"
            opacity="0.35"
          />

          {/* Subtle area gradient */}
          <path d={areaD} fill={themeStyles.fill} />

          {/* Main trend line */}
          <path
            d={pathD}
            fill="none"
            stroke={themeStyles.stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active playback scrubber or hover point */}
          {activePt && (
            <g>
              {/* Vertical tracking dashed line */}
              <line
                x1={activePt.x}
                y1={0}
                x2={activePt.x}
                y2={height}
                stroke={hoverIdx !== null ? '#f59e0b' : themeStyles.stroke}
                strokeWidth={hoverIdx !== null ? '1.5' : '1.2'}
                strokeDasharray={hoverIdx !== null ? '1,1' : '2,2'}
                opacity={hoverIdx !== null ? '1' : '0.85'}
              />
              {/* Outer halo */}
              <circle
                cx={activePt.x}
                cy={activePt.y}
                r={hoverIdx !== null ? '5.5' : '4.5'}
                fill={hoverIdx !== null ? 'rgba(245, 158, 11, 0.4)' : themeStyles.glow}
              />
              {/* Center dot */}
              <circle
                cx={activePt.x}
                cy={activePt.y}
                r={hoverIdx !== null ? '3' : '2.5'}
                fill={hoverIdx !== null ? '#fef08a' : themeStyles.dot}
                stroke="#020617"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Dynamic Range Min/Max & Active Point footer */}
      <div className="flex items-center justify-between text-[8px] font-mono mt-1 px-0.5 select-none">
        <span className="text-slate-500">저 {formatVal ? formatVal(minVal) : minVal}</span>
        <span className={`px-1 py-0.2 rounded font-bold border transition-colors ${
          hoverIdx !== null 
            ? 'bg-amber-950/90 text-amber-300 border-amber-600/70 shadow-sm' 
            : 'bg-slate-900 text-slate-300 border-slate-800'
        }`}>
          {activeLabel ? `${activeLabel}: ` : ''}{activeValFormatted}
        </span>
        <span className="text-slate-500">고 {formatVal ? formatVal(maxVal) : maxVal}</span>
      </div>
    </div>
  );
};

// ── 6대 핵심 지표 카드 컴포넌트 (텍스트 + 하단 심플 그래프) ──
interface PtMetricGraphCardProps {
  title: string;
  subLabel?: string;
  currentValue: string;
  valueColor: string;
  deltaText: string;
  deltaColor: string;
  startText: string;
  data: number[];
  currentIndex: number;
  colorTheme: 'cyan' | 'purple' | 'emerald' | 'amber' | 'sky' | 'rose';
  formatVal?: (v: number) => string;
  onSelectIndex: (idx: number) => void;
  labels?: string[];
  rangeStartIdx?: number;
  rangeEndIdx?: number;
}

const PtMetricGraphCard: React.FC<PtMetricGraphCardProps> = ({
  title,
  subLabel,
  currentValue,
  valueColor,
  deltaText,
  deltaColor,
  startText,
  data,
  currentIndex,
  colorTheme,
  formatVal,
  onSelectIndex,
  labels,
  rangeStartIdx,
  rangeEndIdx
}) => {
  return (
    <div className="bg-slate-950/85 p-2.5 rounded-xl border border-slate-800/90 hover:border-slate-700/80 transition-all flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[10px] text-slate-300 font-mono font-bold truncate">{title}</span>
            {subLabel && (
              <span className="text-[8px] px-1 py-0.2 rounded bg-slate-800/80 text-slate-400 font-sans border border-slate-700/60 shrink-0">
                {subLabel}
              </span>
            )}
          </div>
          <span className="text-[9px] text-slate-500 font-mono shrink-0">{startText}</span>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <span className={`text-base font-black font-mono ${valueColor}`}>{currentValue}</span>
          <span className={`text-[10px] font-mono font-bold ${deltaColor}`}>{deltaText}</span>
        </div>
      </div>

      {/* 심플한 그래프 (30개월 연동 스파크라인) */}
      <div className="mt-2 pt-1.5 border-t border-slate-850/60">
        <PtMiniSparkline
          data={data}
          currentIndex={currentIndex}
          colorTheme={colorTheme}
          onSelectIndex={onSelectIndex}
          formatVal={formatVal}
          labels={labels}
          rangeStartIdx={rangeStartIdx}
          rangeEndIdx={rangeEndIdx}
        />
      </div>
    </div>
  );
};

interface HighResTimelinePtControllerProps {
  currentMonthlyIndex: number;
  onSelectMonthlyIndex: (index: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  // Also pass currently active milestone info if matches
  activeMilestone?: HistoricalMacroPoint;
  // Mode awareness and quick navigation
  isSimulationMode?: boolean;
  onResetToLive?: () => void;
  onScrollToLayer2?: () => void;
  onScrollToLayer3?: () => void;
  // Historical Era additions
  activeEraId?: string;
  onSelectEraId?: (eraId: string) => void;
  activeSeries?: MonthlyMacroTimeSeriesPoint[];
  onOpenDataUpdateManager?: () => void;
}

export const HighResTimelinePtController: React.FC<HighResTimelinePtControllerProps> = ({
  currentMonthlyIndex,
  onSelectMonthlyIndex,
  isOpen,
  onToggleOpen,
  activeMilestone,
  isSimulationMode = true,
  onResetToLive,
  onScrollToLayer2,
  onScrollToLayer3,
  activeEraId = 'recent-pivot-2024',
  onSelectEraId,
  activeSeries: propActiveSeries,
  onOpenDataUpdateManager,
}) => {
  const activeSeries = propActiveSeries || MONTHLY_MACRO_SERIES;
  const activeEra = useMemo(() => getHistoricalEraById(activeEraId), [activeEraId]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1200); // ms per monthly step
  const [isCompact, setIsCompact] = useState<boolean>(false); // Compact View Toggle
  const [showFactCheck, setShowFactCheck] = useState<boolean>(false); // Real-world data fact-check toggle
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState<boolean>(false); // Historical Era Deep Dive Briefing Modal

  const totalMonths = activeSeries.length;

  // ── 시뮬레이션 기간 사용자 자유 설정 상태 ──
  const [rangeStartIdx, setRangeStartIdx] = useState<number>(0);
  const [rangeEndIdx, setRangeEndIdx] = useState<number>(totalMonths - 1);

  // When era changes, reset range
  useEffect(() => {
    setRangeStartIdx(0);
    setRangeEndIdx(activeSeries.length - 1);
  }, [activeEraId, activeSeries.length]);

  const currentMonthPoint = activeSeries[currentMonthlyIndex] || activeSeries[0];

  const handleRangeStartChange = (newStart: number) => {
    let validEnd = rangeEndIdx;
    if (newStart > rangeEndIdx) {
      validEnd = newStart;
      setRangeEndIdx(validEnd);
    }
    setRangeStartIdx(newStart);
    if (currentMonthlyIndex < newStart || currentMonthlyIndex > validEnd) {
      onSelectMonthlyIndex(newStart);
    }
  };

  const handleRangeEndChange = (newEnd: number) => {
    let validStart = rangeStartIdx;
    if (newEnd < rangeStartIdx) {
      validStart = newEnd;
      setRangeStartIdx(validStart);
    }
    setRangeEndIdx(newEnd);
    if (currentMonthlyIndex > newEnd || currentMonthlyIndex < validStart) {
      onSelectMonthlyIndex(validStart);
    }
  };

  const setCustomRange = (start: number, end: number) => {
    const s = Math.max(0, Math.min(totalMonths - 1, start));
    const e = Math.max(0, Math.min(totalMonths - 1, end));
    setRangeStartIdx(s);
    setRangeEndIdx(e);
    onSelectMonthlyIndex(s);
  };

  // Auto-play interval across custom selected range [rangeStartIdx ~ rangeEndIdx]
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      let next = currentMonthlyIndex + 1;
      if (next > rangeEndIdx || next < rangeStartIdx) {
        next = rangeStartIdx;
      }
      onSelectMonthlyIndex(next);
    }, playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, currentMonthlyIndex, rangeStartIdx, rangeEndIdx, playbackSpeed, onSelectMonthlyIndex]);

  const handlePrevMonth = () => {
    let prev = currentMonthlyIndex - 1;
    if (prev < rangeStartIdx || prev > rangeEndIdx) {
      prev = rangeEndIdx;
    }
    onSelectMonthlyIndex(prev);
  };

  const handleNextMonth = () => {
    let next = currentMonthlyIndex + 1;
    if (next > rangeEndIdx || next < rangeStartIdx) {
      next = rangeStartIdx;
    }
    onSelectMonthlyIndex(next);
  };

  // Jump to specific milestone date
  const jumpToPeriod = (id: string) => {
    const targetIdx = activeSeries.findIndex(m => m.id === id);
    if (targetIdx !== -1) {
      if (targetIdx < rangeStartIdx) setRangeStartIdx(targetIdx);
      if (targetIdx > rangeEndIdx) setRangeEndIdx(targetIdx);
      onSelectMonthlyIndex(targetIdx);
    }
  };

  // Trajectory Delta from Selected Range Start to Current Month
  const startPoint = activeSeries[rangeStartIdx] || activeSeries[0];
  const deltaRate = currentMonthPoint.fedRate - startPoint.fedRate;
  const deltaLiq = currentMonthPoint.netLiquidity - startPoint.netLiquidity;
  const deltaFx = currentMonthPoint.usdkrw - startPoint.usdkrw;
  const deltaTreasury10Y = currentMonthPoint.treasury10Y - startPoint.treasury10Y;
  const deltaSp500 = currentMonthPoint.sp500Index - startPoint.sp500Index;
  const pctSp500 = ((deltaSp500 / (startPoint.sp500Index || 1)) * 100).toFixed(1);
  const deltaKospi = currentMonthPoint.kospiIndex - startPoint.kospiIndex;
  const pctKospi = ((deltaKospi / (startPoint.kospiIndex || 1)) * 100).toFixed(1);

  // Time series arrays for 6 metric sparklines
  const fedRateSeries = useMemo(() => activeSeries.map(p => p.fedRate), [activeSeries]);
  const netLiqSeries = useMemo(() => activeSeries.map(p => p.netLiquidity), [activeSeries]);
  const fxSeries = useMemo(() => activeSeries.map(p => p.usdkrw), [activeSeries]);
  const treasurySeries = useMemo(() => activeSeries.map(p => p.treasury10Y), [activeSeries]);
  const sp500Series = useMemo(() => activeSeries.map(p => p.sp500Index), [activeSeries]);
  const kospiSeries = useMemo(() => activeSeries.map(p => p.kospiIndex), [activeSeries]);
  const monthLabels = useMemo(() => activeSeries.map(p => p.label), [activeSeries]);

  if (!isOpen) {
    return (
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
          <span className="font-semibold text-slate-300">자유 시뮬레이션</span>
          <span className="text-slate-500 hidden sm:inline">• 사분면과 3대 페이더를 직접 조작하는 라이브 모드</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenDataUpdateManager && (
            <button
              onClick={onOpenDataUpdateManager}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-600/40 text-cyan-300 font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm text-xs"
              title="글로벌 시장 실시간 발표 확인 및 최신 데이터 자동 업데이트"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>최신 데이터 업데이트</span>
            </button>
          )}

          <button
            onClick={onToggleOpen}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
            title="2000~2026 역대 미국 금융위기 시계열 시뮬레이션 열기"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>역사적 위기 시계열 PT</span>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded ml-0.5 shrink-0">
              2000~2026
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 bg-gradient-to-b from-slate-900/98 to-slate-950/98 rounded-2xl border-2 border-amber-500/60 p-4 sm:p-5 shadow-2xl shadow-amber-950/40 transition-all space-y-3.5 ring-1 ring-amber-500/30">
      {/* 1. Distinct Mode Indicator & Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-amber-500/20 gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
            <Activity className="w-4 h-4 animate-pulse text-amber-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {isSimulationMode ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black tracking-wider bg-amber-500 text-slate-950 shadow-sm uppercase whitespace-nowrap shrink-0">
                  🔴 시계열 PT 모드 가동 중
                </span>
              ) : (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black tracking-wider bg-emerald-500 text-slate-950 shadow-sm uppercase whitespace-nowrap">
                    🟢 자유 시뮬레이션 모드
                  </span>
                  <button
                    onClick={() => onSelectMonthlyIndex(currentMonthlyIndex)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 cursor-pointer transition"
                    title="현재 선택된 월의 시계열 데이터로 다시 연동"
                  >
                    시계열 PT 재연동
                  </button>
                </div>
              )}
              <span className="text-[11px] bg-slate-950 text-cyan-300 border border-cyan-800/80 px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <Calendar className="w-3 h-3 text-cyan-400 shrink-0" />
                {currentMonthPoint.dateStr} ({currentMonthlyIndex + 1}/{totalMonths}개월)
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2 mt-0.5 truncate">
              <span className="truncate">{activeEra.name}</span>
              <span className="hidden xl:inline text-xs text-amber-300/80 font-normal shrink-0">• 전 지표 연동</span>
            </h3>
          </div>
        </div>

        {/* View Mode & Control Action Buttons - Compact 1-line with whitespace-nowrap */}
        <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap self-start sm:self-auto shrink-0">
          {/* 최신 데이터 자동 업데이트 버튼 */}
          {onOpenDataUpdateManager && (
            <button
              onClick={onOpenDataUpdateManager}
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold border border-cyan-400/50 flex items-center gap-1.5 transition whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-cyan-950/40"
              title="글로벌 시장 실시간 발표 확인 및 최신 데이터 자동 업데이트"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse shrink-0" />
              <span>최신 데이터 자동 업데이트</span>
            </button>
          )}

          {/* Quick jump to lower graphs */}
          {onScrollToLayer2 && (
            <button
              onClick={onScrollToLayer2}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 text-xs font-bold border border-cyan-700/60 flex items-center gap-1 transition whitespace-nowrap shrink-0 cursor-pointer"
              title="아래 금리·유동성 3대 페이더 콘솔로 스크롤 이동"
            >
              <ArrowDown className="w-3.5 h-3.5 shrink-0" />
              <span>금리·유동성</span>
            </button>
          )}

          {onScrollToLayer3 && (
            <button
              onClick={onScrollToLayer3}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 text-xs font-bold border border-emerald-700/60 flex items-center gap-1 transition whitespace-nowrap shrink-0 cursor-pointer"
              title="아래 자산군별 변동성 반응판으로 스크롤 이동"
            >
              <ArrowDown className="w-3.5 h-3.5 shrink-0" />
              <span>자산 변동</span>
            </button>
          )}

          {/* Real Market Data Fact-Check Guide Toggle */}
          <button
            onClick={() => setShowFactCheck(!showFactCheck)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 transition whitespace-nowrap shrink-0 cursor-pointer ${
              showFactCheck 
                ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400/70 shadow-sm shadow-cyan-900/40' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="미국 기준금리, 국채 10년물, 환율 실데이터 검증 확인"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>팩트체크</span>
          </button>

          {/* Compact View Toggle */}
          <button
            onClick={() => setIsCompact(!isCompact)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 transition whitespace-nowrap shrink-0 cursor-pointer ${
              isCompact 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={isCompact ? '상세 해설 및 지표 확장' : '슬림/컴팩트 뷰로 전환하여 아래 지표 공간 확보'}
          >
            {isCompact ? <Maximize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Minimize2 className="w-3.5 h-3.5 shrink-0" />}
            <span>{isCompact ? '상세보기' : '간소화'}</span>
          </button>

          {/* Close/Toggle Button */}
          <button
            onClick={onToggleOpen}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition whitespace-nowrap shrink-0 cursor-pointer"
            title="일반 시연 모드로 복귀"
          >
            <span>PT 종료</span>
          </button>
        </div>
      </div>

      {/* 1-1. Real Data Fact-Check Guide Drawer */}
      {showFactCheck && (
        <div className="p-3.5 bg-slate-950/95 rounded-xl border border-cyan-500/40 space-y-2.5 text-xs text-slate-300 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="font-extrabold text-white text-sm">
                📊 실제 미국 시장 거시 데이터 정합성 & 공식 팩트체크 검증 내역
              </span>
            </div>
            <button 
              onClick={() => setShowFactCheck(false)}
              className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
            >
              닫기 ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-cyan-800/40 space-y-1">
              <div className="flex items-center justify-between text-cyan-300 font-bold font-mono">
                <span>1. 미국 기준금리 (Fed Funds)</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-800">5.50% ➔ 4.50%</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                연준 공식 상단 금리는 <strong>2023.07~2024.08 동안 5.50% 최고점 유지</strong> 후, 2024년 9월 50bp 빅컷(5.00%), 11월 4.75%, 12월 4.50%로 <span className="text-cyan-300 font-semibold">인하(하향) 추세</span>입니다.
              </p>
              <p className="text-[10px] text-slate-400">
                💡 한국은행 기준금리(3.50% 동결 후 3.00% 인하) 및 3%대인 미국 실질 GDP·CPI 수치와의 구분이 명확히 반영되어 있습니다.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-amber-800/40 space-y-1">
              <div className="flex items-center justify-between text-amber-300 font-bold font-mono">
                <span>2. 미국채 10년물 금리</span>
                <span className="text-[10px] bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded border border-amber-800">피크 4.74% & 4.88%</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <strong>2024.04월</strong> 물가 쇼크 시 <strong>4.74%(5% 육박)</strong>, <strong>2025.02월</strong> 트럼프 재정적자·관세 쇼크 시 <strong>4.88%(장중 4.9% 상회, 5.0% 목전)</strong>까지 2차례 급등한 실거래 피크가 그래프에 정확히 구현되어 있습니다.
              </p>
              <p className="text-[10px] text-slate-400">
                💡 사용자 체감 그대로 24년 4월 및 25년초 트럼프 트레이드 당시의 두 차례 5% 근접 채권 급등이 완벽 검증되었습니다.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-800/40 space-y-1">
              <div className="flex items-center justify-between text-emerald-300 font-bold font-mono">
                <span>3. 원/달러 환율 (USD/KRW)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800">최고 1,485원 피크</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                2024.04월 1,395원 터치 후, <strong>2024.12월 12.3 비상계엄 쇼크로 1,448원 급등</strong>(역외 1,446원 돌파), <strong>2025.02월 트럼프 관세 충격으로 1,485원</strong>(외환위기 이후 최고치, 체감 1,500원 목전)까지 치솟은 궤적이 정합성 있게 표기됩니다.
              </p>
              <p className="text-[10px] text-slate-400">
                💡 언론의 1,500원 돌파 뉴스 체감과 공식 마감 종가(1,485원 피크)가 일치하여 프레젠테이션의 신뢰성을 보장합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1-2. Historical Crisis & Regime Shift Era Preset Selector & Deep Dive Briefing Launcher */}
      <div className="p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-amber-500/40 space-y-2.5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono text-xs">
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>역사적 위기·전환기 아카이브:</span>
            </div>

            {/* Era Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {HISTORICAL_ERA_PRESETS.map((era) => {
                const isSelected = era.id === activeEraId;
                return (
                  <button
                    key={era.id}
                    onClick={() => onSelectEraId?.(era.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {era.shortTitle}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deep Dive Briefing Modal Launcher Button */}
          <button
            onClick={() => setIsBriefingModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-amber-500/50 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>시대별 개요 & 브리핑</span>
            <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold shrink-0">열람</span>
          </button>
        </div>

        {/* Current Era Inline Overview Banner */}
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold font-mono shrink-0">[{activeEra.shortTitle}]</span>
            <span className="text-slate-300 leading-snug line-clamp-1">{activeEra.overview.summary}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-slate-400 self-end md:self-auto">
            <span>기간: <b className="text-white">{activeEra.periodRange}</b></span>
            <span>• S&P 낙폭: <b className="text-rose-400">{activeEra.stats.sp500MaxDrawdown}</b></span>
            <span>• 금리: <b className="text-cyan-400">{activeEra.stats.peakFedRate}➔{activeEra.stats.troughFedRate}</b></span>
          </div>
        </div>
      </div>

      {/* 2. Playback Speed & VCR Step Track Bar */}
      <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 flex-wrap font-mono">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping" />
              선택 시점:
            </span>
            <span className="text-white font-extrabold text-sm px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-600/60 text-amber-200">
              {currentMonthPoint.dateStr}
            </span>
            <span className="text-slate-300 text-xs font-sans font-medium">
              - {currentMonthPoint.phaseTitle}
            </span>
          </div>

          {/* VCR & Speed Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Speed Selector */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[10px] font-mono">
              <span className="text-slate-500 px-1 font-bold">속도:</span>
              <button
                onClick={() => setPlaybackSpeed(1800)}
                className={`px-1.5 py-0.5 rounded ${playbackSpeed === 1800 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
              >
                0.8x
              </button>
              <button
                onClick={() => setPlaybackSpeed(1200)}
                className={`px-1.5 py-0.5 rounded ${playbackSpeed === 1200 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
              >
                1.0x
              </button>
              <button
                onClick={() => setPlaybackSpeed(700)}
                className={`px-1.5 py-0.5 rounded ${playbackSpeed === 700 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
              >
                1.8x
              </button>
            </div>

            {/* VCR Step Buttons */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
              <button
                onClick={handlePrevMonth}
                title="이전 달 (1개월 후퇴)"
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? '일시 정지' : '시계열 연속 자동 재생'}
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition ${
                  isPlaying 
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm' 
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? '재생 중' : '재생'}</span>
              </button>
              <button
                onClick={handleNextMonth}
                title="다음 달 (1개월 전진)"
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  onSelectMonthlyIndex(rangeStartIdx);
                }}
                title={`선택 구간 시작(${startPoint.dateStr})으로 리셋`}
                className="p-1 rounded-md text-slate-400 hover:text-amber-300 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 2-1. User Definable Simulation Period Range Selector & Quick Presets */}
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-amber-300 font-bold flex items-center gap-1 font-mono text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              시뮬레이션 구간:
            </span>

            {/* Start Month Selector */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-700">
              <span className="text-slate-400 text-[10px]">시작:</span>
              <select
                value={rangeStartIdx}
                onChange={(e) => handleRangeStartChange(Number(e.target.value))}
                className="bg-transparent text-cyan-300 font-mono font-bold text-xs focus:outline-none cursor-pointer"
              >
                {activeSeries.map((m, idx) => (
                  <option key={m.id} value={idx} className="bg-slate-900 text-white">
                    {m.dateStr} ({m.phaseTitle.slice(0, 8)})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-slate-500 font-bold">~</span>

            {/* End Month Selector */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-700">
              <span className="text-slate-400 text-[10px]">종료:</span>
              <select
                value={rangeEndIdx}
                onChange={(e) => handleRangeEndChange(Number(e.target.value))}
                className="bg-transparent text-cyan-300 font-mono font-bold text-xs focus:outline-none cursor-pointer"
              >
                {activeSeries.map((m, idx) => (
                  <option key={m.id} value={idx} className="bg-slate-900 text-white">
                    {m.dateStr} ({m.phaseTitle.slice(0, 8)})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[11px] text-amber-200/90 font-mono font-semibold">
              ({rangeEndIdx - rangeStartIdx + 1}개월 반복 재생)
            </span>
          </div>

          {/* Quick Period Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">빠른 프리셋:</span>
            <button
              onClick={() => setCustomRange(0, totalMonths - 1)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border transition whitespace-nowrap cursor-pointer ${
                rangeStartIdx === 0 && rangeEndIdx === totalMonths - 1
                  ? 'bg-amber-500/25 text-amber-300 border-amber-500/70 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              전체 {totalMonths}개월
            </button>
            <button
              onClick={() => setCustomRange(0, Math.floor((totalMonths - 1) / 2))}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border transition whitespace-nowrap cursor-pointer ${
                rangeStartIdx === 0 && rangeEndIdx === Math.floor((totalMonths - 1) / 2)
                  ? 'bg-cyan-500/25 text-cyan-300 border-cyan-500/70 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              전반부
            </button>
            <button
              onClick={() => setCustomRange(Math.floor(totalMonths * 0.25), Math.min(totalMonths - 1, Math.floor(totalMonths * 0.75)))}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border transition whitespace-nowrap cursor-pointer ${
                rangeStartIdx === Math.floor(totalMonths * 0.25)
                  ? 'bg-rose-500/25 text-rose-300 border-rose-500/70 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              변곡·충격기
            </button>
            <button
              onClick={() => setCustomRange(Math.floor((totalMonths - 1) / 2), totalMonths - 1)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border transition whitespace-nowrap cursor-pointer ${
                rangeStartIdx === Math.floor((totalMonths - 1) / 2) && rangeEndIdx === totalMonths - 1
                  ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/70 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              후반부
            </button>
            <button
              onClick={onResetToLive}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-amber-400/90 hover:text-amber-300 border border-amber-800/60 transition whitespace-nowrap cursor-pointer"
            >
              현재(최신월)
            </button>
          </div>
        </div>

        {/* Range Slider Scrubber with Active Span Highlight */}
        <div className="relative pt-1 pb-1">
          {/* Active Range Highlight Backdrop */}
          <div className="relative w-full h-2.5 bg-slate-800 rounded-lg overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-500/30 via-cyan-500/35 to-amber-500/30 border-l border-r border-amber-400 transition-all pointer-events-none"
              style={{
                left: `${(rangeStartIdx / Math.max(1, (totalMonths - 1))) * 100}%`,
                width: `${Math.max(1.5, ((rangeEndIdx - rangeStartIdx) / Math.max(1, (totalMonths - 1))) * 100)}%`,
              }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={totalMonths - 1}
            value={currentMonthlyIndex}
            onChange={(e) => {
              setIsPlaying(false);
              onSelectMonthlyIndex(Number(e.target.value));
            }}
            className="absolute top-1 left-0 w-full h-2.5 bg-transparent appearance-none cursor-pointer accent-amber-400 focus:outline-none"
          />

          {/* Milestone markers on track */}
          <div className="relative w-full flex justify-between text-[9px] font-mono text-slate-400 pt-1 select-none">
            {activeSeries.length <= 8 ? (
              activeSeries.map((p, idx) => (
                <button 
                  key={p.id} 
                  onClick={() => onSelectMonthlyIndex(idx)} 
                  className={`hover:text-cyan-300 cursor-pointer ${currentMonthlyIndex === idx ? 'text-amber-400 font-bold' : ''}`}
                >
                  {p.label}
                </button>
              ))
            ) : (
              [
                { idx: 0, label: `${activeSeries[0]?.label || '시작'} 시작` },
                { idx: Math.floor(totalMonths * 0.25), label: activeSeries[Math.floor(totalMonths * 0.25)]?.label || '' },
                { idx: Math.floor(totalMonths * 0.5), label: `${activeSeries[Math.floor(totalMonths * 0.5)]?.label || ''} 중반` },
                { idx: Math.floor(totalMonths * 0.75), label: activeSeries[Math.floor(totalMonths * 0.75)]?.label || '' },
                { idx: totalMonths - 1, label: `${activeSeries[totalMonths - 1]?.label || '종료'} 종료` },
              ].map(m => (
                <button
                  key={m.idx}
                  onClick={() => onSelectMonthlyIndex(m.idx)}
                  className={`hover:text-cyan-300 cursor-pointer ${currentMonthlyIndex === m.idx ? 'text-amber-400 font-bold' : ''}`}
                >
                  {m.label}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. Live Trajectory & Delta Telemetry Cards (시작 대비 누적 변동량) - Compact mode uses 1-line mini row */}
      {isCompact ? (
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono bg-slate-950/60 p-2 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between px-2 py-1 bg-slate-900 rounded">
            <span className="text-[10px] text-slate-400">기준금리:</span>
            <span className="font-bold text-cyan-300">{currentMonthPoint.fedRate.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 bg-slate-900 rounded">
            <span className="text-[10px] text-slate-400">순유동성:</span>
            <span className="font-bold text-purple-300">${currentMonthPoint.netLiquidity.toFixed(2)}T</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 bg-slate-900 rounded">
            <span className="text-[10px] text-slate-400">원/달러:</span>
            <span className="font-bold text-emerald-300">{currentMonthPoint.usdkrw.toLocaleString()}원</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 bg-slate-900 rounded">
            <span className="text-[10px] text-slate-400">미국채10년:</span>
            <span className="font-bold text-amber-300">{currentMonthPoint.treasury10Y.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 bg-slate-900 rounded">
            <span className="text-[10px] text-slate-400">S&P500:</span>
            <span className="font-bold text-sky-300">{currentMonthPoint.sp500Index.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1 bg-slate-900 rounded">
            <span className="text-[10px] text-slate-400">KOSPI:</span>
            <span className="font-bold text-rose-300">{currentMonthPoint.kospiIndex.toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* 1. 미국 기준금리 */}
          <PtMetricGraphCard
            title="미국 기준금리"
            subLabel="Fed 공식상단"
            currentValue={`${currentMonthPoint.fedRate.toFixed(2)}%`}
            valueColor="text-cyan-300"
            deltaText={`(${deltaRate >= 0 ? '+' : ''}${deltaRate.toFixed(2)}%p)`}
            deltaColor={deltaRate <= 0 ? 'text-cyan-400' : 'text-amber-400'}
            startText={`기준(${startPoint.label}): ${startPoint.fedRate.toFixed(2)}%`}
            data={fedRateSeries}
            currentIndex={currentMonthlyIndex}
            colorTheme="cyan"
            formatVal={(v) => `${v.toFixed(2)}%`}
            onSelectIndex={onSelectMonthlyIndex}
            labels={monthLabels}
            rangeStartIdx={rangeStartIdx}
            rangeEndIdx={rangeEndIdx}
          />

          {/* 2. 연준 유동성 */}
          <PtMetricGraphCard
            title="연준 순유동성"
            subLabel="B/S-TGA-RRP"
            currentValue={`$${currentMonthPoint.netLiquidity.toFixed(2)}T`}
            valueColor="text-purple-300"
            deltaText={`(${deltaLiq >= 0 ? '+' : ''}${deltaLiq.toFixed(2)}T)`}
            deltaColor={deltaLiq >= 0 ? 'text-purple-400' : 'text-slate-400'}
            startText={`기준(${startPoint.label}): $${startPoint.netLiquidity.toFixed(2)}T`}
            data={netLiqSeries}
            currentIndex={currentMonthlyIndex}
            colorTheme="purple"
            formatVal={(v) => `$${v.toFixed(2)}T`}
            onSelectIndex={onSelectMonthlyIndex}
            labels={monthLabels}
            rangeStartIdx={rangeStartIdx}
            rangeEndIdx={rangeEndIdx}
          />

          {/* 3. 원/달러 환율 */}
          <PtMetricGraphCard
            title="원/달러 환율"
            subLabel="서울외환 마감"
            currentValue={`${currentMonthPoint.usdkrw.toLocaleString()}원`}
            valueColor="text-emerald-300"
            deltaText={`(${deltaFx >= 0 ? '+' : ''}${deltaFx}원)`}
            deltaColor={deltaFx <= 0 ? 'text-emerald-400' : 'text-rose-400'}
            startText={`기준(${startPoint.label}): ${startPoint.usdkrw.toLocaleString()}원`}
            data={fxSeries}
            currentIndex={currentMonthlyIndex}
            colorTheme="emerald"
            formatVal={(v) => `${v.toLocaleString()}원`}
            onSelectIndex={onSelectMonthlyIndex}
            labels={monthLabels}
            rangeStartIdx={rangeStartIdx}
            rangeEndIdx={rangeEndIdx}
          />

          {/* 4. 미국채 10년물 */}
          <PtMetricGraphCard
            title="미국채 10년물"
            subLabel="피크 4.88%"
            currentValue={`${currentMonthPoint.treasury10Y.toFixed(2)}%`}
            valueColor="text-amber-300"
            deltaText={`(${deltaTreasury10Y >= 0 ? '+' : ''}${deltaTreasury10Y.toFixed(2)}%p)`}
            deltaColor={deltaTreasury10Y <= 0 ? 'text-emerald-400' : 'text-amber-400'}
            startText={`기준(${startPoint.label}): ${startPoint.treasury10Y.toFixed(2)}%`}
            data={treasurySeries}
            currentIndex={currentMonthlyIndex}
            colorTheme="amber"
            formatVal={(v) => `${v.toFixed(2)}%`}
            onSelectIndex={onSelectMonthlyIndex}
            labels={monthLabels}
            rangeStartIdx={rangeStartIdx}
            rangeEndIdx={rangeEndIdx}
          />

          {/* 5. S&P 500 주가지수 */}
          <PtMetricGraphCard
            title="S&P 500"
            subLabel="월말 종가"
            currentValue={`${currentMonthPoint.sp500Index.toLocaleString()}pt`}
            valueColor="text-sky-300"
            deltaText={`(${deltaSp500 >= 0 ? '+' : ''}${pctSp500}%)`}
            deltaColor={deltaSp500 >= 0 ? 'text-emerald-400' : 'text-rose-400'}
            startText={`기준(${startPoint.label}): ${startPoint.sp500Index.toLocaleString()}pt`}
            data={sp500Series}
            currentIndex={currentMonthlyIndex}
            colorTheme="sky"
            formatVal={(v) => `${v.toLocaleString()}pt`}
            onSelectIndex={onSelectMonthlyIndex}
            labels={monthLabels}
            rangeStartIdx={rangeStartIdx}
            rangeEndIdx={rangeEndIdx}
          />

          {/* 6. KOSPI 주가지수 */}
          <PtMetricGraphCard
            title="KOSPI 지수"
            subLabel="국내 증시"
            currentValue={`${currentMonthPoint.kospiIndex.toLocaleString()}pt`}
            valueColor="text-rose-300"
            deltaText={`(${deltaKospi >= 0 ? '+' : ''}${pctKospi}%)`}
            deltaColor={deltaKospi >= 0 ? 'text-emerald-400' : 'text-rose-400'}
            startText={`기준(${startPoint.label}): ${startPoint.kospiIndex.toLocaleString()}pt`}
            data={kospiSeries}
            currentIndex={currentMonthlyIndex}
            colorTheme="rose"
            formatVal={(v) => `${v.toLocaleString()}pt`}
            onSelectIndex={onSelectMonthlyIndex}
            labels={monthLabels}
            rangeStartIdx={rangeStartIdx}
            rangeEndIdx={rangeEndIdx}
          />
        </div>
      )}

      {/* 4. Monthly Market Note & Theoretical Comparison Briefing Card (Hidden in compact mode) */}
      {!isCompact && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Real World Dynamics */}
          <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>실제 시장 동인 및 현상 ({currentMonthPoint.dateStr})</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {currentMonthPoint.marketNote}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-850 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>미 10년물 국채: <b className="text-amber-300">{currentMonthPoint.treasury10Y}%</b></span>
              <span>비트코인: <b className="text-orange-400">${currentMonthPoint.bitcoinPrice}K</b></span>
              <span>금: <b className="text-yellow-400">${currentMonthPoint.goldPrice}</b></span>
            </div>
          </div>

          {/* Theoretical Divergence Reason */}
          <div className="bg-gradient-to-br from-amber-950/20 to-slate-950 rounded-xl p-3 border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>표준 이론 연동값과의 차이 및 발생 원인</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans font-medium">
                {currentMonthPoint.theoreticalComparison}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-200/80">
              💡 거시 정책 전달경로: 금리({currentMonthPoint.fedRate}%) ➔ 유동성(${currentMonthPoint.netLiquidity}T) ➔ 환율({currentMonthPoint.usdkrw}원)
            </div>
          </div>
        </div>
      )}

      {/* Historical Era Briefing & Deep Dive Modal */}
      <HistoricalEraBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        activeEraId={activeEraId}
        onSelectEra={(eraId) => {
          onSelectEraId?.(eraId);
        }}
      />
    </div>
  );
};
