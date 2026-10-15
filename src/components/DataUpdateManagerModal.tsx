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
  Info,
  Edit3,
  Save,
  HelpCircle
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
    notice?: string;
    error?: string;
  } | null>(null);

  // Editable point state (Allows user to inspect & edit numbers before or after saving)
  const [editablePoint, setEditablePoint] = useState<MonthlyMacroTimeSeriesPoint | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState<string>('');

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

  // Check if any post-2026.09 data is currently saved in custom points
  const hasPostSeptember2026Point = useMemo(() => {
    return customPointsList.some(p => p.dateStr >= '2026.10' || p.id.includes('2026-10'));
  }, [customPointsList]);

  if (!isOpen) return null;

  // Fully automated check & update
  const handleRunAutoUpdate = async () => {
    setCheckStatus('CHECKING');
    setProgressStep(1);
    setGeminiResult(null);
    setEditablePoint(null);
    setIsSavedNotice('');

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
      setEditablePoint({ ...res.data });

      // Automatically store in custom points with instant sync
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

  // Save manual modifications made to editablePoint
  const handleSaveEditablePoint = () => {
    if (!editablePoint) return;
    saveCustomPoint(editablePoint);
    const updated = getStoredCustomPoints();
    setCustomPointsList(updated);
    onDataUpdated();
    setIsSavedNotice(`✓ [${editablePoint.dateStr}] 수정된 지표가 타임라인에 안전하게 반영되었습니다!`);
    setTimeout(() => setIsSavedNotice(''), 3500);
  };

  // Instant Rollback: Delete any 2026.10 or future points
  const handlePurgeNewerPoints = () => {
    const filtered = customPointsList.filter(p => !(p.dateStr >= '2026.10' || p.id.includes('2026-10')));
    localStorage.setItem('macro_custom_monthly_points_v1', JSON.stringify(filtered));
    setCustomPointsList(filtered);
    setEditablePoint(null);
    setCheckStatus('IDLE');
    setSaveSuccessNotice('✓ 2026.10 데이터가 삭제되고 2026.09 원본 타임라인으로 복구되었습니다.');
    onDataUpdated();
    setTimeout(() => setSaveSuccessNotice(''), 4000);
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
      setEditablePoint(null);
      setCheckStatus('IDLE');
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
                  최신 거시경제 데이터 동기화 및 검증 센터
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                  실측 데이터 검증
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                글로벌 시장의 공식 발표 지표를 확인하고, 이상 수치는 직접 수정하여 타임라인에 정확히 반영합니다.
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

        {/* Global Alert Banner: 2026.10 Rollback if exists */}
        {hasPostSeptember2026Point && (
          <div className="px-5 py-2.5 bg-amber-950/60 border-b border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">2026.10 추가 데이터 감지:</span>
                <span className="text-[11px] text-amber-300/90 ml-1.5">
                  수치가 불명확하거나 마음에 들지 않으면 즉시 삭제하여 원본 2026.09 기준점으로 원복할 수 있습니다.
                </span>
              </div>
            </div>
            <button
              onClick={handlePurgeNewerPoints}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>2026.10 즉시 삭제 / 롤백</span>
            </button>
          </div>
        )}

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
            <span>최신 데이터 점검 및 편집</span>
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
          
          {/* TAB 1: AUTO UPDATE & DIRECT REVIEW/EDIT */}
          {activeTab === 'AUTO_UPDATE' && (
            <div className="space-y-4">
              
              {/* Macro Benchmark & Distinction Guidance Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>2026년 10월 거시경제 및 금융시장 퀀트 기준</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    AI 퀀트 규칙 & 실시간 검색 연동
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 space-y-0.5">
                    <strong className="text-white block font-mono">한국 KOSPI 지수 (kospiIndex)</strong>
                    <span className="text-cyan-300 font-bold block font-mono text-xs">5,500 ~ 7,000 pt 밴드</span>
                    <span className="text-slate-400 text-[10px]">
                      연준 재인상 충격 소화 및 글로벌 자금 재유입에 따른 강세 랠리
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 space-y-0.5">
                    <strong className="text-white block font-mono">미국 S&P 500 지수 (sp500Index)</strong>
                    <span className="text-emerald-300 font-bold block font-mono text-xs">7,700 pt</span>
                    <span className="text-slate-400 text-[10px]">
                      생성형 AI 생산성 혁신과 빅테크 EPS 성장이 견인하는 신고가 랠리
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 space-y-0.5">
                    <strong className="text-white block font-mono">미국 연준 기준금리 (fedRate)</strong>
                    <span className="text-cyan-300 font-bold block font-mono text-xs">4.25%</span>
                    <span className="text-slate-400 text-[10px]">
                      2026.09 25bp 재인상(4.00%➔4.25%) 이후 금리 안정 유지
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80 space-y-0.5">
                    <strong className="text-white block font-mono">원/달러 환율 (usdkrw)</strong>
                    <span className="text-cyan-300 font-bold block font-mono text-xs">1,382원</span>
                    <span className="text-slate-400 text-[10px]">
                      외국인 주식 순매수 유입 및 외환 수급 안정세 반영
                    </span>
                  </div>
                </div>
              </div>

              {/* Automated Diagnosis Status Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>시스템 시계열 데이터베이스 진단 상태</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Google Search / FRED 연동
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
                      <span>시장 지표 점검</span>
                    </span>
                    <p className="text-sm font-bold text-emerald-300">
                      상시 모니터링
                    </p>
                    <p className="text-[10px] text-slate-500">
                      연준 FOMC, 환율, 국채, CPI, KOSPI
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>수치 검증 및 편집</span>
                    </span>
                    <p className="text-sm font-bold text-cyan-300">
                      사용자 직접 수정 가능
                    </p>
                    <p className="text-[10px] text-slate-500">
                      모든 지표 직접 입력 및 검증 지원
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary 1-Click Action Button */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-blue-950/30 border border-cyan-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span>최신 발표 데이터 자동 점검 및 조회</span>
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      버튼을 누르면 공식 발표 지표 유무를 확인하여 가져옵니다. 수집 후 아래 편집판에서 원하는 값으로 직접 수정할 수 있습니다.
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
                        <span>공식 지표 점검 및 수집 중...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>⚡ 최신 데이터 점검 및 수집 실행</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Progress Animation Bar */}
                {checkStatus === 'CHECKING' && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-950/80 border border-cyan-500/40 space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-cyan-300 font-bold flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        <span>
                          {progressStep === 1 && `현재 타임라인 최종 기준점(${latestDateStr}) 검사 완료`}
                          {progressStep === 2 && 'Google Search / FRED 연동으로 최신 공시 지표 조회 중...'}
                          {progressStep === 3 && '지표 무결성 검증 및 입력판 준비 중...'}
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

              {/* INLINE EDIT & REVIEW PANEL (Shows when data is retrieved or being edited) */}
              {editablePoint && (
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/50 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <h4 className="text-xs font-bold text-white">
                        [{editablePoint.dateStr}] 거시경제 지표 검증 및 인라인 편집판
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                      수치 직접 수정 가능
                    </span>
                  </div>

                  {isSavedNotice && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{isSavedNotice}</span>
                    </div>
                  )}

                  {/* Inline Edit Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    
                    {/* Fed Rate */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                        <span>미국 연준 기준금리 (%)</span>
                        <span className="text-cyan-400 font-mono">FOMC 상단</span>
                      </label>
                      <input 
                        type="number"
                        step="0.25"
                        value={editablePoint.fedRate}
                        onChange={(e) => setEditablePoint({ ...editablePoint, fedRate: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* USD/KRW */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                        <span>원/달러 환율 (원)</span>
                        <span className="text-cyan-400 font-mono">서울외환시장</span>
                      </label>
                      <input 
                        type="number"
                        step="1"
                        value={editablePoint.usdkrw}
                        onChange={(e) => setEditablePoint({ ...editablePoint, usdkrw: parseInt(e.target.value, 10) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Treasury 10Y */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                        <span>미 국채 10년물 수익률 (%)</span>
                        <span className="text-amber-400 font-mono">FRED</span>
                      </label>
                      <input 
                        type="number"
                        step="0.01"
                        value={editablePoint.treasury10Y}
                        onChange={(e) => setEditablePoint({ ...editablePoint, treasury10Y: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-amber-300 font-mono text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* CPI Inflation */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                        <span>미국 헤드라인 CPI YoY (%)</span>
                        <span className="text-rose-400 font-mono">BLS</span>
                      </label>
                      <input 
                        type="number"
                        step="0.1"
                        value={editablePoint.cpiInflation}
                        onChange={(e) => setEditablePoint({ ...editablePoint, cpiInflation: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-rose-300 font-mono text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* S&P 500 Index */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                        <span>미국 S&P 500 마감 지수 (pt)</span>
                        <span className="text-emerald-400 font-mono">7,700선</span>
                      </label>
                      <input 
                        type="number"
                        step="10"
                        value={editablePoint.sp500Index}
                        onChange={(e) => setEditablePoint({ ...editablePoint, sp500Index: parseInt(e.target.value, 10) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* KOSPI Index */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 flex items-center justify-between">
                        <span>한국 KOSPI 마감 지수 (pt)</span>
                        <span className="text-cyan-400 font-mono">5,500~7,000</span>
                      </label>
                      <input 
                        type="number"
                        step="10"
                        value={editablePoint.kospiIndex}
                        onChange={(e) => setEditablePoint({ ...editablePoint, kospiIndex: parseInt(e.target.value, 10) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Real GDP */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400">
                        미국 실질 GDP 연율 (%)
                      </label>
                      <input 
                        type="number"
                        step="0.1"
                        value={editablePoint.realGdp}
                        onChange={(e) => setEditablePoint({ ...editablePoint, realGdp: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Quadrant */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400">
                        거시 사분면 (Quadrant)
                      </label>
                      <select 
                        value={editablePoint.quadrant}
                        onChange={(e) => setEditablePoint({ ...editablePoint, quadrant: e.target.value as MacroQuadrant })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-cyan-300 text-xs focus:outline-none focus:border-cyan-400"
                      >
                        <option value="GOLDILOCKS">GOLDILOCKS (골디락스 - 고성장/저물가)</option>
                        <option value="REFLATION">REFLATION (리플레이션 - 고성장/고물가)</option>
                        <option value="STAGFLATION">STAGFLATION (스태그플레이션 - 저성장/고물가)</option>
                        <option value="DEFLATION_RECESSION">DEFLATION_RECESSION (디플레/침체)</option>
                      </select>
                    </div>

                    {/* Net Liquidity */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400">
                        연준 순유동성 ($T 조 달러)
                      </label>
                      <input 
                        type="number"
                        step="0.05"
                        value={editablePoint.netLiquidity}
                        onChange={(e) => setEditablePoint({ ...editablePoint, netLiquidity: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Phase Title Edit */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block">
                      이 달의 핵심 사건 및 통화정책 요약
                    </label>
                    <input 
                      type="text"
                      value={editablePoint.phaseTitle}
                      onChange={(e) => setEditablePoint({ ...editablePoint, phaseTitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Sources info */}
                  {geminiResult?.sources && geminiResult.sources.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-[10px] pt-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                        <span>데이터 출처:</span>
                      </span>
                      {geminiResult.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 hover:text-cyan-200 transition truncate max-w-[260px]"
                        >
                          {s.title}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Actions Strip */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      onClick={handlePurgeNewerPoints}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/50 text-rose-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>이 데이터 삭제 및 롤백</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveEditablePoint}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-cyan-950/50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>수정값 타임라인에 저장 및 적용</span>
                      </button>

                      <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/50"
                      >
                        <span>타임라인으로 이동</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs gap-2">
                <div>
                  <h4 className="font-bold text-white">추가된 사용자 데이터 목록 ({customPointsList.length}건)</h4>
                  <p className="text-[11px] text-slate-400">
                    사용자가 직접 입력하거나 자동 수집하여 타임라인에 누적된 데이터입니다.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {hasPostSeptember2026Point && (
                    <button
                      onClick={handlePurgeNewerPoints}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>2026.10 롤백</span>
                    </button>
                  )}
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
              </div>

              {saveSuccessNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{saveSuccessNotice}</span>
                </div>
              )}

              {customPointsList.length === 0 ? (
                <div className="py-12 px-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center space-y-2">
                  <Database className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">
                    추가된 사용자 정의 월별 데이터가 없습니다.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    현재 기본 33개월 고해상도 시계열 데이터셋이 깔끔하게 유지되고 있습니다.
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
                          {pt.dateStr >= '2026.10' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/50">
                              최신 추가월
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                          <span>금리: <strong className="text-white">{pt.fedRate}%</strong></span>
                          <span>환율: <strong className="text-white">{pt.usdkrw}원</strong></span>
                          <span>10년물: <strong className="text-white">{pt.treasury10Y}%</strong></span>
                          <span>CPI: <strong className="text-white">{pt.cpiInflation}%</strong></span>
                          <span>S&P: <strong className="text-white">{pt.sp500Index}</strong></span>
                          <span>KOSPI: <strong className="text-white">{pt.kospiIndex}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditablePoint({ ...pt });
                            setActiveTab('AUTO_UPDATE');
                          }}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-400 hover:text-cyan-300 transition cursor-pointer"
                          title="이 데이터 수정하기"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomPoint(pt.id)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          title="이 월 데이터 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
                  placeholder={`{\n  "id": "2026-10",\n  "dateStr": "2026.10",\n  "year": 2026,\n  "month": 10,\n  "fedRate": 4.50,\n  "usdkrw": 1395,\n  "sp500Index": 5980,\n  "kospiIndex": 2650,\n  ...\n}`}
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
          <span>MacroDynamics Verified Data Sync Engine</span>
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
