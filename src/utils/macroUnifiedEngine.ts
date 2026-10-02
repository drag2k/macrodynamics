import { 
  RateRegime, 
  FxRegime, 
  RateDirection, 
  FxDirection, 
  RelationshipType, 
  DetailedPhase, 
  CouplingMode, 
  UnifiedMacroState,
  MacroQuadrant,
  LiquidityRegime
} from '../types';

export interface PhaseInfo {
  phase: DetailedPhase;
  title: string;
  shortLabel: string;
  badge: string;
  rateValue: number;
  fxValue: number;
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  description: string;
}

export const DETAILED_PHASES_ORDER: DetailedPhase[] = [
  'HIGH_HOLD',
  'FALLING_HIGH_TO_MID',
  'RISING_MID_TO_HIGH',
  'MID_HOLD',
  'FALLING_MID_TO_LOW',
  'RISING_LOW_TO_MID',
  'LOW_HOLD'
];

export const DETAILED_PHASE_INFO: Record<DetailedPhase, PhaseInfo> = {
  HIGH_HOLD: {
    phase: 'HIGH_HOLD',
    title: '고점 유지 (장기 고착/동결)',
    shortLabel: '고점 유지 ⏸️',
    badge: 'Higher for Longer',
    rateValue: 5.50,
    fxValue: 1430,
    direction: 'NEUTRAL',
    description: '인상된 최고 수준에서 장기간 머물며 누적된 이자 부담으로 한계기업 연체율이 폭증하는 국면'
  },
  FALLING_HIGH_TO_MID: {
    phase: 'FALLING_HIGH_TO_MID',
    title: '고점에서 중간까지 하락 중',
    shortLabel: '고점➔중간 하락 ▼',
    badge: 'Pivot Easing 1',
    rateValue: 4.25,
    fxValue: 1350,
    direction: 'DOWN',
    description: '고점을 지나 연준이 피벗 인하를 시작하고 환율이 1,300원대 중반으로 내려오는 안정 초입 국면'
  },
  RISING_MID_TO_HIGH: {
    phase: 'RISING_MID_TO_HIGH',
    title: '중간에서 고점까지 상승 중',
    shortLabel: '중간➔고점 상승 ▲',
    badge: 'Tightening Accelerate',
    rateValue: 4.75,
    fxValue: 1390,
    direction: 'UP',
    description: '인플레이션 억제를 위해 빅스텝으로 기준금리와 환율이 가파르게 치솟는 긴축 가속 국면'
  },
  MID_HOLD: {
    phase: 'MID_HOLD',
    title: '중간 수준 유지 (중립/평형)',
    shortLabel: '중간 유지 ⏸️',
    badge: 'Neutral Balance',
    rateValue: 3.25,
    fxValue: 1280,
    direction: 'NEUTRAL',
    description: '인플레이션과 디플레이션 사이의 중립금리(3%대)와 1,280원대 박스권에서 숨고르기하는 평형 국면'
  },
  FALLING_MID_TO_LOW: {
    phase: 'FALLING_MID_TO_LOW',
    title: '중간에서 저점까지 하락 중',
    shortLabel: '중간➔저점 하락 ▼',
    badge: 'Stimulus Liquidity',
    rateValue: 1.75,
    fxValue: 1210,
    direction: 'DOWN',
    description: '경기 부양을 위해 기준금리를 초저금리로 빠르게 내리고 원화 강세가 심화되는 유동성 확대 국면'
  },
  RISING_LOW_TO_MID: {
    phase: 'RISING_LOW_TO_MID',
    title: '저점에서 중간까지 상승 중',
    shortLabel: '저점➔중간 상승 ▲',
    badge: 'Normalization Start',
    rateValue: 2.00,
    fxValue: 1230,
    direction: 'UP',
    description: '초저금리 비상체제를 끝내고 경기 회복 신호와 함께 정상화 수순으로 금리와 환율이 고개를 드는 국면'
  },
  LOW_HOLD: {
    phase: 'LOW_HOLD',
    title: '저점 유지 (초저금리/저환율 안정)',
    shortLabel: '저점 유지 ⏸️',
    badge: 'Lower for Longer',
    rateValue: 0.50,
    fxValue: 1140,
    direction: 'NEUTRAL',
    description: '0%대 초저금리와 1,140원대 안정된 환율이 수년간 정착되어 화폐가치 하락과 자산 버블이 팽창하는 국면'
  }
};

// 커플링 연동 계산 헬퍼
export function calculateCoupledFxFromRate(rate: number, mode: CouplingMode): number {
  if (mode === 'INDEPENDENT') return 1300; // 수동
  if (mode === 'COUPLED') {
    // 0.5% ~ 5.5% ➔ 1140원 ~ 1430원 비례 연동
    const ratio = Math.max(0, Math.min(1, (rate - 0.5) / 5.0));
    return Math.round(1140 + ratio * (1430 - 1140));
  }
  // DECOUPLED_INVERSE (위기형 역행: 금리가 낮아질수록 공포로 환율 폭등)
  const invRatio = Math.max(0, Math.min(1, (5.5 - rate) / 5.0));
  return Math.round(1200 + invRatio * (1460 - 1200));
}

export function calculateCoupledRateFromFx(fx: number, mode: CouplingMode): number {
  if (mode === 'INDEPENDENT') return 3.25; // 수동
  if (mode === 'COUPLED') {
    // 1140원 ~ 1430원 ➔ 0.5% ~ 5.5% 비례 연동
    const ratio = Math.max(0, Math.min(1, (fx - 1140) / (1430 - 1140)));
    return parseFloat((0.5 + ratio * 5.0).toFixed(2));
  }
  // DECOUPLED_INVERSE
  const invRatio = Math.max(0, Math.min(1, (fx - 1200) / (1460 - 1200)));
  return parseFloat((5.5 - invRatio * 5.0).toFixed(2));
}

export interface QuadrantInfo {
  quadrant: MacroQuadrant;
  title: string;
  badge: string;
  description: string;
  defaultGrowth: number;
  defaultInflation: number;
  recommendedFedRate: number;
  recommendedLiquidity: number;
  recommendedFx: number;
  color: string;
}

export const MACRO_QUADRANT_INFO: Record<MacroQuadrant, QuadrantInfo> = {
  GOLDILOCKS: {
    quadrant: 'GOLDILOCKS',
    title: '골디락스 (Goldilocks)',
    badge: '성장↑ · 물가안정↓',
    description: '경제가 견고하게 성장하면서도 인플레이션 압력이 낮아, 중앙은행이 긴축하지 않고 기업 이익과 주식 가치가 극대화되는 금융시장의 최고 이상향',
    defaultGrowth: 65,
    defaultInflation: -25,
    recommendedFedRate: 2.75,
    recommendedLiquidity: 8.2,
    recommendedFx: 1210,
    color: 'emerald'
  },
  REFLATION: {
    quadrant: 'REFLATION',
    title: '리플레이션 / 인플레 호황 (Reflation)',
    badge: '성장↑ · 물가상승↑',
    description: '뜨거운 경기 회복과 함께 원자재와 물가가 동반 상승하는 국면. 기업 실적은 좋으나 연준의 긴축(금리 인상) 경계감이 싹트는 단계',
    defaultGrowth: 75,
    defaultInflation: 60,
    recommendedFedRate: 4.50,
    recommendedLiquidity: 7.2,
    recommendedFx: 1330,
    color: 'amber'
  },
  STAGFLATION: {
    quadrant: 'STAGFLATION',
    title: '스태그플레이션 (Stagflation)',
    badge: '성장침체↓ · 고물가↑',
    description: '공급망 충격과 원자재 급등으로 물가는 치솟는데 실물경기는 꺾이는 최악의 국면. 연준이 물가를 잡기 위해 경기 침체를 불사하고 고금리를 유지',
    defaultGrowth: -65,
    defaultInflation: 80,
    recommendedFedRate: 5.50,
    recommendedLiquidity: 6.2,
    recommendedFx: 1440,
    color: 'rose'
  },
  DEFLATION_RECESSION: {
    quadrant: 'DEFLATION_RECESSION',
    title: '경기 침체 / 디플레이션 (Recession)',
    badge: '성장침체↓ · 물가급락↓',
    description: '총수요 절벽과 자산 거품 붕괴로 경기가 급격히 얼어붙는 국면. 중앙은행은 긴급 금리인하와 대규모 양적완화(QE)로 유동성을 퍼부어 구제에 나섬',
    defaultGrowth: -80,
    defaultInflation: -70,
    recommendedFedRate: 0.75,
    recommendedLiquidity: 9.0,
    recommendedFx: 1380,
    color: 'cyan'
  }
};

export function calculateLiquidityMeta(fedRate: number, customLiquidity?: number): {
  liquidityValue: number;
  liquidityRegime: LiquidityRegime;
  liquidityLabel: string;
  liquidityDesc: string;
} {
  const val = customLiquidity ?? parseFloat((9.2 - ((fedRate - 0.25) / 5.75) * 3.2).toFixed(2));
  
  if (val >= 8.5) {
    return {
      liquidityValue: val,
      liquidityRegime: 'MASSIVE_QE',
      liquidityLabel: '대규모 양적완화 (QE 팽창)',
      liquidityDesc: '연준이 국채를 대거 매입해 시중에 돈을 쏟아붓는 유동성 파티 국면으로, 위험자산(주식, 코인) 밸류에이션이 폭발합니다.'
    };
  } else if (val >= 7.8) {
    return {
      liquidityValue: val,
      liquidityRegime: 'MODERATE_EXPANSION',
      liquidityLabel: '온건한 유동성 확대',
      liquidityDesc: '시중 실물 경제와 자산시장에 적정 수준의 자금이 공급되어 유동성 프리미엄이 지지되는 안정적 환경입니다.'
    };
  } else if (val >= 7.2) {
    return {
      liquidityValue: val,
      liquidityRegime: 'NEUTRAL',
      liquidityLabel: '유동성 중립 유지',
      liquidityDesc: '연준 총자산과 M2 통화량이 균형을 이루며, 자산 가격이 유동성 힘보다는 순수 기업 실적에 좌우되는 국면입니다.'
    };
  } else if (val >= 6.5) {
    return {
      liquidityValue: val,
      liquidityRegime: 'MODERATE_QT',
      liquidityLabel: '완만한 양적긴축 (QT 진행)',
      liquidityDesc: '만기 도래 채권 재투자를 축소하며 시중 잉여 유동성을 점진적으로 흡수하는 국면으로, 한계 자산부터 조정이 시작됩니다.'
    };
  } else {
    return {
      liquidityValue: val,
      liquidityRegime: 'AGGRESSIVE_QT',
      liquidityLabel: '강력한 양적긴축 (유동성 가뭄)',
      liquidityDesc: '급격한 대차대조표 축소로 금융시장 자금경색 및 역레포/지급준비금 고갈 위험이 발생해 자산시장 밸류에이션이 압축됩니다.'
    };
  }
}

