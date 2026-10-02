import React from 'react';
import { 
  TrendingUp, 
  FileText, 
  Printer,
  Presentation
} from 'lucide-react';
import { APP_VERSION } from '../version';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenFactCheckModal: () => void;
  onOpenReportModal: () => void;
  onStartPresentation: () => void;
  scenarioName: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenFactCheckModal,
  onOpenReportModal,
  onStartPresentation,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Title (Clean & Balanced) */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg text-white tracking-tight leading-none">
                  MacroDynamics
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800/90 text-cyan-400 border border-slate-700/80 shadow-xs leading-none">
                  v{APP_VERSION}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block mt-1 leading-none">
                글로벌 금리·유동성·환율 연동 거시경제 시뮬레이터
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* PWA App Install Button */}
            <PWAInstallButton />

            {/* Fact Check Modal Button */}
            <button
              onClick={onOpenFactCheckModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer whitespace-nowrap"
              title="교과서 이론 vs 실제 시장 팩트체크 검증표"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>팩트체크</span>
            </button>

            {/* Print/Report Button */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer whitespace-nowrap"
              title="인쇄 및 PDF 저장"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="hidden sm:inline">인쇄</span>
            </button>

            {/* Presentation Slide Show */}
            <button
              onClick={onStartPresentation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-md shadow-cyan-600/20 cursor-pointer whitespace-nowrap"
              title="전체 화면 슬라이드 쇼 발표 모드"
            >
              <Presentation className="w-3.5 h-3.5 shrink-0" />
              <span>슬라이드 쇼</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

