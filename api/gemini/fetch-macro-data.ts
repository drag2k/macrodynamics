import { GoogleGenAI } from '@google/genai';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다. Vercel 환경변수(Environment Variables)에서 GEMINI_API_KEY를 추가해 주세요.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to format clean, friendly error messages
function formatFriendlyErrorMessage(err: any): string {
  const raw = err?.message || String(err || '');
  if (raw.includes('503') || raw.includes('UNAVAILABLE') || raw.includes('high demand')) {
    return 'Google Gemini 서버에 일시적인 트래픽 폭주(503)가 발생했습니다. 약 5~10초 후 다시 시도해 주세요.';
  }
  if (raw.includes('403') || raw.includes('API_KEY_INVALID') || raw.includes('API key not valid')) {
    return 'Gemini API 키가 유효하지 않거나 권한이 없습니다. Vercel 환경변수 설정을 확인해 주세요.';
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return 'Gemini API 사용량 한도(Rate Limit)에 도달했습니다. 잠시 후 다시 시도해 주세요.';
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {}
  return raw || '요청 처리 중 오류가 발생했습니다.';
}

// Resilient Gemini generateContent with fallback models
async function callGeminiWithFallback(ai: GoogleGenAI, config: any) {
  const models = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      return await ai.models.generateContent({
        ...config,
        model,
      });
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`[Gemini API] Model ${model} failed (${errMsg}). Trying fallback model...`);
      if (i < models.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
  throw lastError;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let { year, month, currentLatestDateStr } = req.body || {};
    const baseDateStr = currentLatestDateStr || '2026.09';

    // If year/month not provided, determine next candidate target month from current latest date
    if (!year || !month) {
      const parts = baseDateStr.split('.');
      const baseY = parseInt(parts[0], 10) || 2026;
      const baseM = parseInt(parts[1], 10) || 9;
      if (baseM >= 12) {
        year = baseY + 1;
        month = 1;
      } else {
        year = baseY;
        month = baseM + 1;
      }
    }

    const ai = getGeminiClient();
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const candidateDateStr = `${year}.${monthStr}`;

    const prompt = `[거시경제 최신 데이터 실시간 자동 확인 및 수집 요청]
당신은 최고 수준의 글로벌 거시경제 퀀트 분석가입니다.
현재 우리 시스템에 등록된 최신 시계열은 **${baseDateStr}**까지입니다.
Google Search를 활용하여 실시간 거시경제 지표를 확인해 주세요.

■ 판단 기준:
1. 차월인 **${year}년 ${month}월 (${candidateDateStr})**의 미국 연준 기준금리, 원/달러 환율, 미 국채 10년물, 헤드라인 CPI, GDP 등 지표가 이미 발표되었거나 확인 가능한 최신 선행/확정치가 존재한다면, **${candidateDateStr}**를 기준으로 정형화해 주세요 (isNewMonth: true).
2. 만약 아직 ${candidateDateStr} 공식 발표 전이어서 지표가 없다면, 현재 등록된 마지막 월인 **${baseDateStr}**의 가장 최신 마감 확정 수치를 정형화해 주세요 (isNewMonth: false).

조사 대상 지표:
1. 연준 기준금리 (상단 %, 예: 4.25)
2. 원/달러 환율 (KRW, 예: 1418)
3. 연준 순유동성 (총자산 - TGA - RRP, 조 달러, 예: 7.02)
4. 미국 10년물 국채 수익률 (%, 예: 4.58)
5. S&P 500 마감 지수 (pt, 예: 6940)
6. KOSPI 마감 지수 (pt, 예: 2870)
7. 미국 헤드라인 CPI YoY 상승률 (%, 예: 3.1)
8. 미국 실질 GDP 전기비 연율 (%, 예: 1.8)
9. 당시 거시 사분면: "GOLDILOCKS" | "REFLATION" | "STAGFLATION" | "DEFLATION_RECESSION" 중 1개
10. 경기 체감 점수 (-100 ~ +100)
11. 물가 압력 점수 (-100 ~ +100)
12. 국제 금 시세 ($/oz, 예: 2860)
13. 비트코인 시세 ($K 천달러, 예: 125.0)
14. phaseTitle: 이 달의 가장 결정적인 연준 정책 및 거시 사건 한 줄 요약 (한국어 35자 이내)
15. marketNote: 자산 시장의 실제 반응 및 원인 해설 (한국어 1~2문장)
16. theoreticalComparison: 전통 경제학 이론과 실제 시장 반응 간의 차이점 및 교훈 (한국어 1~2문장)

반드시 아래와 같은 유효한 JSON 객체 형식 하나만을 출력해 주세요. 마크다운 \`\`\`json ... \`\`\` 블록으로 감싸주세요:
\`\`\`json
{
  "id": "${candidateDateStr.replace('.', '-')}",
  "dateStr": "${candidateDateStr}",
  "year": ${year},
  "month": ${month},
  "label": "'${String(year).slice(2)}.${monthStr}",
  "isNewMonth": true,
  "statusMessage": "새로운 월 데이터 발견 또는 최신 마감치 반영",
  "phaseTitle": "핵심 사건 요약",
  "quadrant": "STAGFLATION",
  "realGdp": 1.8,
  "cpiInflation": 3.1,
  "growthScore": -10,
  "inflationScore": 35,
  "fedRate": 4.25,
  "netLiquidity": 7.02,
  "usdkrw": 1418,
  "sp500Index": 6940,
  "kospiIndex": 2870,
  "treasury10Y": 4.58,
  "goldPrice": 2860,
  "bitcoinPrice": 125.0,
  "marketNote": "자산시장 반응 해설",
  "theoreticalComparison": "이론 vs 실무 비교 분석"
}
\`\`\``;

    const response = await callGeminiWithFallback(ai, {
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    const responseText = response.text || '';
    
    let cleanJson = responseText.trim();
    if (cleanJson.includes('```json')) {
      cleanJson = cleanJson.split('```json')[1].split('```')[0].trim();
    } else if (cleanJson.includes('```')) {
      cleanJson = cleanJson.split('```')[1].split('```')[0].trim();
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch {
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        parsedData = JSON.parse(cleanJson.slice(firstBrace, lastBrace + 1));
      } else {
        throw new Error('Gemini 응답에서 올바른 JSON 구조를 추출하지 못했습니다.');
      }
    }

    const groundingChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter(Boolean)
      .map((web: any) => ({
        title: web.title || '출처 문서',
        url: web.uri || '',
      }))
      .slice(0, 5);

    const isNewMonth = Boolean(parsedData.isNewMonth ?? (parsedData.dateStr !== baseDateStr));

    res.status(200).json({
      success: true,
      data: parsedData,
      isNewMonth,
      baseDateStr,
      sources: webSources,
      rawSummary: parsedData.phaseTitle || '',
    });
  } catch (error: any) {
    console.error('Gemini macro fetch error:', error);
    res.status(500).json({
      success: false,
      error: formatFriendlyErrorMessage(error),
    });
  }
}
