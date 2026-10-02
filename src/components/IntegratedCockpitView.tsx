import React, { useState, useMemo } from 'react';
import { 
  DetailedPhase, 
  CouplingMode, 
  UnifiedMacroState,
  MacroQuadrant
} from '../types';
import { 
  DETAILED_PHASE_INFO,
  calculateCoupledFxFromRate,
  calculateCoupledRateFromFx,
  calculateContinuousTransmission
} from '../utils/macroUnifiedEngine';
import { CustomVerticalFader } from './CustomVerticalFader';
import { MacroFundamentalQuadrant } from './MacroFundamentalQuadrant';
import { HistoricalTimelinePtController } from './HistoricalTimelinePtController';
import { HighResTimelinePtController } from './HighResTimelinePtController';
import { MiniSparkline } from './MiniSparkline';
import { 
  HistoricalMacroPoint, 
  HISTORICAL_MACRO_TIMELINE 
} from '../data/historicalTimelineData';
import { 
  MonthlyMacroTimeSeriesPoint, 
  MONTHLY_MACRO_SERIES 
} from '../data/monthlyMacroTimeSeries';
import { 
  getHistoricalEraById, 
  HISTORICAL_ERA_PRESETS 
} from '../data/historicalEraData';
import { getActiveRecentSeries } from '../data/timeSeriesStorage';
import { 
  Sliders, 
  Link, 
  Unlink, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Scale, 
  AlertCircle, 
  ShieldCheck, 
  Layers, 
  DollarSign, 
  ArrowRight,
  Sparkles,
  Flame,
  CloudLightning,
  Snowflake,
  PieChart,
  Activity
} from 'lucide-react';

interface IntegratedCockpitViewProps {
  rateValue: number;
  setRateValue: (val: number) => void;
  fxValue: number;
  setFxValue: (val: number) => void;
  liquidityValue: number;
  setLiquidityValue: (val: number) => void;
  rateDetailedPhase: DetailedPhase;
  setRateDetailedPhase: (phase: DetailedPhase) => void;
  fxDetailedPhase: DetailedPhase;
  setFxDetailedPhase: (phase: DetailedPhase) => void;
  couplingMode: CouplingMode;
  setCouplingMode: (mode: CouplingMode) => void;
  growthScore: number;
  setGrowthScore: (score: number) => void;
  inflationScore: number;
  setInflationScore: (score: number) => void;
  onQuadrantSelect: (quadrant: MacroQuadrant) => void;
  macro: UnifiedMacroState;
  onSelectPreset: (presetId: string) => void;
  onOpenDataUpdateManager?: () => void;
  dataVersion?: number;
}

