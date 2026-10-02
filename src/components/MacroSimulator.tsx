import React from 'react';
import { 
  Sliders, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  DollarSign, 
  Percent, 
  Building, 
  Landmark, 
  Globe2, 
  CheckCircle2, 
  RefreshCw, 
  Info, 
  Sparkles,
  Zap,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { PolicyAction, EconomicPhase, ScenarioPreset } from '../types';
import { SCENARIO_PRESETS } from '../data/macroPresets';
import { MacroCalculationResult } from '../utils/macroCalculator';

interface MacroSimulatorProps {
  fedRate: number;
  setFedRate: (rate: number) => void;
  usdkrw: number;
  setUsdkrw: (rate: number) => void;
  policy: PolicyAction;
  setPolicy: (policy: PolicyAction) => void;
  phase: EconomicPhase;
  setPhase: (phase: EconomicPhase) => void;
  results: MacroCalculationResult;
  onConfirmStep: () => void;
  isStepConfirmed: boolean;
  onGoToNextTab: () => void;
}

export const MacroSimulator: React.FC<MacroSimulatorProps> = ({
  fedRate,
  setFedRate,
  usdkrw,
  setUsdkrw,
  policy,
  setPolicy,
  phase,
  setPhase,
  results,
  onConfirmStep,
  isStepConfirmed,
  onGoToNextTab
}) => {
  const handlePresetSelect = (preset: ScenarioPreset) => {
    setFedRate(preset.fedRate);
    setUsdkrw(preset.usdkrw);
    setPolicy(preset.policy);
    setPhase(preset.phase);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Confirm bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>2단계: 거시경제 변수 인과관계 스마트 시뮬레이터</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            환율 · 금리 · 통화량의 동적 연동과 자산시장 파급효과
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            슬라이더를 조작하거나 역사적 시나리오 프리셋을 클릭하면, 미 연준의 정책에서부터 
            달러 가치, 채권 수익률 곡선, 한국 자본유출입, 6대 자산군 변동까지 실시간으로 계산되어 반응합니다.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="confirm-step2-btn"
            onClick={onConfirmStep}
            className={`px-4 py-3 rounded-xl font-semibold text-sm transition flex items-center gap-2 shadow-lg ${
              isStepConfirmed
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isStepConfirmed ? '2단계 시뮬레이터 승인 완료' : '2단계 시뮬레이터 승인(컨펌)'}</span>
          </button>
        </div>
      </div>

      {/* Preset Selection Buttons */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            역사적 거시경제 시나리오 프리셋 (원클릭 재현)
          </span>
          <span className="text-[11px] text-slate-500">실제 경제 위기 및 정책 전환기 데이터 매핑</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCENARIO_PRESETS.map((preset) => {
            const isMatch = fedRate === preset.fedRate && policy === preset.policy && usdkrw === preset.usdkrw;
            return (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                onClick={() => handlePresetSelect(preset)}
                className={`p-3.5 rounded-xl text-left border transition-all relative overflow-hidden ${
                  isMatch
                    ? 'bg-gradient-to-br from-cyan-950/60 to-blue-900/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isMatch && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
                <div className="font-semibold text-xs text-white leading-tight">{preset.title}</div>
                <div className="text-[11px] text-cyan-300/80 font-mono mt-1">{preset.subtitle}</div>
                <div className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Control Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: 3 Core Controls (Rate, Policy, FX) */}
        <div className="md:col-span-6 space-y-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            거시경제 핵심 변수 컨트롤러 (Macro Controllers)
          </h3>

          {/* 1. Fed Funds Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="fed-rate-slider" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-cyan-400" />
                미국 기준금리 (Fed Funds Rate)
              </label>
              <span className="text-base font-bold text-cyan-400 font-mono">
                {fedRate.toFixed(2)}%
              </span>
            </div>
            <input
              id="fed-rate-slider"
              type="range"
              min="0.0"
              max="6.0"
              step="0.25"
              value={fedRate}
              onChange={(e) => setFedRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <button onClick={() => setFedRate(0.25)} className="hover:text-cyan-400">초저금리 0.25%</button>
              <button onClick={() => setFedRate(2.50)} className="hover:text-cyan-400">중립금리 2.50%</button>
              <button onClick={() => setFedRate(5.25)} className="hover:text-cyan-400">긴축고금리 5.25%</button>
            </div>
          </div>

          {/* 2. Monetary Policy 4 Stages (QE vs Tapering vs Hike vs QT) */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                연준 통화정책 기조 (PPT 3p 개념 교정 반영)
              </label>
              <span className="text-xs font-semibold text-amber-400">
                {policy === 'QE' && '양적완화 (달러 순공급)'}
                {policy === 'TAPERING' && '테이퍼링 (매입속도 감속)'}
                {policy === 'RATE_HIKE' && '기준금리 인상 (신용 억제)'}
                {policy === 'QT' && '양적긴축 (달러 직접 회수)'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'QE', label: '양적완화 (QE)', sub: '자산매입/달러공급' },
                { id: 'TAPERING', label: '테이퍼링', sub: '매입규모 축소' },
                { id: 'RATE_HIKE', label: '금리인상', sub: '기준금리 인상' },
                { id: 'QT', label: '양적긴축 (QT)', sub: '자산매각/달러회수' }
              ].map(item => (
                <button
                  key={item.id}
                  id={`policy-btn-${item.id}`}
                  onClick={() => setPolicy(item.id as PolicyAction)}
                  className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition ${
                    policy === item.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  <div className="leading-tight">{item.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. USD/KRW Exchange Rate */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label htmlFor="fx-slider" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                원/달러 환율 (USD/KRW)
              </label>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-400 font-mono">
                  ₩{usdkrw.toLocaleString()}
                </span>
                <span className={`text-[11px] ml-2 px-1.5 py-0.5 rounded font-semibold ${
                  usdkrw >= 1380 ? 'bg-rose-500/20 text-rose-300' : usdkrw <= 1180 ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {usdkrw >= 1380 ? '고환율/강달러' : usdkrw <= 1180 ? '저환율/약달러' : '적정환율'}
                </span>
              </div>
            </div>
            <input
              id="fx-slider"
              type="range"
              min="950"
              max="1500"
              step="10"
              value={usdkrw}
              onChange={(e) => setUsdkrw(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <button onClick={() => setUsdkrw(1080)} className="hover:text-emerald-400">1,080원 (초강세)</button>
              <button onClick={() => setUsdkrw(1250)} className="hover:text-emerald-400">1,250원 (평균)</button>
              <button onClick={() => setUsdkrw(1440)} className="hover:text-emerald-400">1,440원 (위기급)</button>
            </div>
          </div>

          {/* 4. Business Cycle Phase */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              경기 사이클 국면 (Business Cycle Quadrant)
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { id: 'RECOVERY', label: '회복기', color: 'emerald' },
                { id: 'EXPANSION', label: '호황기', color: 'cyan' },
                { id: 'SLOWDOWN', label: '후퇴기', color: 'amber' },
                { id: 'RECESSION', label: '침체기', color: 'rose' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPhase(p.id as EconomicPhase)}
                  className={`py-2 rounded-lg font-semibold transition border ${
                    phase === p.id
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Key Macro Indicators & Foreign Capital Flow */}
        <div className="md:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                실시간 파생 거시경제 지표 및 한국 시장 파급
              </span>
              <span className="text-[11px] font-mono text-cyan-400">Live Computed</span>
            </h3>

            {/* Indicator Metrics Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] text-slate-400">달러 인덱스(DXY) 추정</div>
                <div className="text-xl font-bold font-mono text-white mt-0.5">
                  {results.dollarIndexEstimate} <span className="text-xs font-normal text-slate-400">pt</span>
                </div>
                <div className="text-[10px] text-cyan-400 mt-1">
                  {results.dollarIndexEstimate >= 105 ? '슈퍼 달러 (신흥국 위험)' : results.dollarIndexEstimate <= 95 ? '달러 약세 (위험선호)' : '달러 보합'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] text-slate-400">10Y-2Y 장단기 금리차</div>
                <div className={`text-xl font-bold font-mono mt-0.5 ${
                  results.curveShape === 'INVERTED' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {results.tenMinusTwoSpread > 0 ? '+' : ''}{results.tenMinusTwoSpread}%p
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {results.curveShape === 'INVERTED' ? '⚠️ 역전 상태 (불황 선행)' : '정상 우상향 커브'}
                </div>
              </div>
            </div>

            {/* Foreign Capital Flow Box (Addressing PPT Page 1 & 2) */}
            <div className={`p-4 rounded-xl border ${
              results.foreignCapitalFlow.includes('INFLOW') 
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' 
                : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span>외국인 자본 흐름 & KOSPI 전망</span>
                <span className="font-mono px-2 py-0.5 rounded bg-slate-900/80">
                  {results.foreignCapitalFlow === 'MASSIVE_INFLOW' && '대규모 순유입 (Strong Inflow)'}
                  {results.foreignCapitalFlow === 'INFLOW' && '순유입 (Inflow)'}
                  {results.foreignCapitalFlow === 'NEUTRAL' && '중립 (Neutral)'}
                  {results.foreignCapitalFlow === 'OUTFLOW' && '순유출 (Outflow)'}
                  {results.foreignCapitalFlow === 'MASSIVE_OUTFLOW' && '대규모 자금이탈 (Capital Flight)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                {results.foreignCapitalFlow.includes('OUTFLOW') 
                  ? '달러 금리가 높고 원달러 환율이 상승하면, 외국인 투자자는 환차손(Currency Loss)을 방지하기 위해 한국 주식(KOSPI)을 매도하고 달러 안전자산으로 자금을 회수합니다.'
                  : '달러 금리가 인하되고 원화 가치가 반등하면, 외국인은 환차익(Currency Gain)과 신흥국 밸류에이션 매력을 노리고 KOSPI 시장으로 적극 유입됩니다.'}
              </p>
            </div>

            {/* Korean Export Context Box (Addressing PPT Page 1 correction) */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>PPT 슬라이드 1p 심층 보완: 고환율과 수출의 현대적 메커니즘</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {results.koreanExportCompetitiveness}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Stage Animated Macro Pipeline (Visual Infographic) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            거시경제 파급 메커니즘 파이프라인 (5단계 인과 흐름도)
          </h3>
          <span className="text-[11px] text-slate-400">좌측에서 우측으로 정책이 실물경제로 전달되는 과정</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {results.flowSteps.map((step, idx) => (
            <div 
              key={step.step}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-cyan-500/50 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 text-xs font-bold flex items-center justify-center border border-slate-700">
                    {step.step}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    step.status === 'bullish' ? 'bg-emerald-400' : step.status === 'bearish' ? 'bg-rose-400' : 'bg-amber-400'
                  }`} />
                </div>
                <h4 className="text-xs font-bold text-white mt-2 leading-tight">{step.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[10px] font-mono text-cyan-300 truncate">
                {step.indicator}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Major Asset Classes Response Matrix (Radar / Traffic Lights) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              6대 주요 자산군 실시간 반응 신호등 매트릭스
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              현재 설정된 금리·통화량·환율 조건에서 각 자산군에 미치는 직접적 수익률 영향
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" /> 상승/우호적
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Minus className="w-3.5 h-3.5" /> 중립
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <TrendingDown className="w-3.5 h-3.5" /> 하락/부정적
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.assetImpacts.map((asset) => {
            const isUp = asset.direction === 'UP';
            const isDown = asset.direction === 'DOWN';
            return (
              <div
                key={asset.name}
                className={`p-4 rounded-xl border transition-all ${
                  isUp
                    ? 'bg-emerald-950/10 border-emerald-800/30'
                    : isDown
                    ? 'bg-rose-950/10 border-rose-800/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {asset.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{asset.nameKr}</h4>
                  </div>
                  
                  {/* Direction Badge */}
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    isUp
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : isDown
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                    {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                    {!isUp && !isDown && <Minus className="w-3.5 h-3.5" />}
                    <span>{isUp ? '상승 우세' : isDown ? '하락 경계' : '중립 관망'}</span>
                  </div>
                </div>

                {/* Impact Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>영향 모멘텀 지수</span>
                    <span className={`font-mono font-bold ${
                      asset.score > 0 ? 'text-emerald-400' : asset.score < 0 ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {asset.score > 0 ? `+${asset.score}` : asset.score}pt
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        asset.score > 0 ? 'bg-emerald-400 ml-auto' : 'bg-rose-400 mr-auto'
                      }`}
                      style={{ width: `${Math.abs(asset.score)}%` }}
                    />
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {asset.reason}
                </p>

                {/* Key metric pill */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-cyan-300">
                  {asset.keyMetric}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FX Investment Matrix (Addressing PPT Page 1: 신규진입 vs 기존보유자 관점) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            PPT 1p 오류 교정 인터랙티브: 환율 레벨에 따른 해외 투자 유불리 의사결정 매트릭스
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            신규 매수자 vs 기존 보유자 양방향 분석
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box 1: 신규 투자자 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-cyan-400 flex items-center justify-between">
              <span>1. 원화(KRW)로 미국 주식/채권 신규 진입 시</span>
              <span className="text-[11px] font-mono">
                현재 환율: {usdkrw.toLocaleString()}원
              </span>
            </div>
            <div className={`p-3 rounded-lg text-xs leading-relaxed ${
              usdkrw >= 1380
                ? 'bg-rose-950/30 border border-rose-900/40 text-rose-200'
                : usdkrw <= 1180
                ? 'bg-emerald-950/30 border border-emerald-900/40 text-emerald-200'
                : 'bg-slate-900 text-slate-300'
            }`}>
              {usdkrw >= 1380 ? (
                <>
                  <strong className="text-rose-300">⚠️ 신규 매수 불리 (환차손 위험): </strong>
                  달러가 고평가되어 있어 1달러를 사기 위해 많은 원화가 소모됩니다. 향후 환율이 정상화되어 하락할 경우 주가가 올라도 환차손으로 수익률이 갉아먹힐 수 있으므로 분할 매수하거나 헷지형 상품 고려 권장.
                </>
              ) : usdkrw <= 1180 ? (
                <>
                  <strong className="text-emerald-300">✅ 신규 매수 매우 유리 (환차익 기대): </strong>
                  달러가 저평가된 구간이므로 싼 가격에 달러를 환전하여 미국채나 미국 우량주를 매수하기에 최적의 시기입니다. 향후 환율 상승 시 자산 상승 + 환차익의 겹호재를 누릴 수 있습니다.
                </>
              ) : (
                <>
                  <strong className="text-slate-300">평균 구간 (적립식 투자 적합): </strong>
                  환율 변동에 일희일비하기보다는 자산 본연의 배당과 성장성에 집중하여 적립식 매수를 진행하기에 무난한 구간입니다.
                </>
              )}
            </div>
          </div>

          {/* Box 2: 기존 보유자 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>2. 이미 미국 주식/달러를 보유 중인 기존 투자자 시</span>
              <span className="text-[11px] font-mono">
                현재 상태: {usdkrw >= 1380 ? '환평가익 극대화' : '환차익 평이'}
              </span>
            </div>
            <div className={`p-3 rounded-lg text-xs leading-relaxed ${
              usdkrw >= 1380
                ? 'bg-emerald-950/30 border border-emerald-900/40 text-emerald-200'
                : 'bg-slate-900 text-slate-300'
            }`}>
              {usdkrw >= 1380 ? (
                <>
                  <strong className="text-emerald-300">🎉 환차익 실현(매도 익절) 최적기: </strong>
                  PPT 원본의 "환율이 높으면 불리하다"는 서술과 달리, 기존 보유자에게는 원화 환산 자산 가치가 극대화된 최고의 시점입니다! 일부 달러를 원화로 환전하여 국내 우량 자산이나 원화 고금리 예금으로 리밸런싱하기에 유리합니다.
                </>
              ) : (
                <>
                  <strong className="text-slate-300">보유 지속 및 배당 재투자: </strong>
                  환율 레벨이 낮으므로 굳이 달러를 원화로 환전해 환차손을 확정할 필요 없이, 달러 자산 그대로 재투자하며 다음 고환율 사이클을 기다리는 것이 현명합니다.
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Next Step Nav Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-xl">
        <div className="text-xs text-slate-400">
          다음 단계에서는 PPT 2페이지의 핵심 난제인 <strong className="text-white">채권 금리 시소와 장단기 금리차 역전</strong>을 심층 탐구합니다.
        </div>
        <button
          id="go-to-bond-btn"
          onClick={onGoToNextTab}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition"
        >
          <span>3단계: 채권 시소 & 장단기 금리차로 이동</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
