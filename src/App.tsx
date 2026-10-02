import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { IntegratedCockpitView } from './components/IntegratedCockpitView';
import { DynamicPipelineFlow } from './components/DynamicPipelineFlow';
import { AssetPriceBoard } from './components/AssetPriceBoard';
import { BondSeesawVisualizer } from './components/BondSeesawVisualizer';
import { MacroIndicatorBoard } from './components/MacroIndicatorBoard';
import { MacroCheatSheet } from './components/MacroCheatSheet';
import { FactCheckModal } from './components/FactCheckModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { PresentationMode } from './components/PresentationMode';
import { DataUpdateManagerModal } from './components/DataUpdateManagerModal';
import { RateRegime, FxRegime, DetailedPhase, CouplingMode, MacroQuadrant } from './types';
import { getUnifiedMacroData, PRESET_SCENARIOS, DETAILED_PHASE_INFO, MACRO_QUADRANT_INFO } from './utils/macroUnifiedEngine';
import { FACT_CHECK_ITEMS } from './data/factCheckData';
import { getActiveRecentSeries } from './data/timeSeriesStorage';
import { APP_VERSION, APP_AUTHOR, APP_COPYRIGHT } from './version';

export default function App() {
  // Core Vertical Fader & 7-Phase Parameters
  const [rateDetailedPhase, setRateDetailedPhase] = useState<DetailedPhase>('RISING_MID_TO_HIGH');
  const [fxDetailedPhase, setFxDetailedPhase] = useState<DetailedPhase>('RISING_MID_TO_HIGH');
  const [couplingMode, setCouplingMode] = useState<CouplingMode>('COUPLED');
  const [fedRateValue, setFedRateValue] = useState<number>(5.25);
  const [usdkrwValue, setUsdkrwValue] = useState<number>(1380);

  // Layer 1 & 2: Macro Quadrant Scores & Dollar Net Liquidity
  const [liquidityValue, setLiquidityValue] = useState<number>(6.4);
  const [growthScore, setGrowthScore] = useState<number>(-40);
  const [inflationScore, setInflationScore] = useState<number>(65);

  // Modals
  const [isFactCheckModalOpen, setIsFactCheckModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [presentationSlideIndex, setPresentationSlideIndex] = useState<number>(0);
  const [isDataUpdateModalOpen, setIsDataUpdateModalOpen] = useState<boolean>(false);
  const [dataVersion, setDataVersion] = useState<number>(0);

  // Active time series and latest recorded date
  const activeRecentSeries = useMemo(() => getActiveRecentSeries(), [dataVersion]);
  const latestDateStr = useMemo(() => {
    return activeRecentSeries[activeRecentSeries.length - 1]?.dateStr || '2026.09';
  }, [activeRecentSeries]);

  // Derive 4-Regimes from 7-Phases
  const rateRegime: RateRegime = useMemo(() => {
    if (rateDetailedPhase === 'HIGH_HOLD') return 'HIGH_HOLD';
    if (rateDetailedPhase === 'LOW_HOLD') return 'LOW_HOLD';
    if (rateDetailedPhase === 'RISING_MID_TO_HIGH' || rateDetailedPhase === 'RISING_LOW_TO_MID') return 'HIKE';
    if (rateDetailedPhase === 'FALLING_HIGH_TO_MID' || rateDetailedPhase === 'FALLING_MID_TO_LOW') return 'CUT';
    return fedRateValue >= 3.0 ? 'HIGH_HOLD' : 'LOW_HOLD';
  }, [rateDetailedPhase, fedRateValue]);

  const fxRegime: FxRegime = useMemo(() => {
    if (fxDetailedPhase === 'HIGH_HOLD') return 'HIGH_HOLD';
    if (fxDetailedPhase === 'LOW_HOLD') return 'LOW_HOLD';
    if (fxDetailedPhase === 'RISING_MID_TO_HIGH' || fxDetailedPhase === 'RISING_LOW_TO_MID') return 'RISE';
    if (fxDetailedPhase === 'FALLING_HIGH_TO_MID' || fxDetailedPhase === 'FALLING_MID_TO_LOW') return 'FALL';
    return usdkrwValue >= 1280 ? 'HIGH_HOLD' : 'LOW_HOLD';
  }, [fxDetailedPhase, usdkrwValue]);

  // Confirmed Fact Check items
  const [confirmedItems, setConfirmedItems] = useState<Record<string, boolean>>({
    'fc-1': true,
    'fc-2': true,
    'fc-3': true,
    'fc-4': true,
    'fc-5': true
  });

  const toggleConfirmItem = (id: string) => {
    setConfirmedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Real-time Unified Macro Calculation
  const macroData = useMemo(() => {
    return getUnifiedMacroData(
      rateRegime, 
      fxRegime, 
      fedRateValue, 
      usdkrwValue,
      rateDetailedPhase,
      fxDetailedPhase,
      couplingMode,
      liquidityValue,
      growthScore,
      inflationScore
    );
  }, [
    rateRegime, 
    fxRegime, 
    fedRateValue, 
    usdkrwValue, 
    rateDetailedPhase, 
    fxDetailedPhase, 
    couplingMode,
    liquidityValue,
    growthScore,
    inflationScore
  ]);

  // Handle Quick Snapping from 4-Quadrant Buttons
  const handleQuadrantSelect = (quadrant: MacroQuadrant) => {
    const info = MACRO_QUADRANT_INFO[quadrant];
    if (!info) return;

    setGrowthScore(info.defaultGrowth);
    setInflationScore(info.defaultInflation);
    setFedRateValue(info.recommendedFedRate);
    setLiquidityValue(info.recommendedLiquidity);
    setUsdkrwValue(info.recommendedFx);

    // Sync phases
    if (info.recommendedFedRate >= 5.25) setRateDetailedPhase('HIGH_HOLD');
    else if (info.recommendedFedRate >= 4.0) setRateDetailedPhase('RISING_MID_TO_HIGH');
    else if (info.recommendedFedRate >= 2.5) setRateDetailedPhase('MID_HOLD');
    else setRateDetailedPhase('LOW_HOLD');

    if (info.recommendedFx >= 1400) setFxDetailedPhase('HIGH_HOLD');
    else if (info.recommendedFx >= 1320) setFxDetailedPhase('RISING_MID_TO_HIGH');
    else if (info.recommendedFx >= 1250) setFxDetailedPhase('MID_HOLD');
    else setFxDetailedPhase('LOW_HOLD');
  };

  // Preset Selection Handler
  const handleSelectPreset = (presetId: string) => {
    const target = PRESET_SCENARIOS.find(p => p.id === presetId);
    if (target) {
      setFedRateValue(target.fedRate);
      setUsdkrwValue(target.usdkrw);
      // Map regime to phase
      if (target.rateRegime === 'HIGH_HOLD') setRateDetailedPhase('HIGH_HOLD');
      else if (target.rateRegime === 'LOW_HOLD') setRateDetailedPhase('LOW_HOLD');
      else if (target.rateRegime === 'HIKE') setRateDetailedPhase('RISING_MID_TO_HIGH');
      else setRateDetailedPhase('FALLING_HIGH_TO_MID');

      if (target.fxRegime === 'HIGH_HOLD') setFxDetailedPhase('HIGH_HOLD');
      else if (target.fxRegime === 'LOW_HOLD') setFxDetailedPhase('LOW_HOLD');
      else if (target.fxRegime === 'RISE') setFxDetailedPhase('RISING_MID_TO_HIGH');
      else setFxDetailedPhase('FALLING_HIGH_TO_MID');

      setCouplingMode(target.category === 'NORMAL' ? 'COUPLED' : 'DECOUPLED_INVERSE');
    }
  };

  // Presentation Slide Scenario Selector
  const selectScenarioForPresentation = (r: RateRegime, f: FxRegime, fedRate: number, usdkrw: number) => {
    setFedRateValue(fedRate);
    setUsdkrwValue(usdkrw);
    if (r === 'HIGH_HOLD') setRateDetailedPhase('HIGH_HOLD');
    else if (r === 'LOW_HOLD') setRateDetailedPhase('LOW_HOLD');
    else if (r === 'HIKE') setRateDetailedPhase('RISING_MID_TO_HIGH');
    else setRateDetailedPhase('FALLING_HIGH_TO_MID');

    if (f === 'HIGH_HOLD') setFxDetailedPhase('HIGH_HOLD');
    else if (f === 'LOW_HOLD') setFxDetailedPhase('LOW_HOLD');
    else if (f === 'RISE') setFxDetailedPhase('RISING_MID_TO_HIGH');
    else setFxDetailedPhase('FALLING_HIGH_TO_MID');
  };

  // Presentation Slide Renderer
  const renderPresentationSlide = (idx: number) => {
    if (idx >= 0 && idx < PRESET_SCENARIOS.length) {
      return (
        <div className="space-y-6">
          <DynamicPipelineFlow macro={macroData} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <AssetPriceBoard assets={macroData.assets} />
            <BondSeesawVisualizer bond={macroData.bond} />
            <MacroIndicatorBoard indicators={macroData.indicators} />
          </div>
        </div>
      );
    }

    // Final Slide: Summary & Factcheck
    return (
      <div className="space-y-6">
        <MacroCheatSheet />
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white">원본 PPT 팩트체크 및 금융 전문 감수 최종 총괄</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {FACT_CHECK_ITEMS.map((item, i) => (
              <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400">#{i+1} [슬라이드 {item.slideNumber}p] {item.slideTitle}</div>
                <div className="text-slate-400">문제점: {item.critique}</div>
                <div className="text-emerald-400">교정안: {item.correction}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Header
        onOpenFactCheckModal={() => setIsFactCheckModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onStartPresentation={() => {
          setPresentationSlideIndex(0);
          handleSelectPreset('norm-1');
          setIsPresentationMode(true);
        }}
        scenarioName={macroData.scenarioName}
      />

      {/* Main Single-Screen Interactive Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section className="space-y-6">
          <IntegratedCockpitView
            rateValue={fedRateValue}
            setRateValue={setFedRateValue}
            fxValue={usdkrwValue}
            setFxValue={setUsdkrwValue}
            liquidityValue={liquidityValue}
            setLiquidityValue={setLiquidityValue}
            rateDetailedPhase={rateDetailedPhase}
            setRateDetailedPhase={setRateDetailedPhase}
            fxDetailedPhase={fxDetailedPhase}
            setFxDetailedPhase={setFxDetailedPhase}
            couplingMode={couplingMode}
            setCouplingMode={setCouplingMode}
            growthScore={growthScore}
            setGrowthScore={setGrowthScore}
            inflationScore={inflationScore}
            setInflationScore={setInflationScore}
            onQuadrantSelect={handleQuadrantSelect}
            macro={macroData}
            onSelectPreset={handleSelectPreset}
            onOpenDataUpdateManager={() => setIsDataUpdateModalOpen(true)}
            dataVersion={dataVersion}
          />

          {/* Bottom Collapsible / Complementary Cheat Sheet */}
          <MacroCheatSheet />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-xs text-slate-500 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-extrabold text-slate-300 tracking-tight">MacroDynamics</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-cyan-400 border border-slate-800">
              v{APP_VERSION}
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-slate-400 text-[11px]">
              글로벌 금리·유동성·환율 연동 거시경제 시뮬레이터 & 시계열 분석 플랫폼
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            <span>{APP_COPYRIGHT}</span>
            <span className="text-slate-700">|</span>
            <span className="text-cyan-400/90 font-medium">Designed & Developed by {APP_AUTHOR}</span>
          </div>
        </div>
      </footer>

      {/* Fact Check Modal */}
      <FactCheckModal
        isOpen={isFactCheckModalOpen}
        onClose={() => setIsFactCheckModalOpen(false)}
        confirmedItems={confirmedItems}
        onToggleConfirm={toggleConfirmItem}
      />

      {/* Executive Report Modal */}
      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        macro={macroData}
      />

      {/* Macro Data Update & LLM Prompt Manager Modal */}
      <DataUpdateManagerModal
        isOpen={isDataUpdateModalOpen}
        onClose={() => setIsDataUpdateModalOpen(false)}
        onDataUpdated={() => setDataVersion(v => v + 1)}
        latestDateStr={latestDateStr}
      />

      {/* Fullscreen Presentation Mode */}
      {isPresentationMode && (
        <PresentationMode
          onClose={() => setIsPresentationMode(false)}
          activeSlideIndex={presentationSlideIndex}
          setActiveSlideIndex={setPresentationSlideIndex}
          onSelectScenario={selectScenarioForPresentation}
          renderSlideContent={renderPresentationSlide}
        />
      )}
    </div>
  );
}
