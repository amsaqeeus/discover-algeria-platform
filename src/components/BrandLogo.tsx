import React from 'react';

interface BrandLogoProps {
  customLogoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick
}) => {
  const iconDimensions = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }[size];

  const titleSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl'
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3.5 select-none ${className}`}
      id="brand-logo-container"
    >
      {/* Permanent Fixed Algerian Emblem */}
      <div className={`relative ${iconDimensions} rounded-xl bg-gradient-to-b from-[#114B3E] to-[#0B352C] shadow-sm ring-1 ring-[#114B3E]/30 flex items-center justify-center p-1.5 shrink-0 overflow-hidden`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-label="Algeria Tourism Emblem"
        >
          {/* Outer subtle concentric decorative circle */}
          <circle cx="50" cy="50" r="46" stroke="#D1A76A" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
          <circle cx="50" cy="50" r="41" stroke="#EFE9DC" strokeWidth="0.8" opacity="0.3" />

          {/* Atlas Mountain Silhouettes in background */}
          <path
            d="M16 75 L38 48 L56 68 L70 54 L86 75 Z"
            fill="#0F382E"
            opacity="0.8"
          />
          {/* Sahara Golden Dunes */}
          <path
            d="M12 78 C28 66, 42 74, 58 69 C74 64, 84 72, 88 78 L88 88 L12 88 Z"
            fill="#D49757"
            opacity="0.9"
          />

          {/* Oasis Date Palm Motif */}
          <path
            d="M32 74 C33 62, 35 55, 36 50"
            stroke="#F4EDE0"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M36 50 C32 46, 26 48, 22 52 M36 50 C33 44, 30 40, 24 41 M36 50 C38 42, 43 41, 48 44 M36 50 C41 47, 46 50, 48 54"
            stroke="#86C47A"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Algerian Ruby Crescent & 5-Point Star in the Sky */}
          {/* Crescent */}
          <path
            d="M58 20 A 17 17 0 1 0 74 46 A 14 14 0 1 1 58 20 Z"
            fill="#E03838"
          />
          {/* 5-pointed star */}
          <path
            d="M66 31 L68 36 L73 36 L69 39 L71 44 L66 41 L62 44 L63 39 L60 36 L65 36 Z"
            fill="#E03838"
          />

          {/* Sun Rays / Ambient Stars */}
          <circle cx="28" cy="26" r="1" fill="#F8E5B8" />
          <circle cx="42" cy="18" r="1.2" fill="#F8E5B8" />
          <circle cx="82" cy="24" r="0.8" fill="#F8E5B8" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className={`font-serif tracking-tight font-bold text-[#181B1A] ${titleSizes} leading-none`}>
            Discover Algeria
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#114B3E]/10 text-[#114B3E] border border-[#114B3E]/20">
            DZ
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[#60635F] tracking-normal font-normal">
              Community Guide & Vibes
            </span>
            <span className="text-stone-300 text-xs">•</span>
            <span className="font-arabic text-xs font-semibold text-[#114B3E]">
              اكتشف الجزائر
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
