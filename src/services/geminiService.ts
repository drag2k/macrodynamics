import { MonthlyMacroTimeSeriesPoint } from '../data/monthlyMacroTimeSeries';

export interface GeminiHealthResponse {
  status: string;
  hasGeminiKey: boolean;
  timestamp: string;
}

export interface GeminiMacroFetchResponse {
  success: boolean;
  data?: MonthlyMacroTimeSeriesPoint;
  isNewMonth?: boolean;
  baseDateStr?: string;
  sources?: Array<{ title: string; url: string }>;
  rawSummary?: string;
  error?: string;
}

/**
 * Check if the backend Gemini server is reachable and if an API key is configured
 */
export async function checkGeminiHealth(): Promise<GeminiHealthResponse> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      return { status: 'error', hasGeminiKey: false, timestamp: '' };
    }
    return await res.json();
  } catch (err) {
    console.warn('Failed to reach /api/health:', err);
    return { status: 'offline', hasGeminiKey: false, timestamp: '' };
  }
}

/**
 * Call server to use Gemini with Google Search to fetch & synthesize macroeconomic indicators
 * If year and month are omitted, it automatically determines whether newer data exists based on currentLatestDateStr.
 */
export async function fetchMacroDataWithGemini(
  params?: {
    currentLatestDateStr?: string;
    year?: number;
    month?: number;
  } | number,
  optionalMonth?: number
): Promise<GeminiMacroFetchResponse> {
  try {
    let bodyPayload: any = {};
    if (typeof params === 'number') {
      bodyPayload = { year: params, month: optionalMonth };
    } else if (params) {
      bodyPayload = params;
    }

    const res = await fetch('/api/gemini/fetch-macro-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || `서버 응답 오류 (HTTP ${res.status})`,
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || '네트워크 연결 오류가 발생했습니다.',
    };
  }
}

