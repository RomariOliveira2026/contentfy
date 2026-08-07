/**
 * Capa premium — Dominando o TDAH (demo biblioteca / portfólio).
 * Composição com profundidade alinhada ao mockup Desacelere.
 */
export function TdahCover({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 360"
      className={className}
      role="img"
      aria-label="Capa do curso Dominando o TDAH"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="tdah-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#151c2b" />
          <stop offset="45%" stopColor="#0c1220" />
          <stop offset="100%" stopColor="#070b12" />
        </linearGradient>
        <linearGradient id="tdah-accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <radialGradient id="tdah-orange" cx="22%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#070b12" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tdah-blue" cx="85%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#070b12" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tdah-coral" cx="70%" cy="85%" r="45%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#070b12" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tdah-panel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a2332" />
          <stop offset="100%" stopColor="#0f1522" />
        </linearGradient>
        <filter id="tdah-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="640" height="360" fill="url(#tdah-bg)" />
      <rect width="640" height="360" fill="url(#tdah-orange)" />
      <rect width="640" height="360" fill="url(#tdah-blue)" />
      <rect width="640" height="360" fill="url(#tdah-coral)" />

      {/* Painel / “mockup” do curso */}
      <g filter="url(#tdah-soft)">
        <rect
          x="360"
          y="48"
          width="220"
          height="264"
          rx="18"
          fill="url(#tdah-panel)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <rect
          x="378"
          y="72"
          width="184"
          height="110"
          rx="10"
          fill="#070b12"
          stroke="rgba(249,115,22,0.25)"
          strokeWidth="1"
        />
        <circle cx="470" cy="127" r="26" fill="none" stroke="url(#tdah-accent)" strokeWidth="2" />
        <circle cx="470" cy="127" r="10" fill="#f97316" />
        <rect x="390" y="200" width="120" height="8" rx="4" fill="rgba(248,250,252,0.2)" />
        <rect x="390" y="218" width="160" height="6" rx="3" fill="rgba(148,163,184,0.25)" />
        <rect x="390" y="234" width="140" height="6" rx="3" fill="rgba(148,163,184,0.18)" />
        <rect x="390" y="258" width="88" height="22" rx="11" fill="url(#tdah-accent)" opacity="0.9" />
      </g>

      <text
        x="44"
        y="78"
        fill="#94a3b8"
        fontFamily="Sora, Manrope, sans-serif"
        fontSize="12"
        letterSpacing="3.2"
      >
        CONTENTFY · CURSO
      </text>
      <text
        x="44"
        y="140"
        fill="#f8fafc"
        fontFamily="Sora, Manrope, sans-serif"
        fontSize="40"
        fontWeight="600"
      >
        Dominando
      </text>
      <text
        x="44"
        y="186"
        fill="#f8fafc"
        fontFamily="Sora, Manrope, sans-serif"
        fontSize="40"
        fontWeight="600"
      >
        o TDAH
      </text>
      <rect x="44" y="206" width="64" height="3" rx="2" fill="url(#tdah-accent)" />
      <text
        x="44"
        y="248"
        fill="#cbd5e1"
        fontFamily="Manrope, sans-serif"
        fontSize="15"
      >
        Foco, organização e produtividade
      </text>
      <text
        x="44"
        y="274"
        fill="#64748b"
        fontFamily="Manrope, sans-serif"
        fontSize="13"
      >
        com método prático
      </text>
    </svg>
  );
}
