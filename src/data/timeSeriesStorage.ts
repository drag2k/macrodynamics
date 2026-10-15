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

당신은 금융시장 및 거시경제 공인 데이터 분석가입니다. 
웹 검색 및 최신 금융/경제 데이터베이스(FRED, 한국은행, BLS, 거래소 등)를 조회하여 **${targetYear}년 ${targetMonth}월 (${targetDateStr})**의 미국 및 한국의 실제(또는 최신 추정) 거시경제 공식 지표를 조사하고, 아래의 JSON 객체 형식 하나만을 정확하게 출력해 주세요.

■ 지표 입력 기준 및 주의사항:
1. **지수 명칭 구분 (혼동 금지)**:
   - **kospiIndex (한국 KOSPI 종합주가지수)**: 현재 실측 2,500~2,750pt 내외 (역대 최고 3,316pt). 절대 3,500을 넘지 않음.
   - **sp500Index (미국 S&P 500 지수)**: 최근 6,000pt 돌파 (5,800~6,100pt 범위).
2. **fedRate**: 미국 연준 기준금리 상단 (실제 결정 수치, 예: 4.50 또는 4.75)
3. **usdkrw**: 원/달러 마감 환율 (서울외환시장 실측, 예: 1395)
4. **treasury10Y**: 미국 국채 10년물 수익률 (실측 %, 예: 4.35)
5. **cpiInflation**: 미국 헤드라인 CPI 전년비(YoY) 상승률 (%)
6. **realGdp**: 미국 실질 GDP 전기비 연율 성장률 (%)
7. **quadrant**: 거시 사분면 ("GOLDILOCKS" | "REFLATION" | "STAGFLATION" | "DEFLATION_RECESSION")

■ 출력 JSON 템플릿:
\`\`\`json
{
  "id": "${targetId}",
  "dateStr": "${targetDateStr}",
  "year": ${targetYear},
  "month": ${targetMonth},
  "label": "${targetLabel}",
  "phaseTitle": "거시경제 및 금융시장 핵심 동향 요약",
  "quadrant": "GOLDILOCKS",
  "realGdp": 2.1,
  "cpiInflation": 2.7,
  "growthScore": 10,
  "inflationScore": 5,
  "fedRate": 4.50,
  "netLiquidity": 7.05,
  "usdkrw": 1395,
  "sp500Index": 5980,
  "kospiIndex": 2650,
  "treasury10Y": 4.35,
  "goldPrice": 2750,
  "bitcoinPrice": 95.0,
  "marketNote": "주요 자산 시장의 실시간 반응과 펀더멘털 요인 해설",
  "theoreticalComparison": "전통 경제학 이론 대비 실제 시장의 움직임 비교 분석"
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