export const IntegratedCockpitView: React.FC<IntegratedCockpitViewProps> = ({
  rateValue,
  setRateValue,
  fxValue,
  setFxValue,
  liquidityValue,
  setLiquidityValue,
  rateDetailedPhase,
  setRateDetailedPhase,
  fxDetailedPhase,
  setFxDetailedPhase,
  couplingMode,
  setCouplingMode,
  growthScore,
  setGrowthScore,
  inflationScore,
  setInflationScore,
  onQuadrantSelect,
  macro,
  onOpenDataUpdateManager,
  dataVersion = 0
}) => {
  // Historical Timeline PT State (2024 ~ 2026 US Actual Points)
  const [isTimelinePtOpen, setIsTimelinePtOpen] = useState(true);
  const [isPtSimActive, setIsPtSimActive] = useState<boolean>(true); // Distinct Mode: PT Simulation vs Live Exploration
  const [selectedPtPointId, setSelectedPtPointId] = useState<string>(HISTORICAL_MACRO_TIMELINE[0].id);

  // Historical Crisis Era Selection State (Dot-com 2000, GFC 2008, Covid 2020, 2024~2026, etc.)
  const [currentEraId, setCurrentEraId] = useState<string>('recent-pivot-2024');
  const currentEra = useMemo(() => getHistoricalEraById(currentEraId), [currentEraId]);
  
  // Dynamic time series support (merges local storage custom points if recent-pivot-2024)
  const activeTimeSeries = useMemo(() => {
    if (currentEraId === 'recent-pivot-2024') {
      return getActiveRecentSeries();
    }
    return currentEra.monthlySeries;
  }, [currentEraId, currentEra, dataVersion]);

  // Continuous High-Res Time Series Index within the Active Era
  const [currentMonthlyIndex, setCurrentMonthlyIndex] = useState<number>(0);

  // Smooth scroll jumps to Lower Layers
  const scrollToLayer2 = () => {
    const el = document.getElementById('layer2-transmission-console');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToLayer3 = () => {
    const el = document.getElementById('layer3-market-reaction-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetToLive = () => {
    setIsPtSimActive(false);
  };

  // PT Mode Open/Close Toggle Handler: 'PT 종료' 시 즉시 자유 시뮬레이션 모드로 전환
  const handleTogglePtOpen = () => {
    if (isTimelinePtOpen) {
      // 'PT 종료' 버튼 클릭: 컨트롤러를 닫고 즉시 자유 시뮬레이션 모드로 진입!
      setIsTimelinePtOpen(false);
      setIsPtSimActive(false);
    } else {
      // '역사적 위기 시계열 PT' 클릭: 컨트롤러를 열고 즉시 PT 시뮬레이션 모드로 진입!
      setIsTimelinePtOpen(true);
      setIsPtSimActive(true);
      const pt = activeTimeSeries[currentMonthlyIndex] || activeTimeSeries[0];
      if (pt) {
        setGrowthScore(pt.growthScore);
        setInflationScore(pt.inflationScore);
        setRateValue(pt.fedRate);
        setLiquidityValue(pt.netLiquidity);
        setFxValue(pt.usdkrw);
        syncDetailedPhases(pt.fedRate, pt.usdkrw);
      }
    }
  };

  const syncDetailedPhases = (rate: number, fx: number) => {
    if (rate >= 5.25) setRateDetailedPhase('HIGH_HOLD');
    else if (rate >= 4.0) setRateDetailedPhase('RISING_MID_TO_HIGH');
    else if (rate >= 2.5) setRateDetailedPhase('MID_HOLD');
    else if (rate >= 1.0) setRateDetailedPhase('FALLING_MID_TO_LOW');
    else setRateDetailedPhase('LOW_HOLD');

    if (fx >= 1410) setFxDetailedPhase('HIGH_HOLD');
    else if (fx >= 1340) setFxDetailedPhase('RISING_MID_TO_HIGH');
    else if (fx >= 1200) setFxDetailedPhase('MID_HOLD');
    else setFxDetailedPhase('LOW_HOLD');
  };

  // Era Switch Handler
  const handleSelectEra = (eraId: string) => {
    setCurrentEraId(eraId);
    const newEra = getHistoricalEraById(eraId);
    setCurrentMonthlyIndex(0);
    const firstPt = newEra.monthlySeries[0];
    if (firstPt) {
      setIsPtSimActive(true);
      setGrowthScore(firstPt.growthScore);
      setInflationScore(firstPt.inflationScore);
      setRateValue(firstPt.fedRate);
      setLiquidityValue(firstPt.netLiquidity);
      setFxValue(firstPt.usdkrw);
      syncDetailedPhases(firstPt.fedRate, firstPt.usdkrw);
    }
  };

  // Monthly Time Series Selection Handler (Full synchronization across all 3 layers)
  const handleSelectMonthlyIndex = (index: number) => {
    const pt = activeTimeSeries[index];
    if (!pt) return;
    setIsPtSimActive(true); // Activating monthly step puts system in PT simulation mode
    setCurrentMonthlyIndex(index);
    setGrowthScore(pt.growthScore);
    setInflationScore(pt.inflationScore);
    setRateValue(pt.fedRate);
    setLiquidityValue(pt.netLiquidity);
    setFxValue(pt.usdkrw);
    syncDetailedPhases(pt.fedRate, pt.usdkrw);

    // Find closest milestone if applicable for 2024~2026
    if (currentEraId === 'recent-pivot-2024') {
      if (pt.id.startsWith('2024-0') && Number(pt.id.slice(6)) <= 6) {
        setSelectedPtPointId('pt-2024-h1');
      } else if (pt.id === '2024-09') {
        setSelectedPtPointId('pt-2024-sep');
      } else if (pt.id === '2024-11' || pt.id === '2024-12') {
        setSelectedPtPointId('pt-2024-q4');
      } else if (pt.id.startsWith('2025-0') && Number(pt.id.slice(6)) <= 6) {
        setSelectedPtPointId('pt-2025-h1');
      } else if (pt.id.startsWith('2026')) {
        setSelectedPtPointId('pt-2026-now');
      }
    }
  };

  // Historical Timeline Point Selection Handler (Milestones)
  const handleSelectHistoricalPoint = (point: HistoricalMacroPoint) => {
    setSelectedPtPointId(point.id);
    
    // Also find corresponding monthly index
    const monthMapping: Record<string, number> = {
      'pt-2024-h1': 2,   // '24.03
      'pt-2024-sep': 8,  // '24.09
      'pt-2024-q4': 11,  // '24.12
      'pt-2025-h1': 15,  // '25.04
      'pt-2026-now': 29  // '26.06
    };
    if (monthMapping[point.id] !== undefined) {
      setCurrentMonthlyIndex(monthMapping[point.id]);
    }

    setGrowthScore(point.growthScore);
    setInflationScore(point.inflationScore);
    setRateValue(point.fedRate);
    setLiquidityValue(point.netLiquidity);
    setFxValue(point.usdkrw);

    // Sync detailed phases
    if (point.fedRate >= 5.25) setRateDetailedPhase('HIGH_HOLD');
    else if (point.fedRate >= 4.5) setRateDetailedPhase('RISING_MID_TO_HIGH');
    else if (point.fedRate >= 2.75) setRateDetailedPhase('MID_HOLD');
    else setRateDetailedPhase('LOW_HOLD');

    if (point.usdkrw >= 1410) setFxDetailedPhase('HIGH_HOLD');
    else if (point.usdkrw >= 1340) setFxDetailedPhase('RISING_MID_TO_HIGH');
    else if (point.usdkrw >= 1250) setFxDetailedPhase('MID_HOLD');
    else setFxDetailedPhase('LOW_HOLD');
  };

  // 1. Rate slider change handler (0.25% ~ 6.00%)
  const handleRateChange = (newRate: number) => {
    setIsPtSimActive(false); // User manual interaction reverts to Live Mode
    setRateValue(newRate);

    // Auto calculate phase by rate
    if (newRate >= 5.25) {
      setRateDetailedPhase('HIGH_HOLD');
    } else if (newRate >= 4.0 && newRate < 5.25) {
      setRateDetailedPhase(newRate > rateValue ? 'RISING_MID_TO_HIGH' : 'FALLING_HIGH_TO_MID');
    } else if (newRate >= 2.75 && newRate < 4.0) {
      setRateDetailedPhase('MID_HOLD');
    } else if (newRate >= 1.25 && newRate < 2.75) {
      setRateDetailedPhase(newRate > rateValue ? 'RISING_LOW_TO_MID' : 'FALLING_MID_TO_LOW');
    } else {
      setRateDetailedPhase('LOW_HOLD');
    }

    // Auto adjust liquidity inversely if coupling active
    if (couplingMode !== 'INDEPENDENT') {
      const derivedLiq = parseFloat((9.2 - ((newRate - 0.25) / 5.75) * 3.2).toFixed(2));
      setLiquidityValue(Math.max(5.5, Math.min(9.5, derivedLiq)));
    }

    // Coupling reaction to FX
    if (couplingMode !== 'INDEPENDENT') {
      const coupledFx = calculateCoupledFxFromRate(newRate, couplingMode);
      setFxValue(coupledFx);
      if (coupledFx >= 1400) setFxDetailedPhase('HIGH_HOLD');
      else if (coupledFx >= 1320) setFxDetailedPhase(coupledFx > fxValue ? 'RISING_MID_TO_HIGH' : 'FALLING_HIGH_TO_MID');
      else if (coupledFx >= 1250) setFxDetailedPhase('MID_HOLD');
      else if (coupledFx >= 1180) setFxDetailedPhase(coupledFx > fxValue ? 'RISING_LOW_TO_MID' : 'FALLING_MID_TO_LOW');
      else setFxDetailedPhase('LOW_HOLD');
    }

    // Update 4-quadrant derived scores
    setInflationScore(Math.round((newRate - 2.5) * 22));
    setGrowthScore(Math.round(25 - (newRate - 3.0) * 18));
  };

  // 2. Liquidity slider change handler ($5.5T ~ $9.5T)
  const handleLiquidityChange = (newLiq: number) => {
    setIsPtSimActive(false); // User manual interaction reverts to Live Mode
    setLiquidityValue(newLiq);
    // When liquidity changes independently, it influences growth and inflation
    const growthDelta = Math.round((newLiq - 7.5) * 25);
    setGrowthScore(Math.max(-100, Math.min(100, growthDelta)));
  };

  // 3. FX slider change handler (1,100원 ~ 1,500원)
  const handleFxChange = (newFx: number) => {
    setIsPtSimActive(false); // User manual interaction reverts to Live Mode
    setFxValue(newFx);

    if (newFx >= 1410) {
      setFxDetailedPhase('HIGH_HOLD');
    } else if (newFx >= 1320 && newFx < 1410) {
      setFxDetailedPhase(newFx > fxValue ? 'RISING_MID_TO_HIGH' : 'FALLING_HIGH_TO_MID');
    } else if (newFx >= 1250 && newFx < 1320) {
      setFxDetailedPhase('MID_HOLD');
    } else if (newFx >= 1180 && newFx < 1250) {
      setFxDetailedPhase(newFx > fxValue ? 'RISING_LOW_TO_MID' : 'FALLING_MID_TO_LOW');
    } else {
      setFxDetailedPhase('LOW_HOLD');
    }

    if (couplingMode !== 'INDEPENDENT') {
      const coupledRate = calculateCoupledRateFromFx(newFx, couplingMode);
      setRateValue(coupledRate);
      if (coupledRate >= 5.25) setRateDetailedPhase('HIGH_HOLD');
      else if (coupledRate >= 4.0) setRateDetailedPhase(coupledRate > rateValue ? 'RISING_MID_TO_HIGH' : 'FALLING_HIGH_TO_MID');
      else if (coupledRate >= 2.75) setRateDetailedPhase('MID_HOLD');
      else if (coupledRate >= 1.25) setRateDetailedPhase(coupledRate > rateValue ? 'RISING_LOW_TO_MID' : 'FALLING_MID_TO_LOW');
      else setRateDetailedPhase('LOW_HOLD');
    }
  };

  // 2D Coordinates change from Quadrant Pad: Continuous Mathematical Transmission
  const handleCoordinatesChange = (growth: number, inflation: number) => {
    setIsPtSimActive(false); // User manual interaction reverts to Live Mode
    setGrowthScore(growth);
    setInflationScore(inflation);

    // Continuous Taylor Rule and Dollar Liquidity transmission
    const continuous = calculateContinuousTransmission(growth, inflation, couplingMode);
    
    setRateValue(continuous.rateValue);
    setLiquidityValue(continuous.liquidityValue);
    setFxValue(continuous.fxValue);

    // Continuous detailed phase adaptation based on calculated continuous rate & FX
    if (continuous.rateValue >= 5.25) setRateDetailedPhase('HIGH_HOLD');
    else if (continuous.rateValue >= 4.0) setRateDetailedPhase(continuous.rateValue > rateValue ? 'RISING_MID_TO_HIGH' : 'FALLING_HIGH_TO_MID');
    else if (continuous.rateValue >= 2.75) setRateDetailedPhase('MID_HOLD');
    else if (continuous.rateValue >= 1.25) setRateDetailedPhase(continuous.rateValue > rateValue ? 'RISING_LOW_TO_MID' : 'FALLING_MID_TO_LOW');
    else setRateDetailedPhase('LOW_HOLD');

    if (continuous.fxValue >= 1410) setFxDetailedPhase('HIGH_HOLD');
    else if (continuous.fxValue >= 1320) setFxDetailedPhase(continuous.fxValue > fxValue ? 'RISING_MID_TO_HIGH' : 'FALLING_HIGH_TO_MID');
    else if (continuous.fxValue >= 1250) setFxDetailedPhase('MID_HOLD');
    else if (continuous.fxValue >= 1180) setFxDetailedPhase(continuous.fxValue > fxValue ? 'RISING_LOW_TO_MID' : 'FALLING_MID_TO_LOW');
    else setFxDetailedPhase('LOW_HOLD');
  };

  // Tick Definitions for 3 Faders
  const rateTicks = [
    { value: 5.50, label: '5.50% (고금리)' },
    { value: 4.25, label: '4.25%' },
    { value: 3.00, label: '3.00% (중립)' },
    { value: 1.75, label: '1.75%' },
    { value: 0.50, label: '0.50% (초저금리)' }
  ];

  const liquidityTicks = [
    { value: 9.20, label: '$9.2T (대규모 QE)' },
    { value: 8.40, label: '$8.4T (유동성확대)' },
    { value: 7.50, label: '$7.5T (중립균형)' },
    { value: 6.60, label: '$6.6T (완만 QT)' },
    { value: 5.80, label: '$5.8T (긴축 가뭄)' }
  ];

  const fxTicks = [
    { value: 1440, label: '1,440원 (고환율)' },
    { value: 1360, label: '1,360원' },
    { value: 1280, label: '1,280원 (평균)' },
    { value: 1200, label: '1,200원' },
    { value: 1140, label: '1,140원 (저환율)' }
  ];

  const currentRateInfo = DETAILED_PHASE_INFO[rateDetailedPhase];
  const currentFxInfo = DETAILED_PHASE_INFO[fxDetailedPhase];

  return (
    <div id="integrated-macro-cockpit" className="space-y-6">
      {/* ──────────────────────────────────────────────────────────
          HIGH-RESOLUTION HISTORICAL CRISIS & REGIME SHIFT TRAJECTORY PT
      ────────────────────────────────────────────────────────── */}
      <HighResTimelinePtController
        currentMonthlyIndex={currentMonthlyIndex}
        onSelectMonthlyIndex={handleSelectMonthlyIndex}
        isOpen={isTimelinePtOpen}
        onToggleOpen={handleTogglePtOpen}
        activeMilestone={HISTORICAL_MACRO_TIMELINE.find(p => p.id === selectedPtPointId)}
        isSimulationMode={isPtSimActive}
        onResetToLive={handleResetToLive}
        onScrollToLayer2={scrollToLayer2}
        onScrollToLayer3={scrollToLayer3}
        activeEraId={currentEraId}
        onSelectEraId={handleSelectEra}
        activeSeries={activeTimeSeries}
        onOpenDataUpdateManager={onOpenDataUpdateManager}
      />

      {/* ──────────────────────────────────────────────────────────
          LAYER 1: 거시경제 펀더멘털 사분면 (성장 vs 물가)
      ────────────────────────────────────────────────────────── */}
      <MacroFundamentalQuadrant
        growthScore={growthScore}
        inflationScore={inflationScore}
        currentQuadrant={macro.macroQuadrant}
        onQuadrantSelect={onQuadrantSelect}
        onCoordinatesChange={handleCoordinatesChange}
        selectedHistoricalPointId={selectedPtPointId}
        onSelectHistoricalPoint={handleSelectHistoricalPoint}
        timeSeriesIndex={currentMonthlyIndex}
        onTimeSeriesIndexChange={handleSelectMonthlyIndex}
        activeSeries={activeTimeSeries}
        isSimulationMode={isPtSimActive}
        activeEraId={currentEraId}
        activeEraTitle={currentEra.shortTitle}
      />

      {/* ──────────────────────────────────────────────────────────
          TRANSMISSION PIPELINE INDICATOR (원인 ➔ 전달 ➔ 결과)
      ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 py-1 text-slate-500 font-mono text-xs">
        <span className="flex items-center gap-1 text-indigo-400 font-bold">
          [LAYER 1] 펀더멘털 상태
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="flex items-center gap-1 text-cyan-400 font-bold">
          [LAYER 2] 3대 정책·유동성 전달계
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="flex items-center gap-1 text-emerald-400 font-bold">
          [LAYER 3] 자산 변동성 파급
        </span>
      </div>

      {/* ──────────────────────────────────────────────────────────
          LAYER 2: 3대 정책·유동성 전달계 콘솔 (트라이포드 페이더)
      ────────────────────────────────────────────────────────── */}
      <div id="layer2-transmission-console" className="scroll-mt-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
        {/* Transmission Layer Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                LAYER 2 : TRANSMISSION ENGINE
              </span>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                3대 정책·자금수급 제어 콘솔 (금리 × 유동성 × 환율)
              </h3>
            </div>
          </div>

          {/* Coupling Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setCouplingMode('COUPLED')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                couplingMode === 'COUPLED'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="정방향 커플링: 금리 인상 시 달러 유동성 축소 & 원달러 환율 상승 동조"
            >
              <Link className="w-3 h-3" />
              <span>정방향 동조 (기본)</span>
            </button>

            <button
              onClick={() => setCouplingMode('DECOUPLED_INVERSE')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                couplingMode === 'DECOUPLED_INVERSE'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="역행 디커플링: 위기 시 패닉 금리인하와 환율 폭등 등 예외 상황"
            >
              <Zap className="w-3 h-3" />
              <span>역행 디커플링</span>
            </button>

            <button
              onClick={() => setCouplingMode('INDEPENDENT')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                couplingMode === 'INDEPENDENT'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="완전 독립 조작: 3개 조절 바를 각각 자유롭게 테스트"
            >
              <Unlink className="w-3 h-3" />
              <span>개별 수동 조작</span>
            </button>
          </div>
        </div>

        {/* 3 Physical Faders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Fader 1: 미국 기준금리 (Fed Rate) */}
          <CustomVerticalFader
            id="fader-rate"
            title="① 미국 기준금리 (Fed Rate)"
            value={rateValue}
            min={0.00}
            max={7.00}
            step={0.25}
            formatValue={(v) => `${v.toFixed(2)}%`}
            phaseLabel={currentRateInfo.badge}
            accentColor="cyan"
            ticks={rateTicks}
            onChange={handleRateChange}
            sparklineData={isPtSimActive ? {
              label: `${currentEra.shortTitle} 기준금리 궤적`,
              history: activeTimeSeries.map(p => p.fedRate),
              currentIndex: currentMonthlyIndex,
              unit: '%'
            } : undefined}
          />

          {/* Fader 2: 달러 순유동성 & Fed 대차대조표/M2 */}
          <CustomVerticalFader
            id="fader-liquidity"
            title="② 달러 순유동성 (M2/Fed Net Liquidity)"
            value={liquidityValue}
            min={0.50}
            max={9.50}
            step={0.10}
            formatValue={(v) => `$${v.toFixed(1)}T`}
            phaseLabel={macro.liquidityLabel}
            accentColor="purple"
            ticks={liquidityTicks}
            onChange={handleLiquidityChange}
            sparklineData={isPtSimActive ? {
              label: `${currentEra.shortTitle} 순유동성 궤적`,
              history: activeTimeSeries.map(p => p.netLiquidity),
              currentIndex: currentMonthlyIndex,
              unit: 'T'
            } : undefined}
          />

          {/* Fader 3: 원/달러 환율 (USD/KRW) */}
          <CustomVerticalFader
            id="fader-fx"
            title="③ 원/달러 환율 (USD/KRW)"
            value={fxValue}
            min={900}
            max={1650}
            step={10}
            formatValue={(v) => `${v.toLocaleString()}원`}
            phaseLabel={currentFxInfo.badge}
            accentColor="emerald"
            ticks={fxTicks}
            onChange={handleFxChange}
            sparklineData={isPtSimActive ? {
              label: `${currentEra.shortTitle} 환율 궤적`,
              history: activeTimeSeries.map(p => p.usdkrw),
              currentIndex: currentMonthlyIndex,
              unit: '원'
            } : undefined}
          />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          LAYER 3: 최종 시장 변동성 반응판 (Layer 3: Market Impact)
      ────────────────────────────────────────────────────────── */}
      <div id="layer3-market-reaction-panel" className="scroll-mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Market Asset Impact Cards (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                    LAYER 3 : ASSET REACTION
                  </span>
                  <h3 className="text-sm font-extrabold text-white">
                    자산군별 실시간 변동성 및 수급 영향
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">
                수급 압력: <b className="text-purple-400">{macro.liquidityLabel}</b>
              </span>
            </div>

            {/* Asset Impact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {macro.assets.map((asset) => {
                const isBullish = asset.direction === 'UP';
                const isBearish = asset.direction === 'DOWN';
                return (
                  <div
                    key={asset.id}
                    className="p-3 bg-slate-950/70 rounded-xl border border-slate-850 hover:border-slate-750 transition flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-white">{asset.nameKr}</span>
                        <span className="text-[10px] font-mono text-slate-500 ml-1.5">{asset.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-black font-mono flex items-center gap-0.5 ${
                        isBullish 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : isBearish
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {isBullish && <TrendingUp className="w-3 h-3" />}
                        {isBearish && <TrendingDown className="w-3 h-3" />}
                        {!isBullish && !isBearish && <Minus className="w-3 h-3" />}
                        {asset.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {asset.summary}
                    </p>

                    <div className="pt-1.5 border-t border-slate-850/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>영향 강도 (Score)</span>
                      <div className="flex items-center gap-1.5">
                        <span className={asset.score > 0 ? 'text-emerald-400 font-bold' : asset.score < 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                          {asset.score > 0 ? `+${asset.score}` : asset.score}
                        </span>
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isBullish ? 'bg-emerald-400' : isBearish ? 'bg-rose-400' : 'bg-slate-400'}`}
                            style={{ width: `${Math.min(100, Math.max(10, Math.abs(asset.score)))}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Integrated Historical Trend Mini Sparkline for Key Asset Types (Shown during PT Simulation only) */}
                    {isPtSimActive && asset.id === 'us_stock' && (
                      <div className="pt-1 border-t border-slate-850/40">
                        <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                          <span>S&P 500 시계열 궤적</span>
                          <span className="text-amber-300 font-bold">{activeTimeSeries[currentMonthlyIndex]?.sp500Index}pt</span>
                        </div>
                        <MiniSparkline
                          data={activeTimeSeries.map(p => p.sp500Index)}
                          currentIndex={currentMonthlyIndex}
                          color="amber"
                          unit="pt"
                          label="S&P 500"
                          height={28}
                        />
                      </div>
                    )}

                    {isPtSimActive && asset.id === 'crypto' && (
                      <div className="pt-1 border-t border-slate-850/40">
                        <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                          <span>비트코인(BTC) 시계열 궤적</span>
                          <span className="text-orange-400 font-bold">${activeTimeSeries[currentMonthlyIndex]?.bitcoinPrice}K</span>
                        </div>
                        <MiniSparkline
                          data={activeTimeSeries.map(p => p.bitcoinPrice)}
                          currentIndex={currentMonthlyIndex}
                          color="amber"
                          unit="K"
                          label="BTC/USD"
                          height={28}
                        />
                      </div>
                    )}

                    {isPtSimActive && asset.id === 'us_bond' && (
                      <div className="pt-1 border-t border-slate-850/40">
                        <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                          <span>미 10년물 국채수익률 궤적</span>
                          <span className="text-cyan-400 font-bold">{activeTimeSeries[currentMonthlyIndex]?.treasury10Y}%</span>
                        </div>
                        <MiniSparkline
                          data={activeTimeSeries.map(p => p.treasury10Y)}
                          currentIndex={currentMonthlyIndex}
                          color="cyan"
                          unit="%"
                          label="US10Y"
                          height={28}
                        />
                      </div>
                    )}

                    {isPtSimActive && asset.id === 'gold' && (
                      <div className="pt-1 border-t border-slate-850/40">
                        <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                          <span>국제 금(Gold) 시계열 궤적</span>
                          <span className="text-yellow-400 font-bold">${activeTimeSeries[currentMonthlyIndex]?.goldPrice}</span>
                        </div>
                        <MiniSparkline
                          data={activeTimeSeries.map(p => p.goldPrice)}
                          currentIndex={currentMonthlyIndex}
                          color="amber"
                          unit="$"
                          label="Gold/USD"
                          height={28}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bond Seesaw & Yield Curve Status */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-extrabold text-white">
                  채권 시소 원리 (Bond Seesaw) & 장단기 금리차
                </h4>
              </div>
              <span className="text-[11px] font-mono text-cyan-300">
                10Y: {macro.bond.yield10Y}% · 2Y: {macro.bond.yield2Y}% (스프레드 {macro.bond.spread.toFixed(2)}%p)
              </span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-200">
                  {macro.bond.spread < 0 ? '⚠️ 장단기 금리 역전 (수익률곡선 역전)' : '✅ 정상 수익률곡선 (우상향 스프레드)'}
                </div>
                <p className="text-[11px] text-slate-400">
                  {macro.bond.newInvestorNote}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 block">채권 가격 방향</span>
                <span className={`text-sm font-black font-mono ${
                  macro.bond.bondPriceDirection === 'UP' ? 'text-emerald-400' :
                  macro.bond.bondPriceDirection === 'DOWN' ? 'text-rose-400' : 'text-slate-300'
                }`}>
                  {macro.bond.bondPriceDirection === 'UP' ? '▲ 채권 가격 상승' :
                   macro.bond.bondPriceDirection === 'DOWN' ? '▼ 채권 가격 하락' : '─ 횡보 유지'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Action Briefing & Synthesis (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase">
                    SYNTHESIS REPORT
                  </span>
                  <h3 className="text-sm font-extrabold text-white">
                    현재 복합 국면 종합 판정
                  </h3>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                macro.relationshipType === 'NORMAL'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                {macro.relationshipType === 'NORMAL' ? '정방향 정상국면' : '예외/위기 국면'}
              </span>
            </div>

            {/* Causal Chain Summary */}
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-850 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>시나리오: {macro.scenarioName}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {macro.scenarioDescription}
              </p>
            </div>

            {/* Core Transmission Law */}
            <div className="p-3.5 bg-cyan-950/20 rounded-xl border border-cyan-800/40 space-y-1.5">
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>핵심 메커니즘 법칙 (Core Transmission Rule)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {macro.coreRule}
              </p>
            </div>

            {/* Liquidity Supply/Demand Engine Notice */}
            <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-800/40 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-purple-400" />
                  달러 유동성 수급 판정:
                </span>
                <span className="font-mono">{macro.liquidityLabel} (${liquidityValue}T)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {macro.liquidityDesc}
              </p>
            </div>

            {/* Economic Indicators Quick Bar */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                핵심 거시경제 보조 지표 상태
              </span>

              <div className="space-y-1.5 text-xs">
                {macro.indicators.slice(0, 3).map((ind) => (
                  <div key={ind.id} className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200">{ind.titleKr}</span>
                      <span className="text-[10px] text-slate-500 block">{ind.explanation}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-cyan-300">
                      {ind.valueText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
