import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  Share2, 
  FileText, 
  Copy, 
  Presentation, 
  Check, 
  Award,
  TrendingUp,
  Download,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { StepApprovalState } from '../types';

interface FinalDeliverableProps {
  approvals: StepApprovalState;
  onToggleApproval: (key: keyof StepApprovalState) => void;
  onOpenReportModal: () => void;
  onStartPresentation: () => void;
}

export const FinalDeliverable: React.FC<FinalDeliverableProps> = ({
  approvals,
  onToggleApproval,
  onOpenReportModal,
  onStartPresentation
}) => {
  const [copied, setCopied] = useState(false);

  const approvalList = [
    { key: 'step1_factCheck' as const, label: '1단계: PPT 팩트체크 및 금융 전문 감수', desc: '채권금리 vs 수익률 혼동, 테이퍼링 vs QT 분리 등 5대 오류 교정안 검토 완료' },
    { key: 'step2_macroSimulator' as const, label: '2단계: 거시경제 인과관계 시뮬레이터', desc: '미 기준금리·환율·통화량 슬라이더 및 6대 자산군 반응 레이더 매트릭스 검증 완료' },
    { key: 'step3_bondMechanics' as const, label: '3단계: 채권 시소 & 장단기 금리차 곡선', desc: '채권가격-금리 역비례 물리 시소 모델 및 10Y-2Y 일드커브 역전 분석 검증 완료' },
    { key: 'step4_policyCycle' as const, label: '4단계: 양적완화-긴축 4계절 사이클', desc: 'QE → Tapering → Rate Hike → QT 4단계 순환 및 승자/패자 자산군 매핑 완료' },
    { key: 'step5_finalDeliverable' as const, label: '5단계: 최종 산출물 경영진/학습자 배포', desc: '전체 디자인 인터랙션 및 프레젠테이션/인쇄 보고서 최종 승인 완료' }
  ];

  const approvedCount = Object.values(approvals).filter(Boolean).length;
  const allApproved = approvedCount === 5;

  const handleCopySummary = () => {
    const summaryText = `[MacroDynamics 최종 프로젝트 감수 및 완성 보고서]
작성자: Justin LEE 매크로 자료 기반 인터랙티브 대시보드 구축 완료

■ 1단계 핵심 팩트체크 교정 사항:
1. 채권 유통금리(Yield)와 보유자의 실현수익률(Total Return) 개념 분리
2. 테이퍼링(매입 감속)과 양적긴축(QT, 달러 직접 회수)의 명확한 분리
3. 환율 고저에 따른 미국 투자 유불리 시 '신규 매수자' vs '기존 보유자' 전제 명시
4. 환율 상승 시 한국 수출 경쟁력 vs 원자재 수입단가 폭등 및 KOSPI 외인 이탈 복합 메커니즘
5. 미국채 장단기 금리차(10Y-2Y) 역전 자체보다 '역전 해소(Un-inversion)' 시점의 경기침체 위험

■ 구축된 스마트 인터랙티브 모듈:
- 실시간 거시경제 변수 시뮬레이터 (금리·환율·통화량 조절)
- 6대 자산군(미국주식, 한국주식, 미국채, 원자재, 부동산, 달러현금) 실시간 신호등
- 채권 가격-금리 물리 시소(See-saw) 인터랙션
- 미국채 만기별 동적 수익률 곡선(Yield Curve) 및 역전 판별기
- 4단계 통화정책 사이클(QE-Tapering-Hike-QT) 파이프라인

모든 단계의 컨펌이 완료되었습니다.`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Award className="w-4 h-4" />
              <span>5단계: 전체 워크플로우 컨펌 및 최종 산출물 완성</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              매크로 인터랙티브 인포그래픽 대시보드 최종 산출물
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              사용자께서 요청하신 3대 미션인 <strong className="text-emerald-300 font-medium">1) 사실관계 정밀 팩트체크</strong>, 
              <strong className="text-emerald-300 font-medium"> 2) 창의적 스마트 인포그래픽 대시보드 구축</strong>, 
              <strong className="text-emerald-300 font-medium"> 3) 단계별 컨펌 워크플로우</strong>를 100% 반영하여 완성하였습니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              id="final-presentation-btn"
              onClick={onStartPresentation}
              className="px-5 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition"
            >
              <Presentation className="w-4 h-4" />
              <span>풀스크린 프레젠테이션</span>
            </button>

            <button
              id="final-print-report-btn"
              onClick={onOpenReportModal}
              className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>최종 리포트 인쇄 / PDF 저장</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Step Approval Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              단계별 승인 및 검토 확인서 (Step-by-Step Confirmations)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              각 단계별 내용과 디자인을 확인하고 최종 승인 상태를 확정할 수 있습니다.
            </p>
          </div>

          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              allApproved 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {approvedCount} / 5 단계 승인됨 ({Math.round((approvedCount / 5) * 100)}%)
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {approvalList.map((item, idx) => {
            const isChecked = approvals[item.key];
            return (
              <div
                key={item.key}
                onClick={() => onToggleApproval(item.key)}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-slate-950/80 border-emerald-500/40'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isChecked ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {isChecked ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                      {item.label}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-4">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                    isChecked ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isChecked ? '승인 완료' : '클릭하여 승인'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverable Highlights & Action Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deliverable Feature Summary */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            산출물 완성 하이라이트 요약
          </h3>
          <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>학술적·실무적 오류 교정:</strong> PPT에 산재했던 채권 수익률 혼선, 테이퍼링과 QT의 혼동, 환율 투자 주체 시점 등을 명확히 정립.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>스마트 다이내믹 인터랙션:</strong> 단순 텍스트 나열을 탈피하여, 0.25%p 단위 금리 조절 시소와 SVG 기반 일드커브 동적 렌더링 구현.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>6대 자산군 실시간 신호등:</strong> 주식(美/韓), 채권(단기/장기), 원자재(금/원유), 부동산, 현금의 방향성을 정밀 수식 모델로 산출.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>강의 및 경영진 보고 최적화:</strong> 인터랙티브 프레젠테이션 모드 및 고화질 인쇄/PDF 리포트 모듈 탑재.</span>
            </li>
          </ul>
        </div>

        {/* Quick Sharing & Delivery Box */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" />
              검토 결과 텍스트 요약본 복사 및 공유
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              작성된 팩트체크 내용과 핵심 개선점을 요약하여 이메일, 슬랙, 카카오톡 등으로 즉시 전달할 수 있습니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 font-mono line-clamp-4">
            [MacroDynamics 최종 프로젝트 감수 및 완성 보고서]
            1. 채권 유통금리(Yield)와 보유자의 실현수익률(Total Return) 개념 분리...
            2. 테이퍼링(매입 감속)과 양적긴축(QT, 달러 직접 회수)의 명확한 분리...
          </div>

          <button
            id="copy-summary-btn"
            onClick={handleCopySummary}
            className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '요약본 클립보드 복사 완료!' : '결과 보고서 요약본 전체 복사'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
