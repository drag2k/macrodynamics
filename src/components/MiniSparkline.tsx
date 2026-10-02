import React from 'react';

interface MiniSparklineProps {
  data: number[];
  currentIndex: number;
  color: 'cyan' | 'emerald' | 'purple' | 'amber' | 'rose';
  height?: number;
  label?: string;
  unit?: string;
  formatFn?: (val: number) => string;
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  currentIndex,
  color,
  height = 36,
  label,
  unit,
  formatFn = (v) => `${v}`
}) => {
  if (!data || data.length < 2) return null;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const width = 160;
  const paddingX = 4;
  const paddingY = 4;
  const effW = width - paddingX * 2;
  const effH = height - paddingY * 2;

  // Generate SVG points
  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * effW;
    const y = paddingY + effH - ((val - minVal) / range) * effH;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`, '');

  // Fill area under curve
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  // Active point coordinates
  const safeIdx = Math.max(0, Math.min(points.length - 1, currentIndex));
  const currentPt = points[safeIdx];
  const currentVal = data[safeIdx];
  const startVal = data[0];
  const delta = currentVal - startVal;
  const isPositive = delta >= 0;

  const colorStyles = {
    cyan: {
      stroke: '#06b6d4',
      fill: 'rgba(6, 182, 212, 0.15)',
      dot: '#22d3ee',
      text: 'text-cyan-400'
    },
    emerald: {
      stroke: '#10b981',
      fill: 'rgba(16, 185, 129, 0.15)',
      dot: '#34d399',
      text: 'text-emerald-400'
    },
    purple: {
      stroke: '#a855f7',
      fill: 'rgba(168, 85, 247, 0.15)',
      dot: '#c084fc',
      text: 'text-purple-400'
    },
    amber: {
      stroke: '#f59e0b',
      fill: 'rgba(245, 158, 11, 0.15)',
      dot: '#fbbf24',
      text: 'text-amber-400'
    },
    rose: {
      stroke: '#f43f5e',
      fill: 'rgba(244, 63, 94, 0.15)',
      dot: '#fb7185',
      text: 'text-rose-400'
    }
  }[color];

  return (
    <div className="flex flex-col bg-slate-950/70 border border-slate-800/80 rounded-xl p-2 select-none">
      {/* Header: Label & Live Delta */}
      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
        <span className="text-slate-400 font-semibold">{label || '변동 궤적'}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-bold">{formatFn(currentVal)}</span>
          <span className={`text-[9px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            ({isPositive ? '+' : ''}{formatFn(delta)})
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-8 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Subtle area gradient */}
          <path d={areaD} fill={colorStyles.fill} />
          
          {/* Main Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke={colorStyles.stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Live Scrubber Dot */}
          {currentPt && (
            <g>
              {/* Vertical Guide Needle */}
              <line
                x1={currentPt.x}
                y1={0}
                x2={currentPt.x}
                y2={height}
                stroke={colorStyles.stroke}
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.6"
              />
              <circle
                cx={currentPt.x}
                cy={currentPt.y}
                r="4"
                fill={colorStyles.dot}
                stroke="#0f172a"
                strokeWidth="2"
              />
              <circle
                cx={currentPt.x}
                cy={currentPt.y}
                r="7"
                fill="none"
                stroke={colorStyles.dot}
                strokeWidth="1"
                opacity="0.4"
                className="animate-ping"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Footer: Min / Max Range Markers */}
      <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 mt-1 pt-1 border-t border-slate-900">
        <span>저: {formatFn(minVal)}</span>
        <span>고: {formatFn(maxVal)}</span>
      </div>
    </div>
  );
};
