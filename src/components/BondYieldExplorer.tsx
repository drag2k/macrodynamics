import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Activity, 
  Clock, 
  Info, 
  Layers, 
  Percent,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { YieldPoint } from '../utils/macroCalculator';

interface BondYieldExplorerProps {
  yieldCurve: YieldPoint[];
  tenMinusTwoSpread: number;
  curveShape: 'NORMAL' | 'FLAT' | 'INVERTED';
  onConfirmStep: () => void;
  isStepConfirmed: boolean;
  onGoToNextTab: () => void;
}

export const BondYieldExplorer: React.FC<BondYieldExplorerProps> = ({
  yieldCurve,
  tenMinusTwoSpread,
  curveShape,
  onConfirmStep,
  isStepConfirmed,
  onGoToNextTab
}) => {
  // Bond See-Saw Interactive State
  // Benchmark bond: 10-year maturity, 4.0% coupon, $1,000 par
  const [marketRate, setMarketRate] = useState<number>(4.0);
  const couponRate = 4.0;
  const parValue = 1000;

  // Approximate bond price using 10-year discount formula
  const calculateBondPrice = (r: number, c: number, par: number, years: number = 10) => {
    const rateDecimal = r / 100;
    const couponPayment = par * (c / 100);
    let pv = 0;
    for (let t = 1; t <= years; t++) {
      pv += couponPayment / Math.pow(1 + rateDecimal, t);
    }
    pv += par / Math.pow(1 + rateDecimal, years);
    return Math.round(pv);
  };

  const currentPrice = calculateBondPrice(marketRate, couponRate, parValue);
  const priceChangePercent = Number((((currentPrice - parValue) / parValue) * 100).toFixed(1));

  // See-saw rotation angle: marketRate 4% is 0 deg. Higher rate = tilts left down, right up.
  const seeSawAngle = Math.max(-18, Math.min(18, (marketRate - 4.0) * 4.5));

  // Yield Curve SVG Calculations
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 50;
  const paddingY = 30;

  const minY = 0;
  const maxY = Math.max(6.5, ...yieldCurve.map(p => p.yieldValue + 0.8));

  const points = yieldCurve.map((point, index) => {
    const x = paddingX + (index / (yieldCurve.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((point.yieldValue - minY) / (maxY - minY)) * (svgHeight - paddingY * 2);
    return { ...point, x, y };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    // Smooth bezier curve
    const prev = points[idx - 1];
    const cpx1 = prev.x + (curr.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (curr.x - prev.x) / 2;
    const cpy2 = curr.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>3단계: 채권 가격 시소 & 장단기 금리차 역전 인포그래픽</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            채권의 3대 역설 해소 & 수익률 곡선(Yield Curve)의 경기 예측 메커니즘
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            PPT 슬라이드 2페이지의 "채권금리 상승 시 수익률 상승 vs 보유 시 수익률 하락" 모순을 물리적 시소 모델로 완벽히 정리하고, 
            월스트리트가 가장 신뢰하는 경기침체 선행지표인 미국채 장단기 금리차(10Y-2Y)를 인터랙티브하게 분석합니다.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="confirm-step3-btn"
            onClick={onConfirmStep}
            className={`px-4 py-3 rounded-xl font-semibold text-sm transition flex items-center gap-2 shadow-lg ${
              isStepConfirmed
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isStepConfirmed ? '3단계 채권 분석 승인 완료' : '3단계 채권 분석 승인(컨펌)'}</span>
          </button>
        </div>
      </div>

      {/* 1. Interactive Bond See-Saw Section */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              채권의 황금 법칙: 시장 금리와 채권 가격의 '시소(See-Saw)' 원리
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              기준: 10년 만기, 표면이율(쿠폰) 연 4.0%, 액면가 $1,000 채권
            </p>
          </div>

          <div className="text-xs px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-mono">
            공식: 금리(분모)가 오르면 채권 가격은 무조건 하락!
          </div>
        </div>

        {/* See-saw Interactive Controller */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between">
              <label htmlFor="market-rate-slider" className="text-xs font-semibold text-slate-300">
                시장 유통금리 조절 (Market Yield)
              </label>
              <span className="text-lg font-bold font-mono text-cyan-400">
                {marketRate.toFixed(1)}%
              </span>
            </div>

            <input
              id="market-rate-slider"
              type="range"
              min="1.0"
              max="8.0"
              step="0.5"
              value={marketRate}
              onChange={(e) => setMarketRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
              <button 
                onClick={() => setMarketRate(2.0)}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300"
              >
                2.0% (초저금리)
              </button>
              <button 
                onClick={() => setMarketRate(4.0)}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300"
              >
                4.0% (액면발행)
              </button>
              <button 
                onClick={() => setMarketRate(6.5)}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300"
              >
                6.5% (고금리)
              </button>
            </div>

            {/* Calculated Values */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="p-2.5 rounded-lg bg-slate-900 text-center">
                <div className="text-[10px] text-slate-400">신규 매수자 기대수익률(Yield)</div>
                <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                  연 {marketRate.toFixed(1)}%
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 text-center">
                <div className="text-[10px] text-slate-400">채권 시장 평가가격 (Price)</div>
                <div className={`text-base font-bold font-mono mt-0.5 ${
                  currentPrice > parValue ? 'text-emerald-400' : currentPrice < parValue ? 'text-rose-400' : 'text-slate-200'
                }`}>
                  ${currentPrice} <span className="text-[10px]">({priceChangePercent > 0 ? '+' : ''}{priceChangePercent}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Physical See-saw Graphic */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/40 border border-slate-800/80 min-h-[220px]">
            <div className="relative w-full max-w-md h-36 flex items-center justify-center">
              {/* Fulcrum (Triangle Pivot) */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[40px] border-b-slate-700 z-10" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-2 bg-slate-800 rounded-full" />

              {/* Tilting Plank */}
              <div 
                className="absolute w-full h-3.5 bg-gradient-to-r from-cyan-600 via-slate-600 to-indigo-600 rounded-full transition-transform duration-300 shadow-xl flex items-center justify-between px-3"
                style={{ transform: `rotate(${seeSawAngle}deg)` }}
              >
                {/* Left Side: Market Interest Rate Weight */}
                <div className="w-24 -translate-y-9 -translate-x-3 bg-slate-900 border border-cyan-500/50 rounded-xl p-2 text-center shadow-lg">
                  <div className="text-[10px] text-cyan-300 font-medium">시장금리 (Yield)</div>
                  <div className="text-sm font-bold text-cyan-400 font-mono">{marketRate.toFixed(1)}%</div>
                </div>

                {/* Right Side: Bond Price Weight */}
                <div className="w-28 -translate-y-9 translate-x-3 bg-slate-900 border border-indigo-500/50 rounded-xl p-2 text-center shadow-lg">
                  <div className="text-[10px] text-indigo-300 font-medium">채권가격 (Price)</div>
                  <div className={`text-sm font-bold font-mono ${
                    currentPrice > parValue ? 'text-emerald-400' : currentPrice < parValue ? 'text-rose-400' : 'text-slate-200'
                  }`}>
                    ${currentPrice}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 mt-2 max-w-sm">
              {marketRate > 4.0 ? (
                <span className="text-rose-300">
                  ⚠️ 금리가 상승(좌측 하강)하여, 기존 보유 채권의 시장 거래 가격이 액면가($1,000) 아래로 하락(우측 상승)합니다.
                </span>
              ) : marketRate < 4.0 ? (
                <span className="text-emerald-300">
                  🎉 금리가 하락(좌측 상승)하여, 기존 채권 가격이 프리미엄($1,000 이상)으로 급등(우측 하강)합니다!
                </span>
              ) : (
                <span className="text-slate-300">
                  시장금리와 발행금리가 일치하여 채권이 액면가($1,000) 그대로 거래됩니다.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Clarification Table: Resolving PPT Page 2 */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-900/30 space-y-2">
          <div className="text-xs font-bold text-cyan-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            PPT 슬라이드 2페이지의 개념 오류를 100% 해소하는 정리표
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">시장 상태</th>
                  <th className="py-2.5 px-3">신규 매수자 (Yield)</th>
                  <th className="py-2.5 px-3">기존 보유자 (Capital Return)</th>
                  <th className="py-2.5 px-3">PPT 원문의 모호성 해설</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-rose-400">시중 금리 상승 시</td>
                  <td className="py-2.5 px-3 text-cyan-300">
                    기대수익률(Yield) 상승 ⬆️<br/>
                    <span className="text-[10px] text-slate-400">신규로 채권 살 때 고이자 확보</span>
                  </td>
                  <td className="py-2.5 px-3 text-rose-400">
                    보유수익률(Return) 악화 ⬇️<br/>
                    <span className="text-[10px] text-slate-400">채권 평가가격 하락으로 자본손실 발생</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 leading-tight">
                    원문에서 "수익률↑"은 신규 유통수익률(Yield)이고, "보유시 수익률↓"은 보유자의 평가손익입니다.
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-emerald-400">시중 금리 하락 시</td>
                  <td className="py-2.5 px-3 text-cyan-300">
                    기대수익률(Yield) 하락 ⬇️<br/>
                    <span className="text-[10px] text-slate-400">신규 채권의 이자 메리트 축소</span>
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400">
                    보유수익률(Return) 극대화 ⬆️<br/>
                    <span className="text-[10px] text-slate-400">채권 가격 급등으로 대규모 자본차익 실현</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 leading-tight">
                    금리 인하기에는 장기채를 보유할수록 가격 상승폭(듀레이션 효과)이 커져 최고의 투자처가 됩니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Interactive Yield Curve Visualizer (미국채 장단기 금리차 곡선) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              미국채 만기별 수익률 곡선 (Yield Curve Dynamic Graph)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              1개월물부터 30년물까지의 실시간 커브 형태 및 10Y-2Y 스프레드 모니터
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              curveShape === 'INVERTED'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : curveShape === 'FLAT'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {curveShape === 'INVERTED' && '⚠️ 역전 곡선 (Inverted) - 경기침체 신호'}
              {curveShape === 'FLAT' && '평탄화 곡선 (Flat) - 사이클 후반부'}
              {curveShape === 'NORMAL' && '정상 우상향 곡선 (Normal) - 건강한 성장'}
            </span>
          </div>
        </div>

        {/* SVG Dynamic Chart */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>수익률(%)</span>
            <span className="font-mono text-cyan-400">10년-2년 스프레드: {tenMinusTwoSpread > 0 ? '+' : ''}{tenMinusTwoSpread}%p</span>
          </div>

          <div className="w-full overflow-x-auto flex justify-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-2xl h-auto select-none">
              {/* Grid lines */}
              {[1, 2, 3, 4, 5, 6].map(level => {
                const y = svgHeight - paddingY - ((level - minY) / (maxY - minY)) * (svgHeight - paddingY * 2);
                if (y < paddingY || y > svgHeight - paddingY) return null;
                return (
                  <g key={level}>
                    <line 
                      x1={paddingX} 
                      y1={y} 
                      x2={svgWidth - paddingX} 
                      y2={y} 
                      stroke="#334155" 
                      strokeDasharray="4 4" 
                      strokeWidth="0.8" 
                    />
                    <text x={paddingX - 10} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                      {level}%
                    </text>
                  </g>
                );
              })}

              {/* Area gradient under curve */}
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={curveShape === 'INVERTED' ? '#f43f5e' : '#06b6d4'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Filled Area */}
              <path 
                d={`${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`} 
                fill="url(#curveGradient)" 
              />

              {/* Curve Line */}
              <path 
                d={pathD} 
                fill="none" 
                stroke={curveShape === 'INVERTED' ? '#f43f5e' : '#06b6d4'} 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />

              {/* Data Points */}
              {points.map((p, i) => (
                <g key={p.maturity}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="5" 
                    fill="#0f172a" 
                    stroke={curveShape === 'INVERTED' ? '#f43f5e' : '#06b6d4'} 
                    strokeWidth="2.5" 
                  />
                  {/* Value Label */}
                  <text 
                    x={p.x} 
                    y={p.y - 10} 
                    fill="#e2e8f0" 
                    fontSize="10" 
                    fontWeight="bold" 
                    textAnchor="middle" 
                    fontFamily="monospace"
                  >
                    {p.yieldValue}%
                  </text>
                  {/* X-axis maturity label */}
                  <text 
                    x={p.x} 
                    y={svgHeight - 10} 
                    fill="#94a3b8" 
                    fontSize="10" 
                    textAnchor="middle"
                  >
                    {p.maturity}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Inversion Mechanism & Un-inversion Insight (Addressing PPT Page 2 critique) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>역사적 통계와 선행 시차</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              1970년 이후 발생한 거의 모든 미국 경기침체(Recession) 이전에 10년-2년 또는 10년-3개월 금리차가 역전되었습니다. 
              역전 후 경기침체 도래까지의 시차는 평균 약 <strong className="text-white">12~24개월</strong>입니다. 
              시장이 장기 경제 성장에 비관적일수록 장기채권을 대량 매수(장기금리 하락)하여 역전이 심화됩니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2">
            <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>핵심 투자 통찰: '역전 해소(Un-inversion)'의 함정</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-blue-200">진짜 위험은 역전 중일 때가 아닙니다!</strong><br/>
              경기침체와 주식시장 폭락은 보통 <em>"연준이 부랴부랴 기준금리를 내리며 단기금리가 급락하여 역전이 0 위로 정상화되는 시점(Bull Steepening)"</em>에 본격적으로 터집니다. (2000년 닷컴버블, 2008년 금융위기 모두 역전 해소 직후 증시 대폭락 발생).
            </p>
          </div>
        </div>
      </div>

      {/* Next Step Nav Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-xl">
        <div className="text-xs text-slate-400">
          다음 단계에서는 PPT 3페이지의 <strong className="text-white">양적완화, 테이퍼링, 긴축의 4단계 정책 순환</strong>을 살펴봅니다.
        </div>
        <button
          id="go-to-cycle-btn"
          onClick={onGoToNextTab}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition"
        >
          <span>4단계: 정책 4계절 사이클로 이동</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
