export const FlagLV = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 32 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect width="32" height="24" fill="#9E3039" />
    <rect y="9.6" width="32" height="4.8" fill="#FFF" />
  </svg>
);

export const FlagRU = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 32 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect width="32" height="24" fill="#FFF" />
    <rect y="8" width="32" height="8" fill="#0039A6" />
    <rect y="16" width="32" height="8" fill="#D52B1E" />
  </svg>
);

export const FlagEN = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 32 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect width="32" height="24" fill="#012169" />
    <path d="M0 0 L32 24 M32 0 L0 24" stroke="#FFF" strokeWidth="3" />
    <path d="M0 0 L32 24 M32 0 L0 24" stroke="#C8102E" strokeWidth="1.5" />
    <path d="M16 0 V24 M0 12 H32" stroke="#FFF" strokeWidth="5" />
    <path d="M16 0 V24 M0 12 H32" stroke="#C8102E" strokeWidth="3" />
  </svg>
);
