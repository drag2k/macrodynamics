import React from 'react';
import { CouplingMode, DetailedPhase, AssetMetric } from '../types';
import { DETAILED_PHASE_INFO } from '../utils/macroUnifiedEngine';
import { Link, Zap, Unlink, Minus, Plus } from 'lucide-react';

interface MobileCompactFadersProps {
  rateValue: number;
  onRateChange: (val: number) => void;
  liquidityValue: number;
  onLiquidityChange: (val: number) => void;
  fxValue: number;
  onFxChange: (val: number) => void;
  rateDetailedPhase: DetailedPhase;
  fxDetailedPhase: DetailedPhase;
  liquidityLabel: string;
  couplingMode: CouplingMode;
  setCouplingMode: (mode: CouplingMode) => void;
  sp500Asset?: AssetMetric;
  kospiAsset?: AssetMetric;
  activeTimeSeries?: any[];
  currentMonthlyIndex?: number;
  isPtSimActive?: boolean;
}

export const MobileCompactFaders: React.FC<MobileCompactFadersProps> = ({
  rateValue,
  onRateChange,
  liquidityValue,
  onLiquidityChange,
  fxValue,
  onFxChange,
  rateDetailedPhase,
  fxDetailedPhase,
  liquidityLabel,
  couplingMode,
  setCouplingMode,
}) => {
  const currentRateInfo = DETAILED_PHASE_INFO[rateDetailedPhase];
  const currentFxInfo = DETAILED_PHASE_INFO[fxDetailedPhase];

  // Helper percentages for gradient tracks
  const ratePct = Math.max(0, Math.min(100, (rateValue / 7.0) * 100));
  const liqPct = Math.max(0, Math.min(100, ((liquidityValue - 5.5) / (9.5 - 5.5)) * 100));
  const fxPct = Math.max(0, Math.min(100, ((fxValue - 900) / (1650 - 900)) * 100));

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-2.5 sm:p-3 shadow-xl space-y-2">
      {/* 1. Header with Coupling Mode (Ultra Slim) */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <div className="truncate">
            <span className="text-[9px] font-mono text-cyan-400 font-bold tracking-wider uppercase block leading-none">
              LAYER 2 : 3대 전달계
            </span>
            <h3 className="text-xs font-black text-white tracking-tight truncate leading-tight">
              실시간 정책·자금수급 제어
            </h3>
          </div>
        </div>

        {/* Coupling Mode Selector Buttons */}
        <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] shrink-0">
          <button
            type="button"
            onClick={() => setCouplingMode('COUPLED')}
            className={`px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 transition cursor-pointer ${
              couplingMode === 'COUPLED'
                ? 'bg-cyan-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="정방향 동조"
          >
            <Link className="w-2.5 h-2.5" />
            <span>동조</span>
          </button>

          <button
            type="button"
            onClick={() => setCouplingMode('DECOUPLED_INVERSE')}
            className={`px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 transition cursor-pointer ${
              couplingMode === 'DECOUPLED_INVERSE'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="역행 디커플링"
          >
            <Zap className="w-2.5 h-2.5" />
            <span>역행</span>
          </button>

          <button
            type="button"
            onClick={() => setCouplingMode('INDEPENDENT')}
            className={`px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 transition cursor-pointer ${
              couplingMode === 'INDEPENDENT'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="개별 수동 조작"
          >
            <Unlink className="w-2.5 h-2.5" />
            <span>개별</span>
          </button>
        </div>
      </div>

      {/* 2. Three Slim Interactive Sliders (실측 궤적 제거 & 초컴팩트 패킹) */}
      <div className="space-y-1.5">
        {/* Slider 1: 미국 기준금리 (Fed Rate) */}
        <div className="p-2 rounded-xl bg-slate-950/85 border border-cyan-900/40 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs leading-none">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-extrabold text-cyan-400 text-xs">① 미국 기준금리</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-800/60 truncate max-w-[120px]">
                {currentRateInfo.badge}
              </span>
            </div>
            <span className="font-black font-mono text-cyan-300 text-xs sm:text-sm shrink-0">
              {rateValue.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onRateChange(Math.max(0.0, Number((rateValue - 0.25).toFixed(2))))}
              className="w-6 h-6 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 flex items-center justify-center cursor-pointer shrink-0 active:scale-90 transition"
              title="0.25% 인하"
            >
              <Minus className="w-3 h-3" />
            </button>

            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="0.00"
                max="7.00"
                step="0.25"
                value={rateValue}
                onChange={(e) => onRateChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 touch-none"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${ratePct}%, #1e293b ${ratePct}%, #1e293b 100%)`
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => onRateChange(Math.min(7.0, Number((rateValue + 0.25).toFixed(2))))}
              className="w-6 h-6 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 flex items-center justify-center cursor-pointer shrink-0 active:scale-90 transition"
              title="0.25% 인상"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-0.5">
            <button
              type="button"
              onClick={() => onRateChange(0.50)}
              className="hover:text-cyan-300 transition cursor-pointer"
            >
              0.5%(초저)
            </button>
            <button
              type="button"
              onClick={() => onRateChange(3.00)}
              className="hover:text-cyan-300 transition cursor-pointer font-bold text-slate-400"
            >
              3.0%(중립)
            </button>
            <button
              type="button"
              onClick={() => onRateChange(5.25)}
              className="hover:text-cyan-300 transition cursor-pointer font-bold text-slate-400"
            >
              5.25%(고금리)
            </button>
            <button
              type="button"
              onClick={() => onRateChange(6.00)}
              className="hover:text-cyan-300 transition cursor-pointer"
            >
              6.0%
            </button>
          </div>
        </div>

        {/* Slider 2: 달러 순유동성 (Net Liquidity) */}
        <div className="p-2 rounded-xl bg-slate-950/85 border border-purple-900/40 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs leading-none">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-extrabold text-purple-400 text-xs">② 달러 통화량 (순유동성)</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-950/90 text-purple-300 border border-purple-800/60 truncate max-w-[120px]">
                {liquidityLabel}
              </span>
            </div>
            <span className="font-black font-mono text-purple-300 text-xs sm:text-sm shrink-0">
              ${liquidityValue.toFixed(1)}T
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onLiquidityChange(Math.max(5.5, Number((liquidityValue - 0.1).toFixed(2))))}
              className="w-6 h-6 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-300 flex items-center justify-center cursor-pointer shrink-0 active:scale-90 transition"
              title="$0.1T 축소"
            >
              <Minus className="w-3 h-3" />
            </button>

            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="5.5"
                max="9.5"
                step="0.1"
                value={liquidityValue}
                onChange={(e) => onLiquidityChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400 touch-none"
                style={{
                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${liqPct}%, #1e293b ${liqPct}%, #1e293b 100%)`
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => onLiquidityChange(Math.min(9.5, Number((liquidityValue + 0.1).toFixed(2))))}
              className="w-6 h-6 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-300 flex items-center justify-center cursor-pointer shrink-0 active:scale-90 transition"
              title="$0.1T 확대"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-0.5">
            <button
              type="button"
              onClick={() => onLiquidityChange(5.8)}
              className="hover:text-purple-300 transition cursor-pointer"
            >
              $5.8T(긴축가뭄)
            </button>
            <button
              type="button"
              onClick={() => onLiquidityChange(7.5)}
              className="hover:text-purple-300 transition cursor-pointer font-bold text-slate-400"
            >
              $7.5T(중립균형)
            </button>
            <button
              type="button"
              onClick={() => onLiquidityChange(9.2)}
              className="hover:text-purple-300 transition cursor-pointer"
            >
              $9.2T(대규모QE)
            </button>
          </div>
        </div>

        {/* Slider 3: 원/달러 환율 (USD/KRW) */}
        <div className="p-2 rounded-xl bg-slate-950/85 border border-emerald-900/40 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs leading-none">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-extrabold text-emerald-400 text-xs">③ 원/달러 환율</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-800/60 truncate max-w-[120px]">
                {currentFxInfo.badge}
              </span>
            </div>
            <span className="font-black font-mono text-emerald-300 text-xs sm:text-sm shrink-0">
              {fxValue.toLocaleString()}원
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onFxChange(Math.max(900, fxValue - 10))}
              className="w-6 h-6 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 flex items-center justify-center cursor-pointer shrink-0 active:scale-90 transition"
              title="10원 하락"
            >
              <Minus className="w-3 h-3" />
            </button>

            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="900"
                max="1650"
                step="10"
                value={fxValue}
                onChange={(e) => onFxChange(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 touch-none"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${fxPct}%, #1e293b ${fxPct}%, #1e293b 100%)`
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => onFxChange(Math.min(1650, fxValue + 10))}
              className="w-6 h-6 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 flex items-center justify-center cursor-pointer shrink-0 active:scale-90 transition"
              title="10원 상승"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-0.5">
            <button
              type="button"
              onClick={() => onFxChange(1140)}
              className="hover:text-emerald-300 transition cursor-pointer"
            >
              1,140원(저환율)
            </button>
            <button
              type="button"
              onClick={() => onFxChange(1280)}
              className="hover:text-emerald-300 transition cursor-pointer font-bold text-slate-400"
            >
              1,280원(평균)
            </button>
            <button
              type="button"
              onClick={() => onFxChange(1440)}
              className="hover:text-emerald-300 transition cursor-pointer"
            >
              1,440원(고환율)
            </button>
          </div>
        </div>
      </div>

      {/* 3. Real-time feedback hint (Single Line) */}
      <div className="text-[9px] text-center text-slate-400 font-sans pt-0.5 truncate">
        {couplingMode === 'COUPLED' && (
          <span className="text-cyan-400/90 font-medium">
            ✨ <strong className="text-cyan-300">정방향 동조:</strong> 하나의 슬라이더 조절 시 3대 지표와 자산 영향이 동시 연동됩니다.
          </span>
        )}
        {couplingMode === 'DECOUPLED_INVERSE' && (
          <span className="text-rose-400/90 font-medium">
            ⚡ <strong className="text-rose-300">역행 디커플링:</strong> 금리 인하와 환율 상승이 역행 연동됩니다.
          </span>
        )}
        {couplingMode === 'INDEPENDENT' && (
          <span className="text-amber-400/90 font-medium">
            🔓 <strong className="text-amber-300">개별 수동 모드:</strong> 금리, 유동성, 환율을 독립 조작합니다.
          </span>
        )}
      </div>
    </div>
  );
};
