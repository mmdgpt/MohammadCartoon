import React, { useEffect, useRef, useState } from 'react';

const SHEET_WIDTH = 486;
const SHEET_HEIGHT = 864;

interface CatalogSheetViewportProps {
  routeKey: string;
  children: React.ReactNode;
}

export const CatalogSheetViewport: React.FC<CatalogSheetViewportProps> = ({
  routeKey,
  children,
}) => {
  const stageRef = useRef<HTMLElement | null>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateScale = () => {
      const style = window.getComputedStyle(el);
      const padX =
        (parseFloat(style.paddingLeft) || 0) +
        (parseFloat(style.paddingRight) || 0);
      const padY =
        (parseFloat(style.paddingTop) || 0) +
        (parseFloat(style.paddingBottom) || 0);
      const availW = Math.max(240, el.clientWidth - padX);
      const availH = Math.max(320, el.clientHeight - padY);
      const nextScale = Math.min(availW / SHEET_WIDTH, availH / SHEET_HEIGHT, 1);
      setScale(Math.max(0.35, Number(nextScale.toFixed(4))));
    };

    updateScale();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateScale);
      observer.observe(el);
    }
    window.addEventListener('resize', updateScale);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  const scaledW = Math.round(SHEET_WIDTH * scale);
  const scaledH = Math.round(SHEET_HEIGHT * scale);

  return (
    <main
      ref={stageRef}
      className="no-print flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden overscroll-none px-3 sm:px-6 py-2"
    >
      <div
        className="relative shrink-0"
        style={{
          width: `${scaledW}px`,
          height: `${scaledH}px`,
        }}
      >
        <div
          data-testid="smart-catalog-sheet"
          style={{
            width: `${SHEET_WIDTH}px`,
            height: `${SHEET_HEIGHT}px`,
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center center',
          }}
          className="absolute top-1/2 left-1/2 bg-gradient-to-b from-[#FAF8F3] via-[#F7F3EA] to-[#F3EDE0] border border-[#E2D8C5] rounded-[30px] shadow-[0_24px_60px_rgba(68,46,22,0.12)] overflow-hidden overscroll-none touch-manipulation"
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
