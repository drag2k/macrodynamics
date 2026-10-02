// 미국 및 글로벌 주식·금융시장의 역사적 핵심 거시경제 변곡점 & 위기 시나리오 아카이브 (2000년 ~ 2026년)
import { MacroQuadrant } from '../types';
import { MonthlyMacroTimeSeriesPoint, MONTHLY_MACRO_SERIES } from './monthlyMacroTimeSeries';

export interface HistoricalEraOverview {
  summary: string;           // 3~4줄 핵심 개요
  macroEnvironment: string;   // 당시 거시 펀더멘털 환경
  triggerEvent: string;       // 촉발 계기
  peakDrop: string;           // 시장 최대 낙폭/변동치
}

export interface HistoricalEraDeepDive {
  triggerBackground: string;  // 1. 발발 배경 & 시장 과열
  policyResponse: string;     // 2. 연준의 정책 대응 & 유동성 공급/긴축
  assetImpact: string;        // 3. 주식/채권/환율 자산시장 파급 효과
  theoreticalDivergence: string; // 4. 전통 경제학 이론 vs 실제 시장의 괴리
  keyLessons: string;         // 5. 현재 투자자를 위한 핵심 시사점
}

export interface HistoricalEraPreset {
  id: string;
  name: string;               // e.g. "2000~2002 닷컴버블 붕괴 & 9.11 침체"
  shortTitle: string;         // e.g. "닷컴버블 붕괴"
  periodRange: string;        // e.g. "2000.01 ~ 2002.12"
  durationMonths: number;     // e.g. 36
  tagColor: 'rose' | 'amber' | 'cyan' | 'purple' | 'emerald' | 'blue';
  coreQuadrant: MacroQuadrant;
  
  // 개요 및 확장 상세 소개
  overview: HistoricalEraOverview;
  deepDive: HistoricalEraDeepDive;
  
  // 주요 통계 요약 배지
  stats: {
    sp500MaxDrawdown: string;
    peakFedRate: string;
    troughFedRate: string;
    treasury10YRange: string;
    usdkrwPeak: string;
  };

  // 해당 시기의 월별 정규화 시계열 데이터
  monthlySeries: MonthlyMacroTimeSeriesPoint[];
}

