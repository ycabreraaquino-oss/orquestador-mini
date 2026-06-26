"use client";

export default function SecurityBadge() {
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2 z-50">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full card-glass">
        {/* Candado */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {/* Pulso verde */}
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-green glow-green" />
        <span className="text-[10px] text-white/40 whitespace-nowrap">
          Protocolo Cero Confianza Activo&nbsp;•&nbsp;Llaves Locales Protegidas
        </span>
      </div>
    </div>
  );
}
