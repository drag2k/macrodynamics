// 최근 1~2년간 및 2026년 상반기 미국 실측 매크로 데이터 & 이론 모델과의 괴리 분석 데이터셋
import { MacroQuadrant } from '../types';

export interface HistoricalMacroPoint {
  id: string;
  period: string; // 예: "2024 상반기", "2024년 9월", "2025 상반기", "2026 현재(상반기)"
  title: string;
  themeBadge: string;
  quadrant: MacroQuadrant;
  
  // 실측 거시 펀더멘털 지표 (Layer 1)
  realGdp: number;          // 실질 GDP 성장률 (연율 %)
  cpiInflation: number;     // 헤드라인 CPI 물가상승률 (YoY %)
  growthScore: number;      // -100 ~ +100 변환치
  inflationScore: number;   // -100 ~ +100 변환치

  // 실측 정책 및 유동성 지표 (Layer 2)
  fedRate: number;          // 미국 기준금리 (%)
  netLiquidity: number;     // 연준 순유동성 ($T, Fed Assets - TGA - RRP)
  usdkrw: number;           // 원/달러 환율 (원)
  
  // 실측 자산시장 핵심 반응 (Layer 3)
  treasury10Y: number;      // 미 국채 10년물 금리 (%)
  sp500Trend: string;       // S&P 500 시장 반응
  assetReactionSummary: string;

  // [핵심] 표준 이론 연동값(Theoretical Model)과의 차이 및 원인 해설
  divergence: {
    standardTheoryPrediction: string; // 교과서/표준 모델의 예측
    actualMarketBehavior: string;     // 실제 시장이 보인 행태
    divergenceReason: string;         // 왜 이론과 다른 괴리가 발생했는가?
    keyTakeaway: string;              // 투자 및 매크로 시사점
  };
}