/**
 * 4분면 점수(-100 ~ +100)를 현실 실물 거시경제 대표 지표 수치로 정밀 환산
 * - 성장성 대표 지표: 실질 GDP 성장률 (Real GDP Growth, 연율 %) & ISM 제조업 PMI (50 기준선)
 * - 물가 대표 지표: 헤드라인 CPI 물가상승률 (YoY %) & 근원 PCE 물가상승률 (YoY %)
 */
export function scoreToMacroFundamentals(growthScore: number, inflationScore: number) {
  // 실질 GDP: -100(역성장 -1.5%) ~ 0(잠재성장률 2.0%) ~ +100(과열성장 5.0%)
  const realGdpGrowth = parseFloat((2.0 + (growthScore / 100) * 2.8).toFixed(1));
  
  // ISM 제조업 PMI: 50.0 기준선. -100(38.0 극심한 위축) ~ +100(62.0 강력한 확장)
  const ismPmi = parseFloat((50.0 + (growthScore / 100) * 11.5).toFixed(1));
  
  // CPI 인플레이션: -100(-0.5% 디플레이션) ~ 0(2.5% 안정) ~ +100(6.8% 고인플레)
  const cpiInflation = parseFloat((2.5 + (inflationScore / 100) * 3.8).toFixed(1));

  // 근원 PCE: 연준 공식 물가목표 2.0% 기준
  const pceCore = parseFloat((2.1 + (inflationScore / 100) * 2.9).toFixed(1));

  return {
    realGdpGrowth,
    ismPmi,
    cpiInflation,
    pceCore
  };
}

/**
 * 테일러 준칙(Taylor Rule)과 유동성 반응함수에 기반한 연속 수학적 전달 연동 함수
 * 성장과 물가의 미세한 연속 변화가 3대 조절 바(금리, 유동성, 환율)로 매끄럽게 전달됨
 */
export function calculateContinuousTransmission(
  growthScore: number, 
  inflationScore: number,
  couplingMode: CouplingMode = 'COUPLED'
) {
  const { realGdpGrowth, cpiInflation } = scoreToMacroFundamentals(growthScore, inflationScore);

  // 1. 미국 기준금리 (Taylor Rule 간소화 보정)
  // Neutral Rate ~ 2.5%, CPI 목표치 2.0%, GDP 잠재성장률 2.0%
  // Rate = Neutral + 0.6*(CPI - 2.0) + 0.35*(GDP - 2.0)
  const rawRate = 2.50 + 0.65 * (cpiInflation - 2.0) + 0.30 * (realGdpGrowth - 2.0);
  // 0.25% ~ 6.00% 클램프 및 0.05% 단위로 매끄럽게 반올림
  const rateValue = parseFloat((Math.max(0.25, Math.min(6.00, Math.round(rawRate * 20) / 20))).toFixed(2));

  // 2. 달러 순유동성 ($T, Fed Net Liquidity)
  // 인플레이션이 높으면 QT 강화(유동성 축소), 성장이 침체면 QE 방출(유동성 확대)
  const rawLiq = 7.50 - (inflationScore / 100) * 1.35 - (growthScore / 100) * 0.55;
  const liquidityValue = parseFloat((Math.max(5.50, Math.min(9.50, Math.round(rawLiq * 20) / 20))).toFixed(2));

  // 3. 원/달러 환율 (USD/KRW)
  let rawFx = 1280;
  if (couplingMode === 'COUPLED') {
    // 스태그플레이션(성장침체 + 물가급등) ➔ 킹달러 및 원화 약세 극대화 (1,430원+)
    // 골디락스(성장확대 + 물가안정) ➔ 글로벌 위험선호 & 원화 강세 (1,200원대)
    // 침체(디플레) ➔ 안전자산 달러 선호로 1,350원 수준 지지
    rawFx = 1280 + (inflationScore * 1.1) - (growthScore * 0.7);
  } else if (couplingMode === 'DECOUPLED_INVERSE') {
    // 디커플링 역행 시나리오
    rawFx = 1280 - (inflationScore * 0.8) + (growthScore * 0.6);
  } else {
    // INDEPENDENT일 경우 기존 추세 유지
    rawFx = 1280 + (inflationScore * 0.9) - (growthScore * 0.5);
  }
  const fxValue = Math.max(1100, Math.min(1500, Math.round(rawFx / 10) * 10));

  return {
    rateValue,
    liquidityValue,
    fxValue
  };
}

export interface PresetScenarioDef {
  id: string;
  category: RelationshipType; // 'NORMAL' (일반 상황) | 'EXCEPTION' (예외 상황)
  title: string;
  badge: string;
  rateRegime: RateRegime;
  fxRegime: FxRegime;
  fedRate: number;
  usdkrw: number;
  summary: string;
}

export const PRESET_SCENARIOS: PresetScenarioDef[] = [
  // --- 일반적 상황 (Normal Correlated Dynamics) ---
  {
    id: 'norm-1',
    category: 'NORMAL',
    title: '금리 인상기 × 환율 상승기 (전형적 긴축 충격)',
    badge: '일반 상황 ①',
    rateRegime: 'HIKE',
    fxRegime: 'RISE',
    fedRate: 5.25,
    usdkrw: 1380,
    summary: '미국 금리 인상 ➔ 달러 강세 ➔ 한미 금리역전 확대로 외국인 자본 유출 및 환율 급등 (정방향 전파)'
  },
  {
    id: 'norm-2',
    category: 'NORMAL',
    title: '고금리 장기 유지 × 고환율 고착화 (Higher for Longer 누적 타격)',
    badge: '일반 상황 ②',
    rateRegime: 'HIGH_HOLD',
    fxRegime: 'HIGH_HOLD',
    fedRate: 5.50,
    usdkrw: 1420,
    summary: '인상된 높은 금리가 장기화되며 한계기업 부도·연체율 폭증, 고환율 장기화로 원자재 수입단가 누적 부담 극대화'
  },
  {
    id: 'norm-3',
    category: 'NORMAL',
    title: '금리 인하기 × 환율 하락기 (통화완화 & 골디락스 랠리)',
    badge: '일반 상황 ③',
    rateRegime: 'CUT',
    fxRegime: 'FALL',
    fedRate: 3.25,
    usdkrw: 1220,
    summary: '연준 피벗(금리 인하) ➔ 달러화 매력 감소 ➔ 원화 강세 전환으로 외국인 신흥국(한국) 주식 순매수 유입'
  },
  {
    id: 'norm-4',
    category: 'NORMAL',
    title: '저금리 장기 유지 × 저환율 안정 (대유동성 자산 팽창기)',
    badge: '일반 상황 ④',
    rateRegime: 'LOW_HOLD',
    fxRegime: 'LOW_HOLD',
    fedRate: 0.75,
    usdkrw: 1140,
    summary: '인하된 초저금리가 수년간 지속되며 풍부한 유동성 정착, 차입 투자(레버리지) 폭발, 부동산·주식 자산 버블'
  },

  // --- 예외적 상황 (Decoupling & Crisis Divergence) ---
  {
    id: 'ex-1',
    category: 'EXCEPTION',
    title: '금리 인상기인데 환율 하락! (한국 독자 호황 & 수출 흑자 폭발)',
    badge: '예외 상황 ①',
    rateRegime: 'HIKE',
    fxRegime: 'FALL',
    fedRate: 5.00,
    usdkrw: 1210,
    summary: '미국이 금리를 올릴 만큼 호황인데, 한국 반도체·자동차 수출이 사상 최대 흑자로 달러가 대거 쏟아져 들어와 원화 강세'
  },
  {
    id: 'ex-2',
    category: 'EXCEPTION',
    title: '금리 인하기인데 환율 급등! (위기형 패닉 컷 & 안전자산 달러 쏠림)',
    badge: '예외 상황 ② (위기형)',
    rateRegime: 'CUT',
    fxRegime: 'RISE',
    fedRate: 1.50,
    usdkrw: 1450,
    summary: '2008 금융위기나 2020 코로나처럼 연준이 비상 금리인하를 하지만, 시장 공포로 안전자산 달러를 사재기해 환율 폭등'
  },
  {
    id: 'ex-3',
    category: 'EXCEPTION',
    title: '고금리 장기 유지인데 환율 안정 (외환 스왑 & 무역흑자 방어)',
    badge: '예외 상황 ③',
    rateRegime: 'HIGH_HOLD',
    fxRegime: 'LOW_HOLD',
    fedRate: 5.25,
    usdkrw: 1240,
    summary: '미국의 높은 금리가 지속되나 한미 통화스왑 체결 및 경상수지 흑자 확대로 원화가 이례적으로 안정세를 유지'
  },
  {
    id: 'ex-4',
    category: 'EXCEPTION',
    title: '저금리 장기 유지인데 환율 급등! (스태그플레이션 & 화폐신용 위기)',
    badge: '예외 상황 ④ (불안형)',
    rateRegime: 'LOW_HOLD',
    fxRegime: 'HIGH_HOLD',
    fedRate: 1.25,
    usdkrw: 1460,
    summary: '경기가 침체되어 금리를 올리지 못하고 저금리를 유지하나, 재정적자와 인플레로 원화 신인도가 추락하여 고환율 고착'
  }
];

