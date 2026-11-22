import React, { useState } from 'react';
import { CatalogProduct } from '../data/catalogData';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  zoomScale?: number;
  objectFit?: 'cover' | 'contain';
}

/**
 * Interactive cursor-tracking hover zoom image component.
 * Moving the mouse over the image smoothly zooms into the cursor position.
 */
export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  zoomScale = 2.1,
  objectFit = 'cover',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovered(false);
        setOrigin({ x: 50, y: 50 });
      }}
      className={`relative overflow-hidden cursor-zoom-in ${containerClassName}`}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        style={{
          transformOrigin: `${origin.x}% ${origin.y}%`,
          transform: isHovered ? `scale(${zoomScale})` : 'scale(1)',
        }}
        className={`w-full h-full ${
          objectFit === 'contain' ? 'object-contain' : 'object-cover'
        } transition-transform duration-150 ease-out ${className}`}
      />
    </div>
  );
};

interface ProductDiagramProps {
  diagramType: CatalogProduct['diagramType'];
  customImage?: string;
  className?: string;
  compact?: boolean;
  enableHoverZoom?: boolean;
}

/**
 * Renders technical isometric & cross-section SVG engineering illustrations
 * (or custom uploaded schematic image) with interactive mouse-hover zoom.
 */
export const ProductDiagram: React.FC<ProductDiagramProps> = ({
  diagramType,
  customImage,
  className = '',
  compact = false,
  enableHoverZoom = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableHoverZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });
  };

  // If a custom schematic image has been uploaded/set in the Admin Panel, render it with hover zoom
  if (customImage && customImage.trim().length > 0) {
    return (
      <div
        onMouseEnter={() => enableHoverZoom && setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setIsHovered(false);
          setOrigin({ x: 50, y: 50 });
        }}
        className={`relative flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF6EE] to-[#F1E9DA] border border-[#E5DAC7] rounded-2xl overflow-hidden select-none ${
          enableHoverZoom ? 'cursor-zoom-in' : ''
        } ${className}`}
      >
        <img
          src={customImage}
          alt="شماتیک فنی محصول"
          referrerPolicy="no-referrer"
          style={{
            transformOrigin: `${origin.x}% ${origin.y}%`,
            transform: isHovered ? 'scale(2.1)' : 'scale(1)',
          }}
          className="w-full h-full object-contain transition-transform duration-150 ease-out"
        />
      </div>
    );
  }

  // Helper to generate sinusoidal wave path for corrugated flutes
  const buildWavePath = (
    yCenter: number,
    amplitude: number,
    wavelength: number,
    startX: number = 16,
    endX: number = 224
  ) => {
    let d = `M ${startX} ${yCenter}`;
    for (let x = startX; x < endX; x += wavelength) {
      const half = wavelength / 2;
      const q1 = x + half / 2;
      const q2 = x + half;
      const q3 = x + half + half / 2;
      const q4 = Math.min(endX, x + wavelength);
      d += ` Q ${q1} ${yCenter - amplitude}, ${q2} ${yCenter} Q ${q3} ${yCenter + amplitude}, ${q4} ${yCenter}`;
    }
    return d;
  };

  const zoomStyle = enableHoverZoom
    ? {
        transformOrigin: `${origin.x}% ${origin.y}%`,
        transform: isHovered ? (compact ? 'scale(1.65)' : 'scale(1.95)') : 'scale(1)',
      }
    : undefined;

  // Check if it's a corrugated sheet flute diagram
  if (diagramType.startsWith('flute-')) {
    const isDoubleWall =
      diagramType === 'flute-cb' || diagramType === 'flute-ce' || diagramType === 'flute-be';

    return (
      <div
        onMouseEnter={() => enableHoverZoom && setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setIsHovered(false);
          setOrigin({ x: 50, y: 50 });
        }}
        className={`relative flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF6EE] to-[#F1E9DA] border border-[#E5DAC7] rounded-2xl overflow-hidden select-none ${
          enableHoverZoom ? 'cursor-zoom-in' : ''
        } ${compact ? 'p-2.5' : 'p-4'} ${className}`}
      >
        <svg
          viewBox="0 0 240 120"
          style={zoomStyle}
          className={`w-full h-full ${
            compact ? 'max-h-[120px]' : 'max-h-[224px]'
          } transition-transform duration-150 ease-out`}
          role="img"
          aria-label={`مقطع مهندسی ${diagramType.toUpperCase()}`}
        >
          <defs>
            <linearGradient id="kraftLiner" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B88655" />
              <stop offset="50%" stopColor="#CFA06E" />
              <stop offset="100%" stopColor="#A97645" />
            </linearGradient>
            <linearGradient id="fluteMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#925E30" />
              <stop offset="100%" stopColor="#6E431E" />
            </linearGradient>
          </defs>

          {/* Subtle technical grid */}
          <line x1="16" y1="20" x2="224" y2="20" stroke="#E2D5C1" strokeDasharray="2 2" strokeWidth="0.75" />
          <line x1="16" y1="100" x2="224" y2="100" stroke="#E2D5C1" strokeDasharray="2 2" strokeWidth="0.75" />

          {diagramType === 'flute-e' && (
            <g>
              <rect x="16" y="45" width="208" height="3.5" rx="1.5" fill="url(#kraftLiner)" />
              <path
                d={buildWavePath(54.5, 5.5, 9)}
                fill="none"
                stroke="url(#fluteMedium)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <rect x="16" y="60.5" width="208" height="3.5" rx="1.5" fill="url(#kraftLiner)" />
              {!compact && (
                <text x="120" y="92" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="700">
                  E-FLUTE · ۱.۵ mm (۹۴ کنگره)
                </text>
              )}
            </g>
          )}

          {diagramType === 'flute-b' && (
            <g>
              <rect x="16" y="38" width="208" height="4" rx="1.5" fill="url(#kraftLiner)" />
              <path
                d={buildWavePath(52, 9.5, 16)}
                fill="none"
                stroke="url(#fluteMedium)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <rect x="16" y="62" width="208" height="4" rx="1.5" fill="url(#kraftLiner)" />
              {!compact && (
                <text x="120" y="94" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="700">
                  B-FLUTE · ۳.۰ mm (۵۰ کنگره)
                </text>
              )}
            </g>
          )}

          {diagramType === 'flute-c' && (
            <g>
              <rect x="16" y="32" width="208" height="4.5" rx="1.5" fill="url(#kraftLiner)" />
              <path
                d={buildWavePath(51, 13.5, 22)}
                fill="none"
                stroke="url(#fluteMedium)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <rect x="16" y="65" width="208" height="4.5" rx="1.5" fill="url(#kraftLiner)" />
              {!compact && (
                <text x="120" y="96" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="700">
                  C-FLUTE · ۴.۰ mm (۴۱ کنگره)
                </text>
              )}
            </g>
          )}

          {diagramType === 'flute-cb' && (
            <g>
              <rect x="16" y="20" width="208" height="4" rx="1.5" fill="url(#kraftLiner)" />
              <path
                d={buildWavePath(33, 8.5, 16)}
                fill="none"
                stroke="url(#fluteMedium)"
                strokeWidth="2.6"
              />
              <rect x="16" y="42" width="208" height="3.5" rx="1.5" fill="url(#kraftLiner)" />
              <path
                d={buildWavePath(59, 13, 22)}
                fill="none"
                stroke="url(#fluteMedium)"
                strokeWidth="3"
              />
              <rect x="16" y="72.5" width="208" height="4" rx="1.5" fill="url(#kraftLiner)" />
              {!compact && (
                <text x="120" y="98" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="700">
                  CB DOUBLE-WALL · ۷.۰ mm (۵ لایه سنگین)
                </text>
              )}
            </g>
          )}

          {diagramType === 'flute-ce' && (
            <g>
              <rect x="16" y="24" width="208" height="3.5" rx="1.5" fill="url(#kraftLiner)" />
              <path
                d={buildWavePath(33.5, 5.5, 9)}
                fill="none"
                stroke="url(#fluteMedium)"
                strokeWidth="2.3"
              />
              <rect x="16" y="39.5" width="208" height="3.5" rx="1.5" fill="url(#kraftLiner)" />
              <path
                d={buildWavePath(56.5, 13, 22)}
                fill="none"
                stroke="url(#fluteMedium)"
                strokeWidth="2.9"
              />
              <rect x="16" y="70" width="208" height="4" rx="1.5" fill="url(#kraftLiner)" />
              {!compact && (
                <text x="120" y="97" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="700">
                  CE DOUBLE-WALL · ۵.۵ mm (۵ لایه چاپی)
                </text>
              )}
            </g>
          )}

          {diagramType === 'flute-be' && (
            <g>
              <rect x="16" y="27" width="208" height="3.5" rx="1.5" fill="url(#kraftLiner)" />
              <path
                d={buildWavePath(36.5, 5.5, 9)}
                fill="none"
                stroke="url(#fluteMedium)"
                strokeWidth="2.2"
              />
              <rect x="16" y="42.5" width="208" height="3.5" rx="1.5" fill="url(#kraftLiner)" />
              <path
                d={buildWavePath(55.5, 9, 16)}
                fill="none"
                stroke="url(#fluteMedium)"
                strokeWidth="2.6"
              />
              <rect x="16" y="65" width="208" height="3.8" rx="1.5" fill="url(#kraftLiner)" />
              {!compact && (
                <text x="120" y="96" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="700">
                  BE MICRO ۵-PLY · ۴.۵ mm (۵ لایه دایکاتی)
                </text>
              )}
            </g>
          )}
        </svg>

        {compact && (
          <span className="mt-1 text-[10px] font-mono-tech font-semibold text-[#92400E] bg-[#FEF3C7]/80 px-2 py-0.5 rounded-md">
            {isDoubleWall ? '5-PLY' : '3-PLY'} · {diagramType.replace('flute-', '').toUpperCase()}
          </span>
        )}
      </div>
    );
  }

  // Isometric structural box & carton illustrations
  return (
    <div
      onMouseEnter={() => enableHoverZoom && setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovered(false);
        setOrigin({ x: 50, y: 50 });
      }}
      className={`relative flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF6EE] to-[#F0E7D8] border border-[#E5DAC7] rounded-2xl overflow-hidden select-none ${
        enableHoverZoom ? 'cursor-zoom-in' : ''
      } ${compact ? 'p-2.5' : 'p-4'} ${className}`}
    >
      <svg
        viewBox="0 0 200 130"
        style={zoomStyle}
        className={`w-full h-full ${
          compact ? 'max-h-[120px]' : 'max-h-[224px]'
        } transition-transform duration-150 ease-out`}
        role="img"
        aria-label={`ساختار مهندسی ${diagramType}`}
      >
        <defs>
          <linearGradient id="boxTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E6C9A2" />
            <stop offset="100%" stopColor="#D4AF80" />
          </linearGradient>
          <linearGradient id="boxLeft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C89D6C" />
            <stop offset="100%" stopColor="#B08250" />
          </linearGradient>
          <linearGradient id="boxRight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B48655" />
            <stop offset="100%" stopColor="#96693B" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="100" cy="112" rx="56" ry="10" fill="#D5C7B2" opacity="0.55" />

        {diagramType === 'stand' && (
          <g stroke="#6E431E" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="62,20 138,20 138,60 62,60" fill="url(#boxTop)" />
            <rect x="74" y="28" width="52" height="10" rx="2" fill="#FFFBEB" stroke="#B45309" strokeWidth="1" />
            <polygon points="50,68 62,48 62,96 50,104" fill="url(#boxLeft)" />
            <polygon points="150,68 138,48 138,96 150,104" fill="url(#boxRight)" />
            <polygon points="50,82 150,82 150,104 50,104" fill="url(#boxTop)" />
            <line x1="62" y1="52" x2="138" y2="52" stroke="#B45309" strokeDasharray="3 3" strokeWidth="1.5" />
          </g>
        )}

        {diagramType === 'lock-bottom' && (
          <g stroke="#6E431E" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="100,24 148,42 100,60 52,42" fill="url(#boxTop)" />
            <polygon points="52,42 100,60 100,106 52,88" fill="url(#boxLeft)" />
            <polygon points="148,42 100,60 100,106 148,88" fill="url(#boxRight)" />
            <line x1="52" y1="88" x2="82" y2="74" stroke="#FFFBEB" strokeDasharray="3 2" strokeWidth="1.6" />
            <line x1="148" y1="88" x2="118" y2="74" stroke="#FFFBEB" strokeDasharray="3 2" strokeWidth="1.6" />
            <circle cx="100" cy="84" r="9" fill="#B45309" stroke="#FFF" strokeWidth="1.5" />
            <path d="M96 84 l3 3 l6 -6" fill="none" stroke="#FFF" strokeWidth="1.8" />
          </g>
        )}

        {diagramType === 'snap-lock' && (
          <g stroke="#6E431E" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="100,26 146,44 100,62 54,44" fill="url(#boxTop)" />
            <polygon points="54,44 100,62 100,104 54,86" fill="url(#boxLeft)" />
            <polygon points="146,44 100,62 100,104 146,86" fill="url(#boxRight)" />
            <polygon points="75,75 100,65 125,75 100,85" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.3" />
            <line x1="88" y1="70" x2="112" y2="80" stroke="#92400E" strokeWidth="1.5" />
          </g>
        )}

        {diagramType === 'mailer' && (
          <g stroke="#6E431E" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="54,42 100,26 146,42 136,16 90,6 44,20" fill="url(#boxTop)" />
            <polygon points="44,20 34,34 54,42" fill="url(#boxLeft)" />
            <polygon points="136,16 154,28 146,42" fill="url(#boxRight)" />
            <polygon points="54,42 100,26 146,42 100,60" fill="#78350F" opacity="0.85" />
            <polygon points="54,42 100,60 100,98 54,80" fill="url(#boxLeft)" />
            <polygon points="146,42 100,60 100,98 146,80" fill="url(#boxRight)" />
          </g>
        )}

        {diagramType === 'fancy' && (
          <g stroke="#6E431E" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="100,22 146,40 100,58 54,40" fill="url(#boxTop)" />
            <polygon points="54,40 100,58 100,104 54,86" fill="url(#boxLeft)" />
            <polygon points="146,40 100,58 100,104 146,86" fill="url(#boxRight)" />
            <polygon points="64,54 92,65 92,90 64,79" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.2" opacity="0.85" />
            <line x1="100" y1="22" x2="100" y2="58" stroke="#D97706" strokeWidth="2.5" />
          </g>
        )}

        {diagramType === 'pharma' && (
          <g stroke="#6E431E" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="100,16 130,28 100,40 70,28" fill="#FFFBEB" />
            <polygon points="70,28 100,40 100,106 70,94" fill="#F5EFE6" />
            <polygon points="130,28 100,40 100,106 130,94" fill="url(#boxTop)" />
            <path d="M70,28 Q85,12 100,16 L130,28" fill="url(#boxLeft)" />
            <rect x="77" y="52" width="16" height="6" rx="1" fill="#B45309" stroke="none" />
            <rect x="77" y="62" width="12" height="3" rx="1" fill="#A8A29E" stroke="none" />
          </g>
        )}

        {diagramType === 'holder' && (
          <g stroke="#6E431E" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="48,60 100,40 152,60 100,80" fill="url(#boxTop)" />
            <polygon points="48,60 100,80 100,104 48,84" fill="url(#boxLeft)" />
            <polygon points="152,60 100,80 100,104 152,84" fill="url(#boxRight)" />
            <ellipse cx="82" cy="56" rx="10" ry="5.5" fill="#78350F" />
            <ellipse cx="118" cy="56" rx="10" ry="5.5" fill="#78350F" />
            <ellipse cx="82" cy="68" rx="10" ry="5.5" fill="#78350F" />
            <ellipse cx="118" cy="68" rx="10" ry="5.5" fill="#78350F" />
          </g>
        )}

        {diagramType === 'tray' && (
          <g stroke="#6E431E" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="44,64 100,44 156,64 100,84" fill="url(#boxTop)" />
            <polygon points="44,64 100,84 100,104 44,84" fill="url(#boxLeft)" />
            <polygon points="156,64 100,84 100,104 156,84" fill="url(#boxRight)" />
            <polygon points="56,68 92,81 92,94 56,81" fill="#78350F" opacity="0.25" stroke="none" />
          </g>
        )}

        {(diagramType === 'rsc-carton' ||
          diagramType === 'diecut-carton' ||
          diagramType === 'postal-carton' ||
          diagramType === 'charcoal-carton' ||
          diagramType === 'fruit-carton' ||
          diagramType === 'date-carton') && (
          <g stroke="#6E431E" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="100,26 152,44 100,62 48,44" fill="url(#boxTop)" />
            <polygon points="48,44 100,62 100,106 48,88" fill="url(#boxLeft)" />
            <polygon points="152,44 100,62 100,106 152,88" fill="url(#boxRight)" />
            <line x1="74" y1="35" x2="126" y2="53" stroke="#78350F" strokeWidth="1.8" />

            {diagramType === 'fruit-carton' && (
              <g fill="#451A03" stroke="none">
                <circle cx="64" cy="64" r="3.5" />
                <circle cx="76" cy="68" r="3.5" />
                <circle cx="88" cy="72" r="3.5" />
                <rect x="116" y="64" width="18" height="6" rx="3" />
              </g>
            )}

            {diagramType === 'charcoal-carton' && (
              <g>
                <rect x="62" y="62" width="26" height="18" rx="2" fill="#1C1917" stroke="#F59E0B" strokeWidth="1" />
                <path d="M90,34 Q100,18 110,34" fill="none" stroke="#1C1917" strokeWidth="2.5" />
              </g>
            )}

            {diagramType === 'postal-carton' && (
              <g stroke="none">
                <rect x="58" y="58" width="30" height="16" rx="1.5" fill="#FFFBEB" />
                <line x1="62" y1="63" x2="84" y2="63" stroke="#92400E" strokeWidth="1.2" />
                <line x1="62" y1="68" x2="78" y2="68" stroke="#92400E" strokeWidth="1.2" />
              </g>
            )}

            {diagramType === 'date-carton' && (
              <g>
                <polygon points="46,42 100,22 154,42 100,62" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.4" />
                <rect x="112" y="66" width="26" height="14" rx="2" fill="#78350F" stroke="none" />
              </g>
            )}

            {diagramType === 'diecut-carton' && (
              <g>
                <rect x="115" y="62" width="20" height="7" rx="3.5" fill="#451A03" stroke="none" />
                <line x1="56" y1="48" x2="56" y2="86" stroke="#FEF3C7" strokeDasharray="3 2" strokeWidth="1.3" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