export const HISTORICAL_MACRO_TIMELINE: HistoricalMacroPoint[] = [
  {
    id: 'pt-2024-h1',
    period: '2024년 상반기',
    title: 'AI 설비투자 붐 & 22년 만의 최고금리(5.50%) 장기화',
    themeBadge: 'Higher for Longer',
    quadrant: 'REFLATION',
    realGdp: 3.0,
    cpiInflation: 3.4,
    growthScore: 36,
    inflationScore: 24,
    fedRate: 5.50,
    netLiquidity: 6.4,
    usdkrw: 1380,
    treasury10Y: 4.45,
    sp500Trend: '강한 상승 (+15% 랠리)',
    assetReactionSummary: '엔비디아 중심 빅테크 신고가, 원/달러 환율 1,380원대 고환율 고착',
    divergence: {
      standardTheoryPrediction: '기준금리 5.50% 초고금리와 양적긴축(QT) 하에서는 주식 할인율(PER)이 급격히 압축되고 경기침체 우려로 주식시장이 하락해야 정상임.',
      actualMarketBehavior: 'S&P 500과 나스닥이 사상 최고치를 연일 경신하며 강력한 주식 강세장이 전개됨.',
      divergenceReason: '① 생성형 AI發 빅테크 기업들의 폭발적인 실적(EPS) 급증이 금리 부담을 완전히 압도함. ② 연준의 역레포(ON RRP) 잔고가 약 2조 달러에서 4천억 달러대로 소진되며 시중으로 자금이 방출되어 연준의 양적긴축(QT) 충격을 흡수·상쇄하는 "스텔스 유동성 완충 작용"을 함.',
      keyTakeaway: '초고금리라도 기업의 혁신 실적(EPS) 폭증과 숨은 유동성 완충재(RRP 방출)가 결합하면 이론적 밸류에이션 하락 압력을 이겨낼 수 있음을 입증함.'
    }
  },
  {
    id: 'pt-2024-sep',
    period: '2024년 9월',
    title: '연준의 역사적 피벗(Big Cut 50bp) 단행 & 물가 2%대 안착',
    themeBadge: 'Fed Pivot (50bp Cut)',
    quadrant: 'GOLDILOCKS',
    realGdp: 2.8,
    cpiInflation: 2.4,
    growthScore: 28,
    inflationScore: -3,
    fedRate: 5.00,
    netLiquidity: 6.7,
    usdkrw: 1325,
    treasury10Y: 3.75,
    sp500Trend: '전방위 확장 랠리',
    assetReactionSummary: '중소형주·글로벌 증시 동반 랠리, 국채 금리 급락(채권 가격 상승), 원/달러 1,320원대 안정',
    divergence: {
      standardTheoryPrediction: '연준이 통상 50bp의 "빅컷"을 단행하는 것은 심각한 경기침체(Recession)가 임박했다는 신호이므로, 위험자산이 패닉 셀링을 겪어야 함.',
      actualMarketBehavior: '침체 공포 없이 경기 연착륙(Soft Landing) 환호 속에 주식·원자재·가상자산이 일제히 상승함.',
      divergenceReason: '실업률 상승이 대량 해고가 아닌 이민자 유입에 따른 노동 공급 확대 때문이었고, 실질 GDP가 2.8%로 잠재성장률(2.0%)을 크게 웃도는 상태에서 선제적(Insurance Cut) 성격으로 단행되었기 때문임.',
      keyTakeaway: '금리 인하의 "폭(50bp)" 자체보다 "왜 인하하는가(불황 방어 vs 사전 보험)"가 시장 반응을 180도 바꿈.'
    }
  },
  {
    id: 'pt-2024-q4',
    period: '2024년 4분기',
    title: '미 대선 트럼프 2.0 당선 & 관세·재정적자發 킹달러 부활',
    themeBadge: 'Trump Trade & 킹달러',
    quadrant: 'REFLATION',
    realGdp: 2.5,
    cpiInflation: 2.7,
    growthScore: 18,
    inflationScore: 5,
    fedRate: 4.50,
    netLiquidity: 6.5,
    usdkrw: 1425,
    treasury10Y: 4.60,
    sp500Trend: '미국 증시 독주 vs 신흥국 부진',
    assetReactionSummary: '비트코인 10만 달러 돌파, 달러 인덱스 107 돌파, 원/달러 1,400원 상향 돌파',
    divergence: {
      standardTheoryPrediction: '연준이 금리를 4.50%까지 추가 인하했으므로 시장금리(10년물)도 하락하고 달러화 가치가 하락해야 함.',
      actualMarketBehavior: '기준금리는 내렸는데 오히려 미 국채 10년물 금리가 3.7%에서 4.6%로 폭등하고 달러가 초강세(환율 1,425원 돌파)를 보임.',
      divergenceReason: '트럼프 2기 행정부의 보편 관세 공약(수입물가 상승 우려)과 감세에 따른 막대한 국채 발행(연방 재정적자 확대)으로 인해 채권 시장에 "기간 프리미엄(Term Premium)"이 급등하여 기준금리와 장기금리가 탈동조화됨.',
      keyTakeaway: '중앙은행의 통화정책보다 행정부의 "재정정책과 무역 관세"가 장기금리와 환율을 좌우하는 탈동조화 현상.'
    }
  },
  {
    id: 'pt-2025-h1',
    period: '2025년 상반기',
    title: '관세 시행과 인플레 재반등 경계 & 연준 금리인하 일시중단',
    themeBadge: 'Sticky Inflation & 관세 충격',
    quadrant: 'STAGFLATION',
    realGdp: 1.6,
    cpiInflation: 3.1,
    growthScore: -14,
    inflationScore: 16,
    fedRate: 4.50,
    netLiquidity: 6.3,
    usdkrw: 1475,
    treasury10Y: 4.80,
    sp500Trend: '변동성 확대 / 섹터 차별화',
    assetReactionSummary: '원/달러 환율 1,485원 피크(1,500원 목전), 미 국채 10년물 4.88% 급등으로 채권 쇼크',
    divergence: {
      standardTheoryPrediction: '성장률이 1.6%로 둔화되면 연준이 추가 금리 인하로 경기를 방어해야 함.',
      actualMarketBehavior: '연준이 금리 인하를 전면 동결(Pause)하고 "Higher for Longer 2.0" 스탠스를 재가동함.',
      divergenceReason: '무역 관세로 인한 수입 물가 전가와 공급망 재편 비용으로 인해 CPI가 다시 3%대로 고착(Sticky)되면서, 섣부른 금리 인하가 1970년대식 2차 인플레이션 파동을 부를 수 있다는 연준의 극도의 경계감 작용.',
      keyTakeaway: '공급측 비용 충격(관세)이 발생하면 성장이 식어도 금리를 내리지 못하는 "준(準) 스태그플레이션 딜레마" 발생.'
    }
  },
  {
    id: 'pt-2026-now',
    period: '2026년 상반기 (현재)',
    title: 'AI 생산성 혁신 효과 본격화 & 2%대 물가 안착 속 신중한 중립화',
    themeBadge: 'New Neutral Equilibrium',
    quadrant: 'GOLDILOCKS',
    realGdp: 2.2,
    cpiInflation: 2.2,
    growthScore: 8,
    inflationScore: -8,
    fedRate: 4.00,
    netLiquidity: 7.1,
    usdkrw: 1365,
    treasury10Y: 4.15,
    sp500Trend: '실적 기반 완만한 우상향',
    assetReactionSummary: '원/달러 1,360원대 하향 안정화, 인프라 및 전력/소프트웨어 전방위 실적 장세',
    divergence: {
      standardTheoryPrediction: '물가가 2.2%로 연준 목표(2.0%)에 근접했으므로 과거 전통적 중립금리인 2.5% 수준까지 대폭 추가 인하가 이루어져야 함.',
      actualMarketBehavior: '연준은 기준금리를 4.0% 수준에서 멈추고 신중한 완만 인하 기조를 유지 중임.',
      divergenceReason: '① AI 도입으로 미국의 잠재 생산성이 향상되어 자연이자율(r*) 자체가 과거보다 1.0%p 이상 높아짐. ② 미국의 만성적인 GDP 대비 6%대 재정적자로 국채 공급이 지속되어 시장의 균형 금리 자체가 3.5~4.0%로 상향 재설정(Higher Neutral Rate)되었기 때문임.',
      keyTakeaway: '2026년의 새로운 표준은 "저금리 시대의 복귀"가 아니라 "생산성 기반의 3~4%대 고원 중립금리(Higher Neutral)" 시대임.'
    }
  }
];
