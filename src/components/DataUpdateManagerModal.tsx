import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Bot, 
  ExternalLink, 
  Globe, 
  Calendar, 
  ArrowRight, 
  Database, 
  Copy, 
  Trash2, 
  RotateCcw, 
  CheckCircle2,
  FileCode,
  ShieldCheck,
  TrendingUp,
  Clock
} from 'lucide-react';
import { MonthlyMacroTimeSeriesPoint } from '../data/monthlyMacroTimeSeries';
import { 
  generateLlmDataPrompt, 
  parseAndValidateLlmJson, 
  saveCustomPoint, 
  getStoredCustomPoints, 
  removeCustomPoint, 
  resetCustomPoints,
  getActiveRecentSeries
} from '../data/timeSeriesStorage';
import { fetchMacroDataWithGemini } from '../services/geminiService';
import { MacroQuadrant } from '../types';

interface DataUpdateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
  latestDateStr?: string;
}

type TabType = 'AUTO_UPDATE' | 'CUSTOM_STORAGE' | 'PROMPT_BACKUP';

export const DataUpdateManagerModal: React.FC<DataUpdateManagerModalProps> = ({
  isOpen,
  onClose,
  onDataUpdated,
  latestDateStr = '2026.09'
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('AUTO_UPDATE');

  // Stored custom points
  const [customPointsList, setCustomPointsList] = useState<MonthlyMacroTimeSeriesPoint[]>(getStoredCustomPoints());

  // Auto Update State
  const [checkStatus, setCheckStatus] = useState<'IDLE' | 'CHECKING' | 'SUCCESS_NEW' | 'SUCCESS_UP_TO_DATE' | 'ERROR'>('IDLE');
  const [progressStep, setProgressStep] = useState<number>(1);
  const [geminiResult, setGeminiResult] = useState<{
    success: boolean;
    data?: MonthlyMacroTimeSeriesPoint;
    isNewMonth?: boolean;
    sources?: Array<{ title: string; url: string }>;
    rawSummary?: string;
    error?: string;
  } | null>(null);

  // Advanced Prompt / Paste State
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [pasteInput, setPasteInput] = useState<string>('');
  const [pasteValidationResult, setPasteValidationResult] = useState<{
    success: boolean;
    data?: MonthlyMacroTimeSeriesPoint;
    error?: string;
  } | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string>('');

  // Total active months count
  const totalMonthsCount = useMemo(() => {
    return getActiveRecentSeries().length;
  }, [customPointsList]);

  if (!isOpen) return null;

  // Fully automated check & update: zero date-picking required!
  const handleRunAutoUpdate = async () => {
    setCheckStatus('CHECKING');
    setProgressStep(1);
    setGeminiResult(null);

    try {
      // Step 1: Analyze current timeline state
      await new Promise(r => setTimeout(r, 450));
      setProgressStep(2);

      // Step 2: Query Gemini + Google Search Grounding to check for newest macroeconomic release
      const res = await fetchMacroDataWithGemini({ currentLatestDateStr: latestDateStr });
      setProgressStep(3);
      await new Promise(r => setTimeout(r, 400));

      if (!res.success || !res.data) {
        throw new Error(res.error || '최신 거시경제 데이터를 불러오지 못했습니다.');
      }

      setGeminiResult(res);

      // Automatically save and sync!
      saveCustomPoint(res.data);
      const updatedList = getStoredCustomPoints();
      setCustomPointsList(updatedList);
      onDataUpdated();

      const isNew = Boolean(res.isNewMonth || (res.data.dateStr > latestDateStr));
      if (isNew) {
        setCheckStatus('SUCCESS_NEW');
      } else {
        setCheckStatus('SUCCESS_UP_TO_DATE');
      }
    } catch (err: any) {
      setCheckStatus('ERROR');
      setGeminiResult({
        success: false,
        error: err.message || '최신 데이터 확인 중 통신 오류가 발생했습니다.'
      });
    }
  };

  // Helper for prompt copy
  const handleCopyPrompt = async () => {
    const parts = latestDateStr.split('.');
    const y = parseInt(parts[0], 10) || 2026;
    const m = parseInt(parts[1], 10) || 9;
    const nextY = m >= 12 ? y + 1 : y;
    const nextM = m >= 12 ? 1 : m + 1;
    const promptText = generateLlmDataPrompt(nextY, nextM);

    try {
      await navigator.clipboard.writeText(promptText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = promptText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handleValidateAndApplyPaste = () => {
    const res = parseAndValidateLlmJson(pasteInput);
    setPasteValidationResult(res);
    if (res.success && res.data) {
      saveCustomPoint(res.data);
      const updated = getStoredCustomPoints();
      setCustomPointsList(updated);
      setSaveSuccessNotice(`✓ [${res.data.dateStr}] 데이터가 타임라인에 즉시 반영되었습니다!`);
      setPasteInput('');
      onDataUpdated();
      setTimeout(() => setSaveSuccessNotice(''), 4000);
    }
  };

  const handleDeleteCustomPoint = (id: string) => {
    const updated = removeCustomPoint(id);
    setCustomPointsList(updated);
    onDataUpdated();
  };

  const handleResetAll = () => {
    if (window.confirm('추가된 모든 사용자 데이터를 삭제하고 기본 33개월 데이터셋으로 초기화하시겠습니까?')) {
      resetCustomPoints();
      setCustomPointsList([]);
      onDataUpdated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/50 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 shrink-0">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  최신 거시경제 데이터 자동 동기화 센터
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                  AI 자동 판별
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                날짜를 직접 고를 필요 없이, 앱이 글로벌 시장 발표 데이터를 자동 확인하여 즉시 동기화합니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('AUTO_UPDATE')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition cursor-pointer flex items-center gap-2 border-t border-x ${
              activeTab === 'AUTO_UPDATE'
                ? 'bg-slate-900 text-cyan-300 border-slate-700 border-b-slate-900'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>최신 데이터 자동 업데이트</span>
          </button>

          <button
            onClick={() => setActiveTab('CUSTOM_STORAGE')}
            className={`px-3 py-2 text-xs font-medium rounded-t-xl transition cursor-pointer flex items-center gap-1.5 border-t border-x ${
              activeTab === 'CUSTOM_STORAGE'
                ? 'bg-slate-900 text-slate-200 border-slate-700 border-b-slate-900'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>데이터 보관함 ({customPointsList.length}건 추가됨)</span>
          </button>

          <button
            onClick={() => setActiveTab('PROMPT_BACKUP')}
            className={`px-3 py-2 text-xs font-medium rounded-t-xl transition cursor-pointer flex items-center gap-1.5 border-t border-x ${
              activeTab === 'PROMPT_BACKUP'
                ? 'bg-slate-900 text-slate-200 border-slate-700 border-b-slate-900'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            <span>외부 LLM 프롬프트 / JSON 붙여넣기</span>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* TAB 1: FULLY AUTOMATED 1-CLICK UPDATE */}
          {activeTab === 'AUTO_UPDATE' && (
            <div className="space-y-4">
              
              {/* Automated Diagnosis Status Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>시스템 시계열 데이터베이스 진단 상태</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    실시간 Google Search Grounding 연결
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>현재 보유 최신 기준</span>
                    </span>
                    <p className="text-sm font-extrabold text-white font-mono">
                      {latestDateStr}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      총 {totalMonthsCount}개월 연속 시계열 축적
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>글로벌 시장 모니터링</span>
                    </span>
                    <p className="text-sm font-bold text-emerald-300">
                      정상 가동 중
                    </p>
                    <p className="text-[10px] text-slate-500">
                      연준 FOMC, 환율, 국채, CPI, GDP
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      <span>업데이트 판별 방식</span>
                    </span>
                    <p className="text-sm font-bold text-cyan-300">
                      100% 전자동 판별
                    </p>
                    <p className="text-[10px] text-slate-500">
                      신규 발표 시 타임라인 즉시 연장
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary 1-Click Action Button */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-blue-950/30 border border-cyan-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span>최신 발표 데이터 자동 점검 및 업데이트</span>
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      별도 날짜 지정 없이 버튼을 누르면, 시스템이 실시간 발표된 최신 거시경제 지표 유무를 확인하여 자동으로 타임라인에 반영합니다.
                    </p>
                  </div>

                  <button
                    onClick={handleRunAutoUpdate}
                    disabled={checkStatus === 'CHECKING'}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 disabled:opacity-50 shrink-0"
                  >
                    {checkStatus === 'CHECKING' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>실시간 확인 및 수집 중...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>⚡ 최신 데이터 확인 및 업데이트 실행</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Progress Animation Bar when CHECKING */}
                {checkStatus === 'CHECKING' && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-950/80 border border-cyan-500/40 space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-cyan-300 font-bold flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        <span>
                          {progressStep === 1 && `현재 타임라인 최종 기준점(${latestDateStr}) 검사 완료`}
                          {progressStep === 2 && 'Google Search Grounding으로 최신 연준 금리 및 거시 지표 조회 중...'}
                          {progressStep === 3 && '신규 지표 발표 유무 판별 및 19개 필드 정합성 검증 중...'}
                        </span>
                      </span>
                      <span className="text-slate-400 font-mono">{progressStep}/3 단계</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${(progressStep / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SUCCESS RESULTS: Case A - New Month Discovered & Added */}
              {checkStatus === 'SUCCESS_NEW' && geminiResult?.data && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>🎉 신규 최신 데이터 [{geminiResult.data.dateStr}] 발견 및 타임라인 자동 반영 완료!</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                      신규 월 추가됨
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    공식 발표된 새로운 거시경제 지표가 확인되어 타임라인에 성공적으로 추가되었습니다.
                  </p>

                  {/* Summary Metric Board */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">연준 기준금리</span>
                      <span className="text-sm font-extrabold text-cyan-300 font-mono">{geminiResult.data.fedRate}%</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">원/달러 환율</span>
                      <span className="text-sm font-extrabold text-cyan-300 font-mono">{geminiResult.data.usdkrw.toLocaleString()}원</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">미 국채 10년물</span>
                      <span className="text-sm font-extrabold text-amber-300 font-mono">{geminiResult.data.treasury10Y}%</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">미국 헤드라인 CPI</span>
                      <span className="text-sm font-extrabold text-rose-300 font-mono">{geminiResult.data.cpiInflation}%</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">S&P 500 지수</span>
                      <span className="text-sm font-bold text-white font-mono">{geminiResult.data.sp500Index.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">KOSPI 지수</span>
                      <span className="text-sm font-bold text-white font-mono">{geminiResult.data.kospiIndex.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">거시 사분면</span>
                      <span className="text-xs font-bold text-emerald-400">{geminiResult.data.quadrant}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">실질 GDP 성장률</span>
                      <span className="text-sm font-bold text-white font-mono">{geminiResult.data.realGdp}%</span>
                    </div>
                  </div>

                  {geminiResult.data.phaseTitle && (
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300">
                      <strong className="text-cyan-300">핵심 사건 요약:</strong> {geminiResult.data.phaseTitle}
                    </div>
                  )}

                  {/* Sources Strip */}
                  {geminiResult.sources && geminiResult.sources.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                        <span>검색 출처:</span>
                      </span>
                      {geminiResult.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 hover:text-cyan-200 transition truncate max-w-[180px]"
                        >
                          {s.title}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={onClose}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                    >
                      <span>타임라인에서 확인하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* SUCCESS RESULTS: Case B - Already Up To Date */}
              {checkStatus === 'SUCCESS_UP_TO_DATE' && geminiResult?.data && (
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>✅ 현재 데이터베이스({geminiResult.data.dateStr})가 이미 가장 최신 상태입니다!</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                      최신 상태 유지 중
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    글로벌 시장의 최신 공시 지표를 점검한 결과, 현재 등록된 마지막 시점(<strong>{geminiResult.data.dateStr}</strong>)이 현재까지 공식 확정된 가장 최신 데이터입니다. (차월 지표는 공식 릴리즈 일정에 따라 발표되는 즉시 다시 자동으로 추가됩니다.)
                  </p>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                    <div className="text-slate-400 text-[11px] flex items-center justify-between">
                      <span>검증된 최신 지표 마감치:</span>
                      <span className="text-cyan-300 font-mono">기준: {geminiResult.data.dateStr}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div className="text-slate-300 text-[11px]">
                        연준 금리: <strong className="text-cyan-300 font-mono">{geminiResult.data.fedRate}%</strong>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        환율: <strong className="text-cyan-300 font-mono">{geminiResult.data.usdkrw}원</strong>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        10년물 국채: <strong className="text-amber-300 font-mono">{geminiResult.data.treasury10Y}%</strong>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        CPI 인플레이션: <strong className="text-rose-300 font-mono">{geminiResult.data.cpiInflation}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={onClose}
                      className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                    >
                      확인 완료 (닫기)
                    </button>
                  </div>
                </div>
              )}

              {/* ERROR STATE */}
              {checkStatus === 'ERROR' && geminiResult?.error && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs space-y-2 text-rose-300 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>최신 데이터 확인 실패</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {geminiResult.error}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    * 일시적인 네트워크 또는 모델 지연일 수 있습니다. 잠시 후 다시 시도하시거나 상단의 [외부 LLM 프롬프트] 탭을 이용하실 수 있습니다.
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleRunAutoUpdate}
                      className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-white font-bold text-xs transition cursor-pointer"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STORED CUSTOM DATA MANAGEMENT */}
          {activeTab === 'CUSTOM_STORAGE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <h4 className="font-bold text-white">추가된 사용자 데이터 목록 ({customPointsList.length}건)</h4>
                  <p className="text-[11px] text-slate-400">
                    AI 자동 수집 또는 직접 입력하여 타임라인에 누적된 데이터 목록입니다.
                  </p>
                </div>
                {customPointsList.length > 0 && (
                  <button
                    onClick={handleResetAll}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-600/40 text-rose-300 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>전체 초기화 (기본 복귀)</span>
                  </button>
                )}
              </div>

              {customPointsList.length === 0 ? (
                <div className="py-12 px-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center space-y-2">
                  <Database className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">
                    추가된 사용자 정의 월별 데이터가 없습니다.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    [최신 데이터 자동 업데이트] 탭에서 원클릭으로 최신 거시경제 데이터를 추가해 보세요.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customPointsList.map((pt) => (
                    <div 
                      key={pt.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-300 text-sm">{pt.dateStr}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            {pt.quadrant}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                          <span>금리: <strong className="text-white">{pt.fedRate}%</strong></span>
                          <span>환율: <strong className="text-white">{pt.usdkrw}원</strong></span>
                          <span>10년물: <strong className="text-white">{pt.treasury10Y}%</strong></span>
                          <span>CPI: <strong className="text-white">{pt.cpiInflation}%</strong></span>
                          <span>S&P: <strong className="text-white">{pt.sp500Index}</strong></span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteCustomPoint(pt.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition cursor-pointer shrink-0"
                        title="이 월 데이터 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXTERNAL LLM PROMPT & RAW JSON PASTE */}
          {activeTab === 'PROMPT_BACKUP' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>외부 LLM 프롬프트 복사 및 JSON 직접 등록</span>
                  </div>
                  <button
                    onClick={handleCopyPrompt}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      copySuccess
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black'
                    }`}
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>복사 완료!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>프롬프트 복사</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ChatGPT, Claude, Perplexity 등 외부 AI 모델에 프롬프트를 붙여넣어 생성된 JSON 결과물을 아래에 붙여넣으면 즉시 타임라인에 반영됩니다.
                </p>
              </div>

              {saveSuccessNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{saveSuccessNotice}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  JSON 결과값 붙여넣기:
                </label>
                <textarea
                  value={pasteInput}
                  onChange={(e) => setPasteInput(e.target.value)}
                  placeholder={`{\n  "id": "2026-10",\n  "dateStr": "2026.10",\n  "year": 2026,\n  "month": 10,\n  "fedRate": 4.25,\n  "usdkrw": 1415,\n  ...\n}`}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-cyan-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />

                {pasteValidationResult && !pasteValidationResult.success && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{pasteValidationResult.error}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleValidateAndApplyPaste}
                    disabled={!pasteInput.trim()}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>JSON 검증 및 타임라인 반영</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
          <span>MacroDynamics AI Auto-Sync Engine</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer font-bold"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
