import React from 'react';
import { UnifiedMacroState } from '../types';
import { ArrowRight, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DynamicPipelineFlowProps {
  macro: UnifiedMacroState;
}

export const DynamicPipelineFlow: React.FC<DynamicPipelineFlowProps> = ({ macro }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Top Banner: Scenario Title & Core Rule */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-400 font-mono">
              SCENARIO RESULT
            </span>
            <span className="text-xs font-semibold text-slate-400">{macro.scenarioTag}</span>
          </div>
          <h3 className="text-lg font-black text-white mt-1">
            {macro.scenarioName}
          </h3>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 max-w-xl text-xs text-slate-300">
          <strong className="text-cyan-400">⚡ 핵심 인과 연동 법칙: </strong>
          <span>{macro.coreRule}</span>
        </div>
      </div>

      {/* 5-Step Horizontal Pipeline Chain */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>실시간 5단계 거시경제 전파 경로 (Cause & Effect Chain)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
          {macro.pipelineSteps.map((step, idx) => {
            const isUp = step.direction === 'UP';
            const isDown = step.direction === 'DOWN';

            return (
              <div
                key={step.step}
                className="relative bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-700 transition group"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-mono text-cyan-400 font-bold">0{step.step}</span>
                  <span className="font-semibold text-slate-300">{step.title}</span>
                </div>

                {/* Main Outcome */}
                <div className="my-1">
                  <div className="flex items-center gap-1.5">
                    {isUp && <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {isDown && <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />}
                    {!isUp && !isDown && <Minus className="w-4 h-4 text-amber-400 shrink-0" />}
                    <span className={`text-xs font-extrabold leading-tight ${
                      isUp ? 'text-emerald-300' : isDown ? 'text-rose-300' : 'text-amber-300'
                    }`}>
                      {step.value}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {step.sub}
                  </div>
                </div>

                {/* Arrow to next item (hidden on last item and on mobile stacked) */}
                {idx < 4 && (
                  <div className="hidden sm:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-slate-800 text-slate-400 items-center justify-center border border-slate-700">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
