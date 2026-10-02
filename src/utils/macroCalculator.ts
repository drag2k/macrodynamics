import { AssetImpact, EconomicPhase, PolicyAction } from '../types';

export interface YieldPoint {
  maturity: string;
  label: string;
  yieldValue: number;
}

export interface MacroCalculationResult {
  assetImpacts: AssetImpact[];
  yieldCurve: YieldPoint[];
  tenMinusTwoSpread: number;
  curveShape: 'NORMAL' | 'FLAT' | 'INVERTED';
  inversionSeverity: number; // 0 to 100
  dollarIndexEstimate: number;
  koreanExportCompetitiveness: string;
  foreignCapitalFlow: 'MASSIVE_INFLOW' | 'INFLOW' | 'NEUTRAL' | 'OUTFLOW' | 'MASSIVE_OUTFLOW';
  flowSteps: {
    step: number;
    title: string;
    description: string;
    indicator: string;
    status: 'bullish' | 'bearish' | 'neutral';
  }[];
}

export function calculateMacroDynamics(
  fedRate: number,
  usdkrw: number,
  policy: PolicyAction,
  phase: EconomicPhase
): MacroCalculationResult {
  // Policy modifier: QE = -1.5, TAPERING = -0.5, RATE_HIKE = +1.0, QT = +1.8
  const policyImpact = policy === 'QE' ? -1.5 : policy === 'TAPERING' ? -0.3 : policy === 'RATE_HIKE' ? 1.0 : 1.8;

  // Dollar Strength proxy
  const dollarIndexEstimate = Math.round(92 + (fedRate * 2.8) + (policyImpact * 2.2) + ((usdkrw - 1200) / 35));

  // Yield curve calculation
  // Short-term yields track fed funds rate closely
  const yield1M = Number((fedRate + 0.05).toFixed(2));
  const yield3M = Number((fedRate + 0.12).toFixed(2));
  const yield2Y = Number((fedRate + (policyImpact * 0.35) + 0.15).toFixed(2));
  
  // Long-term yields depend on expected long-term growth and terminal inflation
  // During heavy hikes / late cycle, long term yields fall below short term (Inversion!)
  let termPremium = 1.2;
  if (policy === 'RATE_HIKE' || policy === 'QT') {
    termPremium = -0.45; // Inverted
  } else if (policy === 'TAPERING') {
    termPremium = 0.2; // Flat
  } else {
    termPremium = 1.4; // Steep Normal
  }

  const yield10Y = Number(Math.max(1.5, fedRate * 0.75 + termPremium).toFixed(2));
  const yield30Y = Number((yield10Y + 0.35).toFixed(2));

  const tenMinusTwoSpread = Number((yield10Y - yield2Y).toFixed(2));
  const curveShape = tenMinusTwoSpread > 0.4 ? 'NORMAL' : tenMinusTwoSpread >= -0.1 ? 'FLAT' : 'INVERTED';
  const inversionSeverity = curveShape === 'INVERTED' ? Math.min(100, Math.round(Math.abs(tenMinusTwoSpread) * 120)) : 0;

  const yieldCurve: YieldPoint[] = [
    { maturity: '1M', label: '1개월', yieldValue: yield1M },
    { maturity: '3M', label: '3개월', yieldValue: yield3M },
    { maturity: '1Y', label: '1년', yieldValue: Number(((yield3M + yield2Y) / 2).toFixed(2)) },
    { maturity: '2Y', label: '2년(단기)', yieldValue: yield2Y },
    { maturity: '5Y', label: '5년', yieldValue: Number(((yield2Y + yield10Y) / 2 + 0.1).toFixed(2)) },
    { maturity: '10Y', label: '10년(벤치마크)', yieldValue: yield10Y },
    { maturity: '30Y', label: '30년(초장기)', yieldValue: yield30Y },
  ];

  // Capital flow logic
  let foreignCapitalFlow: 'MASSIVE_INFLOW' | 'INFLOW' | 'NEUTRAL' | 'OUTFLOW' | 'MASSIVE_OUTFLOW' = 'NEUTRAL';
  if (usdkrw >= 1400 || (fedRate >= 4.5 && policy === 'QT')) {
    foreignCapitalFlow = 'MASSIVE_OUTFLOW';
  } else if (usdkrw > 1320 || fedRate > 3.5) {
    foreignCapitalFlow = 'OUTFLOW';
  } else if (usdkrw <= 1180 && (policy === 'QE' || fedRate <= 2.0)) {
    foreignCapitalFlow = 'MASSIVE_INFLOW';
  } else if (usdkrw < 1250) {
    foreignCapitalFlow = 'INFLOW';
  }

  // Korean export context
  const koreanExportCompetitiveness = usdkrw > 1350
    ? '원화 약세로 수출 가격경쟁력은 일부 있으나, 원자재 수입단가 폭등 및 글로벌 수요 위축으로 무역수지 압박 심화'
    : usdkrw < 1180
    ? '원화 강세로 수입물가 안정 및 내수 구매력 개선되나, 수출 완제품 가격경쟁력 일부 둔화'
    : '환율 중립 구간: 수출과 내수의 균형 형성 및 환리스크 안정적 관리 가능';

  // Asset impact calculations
  // 1. US Equities (S&P 500 / Big Tech)
  let usEquityScore = 0;
  if (policy === 'QE') usEquityScore += 45;
  if (policy === 'QT') usEquityScore -= 40;
  if (fedRate < 2.0) usEquityScore += 30;
  else if (fedRate > 4.5) usEquityScore -= 30;
  if (phase === 'EXPANSION' || phase === 'RECOVERY') usEquityScore += 20;
  if (phase === 'RECESSION') usEquityScore -= 35;
  usEquityScore = Math.max(-95, Math.min(95, usEquityScore));

  // 2. Korean Equities (KOSPI)
  let kospiScore = 0;
  if (foreignCapitalFlow === 'MASSIVE_INFLOW') kospiScore += 50;
  else if (foreignCapitalFlow === 'INFLOW') kospiScore += 25;
  else if (foreignCapitalFlow === 'OUTFLOW') kospiScore -= 30;
  else if (foreignCapitalFlow === 'MASSIVE_OUTFLOW') kospiScore -= 55;
  if (policy === 'QE') kospiScore += 30;
  if (policy === 'QT') kospiScore -= 35;
  kospiScore = Math.max(-95, Math.min(95, kospiScore));

  // 3. US Bonds (Price of 10Y)
  // Higher yields = lower bond price!
  let bondPriceScore = Math.round(50 - (yield10Y * 16));
  if (policy === 'QE') bondPriceScore += 35;
  if (policy === 'QT') bondPriceScore -= 35;
  bondPriceScore = Math.max(-90, Math.min(90, bondPriceScore));

  // 4. Commodities (Gold & Crude)
  // Dollar up = Commodity down, QE = Commodity up (inflation hedge)
  let commodityScore = 0;
  if (policy === 'QE') commodityScore += 45;
  if (policy === 'QT') commodityScore -= 30;
  if (dollarIndexEstimate > 105) commodityScore -= 25;
  else if (dollarIndexEstimate < 96) commodityScore += 30;
  commodityScore = Math.max(-90, Math.min(90, commodityScore));

  // 5. Real Estate
  let realEstateScore = Math.round(40 - (fedRate * 15) - (policyImpact * 12));
  realEstateScore = Math.max(-85, Math.min(85, realEstateScore));

  // 6. Cash / Money Market (USD)
  let cashScore = Math.round((fedRate * 18) + (policyImpact * 8));
  cashScore = Math.max(-60, Math.min(95, cashScore));

  const assetImpacts: AssetImpact[] = [
    {
      name: 'US Equities',
      nameKr: '미국 주식 (S&P 500 / 나스닥)',
      category: 'EQUITY',
      direction: usEquityScore > 15 ? 'UP' : usEquityScore < -15 ? 'DOWN' : 'NEUTRAL',
      score: usEquityScore,
      reason: policy === 'QE'
        ? '저금리와 무제한 유동성 공급으로 미래 현금흐름 할인율 하락 및 PER 밸류에이션 확장'
        : policy === 'QT'
        ? '고금리 장기화 및 유동성 흡수로 밸류에이션 부담 가중 및 자본비용 증가'
        : '실적 펀더멘털과 금리 인하 기대감이 공존하는 선별 장세',
      keyMetric: `기대 모멘텀: ${usEquityScore > 0 ? '+' : ''}${usEquityScore}pt`
    },
    {
      name: 'Korean Equities',
      nameKr: '한국 주식 (KOSPI / KOSDAQ)',
      category: 'EQUITY',
      direction: kospiScore > 15 ? 'UP' : kospiScore < -15 ? 'DOWN' : 'NEUTRAL',
      score: kospiScore,
      reason: foreignCapitalFlow.includes('OUTFLOW')
        ? '원달러 고환율로 외국인의 환차손 회피성 매도 출회 및 원자재 수입단가 상승으로 기업 마진 압박'
        : foreignCapitalFlow.includes('INFLOW')
        ? '달러 약세 전환에 따른 글로벌 위험자산 선호 및 외국인 패시브 자금 순유입 활성화'
        : '환율 및 수출 지표에 연동된 박스권 등락',
      keyMetric: `외국인 수급 전망: ${foreignCapitalFlow.replace('_', ' ')}`
    },
    {
      name: 'US Treasuries (Price)',
      nameKr: '미국 장기채권 (평가가격)',
      category: 'BOND',
      direction: bondPriceScore > 15 ? 'UP' : bondPriceScore < -15 ? 'DOWN' : 'NEUTRAL',
      score: bondPriceScore,
      reason: yield10Y >= 4.5
        ? '10년물 금리가 고공행진하여 기존 채권 평가손실이 극대화되나, 신규 매수자에게는 매력적인 만기수익률(Yield) 제공'
        : yield10Y <= 2.5
        ? '채권 유통금리 하락으로 보유 채권의 자본차익(평가가격 상승) 극대화'
        : '금리 방향성에 따른 듀레이션 리스크 관리 필요',
      keyMetric: `10Y 벤치마크 금리: ${yield10Y}%`
    },
    {
      name: 'Commodities (Gold/Oil)',
      nameKr: '원자재 (금·원유)',
      category: 'COMMODITY',
      direction: commodityScore > 15 ? 'UP' : commodityScore < -15 ? 'DOWN' : 'NEUTRAL',
      score: commodityScore,
      reason: policy === 'QE'
        ? '통화량 팽창에 따른 인플레이션 헤지 수요 급증 및 달러 약세에 기인한 원자재 표시가격 상승'
        : dollarIndexEstimate > 105
        ? '강달러 기조로 달러 표시 원자재의 비미국권 구매력 약화 및 수요 억제'
        : '지정학적 요인과 공급망 재편에 따른 국지적 변동성',
      keyMetric: `달러 인덱스 추정: ${dollarIndexEstimate}p`
    },
    {
      name: 'Real Estate',
      nameKr: '부동산 자산',
      category: 'REAL_ESTATE',
      direction: realEstateScore > 15 ? 'UP' : realEstateScore < -15 ? 'DOWN' : 'NEUTRAL',
      score: realEstateScore,
      reason: fedRate >= 4.5
        ? '주택담보대출 및 조달비용 급등으로 거래량 급감 및 상업용 부동산 리파이낸싱 리스크 부각'
        : '낮은 차입비용과 대체투자 자금 유입으로 캡레이트 스프레드 우호적',
      keyMetric: `조달금리 부담도: ${fedRate >= 4 ? '위험 수준' : fedRate >= 2.5 ? '보통' : '우호적'}`
    },
    {
      name: 'USD Cash / Deposits',
      nameKr: '달러 현금 / 초단기 MMF',
      category: 'CURRENCY',
      direction: cashScore > 20 ? 'UP' : cashScore < -10 ? 'DOWN' : 'NEUTRAL',
      score: cashScore,
      reason: fedRate >= 4.5
        ? '위험을 감수하지 않고도 4~5%대의 무위험 이자수익(Risk-free Rate)을 누릴 수 있어 현금 보유 매력 최상'
        : '초저금리 환경에서는 실질 마이너스 금리로 인해 현금 보유 기회비용 급증',
      keyMetric: `무위험 수익률: 연 ${yield1M}%`
    }
  ];

  // 5-Stage Animated Pipeline Steps
  const flowSteps = [
    {
      step: 1,
      title: '연준 통화정책 기조',
      description: policy === 'QE' ? '무제한 채권 매입 및 기준금리 인하로 시중 유동성 대규모 살포'
        : policy === 'TAPERING' ? '자산매입 규모 점진 축소 (유동성 공급 속도 감속 조절)'
        : policy === 'RATE_HIKE' ? '기준금리 인상으로 신용팽창 억제 및 대출이자율 상방 압력'
        : '보유 자산 매각 및 만기채권 재투자 중단(대차대조표 축소)으로 시중 달러 직접 흡수',
      indicator: `기준금리 ${fedRate.toFixed(2)}% | 정책: ${policy}`,
      status: policy === 'QE' ? 'bullish' : policy === 'QT' ? 'bearish' : 'neutral'
    },
    {
      step: 2,
      title: '달러 가치 & 외환시장',
      description: usdkrw >= 1350
        ? `원달러 환율 ${usdkrw.toLocaleString()}원 (강달러/원화약세). 원화 평가절하로 달러 환산 평가이익 또는 수입물가 급등 유발.`
        : usdkrw <= 1180
        ? `원달러 환율 ${usdkrw.toLocaleString()}원 (약달러/원화강세). 원화 구매력 상승 및 달러 자산 신규 매수 기회.`
        : `원달러 환율 ${usdkrw.toLocaleString()}원 (안정적 레벨). 균형 환율 구간.`,
      indicator: `환율: ₩${usdkrw.toLocaleString()} / 달러인덱스: ~${dollarIndexEstimate}`,
      status: usdkrw >= 1350 ? 'bearish' : usdkrw <= 1180 ? 'bullish' : 'neutral'
    },
    {
      step: 3,
      title: '채권 시장 & 수익률 곡선',
      description: curveShape === 'INVERTED'
        ? `10년-2년 금리차 역전 (${tenMinusTwoSpread}%p). 시장이 향후 경기 불황과 연준의 긴급 피벗을 강력히 선반영 중.`
        : curveShape === 'FLAT'
        ? `장단기 금리차 평탄화 (${tenMinusTwoSpread}%p). 경기 사이클 후반부 진입 및 긴축 후폭풍 관망.`
        : `정상 수익률 곡선 (${tenMinusTwoSpread}%p 스프레드). 장기 금리가 우상향하며 건강한 경제 성장 전망 반영.`,
      indicator: `2Y: ${yield2Y}% | 10Y: ${yield10Y}% (스프레드: ${tenMinusTwoSpread > 0 ? '+' : ''}${tenMinusTwoSpread}%p)`,
      status: curveShape === 'INVERTED' ? 'bearish' : 'bullish'
    },
    {
      step: 4,
      title: '한국 자본 유출입 & 코스피',
      description: foreignCapitalFlow.includes('OUTFLOW')
        ? '환차손 우려 및 글로벌 안전자산 선호로 외국인 매도세 격화 → 코스피 하방 압력'
        : foreignCapitalFlow.includes('INFLOW')
        ? '환차익 기대감 및 신흥국 자산 매력도 상승으로 외국인 순매수 유입 → 코스피 부양'
        : '외국인 수급 중립, 기업 개별 실적 장세 전개',
      indicator: `외국인 자본 흐름: ${foreignCapitalFlow.replace('_', ' ')}`,
      status: foreignCapitalFlow.includes('INFLOW') ? 'bullish' : foreignCapitalFlow.includes('OUTFLOW') ? 'bearish' : 'neutral'
    },
    {
      step: 5,
      title: '실물 경기 & 최종 자산 배분',
      description: phase === 'EXPANSION'
        ? '호황 국면: 주식과 원자재 비중 확대, 현금 비중 축소 유리'
        : phase === 'RECESSION'
        ? '침체 국면: 고금리 미국 단기채, 달러 현금 및 방어적 금(Gold) 비중 유지'
        : phase === 'RECOVERY'
        ? '회복 국면: 낙폭과대 성장주 및 장기채권 듀레이션 확대 최적기'
        : '둔화 국면: 고배당주 및 단기 현금성 자산 중심 포트폴리오 방어',
      indicator: `경기 사이클: ${phase}`,
      status: phase === 'EXPANSION' || phase === 'RECOVERY' ? 'bullish' : 'bearish'
    }
  ];

  return {
    assetImpacts,
    yieldCurve,
    tenMinusTwoSpread,
    curveShape,
    inversionSeverity,
    dollarIndexEstimate,
    koreanExportCompetitiveness,
    foreignCapitalFlow,
    flowSteps: flowSteps as any
  };
}
