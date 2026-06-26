"use client";

import { useState, useEffect } from "react";

interface AudioModuleProps {
  artista: string;
}

export default function AudioModule({ artista }: AudioModuleProps) {
  const [reproduciendo, setReproduciendo] = useState(false);
  const [abierto, setAbierto] = useState(false);

  function abrirYouTube() {
    const query = encodeURIComponent(`${artista} música`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
    setReproduciendo(true);
    setAbierto(true);
  }

  return (
    <div className="card-glass rounded-2xl p-5 w-48 flex flex-col gap-4">
      {/* Portada */}
      <div className="w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-red-900/30 to-black">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(255,255,255,0.25)">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/>
        </svg>
        <span className="text-[10px] text-white/30 text-center px-2 leading-tight">
          {abierto ? "abierto en YouTube" : "toca para abrir"}
        </span>
      </div>

      {/* Info del artista */}
      <div>
        <p className="text-sm font-medium text-white truncate">{artista}</p>
        <p className="text-[11px] text-white/40">YouTube Music</p>
      </div>

      {/* Botón principal */}
      <button
        type="button"
        onClick={abrirYouTube}
        className="w-full py-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 border border-red-600/20 transition-all text-xs text-white/70 flex items-center justify-center gap-2"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
        {abierto ? "volver a abrir" : "escuchar ahora"}
      </button>

      {/* Indicador */}
      <div className="flex items-center gap-1.5">
        {reproduciendo && (
          <>
            {[10, 16, 8, 14].map((altura, i) => (
              <div
                key={i}
                className="w-0.5 bg-green-400 rounded-full"
                style={{
                  height: `${altura}px`,
                  animation: `pulse-green ${0.5 + i * 0.15}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </>
        )}
        <span className="text-[10px] text-white/20 ml-auto">
          {reproduciendo ? "reproduciendo" : "listo"}
        </span>
      </div>
    </div>
  );
}
