import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone PWA mode, don't show
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-900/60 rounded-md transition shadow-sm shadow-cyan-950/50 cursor-pointer animate-pulse"
        title="홈 화면 또는 PC에 앱으로 설치하여 독립 창으로 실행"
      >
        <Download className="w-3.5 h-3.5 text-cyan-400" />
        <span>앱 설치</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-900/60 rounded-md transition cursor-pointer"
          title="아이폰/아이패드 홈 화면에 앱으로 추가"
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>iOS 앱 추가</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">iPhone / iPad 홈 화면에 추가</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">1</span>
                  <span>Safari 하단 도구 모음의 <strong>공유(Share)</strong> 아이콘을 탭합니다.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">2</span>
                  <span>메뉴를 아래로 스크롤하여 <strong>'홈 화면에 추가(Add to Home Screen)'</strong>를 누릅니다.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">3</span>
                  <span>우측 상단 <strong>[추가]</strong>를 누르면 전체 화면 앱으로 설치됩니다.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 py-2 text-xs font-semibold text-white transition"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