export const HISTORICAL_ERA_PRESETS: HistoricalEraPreset[] = [
  // ──────────────────────────────────────────────────────────
  // 1. 2000~2002 닷컴버블 붕괴 & 9.11 침체 (Dot-Com Crash)
  // ──────────────────────────────────────────────────────────
  {
    id: 'dotcom-bubble-2000',
    name: '2000~2002 닷컴버블 붕괴 & 9.11 침체',
    shortTitle: '2000 닷컴버블',
    periodRange: '2000.01 ~ 2002.12',
    durationMonths: 36,
    tagColor: 'rose',
    coreQuadrant: 'DEFLATION_RECESSION',
    overview: {
      summary: '1990년대 후반 인터넷 혁명으로 폭등했던 기술주 밸류에이션이 2000년 3월 정점을 찍은 후 수익성 부재와 연준의 6.5% 긴축 속에 연쇄 폭락한 사건입니다. 2001년 9.11 테러와 엔론 분식회계 사태가 겹치며 나스닥은 -78%, S&P 500은 -49% 폭락하는 극심한 자산 디플레이션을 겪었습니다.',
      macroEnvironment: '성장 둔화 속 인플레이션 압력이 급랭하며 전형적인 디플레이션·경기침체 국면으로 진입.',
      triggerEvent: '연준의 6.50% 금리 인상 + 수익 없는 닷컴 기업들의 현금 고갈(Burn Rate) + 9.11 테러 충격',
      peakDrop: '나스닥 지수 -78%, S&P 500 지수 -49.1%, 경기침체 8개월 지속'
    },
    deepDive: {
      triggerBackground: '1990년대 후반 "새로운 경제 패러다임"이라는 환상 속에 트래픽만 있고 매출과 이익이 전혀 없는 인터넷 기업들이 수백 배의 밸류에이션을 받았습니다. 2000년 3월 나스닥이 5,048pt로 정점을 친 후, 연준 그린스펀 의장의 금리 인상(6.50%)으로 자금조달 비용이 급등하자 벤처 캐피털의 자금줄이 마르며 도미노 파산이 시작되었습니다.',
      policyResponse: '연준은 2001년 1월 전격적인 50bp 긴급 금리 인하를 시작으로 6.50%였던 기준금리를 2002년 말 1.25%까지 무려 525bp나 초고속 인하했습니다. 당시로서는 역사상 유례없는 공격적인 금리 인하 사이클이었으나, 기업 설비투자 붕괴와 주가 하락의 역자산 효과(Reverse Wealth Effect)를 즉각 차단하지는 못했습니다.',
      assetImpact: '• 주식: 기술주 중심 나스닥 -78%, 시총 5조 달러 증발\n• 채권: 안전자산 선호로 미 국채 10년물 금리가 6.70%에서 3.80%대까지 급락(채권 강세)\n• 환율: 한국 외환위기 후유증 속 원/달러 환율이 1,100원대에서 1,365원까지 급등\n• 금: 장기 침체 우려 속 온스당 270달러에서 350달러로 바닥을 치고 반등 시작',
      theoreticalDivergence: '전통 통화정책 이론에 따르면 기준금리를 5%p 이상 파격 인하하면 통화량이 팽창하여 기업투자와 주가가 즉시 V자 반등해야 합니다. 그러나 "신용 경색과 과잉 부채 청산" 과정에서는 금리를 내려도 돈이 돌지 않는 "유동성 함정(Liquidity Trap)" 현상이 발생하여, 금리를 내리는 동안에도 주가는 2년 반 내내 하락세를 면치 못했습니다.',
      keyLessons: '혁신 기술의 실질 생산성이 기업의 재무제표(현금흐름)로 증명되지 않으면 아무리 위대한 테마라도 밸류에이션 버블은 반드시 붕괴합니다. 또한 연준이 금리를 전격 인하하기 시작하는 "첫 인하 국면"은 경기침체 진입의 방증이므로 주식 매수 신호가 아니라 리스크 관리 신호일 수 있습니다.'
    },
    stats: {
      sp500MaxDrawdown: '-49.1%',
      peakFedRate: '6.50%',
      troughFedRate: '1.25%',
      treasury10YRange: '6.79% ➔ 3.81%',
      usdkrwPeak: '1,365원'
    },
    monthlySeries: [
      {
        id: '2000-01', dateStr: '2000.01', year: 2000, month: 1, label: "'00.01",
        phaseTitle: '닷컴 버블 정점 직전 & 연준 선제적 금리 인상', quadrant: 'REFLATION',
        realGdp: 4.1, cpiInflation: 2.7, growthScore: 45, inflationScore: 15,
        fedRate: 5.75, netLiquidity: 1.15, usdkrw: 1120, sp500Index: 1394, kospiIndex: 943,
        treasury10Y: 6.66, goldPrice: 283, bitcoinPrice: 0,
        marketNote: '인터넷 혁명 환호 속에 나스닥 5,000pt 돌파 임박, 연준 추가 긴축 시사.',
        theoreticalComparison: '고성장·적정물가 국면이나 주식 PER이 역사상 최고치(45배)로 이론적 한계선 도달.'
      },
      {
        id: '2000-03', dateStr: '2000.03', year: 2000, month: 3, label: "'00.03",
        phaseTitle: '나스닥 사상 최고치(5,048pt) 터치 후 균열', quadrant: 'REFLATION',
        realGdp: 4.2, cpiInflation: 3.8, growthScore: 48, inflationScore: 35,
        fedRate: 6.00, netLiquidity: 1.12, usdkrw: 1108, sp500Index: 1498, kospiIndex: 861,
        treasury10Y: 6.26, goldPrice: 279, bitcoinPrice: 0,
        marketNote: '마이크로소프트 반독점 소송 충격과 닷컴 기업들의 현금 고갈 경고 보도 잇따름.',
        theoreticalComparison: '금리 인상 누적 효과가 주식 할인율에 반영되기 시작하며 스마트머니 이탈.'
      },
      {
        id: '2000-05', dateStr: '2000.05', year: 2000, month: 5, label: "'00.05",
        phaseTitle: '연준 50bp 빅스텝 단행 (기준금리 6.50% 도달)', quadrant: 'STAGFLATION',
        realGdp: 3.8, cpiInflation: 3.2, growthScore: 25, inflationScore: 30,
        fedRate: 6.50, netLiquidity: 1.08, usdkrw: 1135, sp500Index: 1420, kospiIndex: 731,
        treasury10Y: 6.44, goldPrice: 273, bitcoinPrice: 0,
        marketNote: '과열된 투기를 잡기 위해 연준이 6.50%로 전격 인상, 기술주 1차 투매 발생.',
        theoreticalComparison: '긴축 정책이 물가보다 자산시장 거품을 먼저 타격하는 전통적 금융경색 초기.'
      },
      {
        id: '2000-09', dateStr: '2000.09', year: 2000, month: 9, label: "'00.09",
        phaseTitle: '인텔·애플 등 테크 대기업 실적 경고 연쇄 발발', quadrant: 'DEFLATION_RECESSION',
        realGdp: 2.4, cpiInflation: 3.5, growthScore: -5, inflationScore: 20,
        fedRate: 6.50, netLiquidity: 1.06, usdkrw: 1115, sp500Index: 1436, kospiIndex: 613,
        treasury10Y: 5.80, goldPrice: 274, bitcoinPrice: 0,
        marketNote: 'PC 및 통신 설비투자 급감으로 주문 취소 쇄도, 경기 둔화 가시화.',
        theoreticalComparison: '성장률 둔화가 현실화되며 10년물 국채금리가 정책금리(6.5%) 밑으로 역전.'
      },
      {
        id: '2000-12', dateStr: '2000.12', year: 2000, month: 12, label: "'00.12",
        phaseTitle: '닷컴 기업 연쇄 파산 & 벤처 투자 시장 동결', quadrant: 'DEFLATION_RECESSION',
        realGdp: 1.8, cpiInflation: 3.4, growthScore: -20, inflationScore: 15,
        fedRate: 6.50, netLiquidity: 1.05, usdkrw: 1264, sp500Index: 1320, kospiIndex: 504,
        treasury10Y: 5.11, goldPrice: 272, bitcoinPrice: 0,
        marketNote: '원/달러 환율 1,260원 돌파, 나스닥 연초 대비 -39% 마감.',
        theoreticalComparison: '주식 밸류에이션 붕괴와 함께 외환시장으로 안전자산 회귀 흐름 가속.'
      },
      {
        id: '2001-01', dateStr: '2001.01', year: 2001, month: 1, label: "'01.01",
        phaseTitle: '연준의 비정기 50bp 전격 긴급 금리인하 개시', quadrant: 'DEFLATION_RECESSION',
        realGdp: 0.9, cpiInflation: 3.7, growthScore: -40, inflationScore: 10,
        fedRate: 6.00, netLiquidity: 1.10, usdkrw: 1285, sp500Index: 1366, kospiIndex: 617,
        treasury10Y: 5.16, goldPrice: 265, bitcoinPrice: 0,
        marketNote: '그린스펀 의장의 깜짝 금리 인하로 단기 반등했으나 추세 반전 실패.',
        theoreticalComparison: '금리 인하가 경기 회복 신호가 아닌 불황의 방증으로 해석되며 매도 압력 잔존.'
      },
      {
        id: '2001-04', dateStr: '2001.04', year: 2001, month: 4, label: "'01.04",
        phaseTitle: '공격적 금리 인하(4.50%)에도 기업 설비투자 동결', quadrant: 'DEFLATION_RECESSION',
        realGdp: 0.5, cpiInflation: 3.3, growthScore: -50, inflationScore: 5,
        fedRate: 4.50, netLiquidity: 1.14, usdkrw: 1325, sp500Index: 1249, kospiIndex: 577,
        treasury10Y: 5.34, goldPrice: 264, bitcoinPrice: 0,
        marketNote: '연속 50bp 인하 지속, 시스코 등 대표 기술주 대규모 감원 단행.',
        theoreticalComparison: '과잉 설비(통신망 등) 해소가 선행되어야 하므로 통화완화의 시차 발생.'
      },
      {
        id: '2001-09', dateStr: '2001.09', year: 2001, month: 9, label: "'01.09",
        phaseTitle: '9.11 테러 발발 & 뉴욕증시 4일간 거래 중단', quadrant: 'DEFLATION_RECESSION',
        realGdp: -1.1, cpiInflation: 2.6, growthScore: -75, inflationScore: -10,
        fedRate: 3.00, netLiquidity: 1.25, usdkrw: 1300, sp500Index: 1040, kospiIndex: 479,
        treasury10Y: 4.59, goldPrice: 290, bitcoinPrice: 0,
        marketNote: '월드트레이드센터 붕괴 충격, 증시 재개장 후 패닉셀, 연준 긴급 유동성 투입.',
        theoreticalComparison: '지정학적 초특대 충격에 대응해 연준이 유동성을 퍼부었으나 소비심리 급랭.'
      },
      {
        id: '2001-12', dateStr: '2001.12', year: 2001, month: 12, label: "'01.12",
        phaseTitle: '엔론(Enron) 분식회계 파산 사태 & 기업 불신 확산', quadrant: 'DEFLATION_RECESSION',
        realGdp: 0.2, cpiInflation: 1.6, growthScore: -60, inflationScore: -30,
        fedRate: 1.75, netLiquidity: 1.28, usdkrw: 1313, sp500Index: 1148, kospiIndex: 693,
        treasury10Y: 5.05, goldPrice: 276, bitcoinPrice: 0,
        marketNote: '기준금리 1.75%까지 인하. 엔론 파산으로 미국 대기업 회계 불신 증폭.',
        theoreticalComparison: '신용 리스크 프리미엄이 폭등하여 국채와 회사채 스프레드가 극단적으로 확대.'
      },
      {
        id: '2002-06', dateStr: '2002.06', year: 2002, month: 6, label: "'02.06",
        phaseTitle: '월드컴(WorldCom) 사상 최대 파산 & 2차 폭락장', quadrant: 'DEFLATION_RECESSION',
        realGdp: 1.5, cpiInflation: 1.1, growthScore: -45, inflationScore: -40,
        fedRate: 1.75, netLiquidity: 1.30, usdkrw: 1205, sp500Index: 989, kospiIndex: 742,
        treasury10Y: 4.86, goldPrice: 320, bitcoinPrice: 0,
        marketNote: '월드컴 분식회계 쇼크로 나스닥 다시 연저점 경신, 안전자산 금 320달러 돌파.',
        theoreticalComparison: '경기 지표는 바닥을 통과 중이었으나 기업 신뢰 상실로 주식 밸류에이션 바닥 지연.'
      },
      {
        id: '2002-10', dateStr: '2002.10', year: 2002, month: 10, label: "'02.10",
        phaseTitle: 'S&P 500 최종 바닥(768pt) & 나스닥 -78% 폭락 저점', quadrant: 'DEFLATION_RECESSION',
        realGdp: 1.6, cpiInflation: 2.0, growthScore: -30, inflationScore: -20,
        fedRate: 1.75, netLiquidity: 1.32, usdkrw: 1240, sp500Index: 885, kospiIndex: 653,
        treasury10Y: 3.90, goldPrice: 317, bitcoinPrice: 0,
        marketNote: '2년 7개월간 이어진 하락장의 극단적 비관론 속에서 장기 바닥 형성.',
        theoreticalComparison: 'PER이 14배 수준까지 압축되고 10년물 금리가 3%대로 떨어지며 밸류에이션 매력 회복.'
      },
      {
        id: '2002-12', dateStr: '2002.12', year: 2002, month: 12, label: "'02.12",
        phaseTitle: '기준금리 1.25% 인하 & 장기 회복 국면 초입', quadrant: 'REFLATION',
        realGdp: 2.0, cpiInflation: 2.4, growthScore: 10, inflationScore: 0,
        fedRate: 1.25, netLiquidity: 1.35, usdkrw: 1186, sp500Index: 879, kospiIndex: 627,
        treasury10Y: 3.82, goldPrice: 342, bitcoinPrice: 0,
        marketNote: '이라크 전쟁 전운 감돌았으나 초저금리 유동성이 주택시장 및 실물경기 견인 시작.',
        theoreticalComparison: '초저금리(1.25%)가 부동산 대출 붐을 촉발시키며 차기 부동산 버블의 씨앗 배양.'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // 2. 2007~2009 서브프라임 & 글로벌 금융위기 (GFC)
  // ──────────────────────────────────────────────────────────
  {
    id: 'gfc-2008',
    name: '2007~2009 글로벌 금융위기 & 리만 브라더스 파산',
    shortTitle: '2008 금융위기',
    periodRange: '2007.06 ~ 2009.12',
    durationMonths: 31,
    tagColor: 'purple',
    coreQuadrant: 'DEFLATION_RECESSION',
    overview: {
      summary: '미국 서브프라임 모기지(비우량 주택담보대출) 부실과 파생상품(CDO/CDS) 붕괴로 월가 4대 투자은행 리만 브라더스가 파산하며 전 세계 금융 시스템이 마비된 1929년 대공황 이후 최악의 경제위기입니다. S&P 500은 -57% 폭락했고, 연준은 역사상 최초로 제로금리와 양적완화(QE)를 단행했습니다.',
      macroEnvironment: '글로벌 신용경색(Credit Crunch)과 부채 디레버리징으로 인한 극심한 복합 불황.',
      triggerEvent: '서브프라임 부실 ➔ 베어스턴스 매각 ➔ 리만브라더스 파산(2008.09) & AIG 구제금융',
      peakDrop: 'S&P 500 -56.8% 폭락, 미국 실업률 10.0% 폭등, 원/달러 1,597원 치솟음'
    },
    deepDive: {
      triggerBackground: '2000년대 초반의 초저금리가 만든 주택시장 버블과, 이를 기초자산으로 무분별하게 발행된 부채담보부증권(CDO)이 주택가격 하락과 함께 부실화되었습니다. 2007년 여름 BNP 파리바의 펀드 환매 중단을 시작으로 신용평가사들의 신용등급 강등이 이어지며 금융기관 간의 상호 신뢰가 완전히 증발했습니다.',
      policyResponse: '버냉키 연준 의장은 기준금리를 5.25%에서 0~0.25%까지 내렸으며, 전통적 금리 정책이 한계에 부딪히자 전대미문의 "양적완화(QE1)"를 통해 국채와 모기지증권(MBS)을 직접 사들여 유동성을 시장에 무제한 공급했습니다. 미 재무부의 7,000억 달러 구제금융(TARP)도 집행되었습니다.',
      assetImpact: '• 주식: S&P 500 지수가 1,565pt에서 666pt까지 -57% 궤멸적 폭락\n• 채권: 10년물 국채금리가 5.3%에서 2.0%대까지 급락(안전자산 쏠림)\n• 환율: 한국의 외화유동성 고갈 공포로 원/달러 환율이 900원대에서 1,597원까지 폭등\n• 원자재: 유가가 배럴당 147달러 피크를 찍은 뒤 30달러대까지 수직 추락',
      theoreticalDivergence: '통화량이 급증(QE)하면 초인플레이션이 발생한다는 통화주의 이론과 달리, 민간 은행들이 부실을 메우느라 대출을 중단(디레버리징)하면서 화폐유통속도가 급락하여 오히려 심각한 디플레이션이 지속되었습니다. 돈을 아무리 찍어도 실물 물가가 오르지 않는 구조적 변화가 발생했습니다.',
      keyLessons: '금융위기는 유동성 위기가 아니라 자본(Solvency) 위기입니다. 시스템 리스크가 발생했을 때 중앙은행의 마지막 대출자(Lender of Last Resort) 역할과 과감한 구제금융이 시장의 최종 바닥을 결정한다는 것을 입증했습니다.'
    },
    stats: {
      sp500MaxDrawdown: '-56.8%',
      peakFedRate: '5.25%',
      troughFedRate: '0.25%',
      treasury10YRange: '5.32% ➔ 2.05%',
      usdkrwPeak: '1,597원'
    },
    monthlySeries: [
      {
        id: '2007-07', dateStr: '2007.07', year: 2007, month: 7, label: "'07.07",
        phaseTitle: '서브프라임 부실 확산 & 베어스턴스 헤지펀드 파산', quadrant: 'REFLATION',
        realGdp: 2.5, cpiInflation: 2.4, growthScore: 20, inflationScore: 10,
        fedRate: 5.25, netLiquidity: 0.85, usdkrw: 923, sp500Index: 1455, kospiIndex: 1933,
        treasury10Y: 4.77, goldPrice: 665, bitcoinPrice: 0,
        marketNote: '주택 모기지 연체율 급등, 신용스프레드 확대 조짐.',
        theoreticalComparison: '지표상 고용과 소비는 견조했으나 파생상품 뇌관이 금융권 장부에 잠복.'
      },
      {
        id: '2007-09', dateStr: '2007.09', year: 2007, month: 9, label: "'07.09",
        phaseTitle: '연준 50bp 인하 단행 & 영국 노던록 은행 뱅크런', quadrant: 'DEFLATION_RECESSION',
        realGdp: 2.3, cpiInflation: 2.8, growthScore: 10, inflationScore: 15,
        fedRate: 4.75, netLiquidity: 0.88, usdkrw: 915, sp500Index: 1526, kospiIndex: 1946,
        treasury10Y: 4.59, goldPrice: 743, bitcoinPrice: 0,
        marketNote: '연준의 첫 금리 인하로 주가 일시적 신고가 경신(마지막 불꽃 불트랩).',
        theoreticalComparison: '주식시장은 금리 인하를 호재로 보았으나 은행간 자금시장은 이미 동결 상태.'
      },
      {
        id: '2008-03', dateStr: '2008.03', year: 2008, month: 3, label: "'08.03",
        phaseTitle: '월가 5대 투자은행 베어스턴스 붕괴 & JP모건 인수', quadrant: 'DEFLATION_RECESSION',
        realGdp: -0.7, cpiInflation: 4.0, growthScore: -35, inflationScore: 40,
        fedRate: 2.25, netLiquidity: 0.92, usdkrw: 991, sp500Index: 1322, kospiIndex: 1703,
        treasury10Y: 3.45, goldPrice: 933, bitcoinPrice: 0,
        marketNote: '유가 배럴당 100달러 돌파 속 금융기관 유동성 위기 병발(스태그플레이션 공포).',
        theoreticalComparison: '원자재발 물가 상승과 금융위기가 겹쳐 중앙은행의 정책 딜레마 극대화.'
      },
      {
        id: '2008-07', dateStr: '2008.07', year: 2008, month: 7, label: "'08.07",
        phaseTitle: '국제유가 147달러 피크 & 양대 모기지 패니매·프레디맥 부실', quadrant: 'STAGFLATION',
        realGdp: -1.2, cpiInflation: 5.6, growthScore: -50, inflationScore: 60,
        fedRate: 2.00, netLiquidity: 0.95, usdkrw: 1012, sp500Index: 1267, kospiIndex: 1594,
        treasury10Y: 3.98, goldPrice: 917, bitcoinPrice: 0,
        marketNote: '헤드라인 CPI 5.6% 치솟음, 미 정부 국책 모기지기관 국유화 준비.',
        theoreticalComparison: '물가 피크 직후 실물 수요 파괴(Demand Destruction)로 이어지는 전형적 전조.'
      },
      {
        id: '2008-09', dateStr: '2008.09', year: 2008, month: 9, label: "'08.09",
        phaseTitle: '리만 브라더스 파산 & AIG 구제금융 (글로벌 패닉)', quadrant: 'DEFLATION_RECESSION',
        realGdp: -2.8, cpiInflation: 4.9, growthScore: -80, inflationScore: 30,
        fedRate: 2.00, netLiquidity: 1.20, usdkrw: 1207, sp500Index: 1166, kospiIndex: 1448,
        treasury10Y: 3.85, goldPrice: 870, bitcoinPrice: 0,
        marketNote: '리만 파산 직후 머니마켓펀드(MMF) 원금 깨짐, 글로벌 달러 조달 시장 마비.',
        theoreticalComparison: '신용승수(Money Multiplier) 붕괴로 금융권 유동성이 일거에 증발.'
      },
      {
        id: '2008-10', dateStr: '2008.10', year: 2008, month: 10, label: "'08.10",
        phaseTitle: '전 세계 증시 블랙 먼데이 & 역사상 최대 투매', quadrant: 'DEFLATION_RECESSION',
        realGdp: -4.5, cpiInflation: 3.7, growthScore: -95, inflationScore: 0,
        fedRate: 1.00, netLiquidity: 1.80, usdkrw: 1291, sp500Index: 968, kospiIndex: 1113,
        treasury10Y: 3.97, goldPrice: 730, bitcoinPrice: 0,
        marketNote: '한 달간 S&P 500 -17%, 코스피 사이드카·서킷브레이커 연속 발동.',
        theoreticalComparison: '유동성 확보를 위해 금, 주식, 채권 구분 없는 전방위 무차별 투매 발생.'
      },
      {
        id: '2008-12', dateStr: '2008.12', year: 2008, month: 12, label: "'08.12",
        phaseTitle: '제로금리(0~0.25%) 선언 & 역사상 최초 양적완화(QE1) 가동', quadrant: 'DEFLATION_RECESSION',
        realGdp: -8.4, cpiInflation: 0.1, growthScore: -100, inflationScore: -50,
        fedRate: 0.25, netLiquidity: 2.25, usdkrw: 1373, sp500Index: 890, kospiIndex: 1124,
        treasury10Y: 2.25, goldPrice: 869, bitcoinPrice: 0,
        marketNote: '버냉키 의장 비전통적 통화정책 착수, 원/달러 연중 최고 1,515원 터치.',
        theoreticalComparison: '기준금리가 제로 하한선(Zero Lower Bound)에 도달하여 대차대조표 정책으로 전환.'
      },
      {
        id: '2009-03', dateStr: '2009.03', year: 2009, month: 3, label: "'09.03",
        phaseTitle: 'S&P 500 역사적 저점(666pt) & 은행 스트레스테스트', quadrant: 'DEFLATION_RECESSION',
        realGdp: -4.4, cpiInflation: -0.4, growthScore: -90, inflationScore: -60,
        fedRate: 0.25, netLiquidity: 2.10, usdkrw: 1570, sp500Index: 735, kospiIndex: 1206,
        treasury10Y: 2.71, goldPrice: 916, bitcoinPrice: 0,
        marketNote: '시티그룹, BOA 등 국유화 루머 속 공포 정점, 원/달러 1,597원 고점 기록.',
        theoreticalComparison: '극단적 비관론과 정부의 은행 자본확충 보증이 맞물리며 12년 대세상승장 시작.'
      },
      {
        id: '2009-06', dateStr: '2009.06', year: 2009, month: 6, label: "'09.06",
        phaseTitle: '공식 경기침체 종료 & 글로벌 동조 반등 랠리', quadrant: 'REFLATION',
        realGdp: 1.4, cpiInflation: -1.4, growthScore: -10, inflationScore: -40,
        fedRate: 0.25, netLiquidity: 2.05, usdkrw: 1285, sp500Index: 919, kospiIndex: 1390,
        treasury10Y: 3.53, goldPrice: 934, bitcoinPrice: 0,
        marketNote: 'NBER 공식 침체 18개월 만에 종료 선언, 중국의 4조 위안 경기부양 효과 가시화.',
        theoreticalComparison: '디플레이션 수치 하에서도 강력한 유동성 힘으로 위험자산 선행 랠리.'
      },
      {
        id: '2009-12', dateStr: '2009.12', year: 2009, month: 12, label: "'09.12",
        phaseTitle: '골디락스 회복 기대감 & 저금리 유동성 파티', quadrant: 'GOLDILOCKS',
        realGdp: 4.5, cpiInflation: 2.7, growthScore: 35, inflationScore: 10,
        fedRate: 0.25, netLiquidity: 2.24, usdkrw: 1167, sp500Index: 1115, kospiIndex: 1682,
        treasury10Y: 3.85, goldPrice: 1096, bitcoinPrice: 0,
        marketNote: 'S&P 500 저점 대비 +67% 반등하며 한 해 마감, 신흥국 증시 및 원자재 급등.',
        theoreticalComparison: '제로금리와 유동성 주입이 밸류에이션(PER)을 밀어 올리는 유동성 장세 만개.'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // 3. 2013~2014 버냉키 테이퍼 탠트럼 (Taper Tantrum)
  // ──────────────────────────────────────────────────────────
  {
    id: 'taper-tantrum-2013',
    name: '2013~2014 버냉키 테이퍼 탠트럼 (긴축 발작)',
    shortTitle: '2013 테이퍼탠트럼',
    periodRange: '2013.01 ~ 2014.06',
    durationMonths: 18,
    tagColor: 'amber',
    coreQuadrant: 'REFLATION',
    overview: {
      summary: '2013년 5월 벤 버냉키 연준 의장이 의회 청문회에서 "앞으로 몇 번의 회의에서 자산 매입 속도(QE)를 늦출 수 있다(Taper)"고 언급하자마자 전 세계 채권금리가 폭등하고 신흥국에서 자금이 썰물처럼 빠져나간 시장 발작(Tantrum) 사태입니다.',
      macroEnvironment: '완만한 경기 회복 국면에서 중앙은행의 완화 기조 축소(테이퍼링) 시사에 따른 금융충격.',
      triggerEvent: '버냉키 의장의 양적완화 축소(Tapering) 시사 발언 (2013.05.22)',
      peakDrop: '미 국채 10년물 금리 1.63% ➔ 3.03% 수직 급등, 신흥국 취약 5개국(Fragile 5) 통화 폭락'
    },
    deepDive: {
      triggerBackground: '2008년 금융위기 이후 연준의 세 차례 양적완화(QE1, QE2, QE3)로 금융시장은 "영원히 공급될 유동성"에 중독되어 있었습니다. 글로벌 캐리 트레이드 자금이 브라질, 인도, 인도네시아 등 신흥국으로 쏟아져 들어간 상태였습니다. 5월 22일 버냉키 의장의 한마디는 이 거대한 자금 흐름의 방향을 단번에 뒤집어 놓았습니다.',
      policyResponse: '시장 발작으로 채권금리가 100bp 이상 폭등하자, 연준은 시장을 진정시키기 위해 "테이퍼링(자산매입 축소)은 금리 인상(Hike)이 아니다"라는 포워드 가이던스(선제적 안내)를 강화했습니다. 실제 자산매입 축소는 시장이 소화할 시간을 준 뒤 2013년 12월에야 100억 달러 축소로 조심스럽게 시작되었습니다.',
      assetImpact: '• 채권: 미 10년물 국채금리가 몇 달 만에 1.63%에서 3.03%로 2배 가까이 폭등(채권 투자자 괴멸적 손실)\n• 신흥국: 인도 루피, 인도네시아 루피아 등 통화가치 폭락, 증시 급락\n• 주식: 미국 S&P 500은 단기 조정을 겪었으나 펀더멘털 개선을 바탕으로 연말 신고가 행진 지속\n• 금: 실질금리 급등으로 금값이 온스당 1,600달러대에서 1,200달러대로 -28% 급락',
      theoreticalDivergence: '양적완화 규모를 줄였을 뿐 여전히 매달 수백억 달러를 사들이며 돈을 풀고 있었음에도, 시장은 이를 "초긴축"으로 받아들여 금리가 급등했습니다. 자산 가격은 실제 자금의 유입량보다 "기대(Expectation)의 변화 속도"에 훨씬 민감하게 반응한다는 것을 보여주었습니다.',
      keyLessons: '중앙은행의 커뮤니케이션 미숙이 시장에 얼마나 파괴적인 변동성을 유발할 수 있는지 보여준 대표적 사례입니다. 이후 연준은 테이퍼링을 할 때 수개월 전부터 예고하고 신호를 분산시키는 프로토콜을 정립하게 되었습니다.'
    },
    stats: {
      sp500MaxDrawdown: '-5.8% (단기 조정 후 반등)',
      peakFedRate: '0.25% (금리동결)',
      troughFedRate: '0.25%',
      treasury10YRange: '1.63% ➔ 3.03%',
      usdkrwPeak: '1,163원'
    },
    monthlySeries: [
      {
        id: '2013-01', dateStr: '2013.01', year: 2013, month: 1, label: "'13.01",
        phaseTitle: 'QE3(월 850억 달러 자산매입) 지속 & 완만한 회복', quadrant: 'GOLDILOCKS',
        realGdp: 2.8, cpiInflation: 1.6, growthScore: 25, inflationScore: -15,
        fedRate: 0.25, netLiquidity: 2.95, usdkrw: 1065, sp500Index: 1498, kospiIndex: 1961,
        treasury10Y: 1.91, goldPrice: 1664, bitcoinPrice: 0.02,
        marketNote: '고용지표 개선세 속에서 주식시장 연초 랠리 지속.',
        theoreticalComparison: '중앙은행의 무제한 유동성 약속으로 시장 변동성 지수(VIX) 최저점 부근.'
      },
      {
        id: '2013-05', dateStr: '2013.05', year: 2013, month: 5, label: "'13.05",
        phaseTitle: '버냉키 의회 청문회 "테이퍼링 가능성" 전격 시사', quadrant: 'REFLATION',
        realGdp: 2.5, cpiInflation: 1.4, growthScore: 20, inflationScore: -20,
        fedRate: 0.25, netLiquidity: 3.30, usdkrw: 1118, sp500Index: 1630, kospiIndex: 2001,
        treasury10Y: 2.16, goldPrice: 1387, bitcoinPrice: 0.12,
        marketNote: '5월 22일 청문회 발언 직후 채권시장 투매 개시, 글로벌 금리 급등 시작.',
        theoreticalComparison: '실제 통화정책 축소가 시작되지 않았음에도 심리적 할인율 폭등으로 채권 급락.'
      },
      {
        id: '2013-06', dateStr: '2013.06', year: 2013, month: 6, label: "'13.06",
        phaseTitle: '글로벌 채권시장 패닉 & 신흥국 Fragile 5 통화 급락', quadrant: 'REFLATION',
        realGdp: 2.4, cpiInflation: 1.8, growthScore: 15, inflationScore: -10,
        fedRate: 0.25, netLiquidity: 3.42, usdkrw: 1152, sp500Index: 1606, kospiIndex: 1863,
        treasury10Y: 2.52, goldPrice: 1223, bitcoinPrice: 0.10,
        marketNote: '원/달러 1,160원대 상승, 인도 루피화 사상 최저치 폭락, 금값 폭락.',
        theoreticalComparison: '미국 자산보다 신흥국 자산이 먼저 타격을 입는 글로벌 자금 회수 현상.'
      },
      {
        id: '2013-09', dateStr: '2013.09', year: 2013, month: 9, label: "'13.09",
        phaseTitle: '연준 9월 FOMC에서 테이퍼링 전격 연기 (비둘기파 반격)', quadrant: 'GOLDILOCKS',
        realGdp: 3.1, cpiInflation: 1.2, growthScore: 30, inflationScore: -25,
        fedRate: 0.25, netLiquidity: 3.65, usdkrw: 1074, sp500Index: 1681, kospiIndex: 1996,
        treasury10Y: 2.64, goldPrice: 1326, bitcoinPrice: 0.13,
        marketNote: '시장 충격을 감안해 테이퍼링 착수 연기 결정, 안도 랠리 재개.',
        theoreticalComparison: '연준이 시장의 발작에 굴복해 정책 실행 속도를 늦추는 전형적 "연준 풋".'
      },
      {
        id: '2013-12', dateStr: '2013.12', year: 2013, month: 12, label: "'13.12",
        phaseTitle: '공식 테이퍼링(월 100억 달러 축소) 개시 & 국채 3.0% 도달', quadrant: 'GOLDILOCKS',
        realGdp: 3.2, cpiInflation: 1.5, growthScore: 35, inflationScore: -15,
        fedRate: 0.25, netLiquidity: 3.90, usdkrw: 1055, sp500Index: 1848, kospiIndex: 2011,
        treasury10Y: 3.03, goldPrice: 1204, bitcoinPrice: 0.75,
        marketNote: '미국채 10년물 3.03% 터치했으나, 주식시장은 경기 자신감으로 해석하며 사상 최고치.',
        theoreticalComparison: '불확실성이 제거되자 금리 상승에도 불구하고 주가가 상승하는 펀더멘털 장세.'
      },
      {
        id: '2014-06', dateStr: '2014.06', year: 2014, month: 6, label: "'14.06",
        phaseTitle: '옐런 신임 의장 취임 & 순조로운 테이퍼링 마무리', quadrant: 'GOLDILOCKS',
        realGdp: 4.0, cpiInflation: 2.1, growthScore: 40, inflationScore: 5,
        fedRate: 0.25, netLiquidity: 4.25, usdkrw: 1013, sp500Index: 1960, kospiIndex: 2002,
        treasury10Y: 2.53, goldPrice: 1315, bitcoinPrice: 0.64,
        marketNote: '채권금리 오히려 2.5%대로 하락 안정, 미국 주식 대세 상승장 지속.',
        theoreticalComparison: '초기 긴축 발작이 지나가면 실물 경기 회복이 채권과 주식을 모두 안정시킴.'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // 4. 2018.06~2019.06 파월 긴축 쇼크 & 미중 무역전쟁 (트럼프 1기)
  // ──────────────────────────────────────────────────────────
  {
    id: 'powell-pivot-2018',
    name: '2018~2019 파월 긴축 쇼크 & 미중 무역전쟁 (트럼프 1기)',
    shortTitle: '2018 파월 피벗',
    periodRange: '2018.06 ~ 2019.06',
    durationMonths: 13,
    tagColor: 'blue',
    coreQuadrant: 'STAGFLATION',
    overview: {
      summary: '트럼프 1기 행정부의 대중국 관세 폭탄과 무역전쟁 격화 속에서, 제롬 파월 신임 연준 의장이 "중립금리까지 갈 길이 멀다", "양적긴축(QT)은 오토파일럿"이라며 금리 인상(2.50%)과 자산 축소를 밀어붙여 2018년 12월 뉴욕증시가 -20% 폭락했던 사건입니다. 파월은 2019년 1월 전격 항복(Pivot)하며 금리 인하로 돌아섰습니다.',
      macroEnvironment: '무역분쟁發 글로벌 경기 둔화 우려와 연준의 기계적 긴축이 충돌한 정책 에러 국면.',
      triggerEvent: '파월 의장의 "중립금리 한참 멀었다" 발언 (2018.10.03) + 크리스마스 이브 폭락',
      peakDrop: 'S&P 500 -19.8% (베어마켓 턱밑), 나스닥 -23% 폭락'
    },
    deepDive: {
      triggerBackground: '2017년 말 트럼프 감세안으로 미국 경제가 일시적 호황을 누리자, 연준은 인플레이션을 선제 차단하겠다며 연 4회 금리 인상을 단행했습니다. 동시에 연간 5,000억 달러 규모의 대차대조표 축소(QT)를 진행했습니다. 그러나 미중 무역전쟁으로 제조업 PMI가 급락하고 기업 심리가 위축되는 상태에서 가해진 무리한 긴축이었습니다.',
      policyResponse: '12월 증시가 1931년 대공황 이후 최악의 12월 폭락세를 기록하자, 파월 의장은 2019년 1월 전미경제학회(AEA) 연설에서 "시장의 소리에 귀 기울이겠다", "정책은 인내심(Patient)을 가질 것"이라며 백기 투항했습니다. 이어 2019년 여름 세 차례의 선제적 "보험성 금리 인하(Insurance Cut)"를 단행했습니다.',
      assetImpact: '• 주식: 2018년 4분기 S&P 500 -20% 폭락 후, 2019년 상반기 파월 피벗으로 전고점 회복 V자 랠리\n• 채권: 10년물 금리가 3.24% 피크를 친 뒤 2019년 중반 2.0% 아래로 수직 하강(장단기 금리 역전 발생)\n• 환율: 미중 무역 갈등으로 원/달러 환율이 1,060원에서 1,190원대까지 상승\n• 비트코인: 2018년 암호화폐 혹한기 속 3,200달러까지 바닥을 친 후 2019년 유동성 재개로 13,000달러 급등',
      theoreticalDivergence: '중앙은행은 경기 사이클에 맞춰 독립적으로 움직여야 한다는 정통 이론과 달리, 금융시장의 급격한 자산가치 하락(금융여건 긴축)이 실물경제를 침체로 몰고 갈 수 있다는 우려 때문에 시장의 가격 폭락에 정책을 완전히 맞추어 굴복하는 현실을 적나라하게 드러냈습니다.',
      keyLessons: '연준의 정책 기조가 "오토파일럿 긴축"에서 "시장 친화적 피벗"으로 전환되는 변곡점은 역사상 가장 강력한 주식 매수 기회가 됩니다. 중앙은행의 고집은 시장의 폭락 앞에서 오래 버티지 못합니다.'
    },
    stats: {
      sp500MaxDrawdown: '-19.8%',
      peakFedRate: '2.50%',
      troughFedRate: '1.75%',
      treasury10YRange: '3.24% ➔ 1.95%',
      usdkrwPeak: '1,195원'
    },
    monthlySeries: [
      {
        id: '2018-06', dateStr: '2018.06', year: 2018, month: 6, label: "'18.06",
        phaseTitle: '미중 관세 전쟁 서막 & 연준 분기별 금리 인상', quadrant: 'REFLATION',
        realGdp: 3.3, cpiInflation: 2.9, growthScore: 30, inflationScore: 20,
        fedRate: 2.00, netLiquidity: 4.10, usdkrw: 1114, sp500Index: 2718, kospiIndex: 2326,
        treasury10Y: 2.86, goldPrice: 1253, bitcoinPrice: 6.4,
        marketNote: '미국 500억 달러 대중 관세 발표, 미국 경제 호황 속 연준 2.0% 인상.',
        theoreticalComparison: '감세 효과로 미국만 홀로 독주하는 "미국 예외주의(US Exceptionalism)" 장세.'
      },
      {
        id: '2018-10', dateStr: '2018.10', year: 2018, month: 10, label: "'18.10",
        phaseTitle: '파월 "중립금리 멀었다" 매파 발언 & 미 국채 10년물 3.24% 피크', quadrant: 'STAGFLATION',
        realGdp: 2.5, cpiInflation: 2.5, growthScore: 10, inflationScore: 15,
        fedRate: 2.25, netLiquidity: 3.98, usdkrw: 1139, sp500Index: 2711, kospiIndex: 2029,
        treasury10Y: 3.16, goldPrice: 1215, bitcoinPrice: 6.3,
        marketNote: '파월 의장의 초강경 긴축 의지 표명으로 채권금리 7년 만의 최고치 경신, 주식 투매.',
        theoreticalComparison: '중립금리를 과대평가한 중앙은행의 정책 실기(Policy Error) 리스크 발생.'
      },
      {
        id: '2018-12', dateStr: '2018.12', year: 2018, month: 12, label: "'18.12",
        phaseTitle: '크리스마스 이브 쇼크 (S&P 500 -20% 베어마켓)', quadrant: 'DEFLATION_RECESSION',
        realGdp: 1.3, cpiInflation: 1.9, growthScore: -25, inflationScore: -10,
        fedRate: 2.50, netLiquidity: 3.88, usdkrw: 1122, sp500Index: 2506, kospiIndex: 2041,
        treasury10Y: 2.68, goldPrice: 1282, bitcoinPrice: 3.7,
        marketNote: '트럼프 대통령의 파월 해임 검토설, 므누신 재무장관 은행 유동성 점검 회의 논란.',
        theoreticalComparison: '주식 폭락으로 금융여건지수(FCI)가 급격히 위축되어 실물경기 침체 경고음.'
      },
      {
        id: '2019-01', dateStr: '2019.01', year: 2019, month: 1, label: "'19.01",
        phaseTitle: '파월 전격 항복(Pivot) "통화정책 유연성 & 인내심"', quadrant: 'REFLATION',
        realGdp: 2.2, cpiInflation: 1.6, growthScore: 10, inflationScore: -15,
        fedRate: 2.50, netLiquidity: 3.85, usdkrw: 1117, sp500Index: 2704, kospiIndex: 2204,
        treasury10Y: 2.63, goldPrice: 1321, bitcoinPrice: 3.4,
        marketNote: '파월의 백기투항 연설 직후 전 세계 증시 V자 폭등 반등 출발.',
        theoreticalComparison: '금리를 실제 내리지 않고 구두 개입(Forward Guidance)만으로 금융시장 안도 유도.'
      },
      {
        id: '2019-06', dateStr: '2019.06', year: 2019, month: 6, label: "'19.06",
        phaseTitle: '보험성 금리인하 시사 & 장단기 금리 역전 경고음', quadrant: 'GOLDILOCKS',
        realGdp: 2.6, cpiInflation: 1.6, growthScore: 20, inflationScore: -15,
        fedRate: 2.50, netLiquidity: 3.78, usdkrw: 1158, sp500Index: 2941, kospiIndex: 2130,
        treasury10Y: 2.01, goldPrice: 1409, bitcoinPrice: 10.8,
        marketNote: 'S&P 500 사상 최고치 경신, 금값 1,400달러 돌파, 비트코인 1만 달러 재탈환.',
        theoreticalComparison: '중앙은행의 금리 인하 선회 확신이 위험자산 전반의 강력한 멀티플 확장 견인.'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // 5. 2020.01~2021.12 코로나19 팬데믹 & 무제한 양적완화 (V자 반등)
  // ──────────────────────────────────────────────────────────
  {
    id: 'covid-pandemic-2020',
    name: '2020~2021 코로나19 팬데믹 & 무제한 양적완화',
    shortTitle: '2020 코로나 팬데믹',
    periodRange: '2020.01 ~ 2021.12',
    durationMonths: 24,
    tagColor: 'emerald',
    coreQuadrant: 'GOLDILOCKS',
    overview: {
      summary: '2020년 3월 전 세계적인 코로나19 바이러스 확산과 락다운으로 세계 경제가 일시에 셧다운되며 주식시장이 한 달 만에 -34% 폭락(서킷브레이커 4회)했습니다. 연준은 즉각 제로금리와 "무제한 양적완화(Unlimited QE)"를 가동했고, 대차대조표를 9조 달러까지 폭발시키며 인류 역사상 가장 빠르고 강력한 V자 유동성 랠리를 연출했습니다.',
      macroEnvironment: '초유의 실물 셧다운 디플레이션 충격 후, 전례 없는 통화·재정 쌍끌이 부양으로 초호황 골디락스 진입.',
      triggerEvent: 'WHO 팬데믹 선언 (2020.03.11) + 전 세계 국경 폐쇄 및 실물경제 셧다운',
      peakDrop: 'S&P 500 단 23거래일 만에 -33.9% 폭락 ➔ 이후 1년 반 동안 +114% 수직 랠리'
    },
    deepDive: {
      triggerBackground: '자연재해에 준하는 전염병 충격으로 인류의 이동과 경제활동이 강제로 멈췄습니다. 2020년 3월 유동성 패닉이 발생하며 안전자산인 미국 국채와 금마저 현금화 매물로 투매되는 극단적인 "달러 현금 쟁탈전(Dash for Cash)"이 벌어졌습니다.',
      policyResponse: '연준은 두 차례의 일요일 긴급회의를 통해 기준금리를 150bp 단숨에 내려 0.00~0.25%로 낮추었습니다. 나아가 매입 한도가 없는 "무제한 QE", 회사채 직접 매입(SMCCF), 해외 중앙은행과의 달러 스왑 라인을 개설했습니다. 미국 의회는 5조 달러가 넘는 재난지원금(CARES Act)을 국민들의 계좌에 직접 꽂아 넣었습니다.',
      assetImpact: '• 주식: 2020년 3월 23일 바닥 후 언택트 빅테크(FAANG)와 테슬라 주도 역사상 최단기 V자 폭등\n• 가상자산: 비트코인이 4,000달러에서 2021년 말 69,000달러까지 17배 폭등\n• 채권: 10년물 국채금리가 0.54%라는 역사상 최저치 기록\n• 유가: 원유 저장시설 포화로 WTI 선물 가격이 사상 최초 마이너스(-37달러) 기록 후 반등',
      theoreticalDivergence: '실물경제가 마이너스 성장(-30% 연율)을 기록하고 실업자가 수천만 명 쏟아지는 최악의 불황 속에서 주식시장이 사상 최고치를 경신하는 극단적인 "실물과 금융의 디커플링"이 발생했습니다. 통화 유동성의 규모가 펀더멘털의 악화를 완전히 압도할 수 있음을 보여준 최고의 사례입니다.',
      keyLessons: '중앙은행과 정부가 "무제한 머니 프린팅"으로 시스템 붕괴를 막겠다고 선언할 때, 시장에 맞서 숏(매도) 포지션을 잡는 것은 자살행위입니다. 유동성의 홍수는 결국 자산 인플레이션으로 직결됩니다.'
    },
    stats: {
      sp500MaxDrawdown: '-33.9%',
      peakFedRate: '1.75% ➔ 0.25%',
      troughFedRate: '0.25%',
      treasury10YRange: '1.88% ➔ 0.54% ➔ 1.68%',
      usdkrwPeak: '1,285원'
    },
    monthlySeries: [
      {
        id: '2020-01', dateStr: '2020.01', year: 2020, month: 1, label: "'20.01",
        phaseTitle: '미중 1단계 무역합의 서명 & 우한 폐렴 초기 보고', quadrant: 'GOLDILOCKS',
        realGdp: 2.1, cpiInflation: 2.5, growthScore: 25, inflationScore: 10,
        fedRate: 1.75, netLiquidity: 4.15, usdkrw: 1168, sp500Index: 3225, kospiIndex: 2119,
        treasury10Y: 1.51, goldPrice: 1589, bitcoinPrice: 9.3,
        marketNote: '글로벌 증시 낙관론 팽배, 바이러스 국지적 영향으로 과소평가.',
        theoreticalComparison: '신종 리스크 발생 초기 금융시장의 안이한 자기확증 편향.'
      },
      {
        id: '2020-03', dateStr: '2020.03', year: 2020, month: 3, label: "'20.03",
        phaseTitle: 'WHO 팬데믹 선언 & 서킷브레이커 4회 발동 (유동성 패닉)', quadrant: 'DEFLATION_RECESSION',
        realGdp: -5.1, cpiInflation: 1.5, growthScore: -100, inflationScore: -30,
        fedRate: 0.25, netLiquidity: 4.85, usdkrw: 1285, sp500Index: 2584, kospiIndex: 1754,
        treasury10Y: 0.67, goldPrice: 1612, bitcoinPrice: 6.4,
        marketNote: '3월 23일 연준 무제한 QE 발표, WTI 원유 폭락, 비트코인 4천 달러 추락.',
        theoreticalComparison: '현금 선호로 모든 자산이 동반 매도되는 극단적 마진콜 유동성 경색.'
      },
      {
        id: '2020-08', dateStr: '2020.08', year: 2020, month: 8, label: "'20.08",
        phaseTitle: '재난지원금 & 빅테크 주도 언택트 유동성 광풍', quadrant: 'GOLDILOCKS',
        realGdp: 33.4, cpiInflation: 1.3, growthScore: 60, inflationScore: -10,
        fedRate: 0.25, netLiquidity: 6.80, usdkrw: 1187, sp500Index: 3500, kospiIndex: 2326,
        treasury10Y: 0.71, goldPrice: 1967, bitcoinPrice: 11.6,
        marketNote: '금 온스당 2,075달러 사상 최고치 경신, 애플·테슬라 주식 액면분할 랠리.',
        theoreticalComparison: '실질금리가 마이너스 심해로 추락하며 무수익 자산(금, 비트코인)과 성장주 폭등.'
      },
      {
        id: '2020-11', dateStr: '2020.11', year: 2020, month: 11, label: "'20.11",
        phaseTitle: '화이자 백신 95% 효능 발표 & 바이든 당선 안도 랠리', quadrant: 'REFLATION',
        realGdp: 4.5, cpiInflation: 1.2, growthScore: 50, inflationScore: 0,
        fedRate: 0.25, netLiquidity: 7.15, usdkrw: 1106, sp500Index: 3621, kospiIndex: 2591,
        treasury10Y: 0.84, goldPrice: 1775, bitcoinPrice: 19.6,
        marketNote: '경기민감주·여행항공주 폭등, 비트코인 3년 만에 2만 달러 돌파.',
        theoreticalComparison: '백신 개발로 디플레이션 공포가 완벽히 소멸되고 리플레이션 국면으로 전환.'
      },
      {
        id: '2021-04', dateStr: '2021.04', year: 2021, month: 4, label: "'21.04",
        phaseTitle: '1.9조 달러 부양책 통과 & 암호화폐 불장 (코인베이스 상장)', quadrant: 'REFLATION',
        realGdp: 6.3, cpiInflation: 4.2, growthScore: 65, inflationScore: 45,
        fedRate: 0.25, netLiquidity: 7.80, usdkrw: 1112, sp500Index: 4181, kospiIndex: 3147,
        treasury10Y: 1.63, goldPrice: 1768, bitcoinPrice: 57.7,
        marketNote: 'CPI 4.2% 폭등했으나 파월 "인플레이션은 일시적(Transitory)" 일축.',
        theoreticalComparison: '중앙은행의 인플레이션 방관(AIT 정책) 속에 투기적 자산 열기 극대화.'
      },
      {
        id: '2021-11', dateStr: '2021.11', year: 2021, month: 11, label: "'21.11",
        phaseTitle: '비트코인 69K 사상 최고치 & 테이퍼링 공식 발표', quadrant: 'STAGFLATION',
        realGdp: 6.9, cpiInflation: 6.8, growthScore: 45, inflationScore: 70,
        fedRate: 0.25, netLiquidity: 8.45, usdkrw: 1188, sp500Index: 4567, kospiIndex: 2839,
        treasury10Y: 1.44, goldPrice: 1774, bitcoinPrice: 57.0,
        marketNote: 'CPI 6.8%로 39년 만의 최고치 기록, 파월 "일시적 단어 은퇴" 선언.',
        theoreticalComparison: '공급망 병목과 과잉 유동성이 결합하여 거대한 인플레이션 괴물 탄생.'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // 6. 2022.01~2023.12 40년 만의 대인플레이션 & 울트라 긴축
  // ──────────────────────────────────────────────────────────
  {
    id: 'inflation-shock-2022',
    name: '2022~2023 대인플레이션 & 500bp 울트라 긴축',
    shortTitle: '2022 인플레 쇼크',
    periodRange: '2022.01 ~ 2023.12',
    durationMonths: 24,
    tagColor: 'rose',
    coreQuadrant: 'STAGFLATION',
    overview: {
      summary: '코로나19 유동성 과잉과 공급망 붕괴, 러시아-우크라이나 전쟁이 겹치며 미국의 헤드라인 CPI가 9.1%까지 폭등했습니다. 연준은 1980년대 볼커 이후 가장 공격적인 4연속 자이언트 스텝(75bp)을 단행해 금리를 0.25%에서 5.50%까지 525bp 초고속 인상했습니다. 주식과 채권이 동시에 -20% 이상 폭락하는 50년 만의 동반 약세장이 전개되었습니다.',
      macroEnvironment: '고물가·고금리·성장 둔화가 결합된 전형적인 스태그플레이션 공포 국면.',
      triggerEvent: '러시아의 우크라이나 침공 (2022.02) + 미국 6월 CPI 9.1% 폭등',
      peakDrop: 'S&P 500 -25.4%, 나스닥 -35.5%, 미 국채 10년물 1.5% ➔ 5.02% 폭등'
    },
    deepDive: {
      triggerBackground: '연준이 2021년 내내 "인플레이션은 일시적"이라는 오판 하에 돈 풀기를 지속했습니다. 2022년 2월 러시아의 우크라이나 침공으로 원유가 130달러, 곡물 가격이 폭등하자 인플레이션에 기름을 부었습니다. 6월 미국 CPI가 9.1%로 41년 만의 최고치를 찍자 시장은 통제 불능의 공포에 휩싸였습니다.',
      policyResponse: '파월 의장은 "고통(Pain)이 따르더라도 물가를 잡겠다"며 6월, 7월, 9월, 11월 4회 연속 75bp 자이언트 스텝이라는 전무후무한 속도전을 벌였습니다. 여기에 매달 950억 달러의 양적긴축(QT)을 병행했습니다. 급격한 금리 인상 충격으로 2023년 3월 실리콘밸리은행(SVB)이 파산하자 긴급 대출(BTFP)로 진화했습니다.',
      assetImpact: '• 주식: 기술주 중심 나스닥 -35%, 메타 -70%, 테슬라 -65% 등 고PER 성장주 궤멸\n• 채권: "채권은 안전자산"이라는 통념이 깨지며 10년물 금리가 5.02%까지 폭등(미국 장기채 ETF -50% 반토막)\n• 60/40 포트폴리오: 주식과 채권이 동반 폭락하며 1937년 이후 최악의 성과(-17%) 기록\n• 환율: 킹달러(달러인덱스 114) 속에서 원/달러 환율이 1,444원까지 치솟음\n• 가상자산: 루나-테라 붕괴, FTX 파산 사태로 비트코인이 15,000달러대까지 추락',
      theoreticalDivergence: '현대 포트폴리오 이론(MPT)의 핵심 전제인 "주식이 떨어질 때 채권이 올라 완충한다"는 주식-채권 음(-)의 상관관계가 완전히 붕괴되었습니다. 물가 충격 시기에는 할인율 상승으로 주식과 채권이 모두 동시에 패망한다는 냉혹한 진실을 증명했습니다.',
      keyLessons: '인플레이션 국면에서 가장 위험한 것은 현금이 아니라 "장기 채권"과 "꿈만 있고 이익이 없는 성장주"입니다. 연준과의 싸움(Don\'t fight the Fed)을 피하고 실질 현금흐름이 창출되는 고배당·가치주와 단기 단기채로 피신해야 함을 각인시켰습니다.'
    },
    stats: {
      sp500MaxDrawdown: '-25.4%',
      peakFedRate: '0.25% ➔ 5.50%',
      troughFedRate: '0.25%',
      treasury10YRange: '1.51% ➔ 5.02%',
      usdkrwPeak: '1,444원'
    },
    monthlySeries: [
      {
        id: '2022-01', dateStr: '2022.01', year: 2022, month: 1, label: "'22.01",
        phaseTitle: '긴축 시계 가속화 & 성장주 밸류에이션 조정 시작', quadrant: 'STAGFLATION',
        realGdp: -1.6, cpiInflation: 7.5, growthScore: -5, inflationScore: 70,
        fedRate: 0.25, netLiquidity: 8.50, usdkrw: 1205, sp500Index: 4515, kospiIndex: 2977,
        treasury10Y: 1.78, goldPrice: 1797, bitcoinPrice: 38.5,
        marketNote: '연준 3월 조기 금리 인상 및 대차대조표 축소(QT) 검토 발표.',
        theoreticalComparison: '초저금리 시대의 종말을 선언하자 장기 듀레이션 성장주부터 급락.'
      },
      {
        id: '2022-03', dateStr: '2022.03', year: 2022, month: 3, label: "'22.03",
        phaseTitle: '러시아의 우크라이나 침공 & 연준 첫 25bp 금리 인상', quadrant: 'STAGFLATION',
        realGdp: -1.4, cpiInflation: 8.5, growthScore: -15, inflationScore: 85,
        fedRate: 0.50, netLiquidity: 8.45, usdkrw: 1212, sp500Index: 4530, kospiIndex: 2757,
        treasury10Y: 2.34, goldPrice: 1937, bitcoinPrice: 45.5,
        marketNote: '국제유가 배럴당 130달러 돌파, 원자재·곡물 공급망 대혼란.',
        theoreticalComparison: '비용 인상 인플레이션(Cost-push)으로 스태그플레이션 위험 급증.'
      },
      {
        id: '2022-06', dateStr: '2022.06', year: 2022, month: 6, label: "'22.06",
        phaseTitle: 'CPI 9.1% 쇼크 & 28년 만의 75bp 자이언트 스텝', quadrant: 'STAGFLATION',
        realGdp: -0.6, cpiInflation: 9.1, growthScore: -25, inflationScore: 98,
        fedRate: 1.75, netLiquidity: 8.20, usdkrw: 1298, sp500Index: 3785, kospiIndex: 2332,
        treasury10Y: 3.01, goldPrice: 1807, bitcoinPrice: 19.8,
        marketNote: '루나-테라 코인 붕괴, S&P 500 공식 베어마켓(-20%) 진입.',
        theoreticalComparison: '중앙은행의 인플레이션 통제력 상실 우려 속에 시장 신뢰도 급락.'
      },
      {
        id: '2022-09', dateStr: '2022.09', year: 2022, month: 9, label: "'22.09",
        phaseTitle: '파월 잭슨홀 "고통(Pain)" 연설 & 킹달러(환율 1,444원)', quadrant: 'STAGFLATION',
        realGdp: 2.7, cpiInflation: 8.2, growthScore: 10, inflationScore: 80,
        fedRate: 3.25, netLiquidity: 7.75, usdkrw: 1440, sp500Index: 3585, kospiIndex: 2155,
        treasury10Y: 3.83, goldPrice: 1660, bitcoinPrice: 19.4,
        marketNote: '영국 트러스 총리 감세안 파동으로 길트채 폭락, 영란은행 긴급 개입.',
        theoreticalComparison: '고금리와 강달러가 글로벌 금융 시스템의 가장 약한 고리를 강타.'
      },
      {
        id: '2022-10', dateStr: '2022.10', year: 2022, month: 10, label: "'22.10",
        phaseTitle: 'S&P 500 저점(3,491pt) & CPI 둔화 조짐', quadrant: 'STAGFLATION',
        realGdp: 2.6, cpiInflation: 7.7, growthScore: 15, inflationScore: 70,
        fedRate: 3.25, netLiquidity: 7.65, usdkrw: 1424, sp500Index: 3871, kospiIndex: 2293,
        treasury10Y: 4.05, goldPrice: 1633, bitcoinPrice: 20.5,
        marketNote: '극도의 공포 속에서 주식시장 연중 최저점 형성 후 바닥 통과.',
        theoreticalComparison: '물가가 비록 7%대였으나 "피크아웃(정점 통과)" 기대감이 저점 매수세 유입.'
      },
      {
        id: '2023-03', dateStr: '2023.03', year: 2023, month: 3, label: "'23.03",
        phaseTitle: '실리콘밸리은행(SVB) 파산 & 연준 긴급 BTFP 대출', quadrant: 'DEFLATION_RECESSION',
        realGdp: 2.2, cpiInflation: 5.0, growthScore: 10, inflationScore: 40,
        fedRate: 5.00, netLiquidity: 7.40, usdkrw: 1303, sp500Index: 4109, kospiIndex: 2476,
        treasury10Y: 3.47, goldPrice: 1969, bitcoinPrice: 28.5,
        marketNote: '금리 급등으로 은행 채권 평가손 발생, 연준의 예금 전액 보증으로 진화.',
        theoreticalComparison: '초고속 금리 인상이 지방은행 뱅크런을 촉발했으나 유동성 지원으로 확산 차단.'
      },
      {
        id: '2023-10', dateStr: '2023.10', year: 2023, month: 10, label: "'23.10",
        phaseTitle: '미 국채 10년물 5.02% 돌파 (16년 만의 최고치) & 마지막 투매', quadrant: 'STAGFLATION',
        realGdp: 4.9, cpiInflation: 3.2, growthScore: 45, inflationScore: 25,
        fedRate: 5.50, netLiquidity: 6.85, usdkrw: 1350, sp500Index: 4193, kospiIndex: 2277,
        treasury10Y: 4.93, goldPrice: 1983, bitcoinPrice: 34.6,
        marketNote: '미 재무부 대규모 국채 발행 쇼크, 빌 애크먼 숏 포지션 청산 선언.',
        theoreticalComparison: '채권 텀프리미엄(Term Premium) 폭등으로 5% 돌파 후 역사적 채권 바닥 형성.'
      },
      {
        id: '2023-12', dateStr: '2023.12', year: 2023, month: 12, label: "'23.12",
        phaseTitle: '연준 파월 피벗 선회 (2024년 3회 인하 시사) & 에브리싱 랠리', quadrant: 'GOLDILOCKS',
        realGdp: 3.4, cpiInflation: 3.4, growthScore: 35, inflationScore: 15,
        fedRate: 5.50, netLiquidity: 6.60, usdkrw: 1299, sp500Index: 4769, kospiIndex: 2655,
        treasury10Y: 3.88, goldPrice: 2062, bitcoinPrice: 42.3,
        marketNote: '10년물 금리 3.8%대로 폭락, 주식·채권·비트코인·금 전방위 산타 랠리.',
        theoreticalComparison: '금리 인상 사이클의 공식 종료 확신이 위험자산 전반에 강력한 안도감 공급.'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // 7. 2024.01~2026.09 최신 거시 사이클 (트럼프 2.0 & AI 실적장 & 50bp 피벗 ➔ 2026.09 전격 재인상)
  // ──────────────────────────────────────────────────────────
  {
    id: 'recent-pivot-2024',
    name: '2024~2026 AI 랠리, 50bp 피벗 & 2026.09 전격 재인상(Re-Hike)',
    shortTitle: '2024~2026 최신',
    periodRange: '2024.01 ~ 2026.09',
    durationMonths: 33,
    tagColor: 'cyan',
    coreQuadrant: 'GOLDILOCKS',
    overview: {
      summary: '22년 만의 최고금리(5.50%) 속에서도 생성형 AI 혁신과 역레포(RRP) 유동성에 힘입어 빅테크 주도 강세장이 이어졌습니다. 2024년 9월 50bp 빅컷에 이어 2025년 관세 충격을 거쳐 4.0%로 인하되었으나, 2026년 하반기 관세 및 임금 누적으로 물가가 재반등하자 2026년 9월 연준이 전격적으로 25bp 재인상(4.00%➔4.25%)을 단행하며 2차 인플레 전쟁(Re-Hike)에 돌입한 33개월 최신 시계열입니다.',
      macroEnvironment: '초고금리 ➔ 완화 피벗 ➔ 트럼프 관세 충격 ➔ 2026.09 인플레 재반등에 따른 25bp 전격 재인상 충격 국면.',
      triggerEvent: '생성형 AI 붐 ➔ 2024.09 50bp 빅컷 ➔ 2024.11 트럼프 당선 ➔ 2026.09 연준 25bp 재인상(4.25%) 단행',
      peakDrop: '환율 피크 1,485원, 미 국채 10년물 4.88% ➔ 4.58%, S&P 500 4,845 ➔ 7,290 ➔ 6,920pt'
    },
    deepDive: {
      triggerBackground: '5.50% 초고금리와 양적긴축(QT) 환경에서도 미국 경제가 침체에 빠지지 않고 AI 인프라 투자 사이클이 가동되었습니다. 연준의 역레포(RRP) 잔고가 소진되며 유동성 완충재 역할을 했습니다. 2026년 상반기까지 4.0% 중립금리로 안착하는 듯했으나, 관세 누적 효과와 타이트한 서비스업 임금 상승으로 CPI가 3.0%로 재반등하며 시장의 안일한 피벗 기대를 뒤흔들었습니다.',
      policyResponse: '연준은 2024년 9월 50bp 빅컷, 11~12월 연속 인하로 4.50%를 만들고 2025년 하반기 4.00%까지 금리를 낮췄습니다. 그러나 2026년 8월 잭슨홀 경고에 이어 9월 FOMC에서 25bp 전격 재인상(4.25%)을 단행하여 피벗 사이클을 전격 종료하고 "인플레이션 통제가 최우선"임을 선언했습니다.',
      assetImpact: '• 주식: AI 랠리로 S&P 500이 7,290pt까지 상승 후, 2026.09 재인상 충격으로 6,900pt대로 단기 급락\n• 채권: 4.1%대로 안정되던 미 국채 10년물 금리가 4.58%로 수직 상승하며 채권 투자자들에게 2차 듀레이션 충격\n• 환율: 1,360원대에서 2026.09 긴축 재개로 1,415원까지 재상승\n• 가상자산 & 금: 안전자산 선호와 통화가치 불안으로 금이 $2,850 사상 최고치를 경신한 반면 비트코인은 유동성 흡수 우려로 $126k로 단기 조정',
      theoreticalDivergence: '중앙은행의 조기 피벗이 인플레이션 불씨를 완전히 끄지 못했을 때 어떤 결과(1970년대 볼커 이전 아서 번즈의 실패 데자뷔)를 낳는지 증명했습니다. 금리 인하 사이클이 영구적이지 않으며 언제든 재인상(Re-Hike)으로 역전될 수 있음을 보여줍니다.',
      keyLessons: '"연준의 피벗 선언을 영원한 완화로 착각하지 말라." 인플레이션 잔존 압력이 남아있는 한 긴축은 언제든 부활할 수 있으며, 금리 재인상기에는 듀레이션 축소와 현금흐름 중심의 방어적 포트폴리오 재편이 필수적입니다.'
    },
    stats: {
      sp500MaxDrawdown: '-8.5% (2024 엔캐리) & -5.1% (2026.09 재인상 충격)',
      peakFedRate: '5.50% (2024) ➔ 4.00% (저점) ➔ 4.25% (2026.09 재인상)',
      troughFedRate: '4.00%',
      treasury10YRange: '3.75% ➔ 4.88% ➔ 4.12% ➔ 4.58%',
      usdkrwPeak: '1,485원 (2024 계엄/관세 피크)'
    },
    monthlySeries: MONTHLY_MACRO_SERIES
  }
];

// Helper to look up preset by id
export const getHistoricalEraById = (id: string): HistoricalEraPreset => {
  return HISTORICAL_ERA_PRESETS.find(e => e.id === id) || HISTORICAL_ERA_PRESETS[HISTORICAL_ERA_PRESETS.length - 1];
};