export function getUnifiedMacroData(
  rateRegime: RateRegime,
  fxRegime: FxRegime,
  customFedRate?: number,
  customUsdkrw?: number,
  customRatePhase?: DetailedPhase,
  customFxPhase?: DetailedPhase,
  customCouplingMode?: CouplingMode,
  customLiquidity?: number,
  customGrowthScore?: number,
  customInflationScore?: number
): UnifiedMacroState {
  const isRateHike = rateRegime === 'HIKE';
  const isRateHighHold = rateRegime === 'HIGH_HOLD';
  const isRateCut = rateRegime === 'CUT';
  const isRateLowHold = rateRegime === 'LOW_HOLD';

  const isFxRise = fxRegime === 'RISE';
  const isFxHighHold = fxRegime === 'HIGH_HOLD';
  const isFxFall = fxRegime === 'FALL';
  const isFxLowHold = fxRegime === 'LOW_HOLD';

  // Derived legacy directions
  const rateDirection: RateDirection = (isRateHike || isRateHighHold) ? 'HIKE' : 'CUT';
  const fxDirection: FxDirection = (isFxRise || isFxHighHold) ? 'RISE' : 'FALL';

  // Default rate & fx values based on regime if not supplied
  const fedRateValue = customFedRate ?? (
    isRateHike ? 5.25 :
    isRateHighHold ? 5.50 :
    isRateCut ? 3.25 : 0.75
  );

  const usdkrwValue = customUsdkrw ?? (
    isFxRise ? 1380 :
    isFxHighHold ? 1420 :
    isFxFall ? 1220 : 1150
  );

  // Derived Detailed Phases
  const rateDetailedPhase: DetailedPhase = customRatePhase ?? (
    isRateHighHold ? 'HIGH_HOLD' :
    isRateHike ? 'RISING_MID_TO_HIGH' :
    isRateLowHold ? 'LOW_HOLD' : 'FALLING_HIGH_TO_MID'
  );

  const fxDetailedPhase: DetailedPhase = customFxPhase ?? (
    isFxHighHold ? 'HIGH_HOLD' :
    isFxRise ? 'RISING_MID_TO_HIGH' :
    isFxLowHold ? 'LOW_HOLD' : 'FALLING_HIGH_TO_MID'
  );

  const couplingMode: CouplingMode = customCouplingMode ?? 'COUPLED';

  // Calculate Dollar Liquidity & M2 Meta
  const { liquidityValue, liquidityRegime, liquidityLabel, liquidityDesc } = 
    calculateLiquidityMeta(fedRateValue, customLiquidity);

  // Calculate Macro 4-Quadrant Scores
  let growthScore = customGrowthScore;
  let inflationScore = customInflationScore;

  if (growthScore === undefined || inflationScore === undefined) {
    // Derive from rate & fx & coupling regime
    if (fedRateValue <= 2.0 && usdkrwValue >= 1400) {
      // 위기형 역행 (패닉컷 & 달러쏠림) -> 침체 & 불황
      growthScore = -75;
      inflationScore = 15;
    } else if (fedRateValue <= 2.5 && usdkrwValue < 1250) {
      // 초저금리 & 원화강세 -> 디플레/침체 탈출용 양적완화 국면
      growthScore = -30;
      inflationScore = -50;
    } else if (fedRateValue >= 4.5 && usdkrwValue >= 1380) {
      // 고금리 & 고환율 -> 스태그플레이션/긴축 충격
      growthScore = -60;
      inflationScore = 75;
    } else if (fedRateValue >= 4.0 && usdkrwValue < 1300) {
      // 고금리이나 환율 안정 -> 경기 호황형 리플레이션
      growthScore = 70;
      inflationScore = 65;
    } else if (fedRateValue >= 2.5 && fedRateValue <= 3.75 && usdkrwValue <= 1260) {
      // 골디락스 (적정금리, 안정된 환율)
      growthScore = 65;
      inflationScore = -15;
    } else {
      // 기본 중립/평형
      growthScore = Math.round(20 - (fedRateValue - 3.0) * 15);
      inflationScore = Math.round((fedRateValue - 2.5) * 20);
    }
  }

  // Determine Quadrant
  let macroQuadrant: MacroQuadrant;
  if (growthScore >= 0 && inflationScore <= 20) {
    macroQuadrant = 'GOLDILOCKS';
  } else if (growthScore >= 0 && inflationScore > 20) {
    macroQuadrant = 'REFLATION';
  } else if (growthScore < 0 && inflationScore > 0) {
    macroQuadrant = 'STAGFLATION';
  } else {
    macroQuadrant = 'DEFLATION_RECESSION';
  }

  const quadInfo = MACRO_QUADRANT_INFO[macroQuadrant];

  const rawState = calculateInternalMacroData(
    rateRegime,
    fxRegime,
    rateDirection,
    fxDirection,
    fedRateValue,
    usdkrwValue
  );

  return {
    ...rawState,
    rateDetailedPhase,
    fxDetailedPhase,
    couplingMode,
    macroQuadrant,
    growthScore,
    inflationScore,
    quadrantTitle: quadInfo.title,
    quadrantBadge: quadInfo.badge,
    quadrantDesc: quadInfo.description,
    liquidityValue,
    liquidityRegime,
    liquidityLabel,
    liquidityDesc
  };
}

type RawMacroData = Omit<
  UnifiedMacroState,
  | 'rateDetailedPhase'
  | 'fxDetailedPhase'
  | 'couplingMode'
  | 'macroQuadrant'
  | 'growthScore'
  | 'inflationScore'
  | 'quadrantTitle'
  | 'quadrantBadge'
  | 'quadrantDesc'
  | 'liquidityValue'
  | 'liquidityRegime'
  | 'liquidityLabel'
  | 'liquidityDesc'
>;

