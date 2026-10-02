import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Sliders,
  ShieldAlert,
  ThumbsUp
} from 'lucide-react';
import { FACT_CHECK_ITEMS } from '../data/factCheckData';
import { FactCheckItem } from '../types';

interface FactCheckAuditorProps {
  onConfirmStep: () => void;
  isStepConfirmed: boolean;
  onGoToSimulator: () => void;
}

export const FactCheckAuditor: React.FC<FactCheckAuditorProps> = ({
  onConfirmStep,
  isStepConfirmed,
  onGoToSimulator
}) => {
  const [items, setItems] = useState<FactCheckItem[]>(FACT_CHECK_ITEMS);
  const [filterSlide, setFilterSlide] = useState<number | 'ALL'>('ALL');
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});

  const toggleConfirmItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, confirmed: !item.confirmed } : item));
  };

  const handleNoteChange = (id: string, text: string) => {
    setUserNotes(prev => ({ ...prev, [id]: text }));
  };

  const filteredItems = filterSlide === 'ALL' 
    ? items 
    : items.filter(i => i.slideNumber === filterSlide);

  const confirmedCount = items.filter(i => i.confirmed).length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Context & Summary */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>1단계 필수 과제: PPT 원본 사실관계 & 개념 무결성 검증</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              작성하신 PPT(1~3페이지) 내용의 팩트체크 및 금융 전문 감수 보고서
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              작성하신 슬라이드는 거시경제의 큰 뼈대를 매우 직관적으로 잘 짚어주셨습니다! 
              다만 <strong className="text-amber-300 font-medium">채권금리와 수익률의 용어 혼선</strong>, 
              <strong className="text-amber-300 font-medium"> 테이퍼링과 양적긴축(QT)의 개념 분리</strong>, 
              <strong className="text-amber-300 font-medium"> 환율과 투자 유불리의 전제조건</strong> 등 
              초심자에게 혼란을 주거나 사실과 다른 5가지 핵심 사항을 정밀 교정해 드립니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-right">
              <div className="text-xs text-slate-400">교정 항목 검토 현황</div>
              <div className="text-lg font-bold text-emerald-400">{confirmedCount} / {items.length} 항목 확인됨</div>
            </div>

            <button
              id="confirm-step1-btn"
              onClick={onConfirmStep}
              className={`px-4 py-3 rounded-xl font-semibold text-sm transition flex items-center gap-2 shadow-lg ${
                isStepConfirmed
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isStepConfirmed ? '1단계 감수 승인 완료됨' : '1단계 감수 승인(컨펌)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Selector Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">슬라이드 필터:</span>
          {(['ALL', 1, 2, 3] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterSlide(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterSlide === tab
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {tab === 'ALL' ? '전체 보기 (5건)' : `페이지 ${tab}`}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> 심각한 개념 혼선
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> 전제조건/맥락 누락
          </span>
        </div>
      </div>

      {/* Fact Check Cards List */}
      <div className="space-y-4">
        {filteredItems.map((item, idx) => {
          const isConfirmed = item.confirmed;
          return (
            <div 
              key={item.id}
              className={`p-6 rounded-2xl border transition-all duration-200 ${
                isConfirmed 
                  ? 'bg-slate-900/60 border-emerald-500/40 shadow-emerald-500/5' 
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl'
              }`}
            >
              {/* Header inside card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-cyan-400 text-xs font-semibold border border-slate-700">
                    슬라이드 {item.slideNumber}p · {item.slideTitle}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    item.severity === 'HIGH' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {item.issueType === 'FACTUAL_ERROR' && '사실관계 오류'}
                    {item.issueType === 'CONCEPTUAL_CONFUSION' && '용어 및 개념 혼선'}
                    {item.issueType === 'OMISSION_OR_CONTEXT' && '투자 전제조건 누락'}
                  </span>
                </div>

                <button
                  id={`confirm-item-${item.id}`}
                  onClick={() => toggleConfirmItem(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    isConfirmed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isConfirmed ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{isConfirmed ? '교정안 확인 완료' : '교정안 확인 및 반영'}</span>
                </button>
              </div>

              {/* Comparison Grid: Original vs Critique vs Correction */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
                {/* Column 1: Original text */}
                <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2">
                  <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>작성하신 원본 내용</span>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed break-all">
                    "{item.originalText}"
                  </div>
                  <div className="text-xs text-rose-400/90 flex items-start gap-1.5 mt-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{item.critique}</span>
                  </div>
                </div>

                {/* Column 2: Correction & Solution */}
                <div className="lg:col-span-8 p-4 rounded-xl bg-gradient-to-br from-cyan-950/20 via-slate-900 to-slate-900 border border-cyan-900/30 space-y-3">
                  <div className="text-xs font-semibold text-cyan-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      스마트 인포그래픽 교정 권고안
                    </span>
                    <span className="text-[11px] text-slate-400">대시보드 시뮬레이터에 실시간 반영</span>
                  </div>

                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-cyan-800/40 text-xs sm:text-sm text-slate-100 whitespace-pre-line leading-relaxed font-sans">
                    {item.correction}
                  </div>

                  {/* Deep dive note */}
                  <div className="p-3 bg-blue-950/30 rounded-lg border border-blue-900/40 text-xs text-blue-300/90 flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-blue-200">금융 전문가 심층 주석: </strong>
                      {item.deepDiveNote}
                    </div>
                  </div>

                  {/* Custom feedback input for user */}
                  <div className="pt-2">
                    <input 
                      type="text"
                      placeholder="이 항목에 대한 추가 의견이나 수정 요청 메모가 있으시면 입력해 주세요..."
                      value={userNotes[item.id] || ''}
                      onChange={(e) => handleNoteChange(item.id, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">감수 내용을 확인하셨나요?</h4>
            <p className="text-xs text-slate-400">
              위 교정 사항을 바탕으로 구성된 2단계 인터랙티브 거시경제 시뮬레이터에서 직접 수치를 조작해 보세요.
            </p>
          </div>
        </div>

        <button
          id="go-to-simulator-btn"
          onClick={onGoToSimulator}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition shrink-0"
        >
          <span>2단계 시뮬레이터로 이동</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
