import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  lightText?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
  showText = true,
  lightText = false,
}: LogoProps) {
  const iconDimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9 sm:w-10 sm:h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }[size];

  const textSizes = {
    sm: "text-base",
    md: "text-lg sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-3xl sm:text-4xl",
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Bespoke Geometric Villa + Monogram SV Emblem */}
      <div
        className={`${iconDimensions} rounded-xl bg-gradient-to-br from-terracotta to-terracotta-dark flex items-center justify-center p-1.5 shadow-md shadow-terracotta/25 shrink-0 relative overflow-hidden`}
      >
        {/* Subtle interior ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/25 pointer-events-none" />

        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          <defs>
            <linearGradient id="svGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2D6" />
              <stop offset="50%" stopColor="#F4D090" />
              <stop offset="100%" stopColor="#E9B263" />
            </linearGradient>
            <linearGradient id="svWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F1EDE4" />
            </linearGradient>
          </defs>

          {/* Tropical Villa Arch / Roofline Architecture */}
          <path
            d="M 6 36 L 24 10 L 42 36"
            stroke="url(#svWhiteGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interlocking 'V' & Sun Infinity Structure */}
          <path
            d="M 14 26 L 24 38 L 34 26"
            stroke="url(#svGoldGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Monogram 'S' Wave Bridge in Center */}
          <path
            d="M 21 21 C 21 18, 27 18, 27 21 C 27 24, 21 24, 21 27 C 21 30, 27 30, 27 27"
            stroke="url(#svWhiteGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Luxury Apex Sparkle Node */}
          <circle cx="24" cy="9" r="2.5" fill="url(#svGoldGrad)" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <span
          className={`${textSizes} font-black tracking-tight leading-none select-none whitespace-nowrap shrink-0`}
        >
          <span className={lightText ? "text-white" : "text-navy"}>Stay</span>
          <span className={lightText ? "text-gold-light" : "text-terracotta"}>
            Villa
          </span>
        </span>
      )}
    </div>
  );
}
