import React, { useState } from 'react';
import { 
  PieChart, 
  RotateCw, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Coins, 
  Building2,
  Calendar,
  Compass
} from 'lucide-react';
import { PolicyAction } from '../types';

interface PolicyCycleEngineProps {
  onConfirmStep: () => void;
  isStepConfirmed: boolean;
  onGoToNextTab: () => void;
}

interface PolicyStageDetail {
  id: PolicyAction;
  stepNum: number;
  title: string;
  subtitle: string;
  tagline: string;
  fedAction: string;
  liquidityState: string;
  dollarFx: string;
  koreaMarket: string;
  winningAssets: string[];
  losingAssets: string[];
  historicalExample: string;
}

export const POLICY_STAGES: PolicyStageDetail[] = [
  {
    id: 'QE',
    stepNum: 1,
    title: '1단계: 양적완화 (QE: Quantitative Easing)',
    subtitle: '위기 극복을 위한 무제한 달러 살포',
    tagline: '수도꼭지를 최대로 틀어 유동성을 쏟아붓는 단계',
    fedAction: '기준금리 0% 인하 + 미 연준이 국채 및 MBS를 시장에서 매입하여 달러 대규모 방출',
    liquidityState: '시중 통화량(M2) 폭증, 화폐가치 급락, 자산 인플레이션 점화',
    dollarFx: '달러 약세(Weak Dollar) 진행, 신흥국 통화 상대적 강세(원달러 환율 하락)',
    koreaMarket: '글로벌 유동성 파티 유입, 외국인 순매수 급증, KOSPI 및 성장주 대세 상승장',
    winningAssets: ['빅테크/성장주', '비트코인/가상자산', '원자재(금/은)', '부동산'],
    losingAssets: ['현금(구매력 상실)', '은행 정기예금', '단기 머니마켓'],
    historicalExample: '2008년 글로벌 금융위기 직후, 2020년 3월 코로나 팬데믹 무제한 QE'
  },
  {
    id: 'TAPERING',
    stepNum: 2,
    title: '2단계: 테이퍼링 (Tapering: 양적완화 축소)',
    subtitle: '수도꼭지를 서서히 잠그는 감속 단계',
    tagline: '★ PPT 3p의 핵심 오류: 테이퍼링은 달러 회수가 아닌 "공급 속도 감속"입니다!',
    fedAction: '매달 사들이던 채권 매입 액수를 단계적으로 축소 (예: 월 1,200억 달러 → 매월 150억 달러씩 감액)',
    liquidityState: '유동성은 여전히 순공급 중이나 증가 속도가 둔화됨 (통화 팽창 피크아웃)',
    dollarFx: '긴축 예고로 달러 가치 반등 모색, 원달러 환율 바닥 찍고 서서히 상승 전환',
    koreaMarket: '긴축 발작(Taper Tantrum) 우려로 시장 변동성 확대, 실적 기반 실적주로 압축 장세',
    winningAssets: ['가치주/고배당주', '원자재(경기 확장기 수요)', '은행/금융주'],
    losingAssets: ['적자 기술주', '고PER 성장주', '장기채권'],
    historicalExample: '2013년 버냉키 쇼크, 2021년 11월 파월 연준의 테이퍼링 공식 개시'
  },
  {
    id: 'RATE_HIKE',
    stepNum: 3,
    title: '3단계: 기준금리 인상 (Rate Hike Cycle)',
    subtitle: '치솟는 인플레이션을 잡기 위한 정면 승부',
    tagline: '돈의 가격(이자율)을 높여 민간의 대출과 투자를 억제하는 단계',
    fedAction: 'FOMC에서 연방기금금리 인상 (베이비스텝 0.25%p ~ 자이언트스텝 0.75%p)',
    liquidityState: '조달 금리 급등으로 은행 대출 위축, 기업 설비투자 축소, 가계 소비 둔화',
    dollarFx: '미국-한국 금리 역전 심화, 강력한 킹달러(King Dollar) 출현, 원달러 환율 급등(원화 약세)',
    koreaMarket: '외국인 환차손 회피성 자본 이탈, 무역수지 악화와 맞물려 KOSPI 급락 및 신용 잔고 축소',
    winningAssets: ['달러 현금/초단기채', '인버스/헤지 상품', '필수소비재'],
    losingAssets: ['고평가 성장주', '부동산(PF 부실)', '중위험 회사채'],
    historicalExample: '2022년 3월~2023년 7월 (연준 기준금리 0.25%에서 5.50%까지 525bp 초고속 인상)'
  },
  {
    id: 'QT',
    stepNum: 4,
    title: '4단계: 양적긴축 (QT: Quantitative Tightening)',
    subtitle: '시중에 풀린 달러를 직접 빨아들이는 대차대조표 축소',
    tagline: '★ PPT 3p의 "달러 회수 / 채권 매도"는 바로 이 양적긴축(QT) 단계입니다!',
    fedAction: '연준 보유 국채 만기 도래 시 원금을 재투자하지 않고 소각(Roll-off)하거나 직접 채권 매각',
    liquidityState: '미 연준 대차대조표(자산) 축소, 금융권 지준금 감소, 유동성 진공 현상',
    dollarFx: '글로벌 달러 유동성 기근으로 달러 프리미엄 극대화, 신흥국 외환보유액 방어 압박',
    koreaMarket: '국내 증시 거래대금 급감, 밸류에이션 리레이팅 중단, 안전자산 선호 극대화',
    winningAssets: ['미국 단기 국채(연 5% 무위험)', '달러 예금', '금(지정학적 안전자산)'],
    losingAssets: ['부채비율 높은 기업', '비수익 자산', '레버리지 투자상품'],
    historicalExample: '2017~2019년 옐런-파월 QT, 2022년 6월 개시된 월 950억 달러 한도 QT'
  }
];

