import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  theme?: 'light' | 'dark';
  showTagline?: boolean;
}

export const ExamBrainLogo: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Outer Blue Swirl Arc */}
      <path
        d="M 38 112 C 22 62, 65 20, 118 20 C 148 20, 172 34, 182 52"
        stroke="#2563EB"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M 175 138 C 158 174, 112 188, 72 172 C 48 162, 32 142, 28 122"
        stroke="#3B82F6"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Floating Tech Pixels */}
      <rect x="156" y="32" width="9" height="9" rx="2" fill="#2563EB" />
      <rect x="168" y="44" width="8" height="8" rx="2" fill="#3B82F6" />
      <rect x="156" y="54" width="7" height="7" rx="1.5" fill="#60A5FA" />
      <rect x="180" y="54" width="8" height="8" rx="2" fill="#1D4ED8" />

      {/* Main Exam Document */}
      <g>
        <path
          d="M 52 46 C 52 40, 56 36, 62 36 L 118 36 L 138 56 L 138 152 C 138 158, 134 162, 128 162 L 62 162 C 56 162, 52 158, 52 152 Z"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="4.5"
        />
        <path d="M 118 36 L 118 56 L 138 56 Z" fill="#0F172A" />
      </g>

      {/* "A+" Grade Badge */}
      <text x="96" y="66" fill="#10B981" fontSize="24" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
        A+
      </text>

      {/* Checked Rubric List Items */}
      {/* Check 1 */}
      <circle cx="68" cy="84" r="5.5" fill="none" stroke="#10B981" strokeWidth="2.5" />
      <path d="M 65 84 L 67 86 L 71 82" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="78" y1="84" x2="110" y2="84" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />

      {/* Check 2 */}
      <circle cx="68" cy="104" r="5.5" fill="none" stroke="#10B981" strokeWidth="2.5" />
      <path d="M 65 104 L 67 106 L 71 102" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="78" y1="104" x2="108" y2="104" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />

      {/* Check 3 */}
      <circle cx="68" cy="124" r="5.5" fill="none" stroke="#10B981" strokeWidth="2.5" />
      <path d="M 65 124 L 67 126 L 71 122" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="78" y1="124" x2="112" y2="124" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />

      {/* Circle Item 4 */}
      <circle cx="68" cy="144" r="5.5" fill="none" stroke="#64748B" strokeWidth="2" />
      <line x1="78" y1="144" x2="108" y2="144" stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" />

      {/* AI Circular Equalizer / Slider Badge on Right */}
      <g>
        <circle cx="150" cy="116" r="28" fill="url(#aiBadgeGrad)" stroke="#FFFFFF" strokeWidth="3" />
        
        {/* Equalizer / AI Sliders */}
        {/* Row 1 */}
        <line x1="134" y1="104" x2="166" y2="104" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <circle cx="142" cy="104" r="3.5" fill="#FFFFFF" />

        {/* Row 2 */}
        <line x1="132" y1="116" x2="168" y2="116" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <circle cx="158" cy="116" r="3.5" fill="#FFFFFF" />

        {/* Row 3 */}
        <line x1="134" y1="128" x2="166" y2="128" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <circle cx="148" cy="128" r="3.5" fill="#FFFFFF" />
      </g>

      <defs>
        <linearGradient id="aiBadgeGrad" x1="120" y1="88" x2="180" y2="144" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const AppLogo: React.FC<Props> = ({
  className = '',
  size = 'md',
  theme = 'light',
  showTagline = false,
}) => {
  let logoPx = 38;
  let titleSize = 'text-xl';
  let subtitleSize = 'text-[11px]';
  let taglineSize = 'text-[11px]';

  if (size === 'sm') {
    logoPx = 30;
    titleSize = 'text-base';
    subtitleSize = 'text-[9px]';
    taglineSize = 'text-[9px]';
  } else if (size === 'lg') {
    logoPx = 48;
    titleSize = 'text-3xl';
    subtitleSize = 'text-xs';
    taglineSize = 'text-xs';
  } else if (typeof size === 'number') {
    logoPx = size;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Icon Badge */}
      <ExamBrainLogo size={logoPx} />

      {/* Brand Text Block */}
      <div className="flex flex-col justify-center leading-none">
        {/* Main Header: AI EXAM */}
        <div className={`font-black tracking-tight ${titleSize} flex items-center space-x-1`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 font-extrabold">
            AI
          </span>
          <span className={isDark ? 'text-white font-black' : 'text-slate-900 font-black'}>
            EXAM
          </span>
        </div>

        {/* Sub Header: EVALUATION SYSTEM */}
        <div className={`font-black tracking-widest uppercase mt-0.5 ${subtitleSize} text-blue-600`}>
          EVALUATION SYSTEM
        </div>

        {/* Tagline */}
        {showTagline && (
          <div className={`font-semibold mt-1 tracking-normal ${taglineSize} ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Smart Evaluation, Fair Results, Better Learning
          </div>
        )}
      </div>
    </div>
  );
};


