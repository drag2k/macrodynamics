import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

export const MacroCheatSheet: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      {/* Accordion Toggle Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/60 transition"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>한눈에 끝내는 매크로 4대 불변 법칙 & 핵심 입체 구조 총정리</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                CHEAT SHEET
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              일반 상황 vs 예외 상황(디커플링), 금리 인상/인하 델타와 고금리/저금리 동결(Level)의 차이, 채권 시소 공식
            </p>
          </div>
        </div>

        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expandable Cheat Sheet Grid */}
      {isOpen && (
        <div className="p-5 sm:p-6 border-t border-slate-800 bg-slate-950/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Rule 1: 일반 동행 vs 예외 역행 */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>1. 일반 동행 vs 예외 디커플링</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
              <div className="text-emerald-400">일반: 금리 인상 ➔ 환율 상승 (강달러)</div>
              <div className="text-purple-400">예외 1: 위기 발생 시 비상 금리인하(▼)에도 안전자산 달러 사재기로 환율 폭등(▲)</div>
              <div className="text-cyan-400">예외 2: 금리 인상(▲)에도 한국 반도체 수출 흑자 대폭증 시 원화 강세(▼)</div>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              기축통화 달러의 특성상 평상시에는 금리와 환율이 같이 움직이나, <strong className="text-slate-200">글로벌 시스템 위기</strong>나 <strong className="text-slate-200">독자적 수출 호황</strong> 시 정반대로 디커플링됩니다.
            </p>
          </div>

          {/* Rule 2: 레벨과 유지(Higher/Lower for Longer) */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>2. 인상/인하 방향 vs 레벨 동결</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
              <div className="text-amber-400">고금리 유지(5%대 동결): 이자 누적으로 한계기업 부도·연체율 폭증</div>
              <div className="text-cyan-400">저금리 유지(0%대 동결): 화폐가치 희석으로 부동산·주식 자산 버블 팽창</div>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              금리를 '올리는 중(인상기)'의 충격보다, <strong className="text-slate-200">'높은 상태로 계속 묶어둘 때(Higher for Longer)'</strong>의 이자 누적으로 인한 실물 파산이 훨씬 위험합니다.
            </p>
          </div>

          {/* Rule 3: 채권 시소 원리 */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">
                3
              </span>
              <span>채권금리 vs 채권가격 시소 원리</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400">
              금리(Yield) ▲ ➔ 구채권가격(Price) ▼<br />
              금리(Yield) ▼ ➔ 구채권가격(Price) ▲
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              채권금리(Yield)와 매매가격(Price)은 100% 반대로 움직입니다. 신규 매수자에게는 고금리 채권이 고수익 확정 기회이지만, 기존 채권 보유자는 거래가격이 폭락하여 손실을 봅니다.
            </p>
          </div>

          {/* Rule 4: 환율과 KOSPI 외인 수급 */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">
                4
              </span>
              <span>환율과 KOSPI 외국인 수급</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-rose-400">
              환율 급등 ▲ ➔ 외인 환차손 ➔ KOSPI 매도<br />
              <span className="text-emerald-400">환율 하락 ▼ ➔ 외인 환차익 ➔ KOSPI 매수</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              외국인 투자자는 주가 상승 수익뿐 아니라 '원화 환차익'을 중요하게 봅니다. 원화가 강세로 전환될 때(환율 하락) 한국 우량주 매수세가 극대화됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
