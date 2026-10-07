import React from 'react';
import logoImg from '../../Images/OBJ.png';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  theme?: 'light' | 'dark';
  showTagline?: boolean;
}

export const ExamBrainLogo: React.FC<{ size?: number; className?: string }> = ({ size = 42, className = '' }) => {
  return (
    <img
      src={logoImg}
      alt="Auto Exam Evaluation System Logo"
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`shrink-0 object-contain drop-shadow-xs ${className}`}
    />
  );
};

export const AppLogo: React.FC<Props> = ({
  className = '',
  size = 'md',
  theme = 'light',
}) => {
  let logoPx = 62;
  let titleSize = 'text-xl sm:text-2xl';

  if (size === 'sm') {
    logoPx = 48;
    titleSize = 'text-lg';
  } else if (size === 'lg') {
    logoPx = 80;
    titleSize = 'text-3xl';
  } else if (typeof size === 'number') {
    logoPx = size;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Icon Image from OBJ.png */}
      <ExamBrainLogo size={logoPx} />

      {/* Brand Text Block */}
      <div className="flex flex-col justify-center leading-none">
        {/* Main Header: AI EXAM */}
        <div className={`font-black tracking-tight ${titleSize} flex items-center space-x-1.5`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 font-black">
            AI
          </span>
          <span className={isDark ? 'text-white font-black' : 'text-slate-900 font-black'}>
            EXAM
          </span>
        </div>

        {/* Sub Header: EVALUATION SYSTEM */}
        <div className={`font-black tracking-[0.18em] uppercase mt-0.5 text-[10px] sm:text-[11px] ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          EVALUATION SYSTEM
        </div>
      </div>
    </div>
  );
};
