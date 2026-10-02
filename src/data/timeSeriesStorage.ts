// ──────────────────────────────────────────────────────────
// Macro Dynamics Time Series Storage & LLM Automation Helper
// ──────────────────────────────────────────────────────────
import { MonthlyMacroTimeSeriesPoint, MONTHLY_MACRO_SERIES } from './monthlyMacroTimeSeries';
import { MacroQuadrant } from '../types';

const STORAGE_KEY = 'macro_custom_monthly_points_v1';

/**
 * 로컬 스토리지에 저장된 사용자 추가 월별 시계열 데이터 불러오기
 */
export const getStoredCustomPoints = (): MonthlyMacroTimeSeriesPoint[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to parse stored custom points:', err);
    return [];
  }
};

/**
 * 사용자 추가 월별 데이터 저장
 */
export const saveCustomPoint = (newPoint: MonthlyMacroTimeSeriesPoint): MonthlyMacroTimeSeriesPoint[] => {
  const current = getStoredCustomPoints();
  // 동일한 id나 dateStr이 있으면 교체, 없으면 추가
  const filtered = current.filter(p => p.id !== newPoint.id && p.dateStr !== newPoint.dateStr);
  const updated = [...filtered, newPoint].sort((a, b) => {
    return a.dateStr.localeCompare(b.dateStr);
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * 특정 월 데이터 삭제
 */
export const removeCustomPoint = (id: string): MonthlyMacroTimeSeriesPoint[] => {
  const current = getStoredCustomPoints();
  const updated = current.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * 모든 사용자 추가 데이터 초기화 (기본 내장 데이터로 복귀)
 */
export const resetCustomPoints = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * 2024~2026 최신 시계열 기본 데이터와 사용자 추가 데이터 병합
 */
export const getActiveRecentSeries = (): MonthlyMacroTimeSeriesPoint[] => {
  const custom = getStoredCustomPoints();
  if (custom.length === 0) {
    return MONTHLY_MACRO_SERIES;
  }
  // 기본 시계열에 없는 최신 월만 추가하거나, 기본 시계열의 특정 월 덮어쓰기
  const map = new Map<string, MonthlyMacroTimeSeriesPoint>();
  MONTHLY_MACRO_SERIES.forEach(p => map.set(p.dateStr, p));
  custom.forEach(p => map.set(p.dateStr, p));
  
  return Array.from(map.values()).sort((a, b) => a.dateStr.localeCompare(b.dateStr));
};

/**
 * 외부 LLM(ChatGPT, Gemini, Claude, Perplexity 등)에 복사하여 붙여넣을 수 있는 정밀 프롬프트 생성기
 */
export const generateLlmDataPrompt = (targetYear: number, targetMonth: number): string => {
  const monthStr = targetMonth < 10 ? `0${targetMonth}` : `${targetMonth}`;
  const targetDateStr = `${targetYear}.${monthStr}`;
  const targetLabel = `'${String(targetYear).slice(2)}.${monthStr}`;
  const targetId = `${targetYear}-${monthStr}`;

  return `[거시경제 최신 데이터 수집 및 정형화 요청]

당신은 거시경제 퀀트 분석가입니다. 
웹 검색 및 최신 금융/경제 데이터베이스를 조회하여 **${targetYear}년 ${targetMonth}월 (${targetDateStr})**의 미국 및 한국의 실제(또는 최신 추정) 거시경제 지표를 조사하고, 아래의 JSON 객체 형식 하나만을 정확하게 출력해 주세요. 마크다운 따옴표(\`\`\`json) 안에 JSON만 작성해야 하며 다른 서론이나 결론 문장은 제외해 주세요.

■ 조사 및 입력 지표 지침:
1. dateStr: "${targetDateStr}" (형식: "YYYY.MM")
2. id: "${targetId}"
3. year: ${targetYear}, month: ${targetMonth}, label: "${targetLabel}"
4. fedRate: 미국 기준금리 (상단 기준 %, 예: 4.25)
5. usdkrw: 원/달러 마감 환율 (원, 예: 1415)
6. netLiquidity: 연준 순유동성(총자산 - TGA - RRP) ($T 조 달러, 예: 7.05)
7. treasury10Y: 미국 국채 10년물 마감 수익률 (%, 예: 4.55)
8. sp500Index: 미국 S&P 500 마감 지수 (포인트, 예: 6950)
9. kospiIndex: 한국 KOSPI 마감 지수 (포인트, 예: 2880)
10. cpiInflation: 미국 헤드라인 CPI 전년비(YoY) 상승률 (%, 예: 3.1)
11. realGdp: 미국 실질 GDP 전기비 연율 성장률 (%, 예: 1.8)
12. quadrant: 당시 거시 사분면 (다음 4개 중 정확히 하나 선택: "GOLDILOCKS" | "REFLATION" | "STAGFLATION" | "DEFLATION_RECESSION")
13. growthScore: 경기 체감 점수 (-100 침체 ~ +100 호황, 예: -5)
14. inflationScore: 물가 압력 점수 (-100 디플레 ~ +100 고인플레, 예: 35)
15. goldPrice: 국제 금 시세 ($/oz, 예: 2860)
16. bitcoinPrice: 비트코인 시세 ($K 천 달러, 예: 125.5)
17. phaseTitle: 이 달의 가장 결정적인 연준 정책 및 거시 사건 한 줄 요약 (한국어 30자 이내)
18. marketNote: 자산 시장의 실제 반응 및 원인 해설 (한국어 1~2문장)
19. theoreticalComparison: 전통 경제학/교과서 이론과 실제 시장 반응 간의 차이점 및 교훈 (한국어 1~2문장)

■ 출력 JSON 템플릿 (반드시 이 키 이름을 엄수):
\`\`\`json
{
  "id": "${targetId}",
  "dateStr": "${targetDateStr}",
  "year": ${targetYear},
  "month": ${targetMonth},
  "label": "${targetLabel}",
  "phaseTitle": "연준 25bp 재인상 충격 후 금융시장 반응 요약",
  "quadrant": "STAGFLATION",
  "realGdp": 1.9,
  "cpiInflation": 3.1,
  "growthScore": -5,
  "inflationScore": 35,
  "fedRate": 4.25,
  "netLiquidity": 7.02,
  "usdkrw": 1418,
  "sp500Index": 6930,
  "kospiIndex": 2870,
  "treasury10Y": 4.56,
  "goldPrice": 2865,
  "bitcoinPrice": 125.0,
  "marketNote": "기준금리 재인상 여파로 장기 국채금리가 상승하고 강달러가 재개되며 위험자산이 조정을 받음.",
  "theoreticalComparison": "조기 완화 후 발생한 2차 인플레로 인해 인하 사이클이 역전될 때 채권 듀레이션 리스크가 극대화됨을 실증."
}
\`\`\``;
};

/**
 * 사용자가 붙여넣은 텍스트(JSON 또는 마크다운 코드블록)를 파싱하고 유효성 검증
 */
export const parseAndValidateLlmJson = (input: string): { success: boolean; data?: MonthlyMacroTimeSeriesPoint; error?: string } => {
  if (!input || !input.trim()) {
    return { success: false, error: '입력된 내용이 없습니다.' };
  }

  try {
    let clean = input.trim();
    // 마크다운 ```json ... ``` 제거
    if (clean.includes('```json')) {
      clean = clean.split('```json')[1].split('```')[0].trim();
    } else if (clean.includes('```')) {
      clean = clean.split('```')[1].split('```')[0].trim();
    }

    const obj = JSON.parse(clean);

    // 필수 필드 검증
    if (!obj.dateStr || typeof obj.dateStr !== 'string') {
      return { success: false, error: 'dateStr(예: "2026.10") 필드가 누락되었습니다.' };
    }
    if (typeof obj.fedRate !== 'number' || isNaN(obj.fedRate)) {
      return { success: false, error: 'fedRate(기준금리, 숫자) 필드가 올바르지 않습니다.' };
    }
    if (typeof obj.usdkrw !== 'number' || isNaN(obj.usdkrw)) {
      return { success: false, error: 'usdkrw(원/달러 환율, 숫자) 필드가 올바르지 않습니다.' };
    }

    const validQuadrants: MacroQuadrant[] = ['GOLDILOCKS', 'REFLATION', 'STAGFLATION', 'DEFLATION_RECESSION'];
    const quadrant: MacroQuadrant = validQuadrants.includes(obj.quadrant) ? obj.quadrant : 'GOLDILOCKS';

    const parts = obj.dateStr.split('.');
    const year = obj.year || (parts[0] ? parseInt(parts[0], 10) : 2026);
    const month = obj.month || (parts[1] ? parseInt(parts[1], 10) : 10);
    const monthStr = month < 10 ? `0${month}` : `${month}`;

    const sanitized: MonthlyMacroTimeSeriesPoint = {
      id: obj.id || `${year}-${monthStr}`,
      dateStr: obj.dateStr || `${year}.${monthStr}`,
      year: year,
      month: month,
      label: obj.label || `'${String(year).slice(2)}.${monthStr}`,
      phaseTitle: obj.phaseTitle || `${year}.${monthStr} 거시경제 업데이트`,
      quadrant: quadrant,
      realGdp: typeof obj.realGdp === 'number' ? obj.realGdp : 2.0,
      cpiInflation: typeof obj.cpiInflation === 'number' ? obj.cpiInflation : 2.5,
      growthScore: typeof obj.growthScore === 'number' ? obj.growthScore : 0,
      inflationScore: typeof obj.inflationScore === 'number' ? obj.inflationScore : 0,
      fedRate: obj.fedRate,
      netLiquidity: typeof obj.netLiquidity === 'number' ? obj.netLiquidity : 7.0,
      usdkrw: obj.usdkrw,
      sp500Index: typeof obj.sp500Index === 'number' ? obj.sp500Index : 6900,
      kospiIndex: typeof obj.kospiIndex === 'number' ? obj.kospiIndex : 2850,
      treasury10Y: typeof obj.treasury10Y === 'number' ? obj.treasury10Y : 4.4,
      goldPrice: typeof obj.goldPrice === 'number' ? obj.goldPrice : 2800,
      bitcoinPrice: typeof obj.bitcoinPrice === 'number' ? obj.bitcoinPrice : 120.0,
      marketNote: obj.marketNote || '최신 거시경제 지표 및 시장 반응.',
      theoreticalComparison: obj.theoreticalComparison || '실제 지표와 이론적 메커니즘 간의 비교 분석.'
    };

    return { success: true, data: sanitized };
  } catch (err) {
    return { success: false, error: `JSON 파싱 오류: ${(err as Error).message}` };
  }
};
