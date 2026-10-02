import React from 'react';
import { X, Printer, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, Scale, Activity } from 'lucide-react';
import { FACT_CHECK_ITEMS } from '../data/factCheckData';
import { UnifiedMacroState } from '../types';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  macro: UnifiedMacroState;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  macro
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
              M
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">최종 감수 및 매크로 인포그래픽 정식 보고서</h3>
              <p className="text-[11px] text-slate-400">Executive Macroeconomic Intelligence & Verification Report</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>인쇄 및 PDF로 저장</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Body (Print friendly) */}
        <div className="p-8 space-y-8 print:p-0 print:text-black print:bg-white">
          {/* Header Title */}
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Macro Dynamics Verification Brief</div>
            <h1 className="text-2xl font-black text-white">
              환율·금리·통화량과 글로벌 자산시장 변동 인포그래픽 정밀 검토 보고서
            </h1>
            <p className="text-xs text-slate-400">
              작성자: Justin LEE 원본 PPT 감수 및 인터랙티브 인포그래픽 시스템화 산출물
            </p>
          </div>

          {/* 1. Core Matrix Snapshot */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              1. 현재 기준 파라미터 상태 및 시나리오 진단
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-slate-400">미국 기준금리 상태</div>
                <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                  {macro.rateRegime === 'HIKE' ? '금리 인상기 (▲)' :
                   macro.rateRegime === 'HIGH_HOLD' ? '고금리 장기 유지 (⏸️)' :
                   macro.rateRegime === 'CUT' ? '금리 인하기 (▼)' : '저금리 장기 유지 (⏸️)'}
                  <span className="text-xs ml-1 font-normal text-slate-400">({macro.fedRateValue.toFixed(2)}%)</span>
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-slate-400">원/달러 환율 상태</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  {macro.fxRegime === 'RISE' ? '환율 상승기 (▲)' :
                   macro.fxRegime === 'HIGH_HOLD' ? '고환율 고착화 (⏸️)' :
                   macro.fxRegime === 'FALL' ? '환율 하락기 (▼)' : '저환율 안정화 (⏸️)'}
                  <span className="text-xs ml-1 font-normal text-slate-400">(₩{macro.usdkrwValue})</span>
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 col-span-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>상황 판정 및 국면</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    macro.relationshipType === 'NORMAL' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {macro.relationshipType === 'NORMAL' ? '일반적 동행 상황' : '예외적 비동조화 상황'}
                  </span>
                </div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">{macro.scenarioName}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div>
                <strong className={macro.relationshipType === 'NORMAL' ? 'text-emerald-400' : 'text-purple-400'}>
                  [{macro.relationshipType === 'NORMAL' ? '일반 동행 원리' : '예외 디커플링 원리'}]:{' '}
                </strong>
                <span>{macro.relationshipReason}</span>
              </div>
              <div className="pt-1 border-t border-slate-900 text-slate-400">
                <strong className="text-cyan-400">인과 연동 법칙: </strong>
                <span>{macro.coreRule}</span>
              </div>
            </div>
          </div>

          {/* 2. Asset & Bond & Macro Impacts */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              2. 자산군·채권·경기 연관 지표 변동 총괄
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Assets */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400">자산 시장 (주가·원자재)</div>
                {macro.assets.map(a => (
                  <div key={a.id} className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-300">{a.nameKr}</span>
                    <span className={`font-bold ${a.direction === 'UP' ? 'text-emerald-400' : a.direction === 'DOWN' ? 'text-rose-400' : 'text-slate-400'}`}>
                      {a.direction === 'UP' ? '상승 ▲' : a.direction === 'DOWN' ? '하락 ▼' : '중립'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bond */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400">채권 가격 메커니즘</div>
                <div className="space-y-2 text-slate-300">
                  <div>
                    <span className="text-slate-400">시장 유통금리: </span>
                    <span className="font-bold text-cyan-400">{macro.bond.marketRateDirection === 'UP' ? '상승 ▲' : '하락 ▼'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">채권 거래가격: </span>
                    <span className="font-bold text-rose-400">{macro.bond.bondPriceDirection === 'UP' ? '상승 ▲' : '하락 ▼'}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                    {macro.bond.existingHolderNote}
                  </div>
                </div>
              </div>

              {/* Macro Indicators */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-400">경기 및 자본 이동</div>
                {macro.indicators.map(ind => (
                  <div key={ind.id} className="flex items-center justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-300">{ind.titleKr}</span>
                    <span className="font-bold text-slate-200">{ind.valueText.split('(')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Fact Check Summary Table */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              3. PPT 원본 사실관계 및 개념 오류 정밀 교정 내역
            </h2>

            <div className="space-y-2.5">
              {FACT_CHECK_ITEMS.map((item, idx) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">
                      #{idx + 1}. [슬라이드 {item.slideNumber}p] {item.slideTitle}
                    </span>
                    <span className="text-rose-400 font-medium">
                      {item.issueType === 'FACTUAL_ERROR' && '사실관계 오류'}
                      {item.issueType === 'CONCEPTUAL_CONFUSION' && '용어 및 개념 혼선'}
                      {item.issueType === 'OMISSION_OR_CONTEXT' && '투자 전제조건 누락'}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    <strong className="text-slate-300">원본: </strong> "{item.originalText}"
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <strong className="text-emerald-400">교정안: </strong> {item.correction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sign-off footer */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>검토 완료일: 2026.09.18 | MacroDynamics Intelligence System</div>
            <div className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>정식 금융 감수 검증 완료 (Verified)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
