import React from 'react';
import { 
  DetailedPhase, 
  CouplingMode, 
  RateRegime, 
  FxRegime, 
  UnifiedMacroState 
} from '../types';
import { 
  DETAILED_PHASES_ORDER, 
  DETAILED_PHASE_INFO,
  calculateCoupledFxFromRate,
  calculateCoupledRateFromFx
} from '../utils/macroUnifiedEngine';
import { CustomVerticalFader } from './CustomVerticalFader';
import { 
  Sliders, 
  Link, 
  Unlink, 
  Zap, 
  ShieldCheck, 
  ArrowUp, 
  ArrowDown, 
  Pause, 
  Info,
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface VerticalDualFaderControllerProps {
  rateValue: number;
  setRateValue: (val: number) => void;
  fxValue: number;
  setFxValue: (val: number) => void;
  rateDetailedPhase: DetailedPhase;
  setRateDetailedPhase: (phase: DetailedPhase) => void;
  fxDetailedPhase: DetailedPhase;
  setFxDetailedPhase: (phase: DetailedPhase) => void;
  couplingMode: CouplingMode;
  setCouplingMode: (mode: CouplingMode) => void;
  macro: UnifiedMacroState;
  onSelectPreset: (presetId: string) => void;
}

export const VerticalDualFaderController: React.FC<VerticalDualFaderControllerProps> = ({
  rateValue,
  setRateValue,
  fxValue,
  setFxValue,
  rateDetailedPhase,
  setRateDetailedPhase,
  fxDetailedPhase,
  setFxDetailedPhase,
  couplingMode,
  setCouplingMode,
  macro,
  onSelectPreset
}) => {
  // Rate slider change handler (0.25% ~ 6.00%)
  const handleRateChange = (newRate: number) => {
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

    // Coupling reaction
    if (couplingMode !== 'INDEPENDENT') {
      const coupledFx = calculateCoupledFxFromRate(newRate, couplingMode);
      setFxValue(coupledFx);
      // Auto assign FX Phase based on coupled FX
      if (coupledFx >= 1400) setFxDetailedPhase('HIGH_HOLD');
      else if (coupledFx >= 1320) setFxDetailedPhase(coupledFx > fxValue ? 'RISING_MID_TO_HIGH' : 'FALLING_HIGH_TO_MID');
      else if (coupledFx >= 1250) setFxDetailedPhase('MID_HOLD');
      else if (coupledFx >= 1180) setFxDetailedPhase(coupledFx > fxValue ? 'RISING_LOW_TO_MID' : 'FALLING_MID_TO_LOW');
      else setFxDetailedPhase('LOW_HOLD');
    }
  };

  // FX slider change handler (1100원 ~ 1500원)
  const handleFxChange = (newFx: number) => {
    setFxValue(newFx);

    // Auto calculate phase by FX
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

    // Coupling reaction
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

  // Click on direct 7-phase mark
  const selectRatePhase = (p: DetailedPhase) => {
    setRateDetailedPhase(p);
    const targetVal = DETAILED_PHASE_INFO[p].rateValue;
    setRateValue(targetVal);

    if (couplingMode === 'COUPLED') {
      const coupledFx = DETAILED_PHASE_INFO[p].fxValue;
      setFxValue(coupledFx);
      setFxDetailedPhase(p);
    } else if (couplingMode === 'DECOUPLED_INVERSE') {
      // Inverse target
      const invIndex = 6 - DETAILED_PHASES_ORDER.indexOf(p);
      const invPhase = DETAILED_PHASES_ORDER[invIndex];
      setFxDetailedPhase(invPhase);
      setFxValue(DETAILED_PHASE_INFO[invPhase].fxValue);
    }
  };

  const selectFxPhase = (p: DetailedPhase) => {
    setFxDetailedPhase(p);
    const targetVal = DETAILED_PHASE_INFO[p].fxValue;
    setFxValue(targetVal);

    if (couplingMode === 'COUPLED') {
      const coupledRate = DETAILED_PHASE_INFO[p].rateValue;
      setRateValue(coupledRate);
      setRateDetailedPhase(p);
    } else if (couplingMode === 'DECOUPLED_INVERSE') {
      const invIndex = 6 - DETAILED_PHASES_ORDER.indexOf(p);
      const invPhase = DETAILED_PHASES_ORDER[invIndex];
      setRateDetailedPhase(invPhase);
      setRateValue(DETAILED_PHASE_INFO[invPhase].rateValue);
    }
  };

  const isNormal = macro.relationshipType === 'NORMAL';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Top Console Bar: Coupling Mode Selector & Scenario Overview */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Interactive Dual Console
              </span>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>금리 & 환율 듀얼 세로 페이더 (Vertical Fader Hub)</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  isNormal 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                }`}>
                  {isNormal ? '🟢 커플링 (정방향 동행)' : '⚡️ 디커플링 (예외 비동조화)'}
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            세로 조절 바를 상하로 올리고 내릴 때마다 저점/중간/고점 유지 및 상승·하락 7대 변동 국면이 시시각각 연동됩니다.
          </p>
        </div>

        {/* 3-Way Coupling Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => setCouplingMode('COUPLED')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              couplingMode === 'COUPLED'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>🔗 커플링 (일반 동행)</span>
          </button>

          <button
            onClick={() => setCouplingMode('DECOUPLED_INVERSE')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              couplingMode === 'DECOUPLED_INVERSE'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>⚡️ 디커플링 (위기 역행)</span>
          </button>

          <button
            onClick={() => setCouplingMode('INDEPENDENT')}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              couplingMode === 'INDEPENDENT'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Unlink className="w-3.5 h-3.5" />
            <span>🎛 완전 독립 조작</span>
          </button>
        </div>
      </div>

      {/* Main Dual Vertical Fader Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: 미국 기준금리 세로 조절 콘솔 (5 Cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-3">
          <CustomVerticalFader
            id="vfc-rate-fader"
            title="미국 기준금리"
            value={rateValue}
            min={0.25}
            max={6.00}
            step={0.25}
            formatValue={(val) => `${val.toFixed(2)}%`}
            phaseLabel={`국면: ${DETAILED_PHASE_INFO[rateDetailedPhase].title} (${DETAILED_PHASE_INFO[rateDetailedPhase].badge})`}
            accentColor="cyan"
            ticks={[
              { value: 6.0, label: '6.0%' },
              { value: 5.0, label: '5.0%' },
              { value: 4.0, label: '4.0%' },
              { value: 3.0, label: '3.0%' },
              { value: 2.0, label: '2.0%' },
              { value: 1.0, label: '1.0%' },
              { value: 0.25, label: '0.25%' },
            ]}
            onChange={handleRateChange}
          />
          <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850 leading-relaxed">
            💡 {DETAILED_PHASE_INFO[rateDetailedPhase].description}
          </div>
        </div>

        {/* Center Column: Linkage Hub & Interactive Coupling Mechanics (2 Cols) */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-4 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-4 text-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            couplingMode === 'COUPLED'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/20 animate-pulse'
              : couplingMode === 'DECOUPLED_INVERSE'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-lg shadow-purple-500/20 animate-pulse'
              : 'bg-slate-800 text-slate-500 border border-slate-700'
          }`}>
            {couplingMode === 'COUPLED' && <Link className="w-6 h-6" />}
            {couplingMode === 'DECOUPLED_INVERSE' && <Zap className="w-6 h-6" />}
            {couplingMode === 'INDEPENDENT' && <Unlink className="w-6 h-6" />}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
              연동 메커니즘
            </span>
            <div className="text-xs font-bold text-white">
              {couplingMode === 'COUPLED' ? '정방향 동행 연동' :
               couplingMode === 'DECOUPLED_INVERSE' ? '위기형 역행 연동' : '완전 개별 조작'}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            {couplingMode === 'COUPLED' 
              ? '금리를 올리면 환율도 동반 상승하고, 내리면 환율도 안정됩니다.'
              : couplingMode === 'DECOUPLED_INVERSE'
              ? '위기 발생 시 비상 금리인하에도 환율이 폭등하는 디커플링!'
              : '금리와 환율을 각각 독립적으로 자유롭게 설정합니다.'}
          </p>

          <div className="pt-2 border-t border-slate-800 w-full">
            <button
              onClick={() => onSelectPreset(isNormal ? 'norm-1' : 'ex-1')}
              className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-[10px] text-cyan-400 font-bold border border-slate-800 transition"
            >
              대표 프리셋 보기
            </button>
          </div>
        </div>

        {/* Right Column: 원/달러 환율 세로 조절 콘솔 (5 Cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-3">
          <CustomVerticalFader
            id="vfc-fx-fader"
            title="원/달러 환율"
            value={fxValue}
            min={1100}
            max={1500}
            step={10}
            formatValue={(val) => `₩${val.toLocaleString()}`}
            phaseLabel={`국면: ${DETAILED_PHASE_INFO[fxDetailedPhase].title} (${DETAILED_PHASE_INFO[fxDetailedPhase].badge})`}
            accentColor="emerald"
            ticks={[
              { value: 1500, label: '1,500' },
              { value: 1400, label: '1,400' },
              { value: 1300, label: '1,300' },
              { value: 1200, label: '1,200' },
              { value: 1100, label: '1,100' },
            ]}
            onChange={handleFxChange}
          />
          <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850 leading-relaxed">
            💡 {DETAILED_PHASE_INFO[fxDetailedPhase].description}
          </div>
        </div>
      </div>

      {/* Bottom Live Result Banner: Explains real-time causality */}
      <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isNormal 
          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' 
          : 'bg-purple-950/20 border-purple-800/40 text-purple-200'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-white">
              실시간 종합 국면 판정
            </span>
            <span className="font-bold text-sm text-white">
              {macro.scenarioName}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            {macro.relationshipReason}
          </p>
        </div>

        <div className="shrink-0 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800 text-right">
          <div className="text-[10px] text-slate-400">결과적 핵심 파급 법칙</div>
          <div className="text-xs font-mono font-bold text-amber-400">
            {macro.assets.find(a => a.id === 'kospi')?.direction === 'UP' ? 'KOSPI 상승세 ▲' : 'KOSPI 하방압력 ▼'} · 채권가격 {macro.bond.bondPriceDirection === 'UP' ? '급등 ▲' : macro.bond.bondPriceDirection === 'DOWN' ? '폭락 ▼' : '바닥 횡보 ⏸️'}
          </div>
        </div>
      </div>
    </div>
  );
};
