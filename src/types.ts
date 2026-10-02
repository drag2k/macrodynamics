export type RateDirection = 'HIKE' | 'CUT';
export type FxDirection = 'RISE' | 'FALL';

// 입체적 금리 4단계 레벨 및 동결 상태
export type RateRegime = 'HIKE' | 'HIGH_HOLD' | 'CUT' | 'LOW_HOLD';

// 입체적 환율 4단계 레벨 및 고착/안정 상태
export type FxRegime = 'RISE' | 'HIGH_HOLD' | 'FALL' | 'LOW_HOLD';

// 사용자가 명시한 7대 정밀 세분 상태
export type DetailedPhase = 
  | 'LOW_HOLD'            // 저점 유지 (초저금리/저환율 안정)
  | 'RISING_LOW_TO_MID'   // 저점에서 중간까지 상승 중
  | 'MID_HOLD'            // 중간 유지 (중립/평형)
  | 'RISING_MID_TO_HIGH'  // 중간에서 고점까지 상승 중
  | 'HIGH_HOLD'           // 고점 유지 (고금리/고환율 장기 고착)
  | 'FALLING_HIGH_TO_MID' // 고점에서 중간까지 하락 중
  | 'FALLING_MID_TO_LOW'; // 중간에서 저점까지 하락 중

// 커플링 / 디커플링 연동 모드
export type CouplingMode = 
  | 'COUPLED'             // 커플링 (일반 동행: 금리 올리면 환율도 동반 상승)
  | 'DECOUPLED_INVERSE'   // 디커플링 역행 (위기 패닉컷 or 한국 독자 수출 호황)
  | 'INDEPENDENT';        // 독립 수동 조작

// 거시 4분면 펀더멘털 상태 (성장 vs 물가)
export type MacroQuadrant = 
  | 'GOLDILOCKS'          // 골디락스 (성장↑, 물가↓)
  | 'REFLATION'           // 리플레이션/인플레 호황 (성장↑, 물가↑)
  | 'STAGFLATION'         // 스태그플레이션 (성장↓, 물가↑)
  | 'DEFLATION_RECESSION';// 침체/디플레이션 (성장↓, 물가↓)

// 달러 유동성 (M2 & 연준 순유동성) 레짐
export type LiquidityRegime = 
  | 'MASSIVE_QE'          // 대규모 양적완화 (M2 폭증)
  | 'MODERATE_EXPANSION'  // 온건한 유동성 확대
  | 'NEUTRAL'             // 유동성 중립 유지
  | 'MODERATE_QT'         // 완만한 양적긴축
  | 'AGGRESSIVE_QT';      // 강력한 양적긴축 (유동성 흡수/가뭄)

// 일반적 상황(동행 메커니즘) vs 예외적 상황(디커플링/위기/호황 역행)
export type RelationshipType = 'NORMAL' | 'EXCEPTION';

export type PolicyAction = 'QE' | 'TAPERING' | 'RATE_HIKE' | 'QT';
export type EconomicPhase = 'RECOVERY' | 'EXPANSION' | 'SLOWDOWN' | 'RECESSION';

export interface AssetMetric {
  id: string;
  name: string;
  nameKr: string;
  category: 'EQUITY' | 'COMMODITY' | 'REAL_ESTATE';
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  score: number; // -100 to +100
  badge: string;
  summary: string;
  mechanism: string;
}

export interface BondMechanic {
  marketRateDirection: 'UP' | 'DOWN' | 'NEUTRAL';
  bondPriceDirection: 'UP' | 'DOWN' | 'NEUTRAL';
  seesawAngle: number; // -12 to 12 degrees
  yield10Y: number;
  yield2Y: number;
  spread: number;
  newInvestorNote: string;
  existingHolderNote: string;
}

export interface EconomicIndicator {
  id: string;
  title: string;
  titleKr: string;
  status: 'POSITIVE' | 'NEGATIVE' | 'WARNING' | 'NEUTRAL';
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  valueText: string;
  explanation: string;
}

export interface UnifiedMacroState {
  rateRegime: RateRegime;
  fxRegime: FxRegime;
  rateDetailedPhase: DetailedPhase;
  fxDetailedPhase: DetailedPhase;
  couplingMode: CouplingMode;
  rateDirection: RateDirection;
  fxDirection: FxDirection;
  relationshipType: RelationshipType; // 'NORMAL' (일반) | 'EXCEPTION' (예외)
  relationshipReason: string; // 왜 일반적인지 또는 왜 예외인지 명쾌한 해설
  
  fedRateValue: number;
  usdkrwValue: number;
  scenarioName: string;
  scenarioTag: string;
  scenarioDescription: string;
  coreRule: string;

  // Macro 4-Quadrant Fundamental Origin
  macroQuadrant: MacroQuadrant;
  growthScore: number;       // -100 (침체) to +100 (호황)
  inflationScore: number;    // -100 (디플레) to +100 (고물가)
  quadrantTitle: string;
  quadrantBadge: string;
  quadrantDesc: string;

  // Dollar Liquidity & M2 Transmission
  liquidityValue: number;    // $5.5T ~ $9.5T (Fed Net Liquidity / M2 expansion index)
  liquidityRegime: LiquidityRegime;
  liquidityLabel: string;
  liquidityDesc: string;
  
  // Pipeline flow items
  pipelineSteps: {
    step: number;
    title: string;
    value: string;
    sub: string;
    direction: 'UP' | 'DOWN' | 'NEUTRAL';
    color: string;
  }[];

  // 3 Core Groups
  assets: AssetMetric[];
  bond: BondMechanic;
  indicators: EconomicIndicator[];
}


export interface FactCheckItem {
  id: string;
  slideNumber: number;
  slideTitle: string;
  originalText: string;
  issueType: 'FACTUAL_ERROR' | 'CONCEPTUAL_CONFUSION' | 'OMISSION_OR_CONTEXT';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  critique: string;
  correction: string;
  deepDiveNote: string;
  confirmed: boolean;
}

export interface StepApprovalState {
  step1_factCheck: boolean;
  step2_macroSimulator: boolean;
  step3_bondMechanics: boolean;
  step4_policyCycle: boolean;
  step5_finalDeliverable: boolean;
}

export interface AssetImpact {
  name: string;
  nameKr: string;
  category: 'EQUITY' | 'BOND' | 'COMMODITY' | 'CURRENCY' | 'REAL_ESTATE';
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  score: number;
  reason: string;
  keyMetric: string;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  subtitle: string;
  fedRate: number;
  usdkrw: number;
  policy: PolicyAction;
  phase: EconomicPhase;
  description: string;
}