function calculateInternalMacroData(
  rateRegime: RateRegime,
  fxRegime: FxRegime,
  rateDirection: RateDirection,
  fxDirection: FxDirection,
  fedRateValue: number,
  usdkrwValue: number
): RawMacroData {
  const isRateHike = rateRegime === 'HIKE';
  const isRateHighHold = rateRegime === 'HIGH_HOLD';
  const isRateCut = rateRegime === 'CUT';
  const isRateLowHold = rateRegime === 'LOW_HOLD';

  const isFxRise = fxRegime === 'RISE';
  const isFxHighHold = fxRegime === 'HIGH_HOLD';
  const isFxFall = fxRegime === 'FALL';
  const isFxLowHold = fxRegime === 'LOW_HOLD';

  // Determine if it is NORMAL (일반 동행) or EXCEPTION (예외 비동조화)
  // 일반적 상황: (고금리계열 & 고환율계열) OR (저금리계열 & 저환율계열)
  const isHighRate = isRateHike || isRateHighHold;
  const isHighFx = isFxRise || isFxHighHold;

  const isNormal = (isHighRate && isHighFx) || (!isHighRate && !isHighFx);
  const relationshipType: RelationshipType = isNormal ? 'NORMAL' : 'EXCEPTION';

  // Specific Deep-Dive Scenarios
  // 1. [일반 1] 금리 인상기(HIKE) + 환율 상승기(RISE)
  if (isRateHike && isFxRise) {
    return {
      rateRegime,
      fxRegime,
      rateDirection,
      fxDirection,
      relationshipType: 'NORMAL',
      relationshipReason:
        '일반적 정방향 상관관계: 미국 금리가 오르면 글로벌 달러화 가치가 상승하고, 한미 금리역전 확대로 자본이 미국으로 이동하면서 원/달러 환율이 상승(원화 약세)합니다.',
      fedRateValue,
      usdkrwValue,
      scenarioName: '전형적 긴축 충격 & 강달러 압박 국면',
      scenarioTag: '일반적 동행 상황 ① · 긴축 착수기',
      scenarioDescription:
        '연준의 금리 인상이 본격화되며 전 세계 달러 유동성이 회수되고, 한미 금리차 역전으로 한국 시장에서 외국인 자본 유출과 원화 약세가 동시에 발생하는 교과서적인 긴축 국면입니다.',
      coreRule: '금리 인상 ▲ + 환율 상승 ▲ ➔ 주식·코인 자산 하락, 채권가격 폭락, 원자재 수입단가 급등 및 KOSPI 외인 순매도',
      pipelineSteps: [
        { step: 1, title: '미국 연준', value: '기준금리 인상 ▲', sub: `현재 ${fedRateValue.toFixed(2)}% 인상 중`, direction: 'UP', color: 'rose' },
        { step: 2, title: '외환 시장', value: '원/달러 환율 급등 ▲', sub: `₩${usdkrwValue} (원화 약세)`, direction: 'UP', color: 'rose' },
        { step: 3, title: '채권 시장', value: '채권 가격 폭락 ▼', sub: '시장금리 급등으로 구채권 평가손실', direction: 'DOWN', color: 'rose' },
        { step: 4, title: '주식/원자재', value: '자산 가격 전반 조정 ▼', sub: '유동성 축소 + 할인율 상승', direction: 'DOWN', color: 'rose' },
        { step: 5, title: '실물 경기', value: '경기 둔화 & 수입인플레', sub: '무역수지 적자 압력 및 소비 위축', direction: 'DOWN', color: 'amber' },
      ],
      assets: [
        { id: 'sp500', name: '미국 주식 (S&P 500 / 나스닥)', nameKr: '미국 주식', category: 'EQUITY', direction: 'DOWN', score: -68, badge: '하락 압력', summary: '금리 인상으로 미래 현금흐름 할인율 상승 및 대출비용 증가로 기술성장주 조정', mechanism: '금리 상승 ➔ 무위험 채권 금리 매력 부각 ➔ 고평가 주식 밸류에이션 하락' },
        { id: 'kospi', name: '한국 주식 (KOSPI 대형주)', nameKr: '한국 주식', category: 'EQUITY', direction: 'DOWN', score: -82, badge: '외인 대량 매도', summary: '환율 상승(원화 약세)에 따른 환차손 회피 외국인의 순매도 공세 집중', mechanism: '원달러 환율 급등 ➔ 외국인 원화 환산 손실 ➔ KOSPI 대형주 매각 및 달러 환전' },
        { id: 'oil', name: '국제 원유 (WTI 원자재)', nameKr: '국제 원유', category: 'COMMODITY', direction: 'DOWN', score: -45, badge: '수요 둔화 우려', summary: '달러화 강세로 비달러 국가의 원유 구매력 감소 + 글로벌 긴축에 따른 경기 둔화 우려', mechanism: '강달러 현상 ➔ 달러 표시 원자재 가격 상대적 상승 ➔ 실질 원유 수요 위축' },
        { id: 'gold', name: '금 (Gold 안전자산)', nameKr: '금 (골드)', category: 'COMMODITY', direction: 'NEUTRAL', score: -15, badge: '호악재 상충 (혼조)', summary: '고금리는 이자 없는 금에 악재이나, 환율 급등 및 위기 불안감이 하방을 지지', mechanism: '실질금리 상승(하방 압력) vs 긴축 충격 헷지 수요(상방 압력) 팽팽' },
        { id: 'realestate', name: '부동산 / 실물자산', nameKr: '부동산', category: 'REAL_ESTATE', direction: 'DOWN', score: -75, badge: '거래 빙하기', summary: '주택담보대출 금리 급등으로 이자 상환 부담 가중 및 영끌 매수 심리 위축', mechanism: '금리 인상 ➔ 대출이자율 6~7% 진입 ➔ 매수세 증발 및 가격 하락' }
      ],
      bond: {
        marketRateDirection: 'UP',
        bondPriceDirection: 'DOWN',
        seesawAngle: 12,
        yield10Y: fedRateValue + 0.35,
        yield2Y: fedRateValue + 0.55,
        spread: -0.20,
        newInvestorNote: '신규 매수자: 새로 발행되는 채권의 확정 고이율(Yield)을 누릴 수 있어 매수 진입 시점 타진',
        existingHolderNote: '기존 보유자: 이미 보유한 저금리 채권의 시장 거래가격(Price)이 급락하여 큰 평가손실(자본손실) 발생'
      },
      indicators: [
        { id: 'foreign_flow', title: '외국인 증권 자본 유출입', titleKr: '외국인 수급', status: 'NEGATIVE', direction: 'DOWN', valueText: '대규모 순매도 (자본 유출)', explanation: '원화 약세로 달러 환산 손실 위험이 커져 국내 주식 및 채권 순매도 지속' },
        { id: 'trade_balance', title: '무역수지 및 수입물가', titleKr: '수입물가 & 무역', status: 'WARNING', direction: 'DOWN', valueText: '수입 원가 폭증 (적자 압력)', explanation: '환율 상승으로 원유·천연가스 수입단가가 치솟아 무역수지 악화 및 물가 상승 유발' },
        { id: 'economic_growth', title: '경기 국면 및 경제성장', titleKr: '경기 사이클', status: 'NEGATIVE', direction: 'DOWN', valueText: '경기 둔화 (하방 압력)', explanation: '기업의 조달금리 상승으로 설비투자 축소, 가계는 이자 부담으로 소비 위축' },
        { id: 'credit_risk', title: '가계 및 기업 신용위험 (연체율)', titleKr: '부실 신용위험', status: 'NEGATIVE', direction: 'UP', valueText: '연체율 상승 경보', explanation: '금리 인상으로 취약차주 및 한계기업의 이자 부담 급증' }
      ]
    };
  }

  // 2. [일반 2 - 신규 요구사항] 인상된 상태에서의 고금리 장기 유지(HIGH_HOLD) + 고환율 고착화(HIGH_HOLD)
  if (isRateHighHold && isFxHighHold) {
    return {
      rateRegime,
      fxRegime,
      rateDirection,
      fxDirection,
      relationshipType: 'NORMAL',
      relationshipReason:
        '일반적 장기 고착 국면: 높은 금리와 높은 환율이 오랜 기간 내려오지 않고 유지되면, 경제의 취약한 고리(부동산PF, 한계기업, 다중채무자)부터 본격 부도가 가시화됩니다.',
      fedRateValue,
      usdkrwValue,
      scenarioName: '고금리 장기 동결 & 고환율 고착화 국면 (Higher for Longer)',
      scenarioTag: '일반적 동행 상황 ② · 누적 피로도 폭발기',
      scenarioDescription:
        '금리를 추가로 올리지 않더라도, 5.5%대 고금리와 1,400원대 고환율이 장기화되면서 기업들의 이자 보상 배율이 무너지고 부동산 PF 및 가계 연체율이 급증하는 누적 한계 국면입니다.',
      coreRule: '고금리 동결 ⏸️ + 고환율 고착 ⏸️ ➔ 채권가격 바닥 정체, 한계기업 부도 폭증, 수입물가 누적 압박, 양극화 장세',
      pipelineSteps: [
        { step: 1, title: '미국 연준', value: '고금리 장기 동결 ⏸️', sub: `5%대 고금리 유지 (${fedRateValue.toFixed(2)}%)`, direction: 'NEUTRAL', color: 'rose' },
        { step: 2, title: '외환 시장', value: '고환율 장기 고착 ⏸️', sub: `₩${usdkrwValue} 박스권 고착`, direction: 'NEUTRAL', color: 'rose' },
        { step: 3, title: '채권 시장', value: '채권 가격 바닥권 횡보', sub: '추가 폭락은 멈추나 고금리 장기화 피로', direction: 'NEUTRAL', color: 'amber' },
        { step: 4, title: '주식/원자재', value: '실적별 극단적 양극화', sub: '현금 부자 빅테크 vs 부채 과다 기업 퇴출', direction: 'DOWN', color: 'rose' },
        { step: 5, title: '실물 경기', value: '연체율 폭증 & 신용경색', sub: '부동산 PF 부실, 한계 자영업자 한계 도달', direction: 'DOWN', color: 'rose' },
      ],
      assets: [
        { id: 'sp500', name: '미국 주식 (S&P 500 / 나스닥)', nameKr: '미국 주식', category: 'EQUITY', direction: 'NEUTRAL', score: -20, badge: '현금 부자 차별화', summary: '금리 동결로 지수 급락은 진정되나, 자금력 있는 메가캡 빅테크만 생존하는 차별화 장세', mechanism: '고금리 장기화 ➔ 현금 보유 대기업 이자수익 증가 vs 중소기업 재융자 절벽' },
        { id: 'kospi', name: '한국 주식 (KOSPI 대형주)', nameKr: '한국 주식', category: 'EQUITY', direction: 'DOWN', score: -60, badge: '수익성 침식', summary: '1,400원대 고환율 고착으로 원자재 도입 비용 상승 누적, 내수 기업 실적 악화', mechanism: '고환율 장기화 ➔ 수입원가 부담 누적 ➔ 제조업 영업이익률 하락' },
        { id: 'oil', name: '국제 원유 (WTI 원자재)', nameKr: '국제 원유', category: 'COMMODITY', direction: 'DOWN', score: -35, badge: '수요 피로감', summary: '고금리 지속에 따른 글로벌 제조업 가동률 저하로 원유 수요 둔화 지속', mechanism: '고금리 유지 ➔ 경기 모멘텀 약화 ➔ 에너지 소비 둔화' },
        { id: 'gold', name: '금 (Gold 안전자산)', nameKr: '금 (골드)', category: 'COMMODITY', direction: 'UP', score: 50, badge: '헤지 수요 증가', summary: '고금리에도 불구하고 금융 시스템 신용 불안(부도 증가) 우려로 중앙은행 금 매입 증가', mechanism: '신용 위험 누적 ➔ 시스템 리스크 헤지 수단으로 금 비축량 확대' },
        { id: 'realestate', name: '부동산 / 실물자산', nameKr: '부동산', category: 'REAL_ESTATE', direction: 'DOWN', score: -90, badge: 'PF 부실 폭탄', summary: '버티던 차주들의 한계 도달로 경매 물건 급증 및 부동산 PF 대출 만기 연장 한계', mechanism: '고금리 유지 ➔ 이자 상환 누적 한계 ➔ 부실 매물 쏟아짐 및 가격 하락' }
      ],
      bond: {
        marketRateDirection: 'NEUTRAL',
        bondPriceDirection: 'NEUTRAL',
        seesawAngle: 10,
        yield10Y: fedRateValue + 0.10,
        yield2Y: fedRateValue + 0.25,
        spread: -0.15,
        newInvestorNote: '신규 매수자: 높은 확정금리를 장기간 받으며 향후 금리 인하 시의 자본차익을 노리고 만기 채권 매집',
        existingHolderNote: '기존 보유자: 채권 가격 추가 하락은 멈추었으나 자본 손실 상태가 지속되어 회복 대기'
      },
      indicators: [
        { id: 'foreign_flow', title: '외국인 증권 자본 유출입', titleKr: '외국인 수급', status: 'WARNING', direction: 'NEUTRAL', valueText: '순매수 정체 및 눈치보기', explanation: '환율이 높게 고착되어 적극적 매수가 제한되며 환율 변곡점 대기' },
        { id: 'trade_balance', title: '무역수지 및 수입물가', titleKr: '수입물가 & 무역', status: 'NEGATIVE', direction: 'DOWN', valueText: '수입물가 누적 부담 심화', explanation: '고환율이 장기화되면서 수입원자재 누적 원가 부담으로 무역수지 개선 지연' },
        { id: 'economic_growth', title: '경기 국면 및 경제성장', titleKr: '경기 사이클', status: 'NEGATIVE', direction: 'DOWN', valueText: '저성장 늪 (L자형 정체)', explanation: '고금리 장기화로 가계 실질소득 감소, 내수 소비 극심한 부진' },
        { id: 'credit_risk', title: '가계 및 기업 신용위험 (연체율)', titleKr: '부실 신용위험', status: 'NEGATIVE', direction: 'UP', valueText: '연체율·부도율 최고치 경보', explanation: '버티던 한계기업과 자영업자가 고금리를 감당하지 못하고 파산 신청 급증' }
      ]
    };
  }

  // 3. [일반 3] 금리 인하기(CUT) + 환율 하락기(FALL)
  if (isRateCut && isFxFall) {
    return {
      rateRegime,
      fxRegime,
      rateDirection,
      fxDirection,
      relationshipType: 'NORMAL',
      relationshipReason:
        '일반적 완화 동행: 미국 연준이 금리를 인하하면 기축통화 달러의 매력이 줄어 달러 약세가 진행되고, 원/달러 환율이 하락(원화 강세)하며 글로벌 유동성이 신흥국으로 유입됩니다.',
      fedRateValue,
      usdkrwValue,
      scenarioName: '대유동성 완화 & 골디락스 랠리 국면',
      scenarioTag: '일반적 동행 상황 ③ · 피벗 전환기',
      scenarioDescription:
        '연준의 금리 인하로 시중에 유동성이 공급되고 달러화 약세로 원/달러 환율이 하락(원화 강세)하며, 외국인의 대규모 한국 증시 순매수와 채권 가격 급등이 동반되는 골디락스 랠리입니다.',
      coreRule: '금리 인하 ▼ + 환율 하락 ▼ ➔ 채권가격 폭등, 주가·원자재 대세 상승, 외국인 KOSPI 공격적 순매수',
      pipelineSteps: [
        { step: 1, title: '미국 연준', value: '기준금리 인하 ▼', sub: `피벗 단행 (${fedRateValue.toFixed(2)}%)`, direction: 'DOWN', color: 'cyan' },
        { step: 2, title: '외환 시장', value: '원/달러 환율 급락 ▼', sub: `₩${usdkrwValue} (원화 강세 전환)`, direction: 'DOWN', color: 'emerald' },
        { step: 3, title: '채권 시장', value: '채권 가격 폭등 ▲', sub: '금리 하락으로 기존 고이율 채권 프리미엄', direction: 'UP', color: 'cyan' },
        { step: 4, title: '주식/원자재', value: '전 자산군 대세 랠리 ▲', sub: '유동성 팽창 + 할인율 급락', direction: 'UP', color: 'emerald' },
        { step: 5, title: '실물 경기', value: '투자·소비 부양 활성화', sub: '대출금리 하락으로 자금 순환 촉진', direction: 'UP', color: 'emerald' },
      ],
      assets: [
        { id: 'sp500', name: '미국 주식 (S&P 500 / 나스닥)', nameKr: '미국 주식', category: 'EQUITY', direction: 'UP', score: 88, badge: '대세 상승 (불마켓)', summary: '저금리로 기업 할인율이 떨어져 밸류에이션 리레이팅 + 시중 유동성 증시 유입', mechanism: '금리 인하 ➔ 주식 기대수익률 매력 부각 ➔ 기술성장주 중심 폭발적 매수세' },
        { id: 'kospi', name: '한국 주식 (KOSPI 대형주)', nameKr: '한국 주식', category: 'EQUITY', direction: 'UP', score: 92, badge: '외인 쌍끌이 매수', summary: '환율 하락에 따른 환차익 메리트 + 글로벌 신흥국 자금 유입으로 KOSPI 급등', mechanism: '달러 약세 ➔ 글로벌 펀드 신흥국 리밸런싱 ➔ KOSPI 대형주 집중 매수' },
        { id: 'oil', name: '국제 원유 (WTI 원자재)', nameKr: '국제 원유', category: 'COMMODITY', direction: 'UP', score: 60, badge: '달러 약세 수혜', summary: '달러 가치 하락으로 달러 표시 원자재 가격 상승 및 유동성 투기 수요 유입', mechanism: '기축통화 달러 가치 하락 ➔ 실물 원자재 헷지 수요 증가 ➔ 원자재 상승' },
        { id: 'gold', name: '금 (Gold 안전자산)', nameKr: '금 (골드)', category: 'COMMODITY', direction: 'UP', score: 85, badge: '신고가 랠리', summary: '실질금리 하락 + 달러 약세의 최대 수혜 자산으로 역사적 고점 돌파', mechanism: '명목금리 인하 ➔ 금 보유 기회비용 제로화 ➔ 금 가격 급등' },
        { id: 'realestate', name: '부동산 / 실물자산', nameKr: '부동산', category: 'REAL_ESTATE', direction: 'UP', score: 75, badge: '자산 인플레이션', summary: '주택담보대출 금리 하락으로 레버리지 투자 부활 및 거래량 회복', mechanism: '저금리 대출 ➔ 유동성 부동산 유입 ➔ 거래량 폭증 및 가격 상승' }
      ],
      bond: {
        marketRateDirection: 'DOWN',
        bondPriceDirection: 'UP',
        seesawAngle: -12,
        yield10Y: fedRateValue + 0.80,
        yield2Y: fedRateValue + 0.10,
        spread: 0.70,
        newInvestorNote: '신규 매수자: 신규 발행 채권 금리가 너무 낮아져 이자 매력 감소 (만기보유 메리트 축소)',
        existingHolderNote: '기존 보유자: 과거 고금리 시절 매수한 채권의 매매가격(Price)이 치솟아 막대한 자본 차익 실현'
      },
      indicators: [
        { id: 'foreign_flow', title: '외국인 증권 자본 유출입', titleKr: '외국인 수급', status: 'POSITIVE', direction: 'UP', valueText: '역대급 자금 순유입', explanation: '달러 약세로 인해 한국 등 신흥국 주식/채권 시장으로 글로벌 펀드 자금 대규모 배분' },
        { id: 'trade_balance', title: '무역수지 및 수입물가', titleKr: '수입물가 & 무역', status: 'POSITIVE', direction: 'UP', valueText: '수입물가 안정 & 소비 진작', explanation: '원화 가치 상승으로 에너지·곡물 수입단가가 낮아져 기업 제조원가 절감 및 가계 가처분소득 증가' },
        { id: 'economic_growth', title: '경기 국면 및 경제성장', titleKr: '경기 사이클', status: 'POSITIVE', direction: 'UP', valueText: '경기 부양 및 재확장', explanation: '낮아진 자금 조달비용으로 기업 신규 R&D 투자 확대, 가계 소비 심리 활성화' },
        { id: 'credit_risk', title: '가계 및 기업 신용위험 (연체율)', titleKr: '부실 신용위험', status: 'POSITIVE', direction: 'DOWN', valueText: '신용 위험 급감 (안정권)', explanation: '대출금리 하락으로 채무자들의 이자 상환 부담이 극적으로 경감되어 연체율 급락' }
      ]
    };
  }

  // 4. [일반 4 - 신규 요구사항] 인하된 상태에서의 저금리 장기 유지(LOW_HOLD) + 저환율 안정(LOW_HOLD)
  if (isRateLowHold && isFxLowHold) {
    return {
      rateRegime,
      fxRegime,
      rateDirection,
      fxDirection,
      relationshipType: 'NORMAL',
      relationshipReason:
        '일반적 장기 완화 국면: 제로금리 및 초저금리와 안정된 원화가 수년간 유지되면, 화폐가치 하락과 자산 인플레이션(버블)이 최고조에 달합니다.',
      fedRateValue,
      usdkrwValue,
      scenarioName: '초저금리 장기 동결 & 저환율 안정 국면 (Lower for Longer)',
      scenarioTag: '일반적 동행 상황 ④ · 자산 버블 팽창기',
      scenarioDescription:
        '2020~2021년 코로나 직후처럼 0%대 초저금리와 1,150원대 안정된 환율이 고착되며 돈의 가치가 떨어지고, 빚을 내어 주식·부동산·코인을 사들이는 자산 버블 극대화 국면입니다.',
      coreRule: '저금리 동결 ⏸️ + 저환율 안정 ⏸️ ➔ 채권수익률 극저조, 부동산·주식 초강세, 화폐가치 희석 및 과열 우려',
      pipelineSteps: [
        { step: 1, title: '미국 연준', value: '초저금리 장기 동결 ⏸️', sub: `0%대 초저금리 유지 (${fedRateValue.toFixed(2)}%)`, direction: 'NEUTRAL', color: 'cyan' },
        { step: 2, title: '외환 시장', value: '저환율 안정 박스권 ⏸️', sub: `₩${usdkrwValue} (원화 강세 유지)`, direction: 'NEUTRAL', color: 'emerald' },
        { step: 3, title: '채권 시장', value: '채권 가격 천장권 형성', sub: '추가 금리 하락 여력 제한으로 가격 고점권', direction: 'NEUTRAL', color: 'slate' },
        { step: 4, title: '주식/원자재', value: '유동성 거품 & 밸류 과열', sub: '실적 무관한 유동성 파티, 투기 심리 과열', direction: 'UP', color: 'emerald' },
        { step: 5, title: '실물 경기', value: '자산 격차 심화 & 과열', sub: '가계부채 폭증, 실물 대비 자산가격 급등', direction: 'UP', color: 'amber' },
      ],
      assets: [
        { id: 'sp500', name: '미국 주식 (S&P 500 / 나스닥)', nameKr: '미국 주식', category: 'EQUITY', direction: 'UP', score: 95, badge: '유동성 버블 과열', summary: '돈을 은행에 둘 이유가 없어 모든 시중 자금이 증시로 몰려 PER 40~50배 과열', mechanism: '초저금리 장기화 ➔ 현금 보유 페널티 ➔ 위험자산 맹목적 매수' },
        { id: 'kospi', name: '한국 주식 (KOSPI 대형주)', nameKr: '한국 주식', category: 'EQUITY', direction: 'UP', score: 85, badge: '동학개미 + 외인 매수', summary: '가계의 주식 투자 열풍과 외국인 유입이 결합되어 역사적 고점 돌파 시도', mechanism: '저금리 예금 탈출 ➔ 주식 시장 예탁금 사상 최고치 경신' },
        { id: 'oil', name: '국제 원유 (WTI 원자재)', nameKr: '국제 원유', category: 'COMMODITY', direction: 'UP', score: 70, badge: '투기 유동성 유입', summary: '원자재 펀드로의 자금 유입과 글로벌 경기 회복세가 맞물려 강세', mechanism: '풍부한 유동성 ➔ 상품 시장 투기적 롱 포지션 확대' },
        { id: 'gold', name: '금 (Gold 안전자산)', nameKr: '금 (골드)', category: 'COMMODITY', direction: 'UP', score: 75, badge: '화폐가치 희석 헤지', summary: '돈이 너무 많이 풀려 화폐 가치가 떨어지므로 실물 가치 보존 수단으로 부각', mechanism: '통화량 M2 폭증 ➔ 화폐 구매력 하락 ➔ 대체 자산 금 매수' },
        { id: 'realestate', name: '부동산 / 실물자산', nameKr: '부동산', category: 'REAL_ESTATE', direction: 'UP', score: 98, badge: '부동산 불패 랠리', summary: '영끌 대출을 통한 아파트 매수 광풍, 전세가·매매가 동반 급등', mechanism: '초저금리 대출 ➔ 매수 레버리지 극대화 ➔ 주택 공급 부족 및 패닉 바잉' }
      ],
      bond: {
        marketRateDirection: 'NEUTRAL',
        bondPriceDirection: 'NEUTRAL',
        seesawAngle: -8,
        yield10Y: fedRateValue + 1.20,
        yield2Y: fedRateValue + 0.30,
        spread: 0.90,
        newInvestorNote: '신규 매수자: 채권 금리가 1%대로 너무 낮아 예금보다 못하며, 향후 금리가 오르면 가격 폭락 위험이 커져 매력 최악',
        existingHolderNote: '기존 보유자: 채권 가격이 역사적 최고점에 도달했으므로 차익을 실현하고 주식/부동산으로 갈아타는 국면'
      },
      indicators: [
        { id: 'foreign_flow', title: '외국인 증권 자본 유출입', titleKr: '외국인 수급', status: 'POSITIVE', direction: 'UP', valueText: '꾸준한 신흥국 분산 유입', explanation: '선진국 저금리로 인해 수익률을 찾아 한국 등 신흥국 주식과 배당주로 유입' },
        { id: 'trade_balance', title: '무역수지 및 수입물가', titleKr: '수입물가 & 무역', status: 'POSITIVE', direction: 'UP', valueText: '수입물가 안정 & 내수 호황', explanation: '원화 강세로 수입 물가가 안정되며 백화점, 레저, 수입차 등 민간 소비 급증' },
        { id: 'economic_growth', title: '경기 국면 및 경제성장', titleKr: '경기 사이클', status: 'POSITIVE', direction: 'UP', valueText: '경기 확장 (자산효과)', explanation: '집값과 주가 상승에 따른 부의 효과(Wealth Effect)로 가계 씀씀이 확대' },
        { id: 'credit_risk', title: '가계 및 기업 신용위험 (연체율)', titleKr: '부실 신용위험', status: 'WARNING', direction: 'UP', valueText: '가계부채 과다 누적 위험', explanation: '당장의 연체율은 낮으나, GDP 대비 가계부채 비율이 100%를 초과하여 잠재적 뇌관 형성' }
      ]
    };
  }

  // 5. [예외 1] 금리 인상기(HIKE)인데 환율 하락(FALL)! (한국 독자 펀더멘털 & 수출 흑자)
  if (isRateHike && isFxFall) {
    return {
      rateRegime,
      fxRegime,
      rateDirection,
      fxDirection,
      relationshipType: 'EXCEPTION',
      relationshipReason:
        '예외적 디커플링(역행): 미국이 금리를 올릴 정도로 글로벌 경기가 호황인데, 한국의 주력 수출품(반도체, 자동차 등)이 사상 최대 흑자를 내며 막대한 달러가 국내로 유입되어 원화가 독자적으로 강세(환율 하락)를 보이는 특수 국면입니다.',
      fedRateValue,
      usdkrwValue,
      scenarioName: '호황형 긴축 & 원화 독자 강세 국면 (실적 장세)',
      scenarioTag: '예외적 비동조화 ① · 펀더멘털 독자 호황',
      scenarioDescription:
        '미국의 고금리 긴축 악재보다 한국의 반도체 수출 대호황과 경상수지 흑자가 더 강력하게 작용하여, 달러 유입으로 원화가 강세를 보이고 주식 시장이 실적으로 상승하는 이례적 선방 국면입니다.',
      coreRule: '금리 인상 ▲ + 환율 하락 ▼ ➔ 채권가격 하락하나, 실적 탄탄한 KOSPI·미국주식 및 원자재는 호황 기반 선방',
      pipelineSteps: [
        { step: 1, title: '미국 연준', value: '경기 호황 속 금리 인상 ▲', sub: `성장률 호조 (${fedRateValue.toFixed(2)}%)`, direction: 'UP', color: 'emerald' },
        { step: 2, title: '외환 시장', value: '환율 이례적 하락 ▼', sub: `수출 달러 대거 유입 (₩${usdkrwValue})`, direction: 'DOWN', color: 'emerald' },
        { step: 3, title: '채권 시장', value: '채권 가격 하락 ▼', sub: '유통금리 상승으로 가격 약세', direction: 'DOWN', color: 'amber' },
        { step: 4, title: '주식/원자재', value: '수출주 중심 실적 장세 ▲', sub: '외국인 대규모 KOSPI 순매수', direction: 'UP', color: 'emerald' },
        { step: 5, title: '실물 경기', value: '수출 흑자 & 견고한 성장', sub: '수입물가 안정 & 무역 대호황', direction: 'UP', color: 'emerald' },
      ],
      assets: [
        { id: 'sp500', name: '미국 주식 (S&P 500 / 나스닥)', nameKr: '미국 주식', category: 'EQUITY', direction: 'UP', score: 45, badge: '실적 장세 선방', summary: '금리 인상 악재보다 기업 실적 증가가 더 커서 주가 견인', mechanism: '강한 소비와 GDP 성장 ➔ 기업 이익(EPS) 급증 ➔ 밸류에이션 부담 상쇄' },
        { id: 'kospi', name: '한국 주식 (KOSPI 대형주)', nameKr: '한국 주식', category: 'EQUITY', direction: 'UP', score: 75, badge: '반도체 수출 호조', summary: '환율 하락(환차익) + 반도체 슈퍼사이클로 외국인 자금 집중 유입', mechanism: '환율 안정 ➔ 외인 환차손 우려 소멸 ➔ 반도체/자동차 대형주 폭풍 매수' },
        { id: 'oil', name: '국제 원유 (WTI 원자재)', nameKr: '국제 원유', category: 'COMMODITY', direction: 'UP', score: 55, badge: '산업 수요 견인', summary: '글로벌 공장이 활발히 가동되면서 산업용 원자재 수요 증가', mechanism: '실물 경기 확장 ➔ 제조업 가동률 상승 ➔ 에너지 수요 증가' },
        { id: 'gold', name: '금 (Gold 안전자산)', nameKr: '금 (골드)', category: 'COMMODITY', direction: 'DOWN', score: -35, badge: '위험자산 선호에 소외', summary: '위험자산(주식) 선호와 고금리로 인해 이자 없는 금 수요 둔화', mechanism: '금리 인상 + 주식 랠리 ➔ 안전자산 선호 약화' },
        { id: 'realestate', name: '부동산 / 실물자산', nameKr: '부동산', category: 'REAL_ESTATE', direction: 'NEUTRAL', score: 10, badge: '소득 증가가 방어', summary: '대출금리는 높으나 수출 호조로 기업 성과급 및 가계소득이 늘어 핵심지 방어', mechanism: '소득 및 고용 호조가 금리 인상 충격을 일정 부분 흡수' }
      ],
      bond: {
        marketRateDirection: 'UP',
        bondPriceDirection: 'DOWN',
        seesawAngle: 8,
        yield10Y: fedRateValue + 0.50,
        yield2Y: fedRateValue + 0.20,
        spread: 0.30,
        newInvestorNote: '신규 매수자: 우량 국채의 높은 이자를 챙길 수 있는 좋은 매수 기회',
        existingHolderNote: '기존 보유자: 시장금리 상승으로 기존 채권 매매가격은 하락 압력'
      },
      indicators: [
        { id: 'foreign_flow', title: '외국인 증권 자본 유출입', titleKr: '외국인 수급', status: 'POSITIVE', direction: 'UP', valueText: '외국인 대규모 순매수', explanation: '원화 절상(환차익) + 한국 반도체 대기업 실적 개선을 기대한 자금 집중 유입' },
        { id: 'trade_balance', title: '무역수지 및 수입물가', titleKr: '수입물가 & 무역', status: 'POSITIVE', direction: 'UP', valueText: '사상 최대 무역 흑자', explanation: '환율 하락으로 원자재 수입단가가 낮아지고 수출 물량이 폭발하여 무역흑자 급증' },
        { id: 'economic_growth', title: '경기 국면 및 경제성장', titleKr: '경기 사이클', status: 'POSITIVE', direction: 'UP', valueText: '경기 확장 (호황 국면)', explanation: '기업 실적 호조, 높은 고용률, 안정적인 가계 소비가 경제 성장을 강력 지지' },
        { id: 'credit_risk', title: '가계 및 기업 신용위험 (연체율)', titleKr: '부실 신용위험', status: 'NEUTRAL', direction: 'NEUTRAL', valueText: '연체율 관리 가능 수준', explanation: '높은 금리에도 불구하고 풍부한 일자리와 소득 증가로 부실 위험 방어' }
      ]
    };
  }

  // 6. [예외 2 - 핵심 위기형] 금리 인하기(CUT)인데 환율 급등(RISE)! (패닉 컷 & 안전자산 달러 쏠림)
  if (isRateCut && (isFxRise || isFxHighHold)) {
    return {
      rateRegime,
      fxRegime,
      rateDirection,
      fxDirection,
      relationshipType: 'EXCEPTION',
      relationshipReason:
        '예외적 위기형 디커플링: 글로벌 시스템 리스크나 경기 침체 공포(2008 금융위기, 2020 코로나 쇼크)가 닥치면, 연준이 금리를 비상 인하(Panic Cut)함에도 불구하고 전 세계가 안전자산인 달러 현금을 사재기하면서 환율이 폭등합니다.',
      fedRateValue,
      usdkrwValue,
      scenarioName: '경기침체 위기 & 안전자산 달러 쏠림 국면 (패닉 컷)',
      scenarioTag: '예외적 비동조화 ② (위기형) · 안전자산 피난처',
      scenarioDescription:
        '글로벌 경제위기나 신용경색으로 연준이 비상 금리인하를 단행하지만, 시장 참여자들이 공포에 휩싸여 주식을 내던지고 오직 달러 현금과 미국 장기국채로만 피신하여 환율이 폭등하는 전형적인 위기형 역행 국면입니다.',
      coreRule: '금리 인하 ▼ + 환율 급등 ▲ ➔ 안전자산(미국채·달러현금) 폭등, 주식·원유·부동산 폭락 및 외인 엑소더스',
      pipelineSteps: [
        { step: 1, title: '미국 연준', value: '비상 금리인하 (Panic Cut) ▼', sub: `위기 방어 급인하 (${fedRateValue.toFixed(2)}%)`, direction: 'DOWN', color: 'rose' },
        { step: 2, title: '외환 시장', value: '안전통화 달러 사재기 ▲', sub: `공포 환율 폭등 (₩${usdkrwValue})`, direction: 'UP', color: 'rose' },
        { step: 3, title: '채권 시장', value: '미국 국채 가격 폭등 ▲', sub: '무위험 안전자산 채권 쏠림', direction: 'UP', color: 'cyan' },
        { step: 4, title: '주식/원자재', value: '위험자산 패닉 투매 ▼', sub: '경기 침체 공포 + 현금화 경쟁', direction: 'DOWN', color: 'rose' },
        { step: 5, title: '실물 경기', value: '심각한 침체 (Recession)', sub: '수출 급감 및 신용경색 위기', direction: 'DOWN', color: 'rose' },
      ],
      assets: [
        { id: 'sp500', name: '미국 주식 (S&P 500 / 나스닥)', nameKr: '미국 주식', category: 'EQUITY', direction: 'DOWN', score: -78, badge: '침체 공포 투매', summary: '금리를 내려도 기업 실적 급감과 부도 공포가 시장을 지배하여 투매 장세 연출', mechanism: '침체 도래 ➔ 기업 부도율 상승 및 실적 쇼크 ➔ 저금리 부양책 효과 무력화' },
        { id: 'kospi', name: '한국 주식 (KOSPI 대형주)', nameKr: '한국 주식', category: 'EQUITY', direction: 'DOWN', score: -88, badge: '외인 패닉 엑소더스', summary: '글로벌 위험자산 축소 정책으로 외국인이 한국 주식을 최우선으로 투매 후 달러 송금', mechanism: '위기 발생 ➔ 달러 확보 위해 KOSPI 패닉 매도 ➔ 원화 가치 폭락' },
        { id: 'oil', name: '국제 원유 (WTI 원자재)', nameKr: '국제 원유', category: 'COMMODITY', direction: 'DOWN', score: -80, badge: '수요 증발 폭락', summary: '공장 중단 및 물류 마비, 글로벌 침체로 인한 실물 수요 소멸로 유가 폭락', mechanism: '경기 침체 ➔ 산업 원유 소비 급감 ➔ 재고 급증 및 유가 폭락' },
        { id: 'gold', name: '금 (Gold 안전자산)', nameKr: '금 (골드)', category: 'COMMODITY', direction: 'UP', score: 80, badge: '안전 피난처 각광', summary: '금융 시스템 붕괴 우려 시 미국 국채와 함께 궁극의 가치 저장 수단으로 자금 쏠림', mechanism: '신용 위험 극대화 ➔ 정부 신용마저 불신 시 대체 실물 안전자산 금으로 피신' },
        { id: 'realestate', name: '부동산 / 실물자산', nameKr: '부동산', category: 'REAL_ESTATE', direction: 'DOWN', score: -60, badge: '경기 충격 하락', summary: '금리는 낮지만 경기 침체로 가계 소득이 줄고 실업률이 올라 매수 여력 상실', mechanism: '침체 충격 ➔ 고용 불안 및 자산 디레버리징 ➔ 급매물 출회' }
      ],
      bond: {
        marketRateDirection: 'DOWN',
        bondPriceDirection: 'UP',
        seesawAngle: -10,
        yield10Y: fedRateValue + 0.30,
        yield2Y: fedRateValue - 0.20,
        spread: 0.50,
        newInvestorNote: '신규 매수자: 금리는 바닥이지만 안전자산 보관 목적으로 울며 겨자먹기식 매수',
        existingHolderNote: '기존 보유자: 안전자산 프리미엄과 금리 급락으로 미국 장기국채 가격이 폭등하여 최고의 헷지 수익 달성'
      },
      indicators: [
        { id: 'foreign_flow', title: '외국인 증권 자본 유출입', titleKr: '외국인 수급', status: 'NEGATIVE', direction: 'DOWN', valueText: '공포성 자본 엑소더스', explanation: '신흥국 리스크 회피를 위해 한국 주식·채권을 가리지 않고 매각하여 본국 달러로 송금' },
        { id: 'trade_balance', title: '무역수지 및 수입물가', titleKr: '수입물가 & 무역', status: 'NEGATIVE', direction: 'DOWN', valueText: '글로벌 수요 실종 & 수출 타격', explanation: '미국과 유럽 등 주요 수출 시장의 소비 침체로 한국의 주력 수출품 수출액 급감' },
        { id: 'economic_growth', title: '경기 국면 및 경제성장', titleKr: '경기 사이클', status: 'NEGATIVE', direction: 'DOWN', valueText: '경기 침체 (Recession 진입)', explanation: '성장률 마이너스 전환, 기업 투자 전면 동결, 실업률 상승 등 실물 한파' },
        { id: 'credit_risk', title: '가계 및 기업 신용위험 (연체율)', titleKr: '부실 신용위험', status: 'NEGATIVE', direction: 'UP', valueText: '신용 경색 및 부도 위험 급증', explanation: '은행들의 대출 회수와 현금 확보 경쟁으로 기업 자금줄이 마르는 신용경색 발생' }
      ]
    };
  }

  // 7. [예외 3] 고금리 장기 유지(HIGH_HOLD)인데 환율 하락/안정(FALL or LOW_HOLD)
  if (isRateHighHold && (isFxFall || isFxLowHold)) {
    return {
      rateRegime,
      fxRegime,
      rateDirection,
      fxDirection,
      relationshipType: 'EXCEPTION',
      relationshipReason:
        '예외적 방어 선방: 미국 금리가 여전히 5%대로 높은 수준에서 유지되고 있으나, 한미 통화스와프 기대감이나 대규모 경상수지 흑자, 외환당국의 개입으로 환율이 안정세를 찾는 국면입니다.',
      fedRateValue,
      usdkrwValue,
      scenarioName: '고금리 장기화 속 환율 안정 방어 국면',
      scenarioTag: '예외적 비동조화 ③ · 외환 방어 선방',
      scenarioDescription:
        '미국의 고금리가 계속되지만 한국의 수출 회복과 외환당국의 적극적 시장 안정화 조치로 원/달러 환율이 하향 안정되어, 고환율로 인한 추가 위기를 막아내는 차별화 상태입니다.',
      coreRule: '고금리 유지 ⏸️ + 환율 안정 ▼ ➔ 수입물가 안정으로 국내 물가 진정, 그러나 높은 대출이자율로 내수는 위축',
      pipelineSteps: [
        { step: 1, title: '미국 연준', value: '고금리 유지 동결 ⏸️', sub: `긴축 기조 지속 (${fedRateValue.toFixed(2)}%)`, direction: 'NEUTRAL', color: 'rose' },
        { step: 2, title: '외환 시장', value: '원/달러 환율 안정 하락 ▼', sub: `경상흑자로 안정 (₩${usdkrwValue})`, direction: 'DOWN', color: 'emerald' },
        { step: 3, title: '채권 시장', value: '채권 가격 바닥 다지기', sub: '유통금리 고점 통과 인식', direction: 'NEUTRAL', color: 'amber' },
        { step: 4, title: '주식/원자재', value: '외환 안정으로 증시 반등', sub: '외국인 환차손 우려 완화', direction: 'UP', color: 'emerald' },
        { step: 5, title: '실물 경기', value: '물가 안정 vs 내수 위축', sub: '수입물가는 잡히나 고금리 지속', direction: 'NEUTRAL', color: 'amber' },
      ],
      assets: [
        { id: 'sp500', name: '미국 주식 (S&P 500 / 나스닥)', nameKr: '미국 주식', category: 'EQUITY', direction: 'NEUTRAL', score: 15, badge: '실적 버티기', summary: '고금리 피로감에도 안정된 기업 실적으로 횡보', mechanism: '금리 동결 안정감 + 실적 방어' },
        { id: 'kospi', name: '한국 주식 (KOSPI 대형주)', nameKr: '한국 주식', category: 'EQUITY', direction: 'UP', score: 55, badge: '외인 순매수 재개', summary: '환율 안도감으로 외국인이 한국 우량주 재매수', mechanism: '환율 하락 ➔ 환차손 우려 제거 ➔ KOSPI 저평가 매력 부각' },
        { id: 'oil', name: '국제 원유 (WTI 원자재)', nameKr: '국제 원유', category: 'COMMODITY', direction: 'NEUTRAL', score: -10, badge: '박스권 횡보', summary: '글로벌 경기 둔화와 공급 조절 팽팽', mechanism: '수요 약화 vs 산유국 감산' },
        { id: 'gold', name: '금 (Gold 안전자산)', nameKr: '금 (골드)', category: 'COMMODITY', direction: 'NEUTRAL', score: 20, badge: '완만한 지지력', summary: '고금리 지속에도 달러화 약세 전환으로 가격 지지', mechanism: '달러 상대적 약세에 따른 금 매수세' },
        { id: 'realestate', name: '부동산 / 실물자산', nameKr: '부동산', category: 'REAL_ESTATE', direction: 'DOWN', score: -50, badge: '이자 부담 지속', summary: '환율은 안정되었으나 대출금리는 여전히 높아 거래 부진', mechanism: '고금리 장기화로 가계 매수 여력 부족' }
      ],
      bond: {
        marketRateDirection: 'NEUTRAL',
        bondPriceDirection: 'NEUTRAL',
        seesawAngle: 5,
        yield10Y: fedRateValue + 0.15,
        yield2Y: fedRateValue + 0.20,
        spread: -0.05,
        newInvestorNote: '신규 매수자: 고금리의 막바지 구간으로 판단하고 장기 우량채권 분할 매집',
        existingHolderNote: '기존 보유자: 채권 가격 최악의 국면 통과 및 반등 대기'
      },
      indicators: [
        { id: 'foreign_flow', title: '외국인 증권 자본 유출입', titleKr: '외국인 수급', status: 'POSITIVE', direction: 'UP', valueText: '외국인 순매수 전환', explanation: '원/달러 환율이 1,200원대로 안정되면서 환차익을 노린 자금 점진 유입' },
        { id: 'trade_balance', title: '무역수지 및 수입물가', titleKr: '수입물가 & 무역', status: 'POSITIVE', direction: 'UP', valueText: '수입물가 안정세', explanation: '환율 하락으로 원자재 수입 물가가 진정되며 무역흑자 확대' },
        { id: 'economic_growth', title: '경기 국면 및 경제성장', titleKr: '경기 사이클', status: 'NEUTRAL', direction: 'NEUTRAL', valueText: '차별화 횡보', explanation: '수출은 개선되나 국내 가계의 고금리 이자 상환 부담 지속' },
        { id: 'credit_risk', title: '가계 및 기업 신용위험 (연체율)', titleKr: '부실 신용위험', status: 'WARNING', direction: 'UP', valueText: '이자 상환 피로 누적', explanation: '금리가 여전히 높아 한계 채무자들의 부실 압력 지속' }
      ]
    };
  }

  // 8. [예외 4] 저금리 장기 유지(LOW_HOLD)인데 환율 급등/고환율(RISE or HIGH_HOLD) (스태그플레이션/화폐불안)
  return {
    rateRegime,
    fxRegime,
    rateDirection,
    fxDirection,
    relationshipType: 'EXCEPTION',
    relationshipReason:
      '예외적 신용불안형 디커플링: 경기가 침체되어 미국이나 한국이 금리를 올리지 못하고 저금리를 유지하고 있으나, 국가 재정 건전성 악화나 신용등급 강등 우려로 자본이 이탈하여 환율이 치솟는 스태그플레이션/통화가치 불신 국면입니다.',
    fedRateValue,
    usdkrwValue,
    scenarioName: '저금리 속 환율 급등 & 스태그플레이션 위기 국면',
    scenarioTag: '예외적 비동조화 ④ · 통화가치 불신 위기',
    scenarioDescription:
      '금리는 바닥권에 머물러 경기 부양을 시도하지만, 원화 가치에 대한 신뢰가 훼손되거나 외환보유액 부족 우려로 외국인 자본이 유출되어 환율이 폭등하는 최악의 이중고 국면입니다.',
    coreRule: '저금리 동결 ⏸️ + 환율 폭등 ▲ ➔ 원자재 수입물가 폭등, 실질소득 급락, 수입 인플레이션 및 원화 자산 투매',
    pipelineSteps: [
      { step: 1, title: '미국/한국 중앙은행', value: '저금리 동결 (올리지 못함)', sub: `경기 부진으로 저금리 (${fedRateValue.toFixed(2)}%)`, direction: 'NEUTRAL', color: 'amber' },
      { step: 2, title: '외환 시장', value: '원/달러 환율 폭등 ▲', sub: `통화 신뢰도 하락 (₩${usdkrwValue})`, direction: 'UP', color: 'rose' },
      { step: 3, title: '채권 시장', value: '채권 가격 급락 (리스크 프리미엄)', sub: '신용 위험 증가로 시장금리 급등', direction: 'DOWN', color: 'rose' },
      { step: 4, title: '주식/원자재', value: '자산 가격 혼란 & 물가 폭등', sub: '환율 폭등으로 인한 수입 인플레', direction: 'DOWN', color: 'rose' },
      { step: 5, title: '실물 경기', value: '스태그플레이션 (불황 속 물가고)', sub: '소비 극심한 침체 및 실질 구매력 붕괴', direction: 'DOWN', color: 'rose' },
    ],
    assets: [
      { id: 'sp500', name: '미국 주식 (S&P 500 / 나스닥)', nameKr: '미국 주식', category: 'EQUITY', direction: 'NEUTRAL', score: -10, badge: '글로벌 불안 혼조', summary: '저금리 효과가 신흥국 위기 전이 불안감으로 상쇄', mechanism: '저금리 vs 글로벌 성장 둔화' },
      { id: 'kospi', name: '한국 주식 (KOSPI 대형주)', nameKr: '한국 주식', category: 'EQUITY', direction: 'DOWN', score: -75, badge: '외인 자본 유출', summary: '원화 가치 폭락으로 외국인이 한국 증시에서 탈출', mechanism: '환율 폭등 ➔ 국가 신용위험 부각 ➔ 원화 주식 투매' },
      { id: 'oil', name: '국제 원유 (WTI 원자재)', nameKr: '국제 원유', category: 'COMMODITY', direction: 'UP', score: 65, badge: '수입물가 폭탄', summary: '국제 가격 자체보다 국내 원화 환산 유가가 폭등하여 경제에 치명타', mechanism: '고환율 ➔ 원화 표시 원유 수입단가 천정부지' },
      { id: 'gold', name: '금 (Gold 안전자산)', nameKr: '금 (골드)', category: 'COMMODITY', direction: 'UP', score: 90, badge: '최고의 피난처', summary: '원화 가치 폭락 시 국내 금 가격이 사상 최고가 폭등', mechanism: '원화 약세 + 저금리 ➔ 실물 금 집중 매수' },
      { id: 'realestate', name: '부동산 / 실물자산', nameKr: '부동산', category: 'REAL_ESTATE', direction: 'DOWN', score: -40, badge: '스태그플레이션 위축', summary: '저금리이나 원자재 건축비 급등과 경기 침체로 거래 정체', mechanism: '실질 구매력 붕괴로 부동산 신규 진입 마비' }
    ],
    bond: {
      marketRateDirection: 'UP',
      bondPriceDirection: 'DOWN',
      seesawAngle: 10,
      yield10Y: fedRateValue + 2.50,
      yield2Y: fedRateValue + 2.00,
      spread: 0.50,
      newInvestorNote: '신규 매수자: 국가 신용위험 프리미엄으로 금리가 급등하여 높은 이자를 요구',
      existingHolderNote: '기존 보유자: 저금리 정책에도 불구하고 시장 국채금리가 튀어올라 채권 평가손실 발생'
    },
    indicators: [
      { id: 'foreign_flow', title: '외국인 증권 자본 유출입', titleKr: '외국인 수급', status: 'NEGATIVE', direction: 'DOWN', valueText: '원화 자산 대거 매도', explanation: '통화가치 절하 위험을 회피하기 위해 한국 국채 및 주식 대규모 순매도' },
      { id: 'trade_balance', title: '무역수지 및 수입물가', titleKr: '수입물가 & 무역', status: 'NEGATIVE', direction: 'DOWN', valueText: '수입인플레 폭탄', explanation: '환율 급등으로 원자재·식료품 수입단가가 치솟아 무역수지 급속 악화' },
      { id: 'economic_growth', title: '경기 국면 및 경제성장', titleKr: '경기 사이클', status: 'NEGATIVE', direction: 'DOWN', valueText: '스태그플레이션 (최악의 국면)', explanation: '경기는 침체되는데 물가만 폭등하여 가계 실질소비 급감' },
      { id: 'credit_risk', title: '가계 및 기업 신용위험 (연체율)', titleKr: '부실 신용위험', status: 'NEGATIVE', direction: 'UP', valueText: '신용 위험 최고조', explanation: '원자재 가격 폭등으로 제조원가를 감당하지 못한 중소기업 부도 급증' }
    ]
  };
}
