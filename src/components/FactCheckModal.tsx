import React from 'react';
import { X, CheckCircle2, AlertTriangle, FileText, Check } from 'lucide-react';
import { FACT_CHECK_ITEMS } from '../data/factCheckData';

interface FactCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  confirmedItems: Record<string, boolean>;
  onToggleConfirm: (id: string) => void;
}

export const FactCheckModal: React.FC<FactCheckModalProps> = ({
  isOpen,
  onClose,
  confirmedItems,
  onToggleConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Justin LEE 원본 PPT 팩트체크 및 금융 전문 감수 총괄표</h3>
              <p className="text-[11px] text-slate-400">학술적 사실관계 오류, 개념 혼선, 전제조건 누락 5대 항목 정밀 교정</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="p-6 space-y-4">
          {FACT_CHECK_ITEMS.map((item, idx) => {
            const isConfirmed = !!confirmedItems[item.id];

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      #{idx + 1} [슬라이드 {item.slideNumber}p]
                    </span>
                    <h4 className="text-xs font-bold text-white">{item.slideTitle}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      {item.issueType === 'FACTUAL_ERROR' && '사실관계 오류'}
                      {item.issueType === 'CONCEPTUAL_CONFUSION' && '개념 혼선'}
                      {item.issueType === 'OMISSION_OR_CONTEXT' && '전제조건 누락'}
                    </span>

                    <button
                      onClick={() => onToggleConfirm(item.id)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                        isConfirmed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isConfirmed ? '교정 확인됨' : '확인'}</span>
                    </button>
                  </div>
                </div>

                {/* Original text */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-xs text-slate-300">
                  <span className="text-slate-400 font-bold block mb-0.5">작성하신 원문:</span>
                  <span className="font-mono text-slate-300">"{item.originalText}"</span>
                </div>

                {/* Critique & Correction */}
                <div className="space-y-1 text-xs">
                  <div className="text-rose-300">
                    <strong className="text-rose-400">문제점 분석: </strong>
                    {item.critique}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200">
                    <strong className="text-emerald-400">스마트 교정 권고안: </strong>
                    <div className="mt-1 whitespace-pre-line leading-relaxed">{item.correction}</div>
                  </div>
                </div>

                {/* Deep dive note */}
                <div className="text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-lg">
                  <span className="text-cyan-400 font-semibold">금융 공학 심층 주석: </span>
                  {item.deepDiveNote}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-900/90">
          <span>MacroDynamics · 감수 완료</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
          >
            확인 완료 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
