import React from 'react';

export const RobotHeadIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3V5.5" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M3.5 11.5V14.5M20.5 11.5V14.5"
      stroke="#60a5fa"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <rect x="5.5" y="6" width="13" height="12" rx="3.5" stroke="#60a5fa" strokeWidth="1.8" />
    <circle cx="9.5" cy="11.5" r="1.15" fill="#60a5fa" />
    <circle cx="14.5" cy="11.5" r="1.15" fill="#60a5fa" />
    <path d="M9.5 15H14.5" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
