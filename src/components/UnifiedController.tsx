import React, { useState } from 'react';
import { 
  RateRegime, 
  FxRegime, 
  RelationshipType, 
  UnifiedMacroState 
} from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  PauseCircle, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  Layers
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../utils/macroUnifiedEngine';

interface UnifiedControllerProps {
  rateRegime: RateRegime;
  setRateRegime: (r: RateRegime) => void;
  fxRegime: FxRegime;
  setFxRegime: (f: FxRegime) => void;
  fedRateValue: number;
  setFedRateValue: (v: number) => void;
  usdkrwValue: number;
  setUsdkrwValue: (v: number) => void;
  macro: UnifiedMacroState;
  onSelectPreset: (presetId: string) => void;
}

export const UnifiedController: React.FC<UnifiedControllerProps> = ({
  rateRegime,
  setRateRegime,
  fxRegime,
  setFxRegime,
  fedRateValue,
  setFedRateValue,
  usdkrwValue,
  setUsdkrwValue,
  macro,
  onSelectPreset
}) => {
  // Preset scenario category filter tab ('ALL' | 'NORMAL' | 'EXCEPTION')
  const [activeTab, setActiveTab] = useState<'ALL' | 'NORMAL' | 'EXCEPTION'>('ALL');

  const filteredPresets = PRESET_SCENARIOS.filter(p => {
    if (activeTab === 'ALL') return true;
    return p.category === activeTab;
  });

  const isNormal = macro.relationshipType === 'NORMAL';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* 1. Top Mode Filter Bar (일반 상황 vs 예외 상황 구분 탭) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              매크로 입체 제어 패널: 일반 상관관계 vs 예외 디커플링
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            금리와 환율의 <strong className="text-emerald-400">인상/인하 방향</strong>뿐만 아니라, <strong className="text-amber-400">인상된 고금리 유지</strong> 및 <strong className="text-cyan-400">인하된 저금리 유지</strong>까지 입체적으로 시뮬레이션합니다.
          </p>
        </div>

        {/* Category Tabs: 일반 vs 예외 */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-2xl self-start lg:self-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'ALL'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>전체 시나리오 (8)</span>
          </button>
          <button
            onClick={() => setActiveTab('NORMAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'NORMAL'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>일반 상황 (정방향 4)</span>
          </button>
          <button
            onClick={() => setActiveTab('EXCEPTION')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'EXCEPTION'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-purple-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>예외 상황 (디커플링 4)</span>
          </button>
        </div>
      </div>

      {/* 2. Preset Quick Cards Grid (원클릭 시나리오 선택) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            대표 시나리오 퀵 셀렉터 ({filteredPresets.length}개)
          </span>
          <span className="text-[11px] text-slate-500">클릭 시 금리·환율 상태가 자동 세팅됩니다</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {filteredPresets.map(preset => {
            const isSelected = rateRegime === preset.rateRegime && fxRegime === preset.fxRegime;
            const isPresetNormal = preset.category === 'NORMAL';

            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                className={`p-3 rounded-2xl text-left transition border flex flex-col justify-between gap-2 relative overflow-hidden ${
                  isSelected
                    ? isPresetNormal
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50'
                      : 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-950/50 ring-1 ring-purple-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isPresetNormal
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {preset.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> 적용 중
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold leading-snug line-clamp-2">
                    {preset.title}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.summary}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Deep-Dive Interactive Regime Controls (금리 4단계 & 환율 4단계 레벨 선택기) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
        {/* Left Column: 미국 기준금리 4단계 상태 */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200">① 미국 연준 기준금리 상태 (Rate Regime)</span>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-lg">
              {fedRateValue.toFixed(2)}%
            </span>
          </div>

          {/* 4-Regime Selector Buttons */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Hike */}
            <button
              onClick={() => {
                setRateRegime('HIKE');
                setFedRateValue(5.25);
              }}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-between transition border ${
                rateRegime === 'HIKE'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md ring-1 ring-rose-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                <span>금리 인상기 (올리는 중)</span>
              </span>
              <span className="text-[10px] opacity-70">긴축 착수</span>
            </button>

            {/* High Hold */}
            <button
              onClick={() => {
                setRateRegime('HIGH_HOLD');
                setFedRateValue(5.50);
              }}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-between transition border ${
                rateRegime === 'HIGH_HOLD'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>고금리 유지/동결 (인상 상태)</span>
              </span>
              <span className="text-[10px] opacity-70">피로 누적</span>
            </button>

            {/* Cut */}
            <button
              onClick={() => {
                setRateRegime('CUT');
                setFedRateValue(3.25);
              }}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-between transition border ${
                rateRegime === 'CUT'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>금리 인하기 (내리는 중)</span>
              </span>
              <span className="text-[10px] opacity-70">피벗 완화</span>
            </button>

            {/* Low Hold */}
            <button
              onClick={() => {
                setRateRegime('LOW_HOLD');
                setFedRateValue(0.75);
              }}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-between transition border ${
                rateRegime === 'LOW_HOLD'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <PauseCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>저금리 유지/동결 (인하 상태)</span>
              </span>
              <span className="text-[10px] opacity-70">버블 과열</span>
            </button>
          </div>

          {/* Slider for fine-tuning */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>미세 금리 조절</span>
              <span className="font-mono text-cyan-300">{fedRateValue.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0.25"
              max="7.00"
              step="0.25"
              value={fedRateValue}
              onChange={(e) => setFedRateValue(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Right Column: 원/달러 환율 4단계 상태 */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200">② 원/달러 환율 상태 (FX Regime)</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-lg">
              ₩{usdkrwValue}
            </span>
          </div>

          {/* 4-Regime Selector Buttons */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Rise */}
            <button
              onClick={() => {
                setFxRegime('RISE');
                setUsdkrwValue(1380);
              }}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-between transition border ${
                fxRegime === 'RISE'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md ring-1 ring-rose-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                <span>환율 상승기 (원화 약세 중)</span>
              </span>
              <span className="text-[10px] opacity-70">외인 이탈</span>
            </button>

            {/* High Hold */}
            <button
              onClick={() => {
                setFxRegime('HIGH_HOLD');
                setUsdkrwValue(1420);
              }}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-between transition border ${
                fxRegime === 'HIGH_HOLD'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>고환율 고착화 (1,400원대 유지)</span>
              </span>
              <span className="text-[10px] opacity-70">수입물가고</span>
            </button>

            {/* Fall */}
            <button
              onClick={() => {
                setFxRegime('FALL');
                setUsdkrwValue(1220);
              }}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-between transition border ${
                fxRegime === 'FALL'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>환율 하락기 (원화 강세 중)</span>
              </span>
              <span className="text-[10px] opacity-70">환차익 유입</span>
            </button>

            {/* Low Hold */}
            <button
              onClick={() => {
                setFxRegime('LOW_HOLD');
                setUsdkrwValue(1150);
              }}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-between transition border ${
                fxRegime === 'LOW_HOLD'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md ring-1 ring-cyan-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <PauseCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>저환율 안정화 (1,100원대 유지)</span>
              </span>
              <span className="text-[10px] opacity-70">원자재 안정</span>
            </button>
          </div>

          {/* Slider for fine-tuning */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>미세 환율 조절</span>
              <span className="font-mono text-emerald-300">₩{usdkrwValue}</span>
            </div>
            <input
              type="range"
              min="1050"
              max="1550"
              step="10"
              value={usdkrwValue}
              onChange={(e) => setUsdkrwValue(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* 4. Real-time Relationship Evaluation Banner (일반 vs 예외 상황 즉시 판정 & 핵심 해설) */}
      <div
        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isNormal
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
            : 'bg-purple-950/30 border-purple-500/40 text-purple-100'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 ${
                isNormal
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}
            >
              {isNormal ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertOctagon className="w-3.5 h-3.5" />}
              {isNormal ? '일반적 동행 상황 (Standard Correlated)' : '예외적 비동조화 상황 (Decoupling Divergence)'}
            </span>
            <span className="text-xs font-bold text-white">
              {macro.scenarioName}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            {macro.relationshipReason}
          </p>
        </div>

        <div className="hidden sm:flex flex-col items-end text-right shrink-0">
          <span className="text-[11px] text-slate-400">현 조합 시나리오</span>
          <span className="text-xs font-bold text-cyan-300 font-mono">
            {macro.scenarioTag}
          </span>
        </div>
      </div>
    </div>
  );
};
