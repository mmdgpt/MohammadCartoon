import React, { useEffect, useRef, useState } from 'react';

const SHEET_WIDTH = 486;
const SHEET_HEIGHT = 864;
const MOBILE_BREAKPOINT = 640;

interface CatalogSheetViewportProps {
  routeKey: string;
  children: React.ReactNode;
}

interface ViewportMetrics {
  isMobile: boolean;
  scale: number;
  logicalWidth: number;
  logicalHeight: number;
  scaledWidth: number;
  scaledHeight: number;
}

export const CatalogSheetViewport: React.FC<CatalogSheetViewportProps> = ({
  routeKey,
  children,
}) => {
  const stageRef = useRef<HTMLElement | null>(null);
  const [metrics, setMetrics] = useState<ViewportMetrics>({
    isMobile: false,
    scale: 1,
    logicalWidth: SHEET_WIDTH,
    logicalHeight: SHEET_HEIGHT,
    scaledWidth: SHEET_WIDTH,
    scaledHeight: SHEET_HEIGHT,
  });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateLayout = () => {
      const stageW = el.clientWidth;
      const stageH = el.clientHeight;
      const isMobile = stageW <= MOBILE_BREAKPOINT;

      if (isMobile) {
        const availW = Math.max(240, stageW);
        const availH = Math.max(320, stageH);
        const scale = Math.max(
          0.35,
          Math.min(availW / SHEET_WIDTH, availH / SHEET_HEIGHT)
        );
        const logicalWidth = availW / scale;
        const logicalHeight = availH / scale;

        setMetrics({
          isMobile: true,
          scale,
          logicalWidth,
          logicalHeight,
          scaledWidth: availW,
          scaledHeight: availH,
        });
        return;
      }

      const style = window.getComputedStyle(el);
      const padX =
        (parseFloat(style.paddingLeft) || 0) +
        (parseFloat(style.paddingRight) || 0);
      const padY =
        (parseFloat(style.paddingTop) || 0) +
        (parseFloat(style.paddingBottom) || 0);
      const availW = Math.max(240, stageW - padX);
      const availH = Math.max(320, stageH - padY);
      const nextScale = Math.max(
        0.35,
        Math.min(availW / SHEET_WIDTH, availH / SHEET_HEIGHT, 1)
      );

      setMetrics({
        isMobile: false,
        scale: nextScale,
        logicalWidth: SHEET_WIDTH,
        logicalHeight: SHEET_HEIGHT,
        scaledWidth: Math.round(SHEET_WIDTH * nextScale),
        scaledHeight: Math.round(SHEET_HEIGHT * nextScale),
      });
    };

    updateLayout();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateLayout);
      observer.observe(el);
    }
    window.addEventListener('resize', updateLayout);
    window.addEventListener('orientationchange', updateLayout);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('orientationchange', updateLayout);
    };
  }, []);

  return (
    <main
      ref={stageRef}
      className="no-print flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden overscroll-none p-0 sm:px-6 sm:py-2"
    >
      <div
        className="relative shrink-0"
        style={{
          width: metrics.isMobile ? '100%' : `${metrics.scaledWidth}px`,
          height: metrics.isMobile ? '100%' : `${metrics.scaledHeight}px`,
        }}
      >
        <div
          data-testid="smart-catalog-sheet"
          style={{
            width: `${metrics.logicalWidth}px`,
            height: `${metrics.logicalHeight}px`,
            transform: `translate(-50%, -50%) scale(${metrics.scale})`,
            transformOrigin: 'center center',
            paddingTop: metrics.isMobile ? 'env(safe-area-inset-top, 0px)' : undefined,
            paddingBottom: metrics.isMobile ? 'env(safe-area-inset-bottom, 0px)' : undefined,
          }}
          className={`absolute top-1/2 left-1/2 bg-gradient-to-b from-[#FAF8F3] via-[#F7F3EA] to-[#F3EDE0] overflow-hidden overscroll-none touch-manipulation ${
            metrics.isMobile
              ? 'border-0 rounded-none shadow-none'
              : 'border border-[#E2D8C5] rounded-[30px] shadow-[0_24px_60px_rgba(68,46,22,0.12)]'
          }`}
        >
          {/* Decorative halftone dot grid corners */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 w-44 h-44 catalog-corner-pattern-tr"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 w-44 h-44 catalog-corner-pattern-bl"
          />

          {/* Animated Page Transitions */}
          <div
            key={routeKey}
            className="w-full h-full overflow-hidden catalog-page-transition"
          >
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};
