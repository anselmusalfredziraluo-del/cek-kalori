import React from 'react';

interface AppleLogoProps {
  className?: string;
  size?: number;
}

export const AppleLogo: React.FC<AppleLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo Apel CEK KALORI"
    >
      {/* Daun Hijau Alami (#4D8B45) */}
      <path
        d="M24 10C24 10 27 3 34 5C34 5 36 12 30 13C26 13.5 24 10 24 10Z"
        fill="#4D8B45"
      />
      {/* Batang Apel */}
      <path
        d="M24 10C23 13 22 15 21 16"
        stroke="#78350F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Buah Apel Pink Lembut (#E94F86) */}
      <path
        d="M24 18C21 15 15 15 11 19C6 24 7 35 13 41C16 44 20 44 24 41C28 44 32 44 35 41C41 35 42 24 37 19C33 15 27 15 24 18Z"
        fill="#E94F86"
      />
      {/* Kilau Halus Buah Apel */}
      <path
        d="M16 20C13 23 13 28 15 32"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
    </svg>
  );
};
