import { useEffect, useState, RefObject } from 'react';

export const CATALOG_BASE_WIDTH = 486;
export const CATALOG_BASE_HEIGHT = 864;

/**
 * Scales the fixed 486x864 (9:16) catalog sheet proportionally to always fit
 * completely inside the available viewport container without any horizontal
 * or vertical scrollbars.
 */
export function useCatalogViewportScale(
  containerRef: RefObject<HTMLElement | null>
): number {
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const style = window.getComputedStyle(el);
      const padX =
        parseFloat(style.paddingLeft || '0') +
        parseFloat(style.paddingRight || '0');
      const padY =
        parseFloat(style.paddingTop || '0') +
        parseFloat(style.paddingBottom || '0');

      const availW = Math.max(240, el.clientWidth - padX);
      const availH = Math.max(360, el.clientHeight - padY);

      const nextScale = Math.min(
        1,
        availW / CATALOG_BASE_WIDTH,
        availH / CATALOG_BASE_HEIGHT
      );
      setScale(Number(nextScale.toFixed(4)));
    };

    updateScale();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateScale);
      ro.observe(el);
      window.addEventListener('resize', updateScale);
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', updateScale);
      };
    }

    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [containerRef]);

  return scale;
}
