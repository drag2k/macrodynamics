import React, { useRef, useState, useCallback, useEffect } from 'react';
import { MiniSparkline } from './MiniSparkline';

interface Tick {
  value: number;
  label: string;
}

interface CustomVerticalFaderProps {
  id: string;
  title: string;
  value: number;
  min: number;
  max: number;
  step: number;
  formatValue: (val: number) => string;
  phaseLabel: string;
  phaseCategory?: 'HIGH' | 'MID' | 'LOW' | 'RISING' | 'FALLING';
  accentColor: 'cyan' | 'emerald' | 'purple';
  ticks: Tick[];
  onChange: (val: number) => void;
  sparklineData?: {
    history: number[];
    currentIndex: number;
    unit?: string;
    label?: string;
  };
}

export const CustomVerticalFader: React.FC<CustomVerticalFaderProps> = ({
  id,
  title,
  value,
  min,
  max,
  step,
  formatValue,
  phaseLabel,
  accentColor,
  ticks,
  onChange,
  sparklineData,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate percentage: 0% at bottom (min), 100% at top (max)
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const updateValueFromPointer = useCallback(
    (clientY: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = rect.height;
      if (trackHeight <= 0) return;

      // Pointer Y relative to track (0 at top, trackHeight at bottom)
      const relativeY = clientY - rect.top;
      // Invert so 0 is at bottom (min), 1 is at top (max)
      const ratio = 1 - Math.max(0, Math.min(1, relativeY / trackHeight));
      const rawVal = min + ratio * (max - min);

      // Snap to step
      const steppedVal = Math.round(rawVal / step) * step;
      const clampedVal = Math.max(min, Math.min(max, steppedVal));

      onChange(Number(clampedVal.toFixed(2)));
    },
    [min, max, step, onChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValueFromPointer(e.clientY);

    const handlePointerMove = (ev: PointerEvent) => {
      updateValueFromPointer(ev.clientY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const isCyan = accentColor === 'cyan';
  const isEmerald = accentColor === 'emerald';
  const isPurple = accentColor === 'purple';

  return (
    <div id={id} className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between space-y-3 shadow-lg">
      {/* 1. Header: 타이틀 & 수치 */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div>
          <span className={`text-xs font-bold ${
            isCyan ? 'text-cyan-400' : isEmerald ? 'text-emerald-400' : 'text-purple-400'
          }`}>
            {title}
          </span>
        </div>
        <div className="text-right">
          <span className={`text-base sm:text-lg font-black font-mono tracking-tight ${
            isCyan ? 'text-cyan-300' : isEmerald ? 'text-emerald-300' : 'text-purple-300'
          }`}>
            {formatValue(value)}
          </span>
        </div>
      </div>

      {/* 2. 단 하나의 깔끔한 현재 상태 뱃지 */}
      <div className="flex items-center justify-center">
        <div className={`w-full py-1 px-2.5 rounded-lg text-center text-[11px] font-bold tracking-wide transition-all border ${
          isCyan 
            ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30 shadow-sm shadow-cyan-950' 
            : isEmerald
            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-950'
            : 'bg-purple-950/40 text-purple-300 border-purple-500/30 shadow-sm shadow-purple-950'
        }`}>
          {phaseLabel}
        </div>
      </div>

      {/* 3. 시원하고 긴 세로 슬라이더 바 & 물리적 놉(Knob Handle) */}
      <div className="flex items-center justify-center gap-4 py-2 select-none">
        {/* Left Side: 눈금 틱 라벨 (Tick Marks) */}
        <div className="flex flex-col justify-between h-72 py-1 text-[10px] font-mono font-semibold text-slate-500 text-right pr-1">
          {ticks.map((t) => (
            <div 
              key={t.value} 
              onClick={() => onChange(t.value)}
              className="cursor-pointer hover:text-slate-200 transition"
              title={`${t.label}로 이동`}
            >
              {t.label}
            </div>
          ))}
        </div>

        {/* Center: 세로 트랙과 잡을 수 있는 물리적 핸들 */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          className="relative h-72 w-14 flex items-center justify-center cursor-ns-resize touch-none"
        >
          {/* Background Track Groove (깊이감 있는 세로 홈) */}
          <div className="absolute w-3 h-full bg-slate-950 rounded-full border border-slate-800 shadow-inner overflow-hidden">
            {/* Dynamic Active Fill (하단에서부터 차오르는 컬러 바) */}
            <div
              className={`w-full transition-all duration-75 rounded-full absolute bottom-0 ${
                isCyan
                  ? 'bg-gradient-to-t from-cyan-600 via-cyan-400 to-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : isEmerald
                  ? 'bg-gradient-to-t from-emerald-600 via-emerald-400 to-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                  : 'bg-gradient-to-t from-purple-600 via-purple-400 to-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
              }`}
              style={{ height: `${percentage}%` }}
            />
          </div>

          {/* 물리적 페이더 핸들 (Heavy Duty Physical Handle Knob) */}
          <div
            className={`absolute w-12 h-7 rounded-lg border flex flex-col items-center justify-center transition-transform duration-75 shadow-xl ${
              isDragging
                ? isCyan
                  ? 'bg-slate-800 border-cyan-400 scale-105 shadow-cyan-500/30'
                  : isEmerald
                  ? 'bg-slate-800 border-emerald-400 scale-105 shadow-emerald-500/30'
                  : 'bg-slate-800 border-purple-400 scale-105 shadow-purple-500/30'
                : 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-slate-600 hover:border-slate-400'
            }`}
            style={{
              bottom: `calc(${percentage}% - 14px)`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {/* Metal Grip Lines (마우스로 잡을 수 있는 그립 홈 라인) */}
            <div className="w-6 flex flex-col items-center gap-[3px]">
              <div className="w-full h-[2px] bg-slate-400/80 rounded-full" />
              <div className={`w-full h-[2px] rounded-full ${
                isCyan ? 'bg-cyan-400' : isEmerald ? 'bg-emerald-400' : 'bg-purple-400'
              }`} />
              <div className="w-full h-[2px] bg-slate-400/80 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right Side: 세로 트랙 눈금 선 (Tick Lines) */}
        <div className="flex flex-col justify-between h-72 py-2 text-slate-700 pl-1">
          {ticks.map((t) => (
            <div key={t.value} className="flex items-center gap-1">
              <div className="w-2.5 h-[1.5px] bg-slate-700" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. 하단 트렌드 스파크라인 (해당 지표 실측 기간 변동 궤적 그래프) */}
      {sparklineData && sparklineData.history.length > 1 && (
        <div className="pt-2 border-t border-slate-800/80">
          <MiniSparkline
            data={sparklineData.history}
            currentIndex={sparklineData.currentIndex}
            color={isCyan ? 'cyan' : isEmerald ? 'emerald' : 'purple'}
            label={sparklineData.label || '기간 실측 궤적'}
            unit={sparklineData.unit}
            formatFn={formatValue}
          />
        </div>
      )}

      {/* 5. 하단 안내 힌트 */}
      <div className="text-center text-[10px] text-slate-500 font-medium">
        핸들을 위아래로 끌어 조절
      </div>
    </div>
  );
};