export const PolicyCycleEngine: React.FC<PolicyCycleEngineProps> = ({
  onConfirmStep,
  isStepConfirmed,
  onGoToNextTab
}) => {
  const [activeStageId, setActiveStageId] = useState<PolicyAction>('QE');
  const currentStage = POLICY_STAGES.find(s => s.id === activeStageId) || POLICY_STAGES[0];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
            <RotateCw className="w-3.5 h-3.5" />
            <span>4단계: 양적완화-테이퍼링-금리인상-양적긴축 정책 4계절 사이클</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            PPT 슬라이드 3페이지의 4단계 정밀 분리 및 자산 순환 나침반
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            작성하신 슬라이드 3페이지에서는 '테이퍼링'과 '양적긴축'이 하나로 묶여 있어 통화 정책의 단계적 전개를 놓치기 쉬웠습니다. 
            중앙은행의 완벽한 4단계 라이프사이클을 도식화하여 각 단계별 필승 자산과 피해야 할 자산을 분석합니다.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="confirm-step4-btn"
            onClick={onConfirmStep}
            className={`px-4 py-3 rounded-xl font-semibold text-sm transition flex items-center gap-2 shadow-lg ${
              isStepConfirmed
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isStepConfirmed ? '4단계 사이클 분석 승인 완료' : '4단계 사이클 분석 승인(컨펌)'}</span>
          </button>
        </div>
      </div>

      {/* 4-Stage Interactive Pipeline Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {POLICY_STAGES.map((st) => {
          const isActive = st.id === activeStageId;
          return (
            <button
              key={st.id}
              id={`stage-card-${st.id}`}
              onClick={() => setActiveStageId(st.id)}
              className={`p-4 rounded-xl text-left border transition-all relative ${
                isActive
                  ? 'bg-gradient-to-br from-purple-950/60 to-slate-900 border-purple-500/60 shadow-xl shadow-purple-500/10'
                  : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  isActive ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {st.stepNum}
                </span>
                <span className="text-[11px] font-mono text-slate-500">Step 0{st.stepNum}</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">{st.title.split(':')[1]}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-snug line-clamp-2">{st.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep-Dive Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-semibold text-purple-400 mb-1">{currentStage.tagline}</div>
            <h3 className="text-lg font-bold text-white tracking-tight">{currentStage.title}</h3>
          </div>
          <div className="text-xs text-slate-400 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>실제 사례: {currentStage.historicalExample}</span>
          </div>
        </div>

        {/* 4 Pillars of Transmission */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>1. 중앙은행(Fed) 액션</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{currentStage.fedAction}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>2. 시중 유동성(M2) 상태</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{currentStage.liquidityState}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>3. 달러 가치 & 환율 반응</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{currentStage.dollarFx}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>4. 한국 시장(KOSPI) 영향</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{currentStage.koreaMarket}</p>
          </div>
        </div>

        {/* Winners vs Losers Asset Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Winners */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>이 국면의 핵심 승자 자산 (Outperform Assets)</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentStage.winningAssets.map((asset) => (
                <span key={asset} className="px-2.5 py-1 rounded-lg bg-emerald-900/40 text-emerald-200 border border-emerald-700/50 text-xs font-medium">
                  {asset}
                </span>
              ))}
            </div>
          </div>

          {/* Losers */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
            <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>이 국면의 핵심 패자/경계 자산 (Underperform Assets)</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentStage.losingAssets.map((asset) => (
                <span key={asset} className="px-2.5 py-1 rounded-lg bg-rose-900/40 text-rose-200 border border-rose-700/50 text-xs font-medium">
                  {asset}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Step Nav Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-xl">
        <div className="text-xs text-slate-400">
          모든 개별 분석을 마치셨습니다. 마지막 단계에서 <strong className="text-white">최종 산출물 검토 및 프레젠테이션/인쇄 보고서</strong>를 생성합니다.
        </div>
        <button
          id="go-to-deliverable-btn"
          onClick={onGoToNextTab}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
        >
          <span>5단계: 최종 산출물 종합으로 이동</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
