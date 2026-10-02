import React from 'react';
import { AssetMetric } from '../types';
import { TrendingUp, TrendingDown, Minus, Coins, Building, LineChart, Globe } from 'lucide-react';

interface AssetPriceBoardProps {
  assets: AssetMetric[];
}

export const AssetPriceBoard: React.FC<AssetPriceBoardProps> = ({ assets }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between">
      {/* Board Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <LineChart className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">자산 시장 연동</span>
            <h3 className="text-sm font-extrabold text-white">주식 · 원자재 · 부동산 가격</h3>
          </div>
        </div>
        <span className="text-[11px] text-slate-400">자산군별 실시간 방향성</span>
      </div>

      {/* Asset Cards List */}
      <div className="space-y-3 flex-1">
        {assets.map((asset) => {
          const isUp = asset.direction === 'UP';
          const isDown = asset.direction === 'DOWN';

          return (
            <div
              key={asset.id}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 hover:border-slate-750 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{asset.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 ${
                      isUp
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isDown
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {isUp && <TrendingUp className="w-3 h-3" />}
                    {isDown && <TrendingDown className="w-3 h-3" />}
                    {!isUp && !isDown && <Minus className="w-3 h-3" />}
                    {asset.badge}
                  </span>
                </div>
              </div>

              {/* Score bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 w-12 font-mono">가격 모멘텀</span>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                  {asset.score < 0 ? (
                    <>
                      <div className="w-1/2 flex justify-end">
                        <div
                          className="h-full bg-rose-500 rounded-l"
                          style={{ width: `${Math.min(100, Math.abs(asset.score))}%` }}
                        />
                      </div>
                      <div className="w-1/2 bg-slate-900" />
                    </>
                  ) : (
                    <>
                      <div className="w-1/2 bg-slate-900" />
                      <div className="w-1/2 flex justify-start">
                        <div
                          className="h-full bg-emerald-500 rounded-r"
                          style={{ width: `${Math.min(100, asset.score)}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
                <span className={`text-[10px] font-mono font-bold w-10 text-right ${
                  asset.score > 0 ? 'text-emerald-400' : asset.score < 0 ? 'text-rose-400' : 'text-slate-400'
                }`}>
                  {asset.score > 0 ? `+${asset.score}` : asset.score}
                </span>
              </div>

              {/* Summary & Mechanism */}
              <div className="text-[11px] text-slate-300 leading-snug">
                {asset.summary}
              </div>

              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-900 flex items-center gap-1">
                <span className="text-cyan-400 font-bold">인과:</span>
                <span>{asset.mechanism}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
