import React from 'react';
import { EconomicIndicator } from '../types';
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MacroIndicatorBoardProps {
  indicators: EconomicIndicator[];
}

export const MacroIndicatorBoard: React.FC<MacroIndicatorBoardProps> = ({ indicators }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between">
      {/* Board Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">실물 거시 연동</span>
            <h3 className="text-sm font-extrabold text-white">경기 연관 지표 & 자본 이동</h3>
          </div>
        </div>
        <span className="text-[11px] text-slate-400">실시간 경제 펀더멘털</span>
      </div>

      {/* Indicators List */}
      <div className="space-y-3 flex-1">
        {indicators.map((ind) => {
          const isPos = ind.status === 'POSITIVE';
          const isNeg = ind.status === 'NEGATIVE';
          const isWarn = ind.status === 'WARNING';

          return (
            <div
              key={ind.id}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 hover:border-slate-750 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{ind.title}</span>

                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 ${
                    isPos
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isNeg
                      ? 'bg-rose-500/20 text-rose-400'
                      : isWarn
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isPos && <TrendingUp className="w-3 h-3" />}
                  {isNeg && <TrendingDown className="w-3 h-3" />}
                  {isWarn && <AlertTriangle className="w-3 h-3" />}
                  <span>{ind.valueText}</span>
                </span>
              </div>

              <div className="text-[11px] text-slate-300 leading-snug">
                {ind.explanation}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Summary Note for Korea economy */}
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
        <div className="font-bold text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>한국 경제의 특수성 (소규모 개방경제)</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          한국은 수출 비중이 높고 외국인 자본 유출입에 민감하므로, <strong>미국 금리와 원/달러 환율의 변동이 국내 KOSPI 증시와 물가에 즉각적인 직접 충격</strong>으로 이어집니다.
        </p>
      </div>
    </div>
  );
};
