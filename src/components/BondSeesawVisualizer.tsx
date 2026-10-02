import React from 'react';
import { BondMechanic } from '../types';
import { Scale, AlertCircle, ArrowUp, ArrowDown, CheckCircle2, Pause } from 'lucide-react';

interface BondSeesawVisualizerProps {
  bond: BondMechanic;
}

export const BondSeesawVisualizer: React.FC<BondSeesawVisualizerProps> = ({ bond }) => {
  const isYieldUp = bond.marketRateDirection === 'UP';
  const isYieldDown = bond.marketRateDirection === 'DOWN';
  const isYieldNeutral = bond.marketRateDirection === 'NEUTRAL';

  const isPriceUp = bond.bondPriceDirection === 'UP';
  const isPriceDown = bond.bondPriceDirection === 'DOWN';
  const isPriceNeutral = bond.bondPriceDirection === 'NEUTRAL';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">채권 시장 핵심 원리</span>
            <h3 className="text-sm font-extrabold text-white">채권 금리 vs 채권 가격 시소</h3>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-amber-400">1:1 역비례 법칙</span>
      </div>

      {/* Interactive Seesaw Graphic */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
        <div className="text-center text-xs font-semibold text-slate-400">
          "시장 금리가 올라가면 구채권 가격은 떨어지고, 금리가 동결되면 가격도 바닥을 다진다"
        </div>

        {/* Dynamic Seesaw Canvas Container */}
        <div className="relative h-28 flex items-center justify-center overflow-hidden">
          {/* Seesaw Beam */}
          <div
            className="w-full max-w-sm h-3.5 bg-gradient-to-r from-cyan-600 via-slate-700 to-rose-600 rounded-full transition-transform duration-700 ease-out shadow-lg flex items-center justify-between px-2 relative z-10"
            style={{
              transform: `rotate(${bond.seesawAngle}deg)`
            }}
          >
            {/* Left Weight: Market Yield (금리) */}
            <div className="w-20 -top-10 -left-2 absolute flex flex-col items-center">
              <div className={`px-2 py-1 rounded-lg text-[10px] font-black shadow-md border whitespace-nowrap ${
                isYieldUp 
                  ? 'bg-rose-500 text-white border-rose-400' 
                  : isYieldDown
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-amber-500 text-slate-950 border-amber-400'
              }`}>
                {isYieldUp ? '금리 ▲ (상승)' : isYieldDown ? '금리 ▼ (하락)' : '금리 ⏸️ (동결/유지)'}
              </div>
              <div className="w-1 h-3 bg-slate-500" />
            </div>

            {/* Right Weight: Bond Price (채권 가격) */}
            <div className="w-24 -top-10 -right-2 absolute flex flex-col items-center">
              <div className={`px-2 py-1 rounded-lg text-[10px] font-black shadow-md border whitespace-nowrap ${
                isPriceUp 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                  : isPriceDown
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-amber-500 text-slate-950 border-amber-400'
              }`}>
                {isPriceUp ? '채권가격 ▲ (급등)' : isPriceDown ? '채권가격 ▼ (폭락)' : '채권가격 ⏸️ (바닥 횡보)'}
              </div>
              <div className="w-1 h-3 bg-slate-500" />
            </div>
          </div>

          {/* Seesaw Fulcrum (받침대) */}
          <div className="absolute bottom-4 w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[36px] border-b-slate-700 z-0" />
          <div className="absolute bottom-2 w-36 h-2 bg-slate-800 rounded-full" />
        </div>

        {/* Yield Spread Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-center font-mono">
          <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400">10년물 금리</div>
            <div className="text-xs font-bold text-cyan-400">{bond.yield10Y.toFixed(2)}%</div>
          </div>
          <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400">2년물 금리</div>
            <div className="text-xs font-bold text-slate-200">{bond.yield2Y.toFixed(2)}%</div>
          </div>
          <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400">장단기 스프레드</div>
            <div className={`text-xs font-bold ${bond.spread < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {bond.spread >= 0 ? `+${bond.spread.toFixed(2)}%p` : `${bond.spread.toFixed(2)}%p`}
            </div>
          </div>
        </div>
      </div>

      {/* Crucial Fact-Check: New Buyer vs Existing Holder */}
      <div className="space-y-2 text-xs">
        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-900/50 space-y-1">
          <div className="font-bold text-cyan-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>신규 매수자 관점 (수익률·이자)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {bond.newInvestorNote}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/50 space-y-1">
          <div className="font-bold text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>기존 보유자 관점 (평가손익·자본차익)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {bond.existingHolderNote}
          </p>
        </div>
      </div>
    </div>
  );
};
