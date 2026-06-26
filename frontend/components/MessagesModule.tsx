"use client";

import { useState, useEffect } from "react";

interface Mensaje {
  id: number;
  remitente: string;
  texto: string;
  urgente: boolean;
  hora: string;
}

const MENSAJES_SIMULADOS: Mensaje[] = [
  { id: 1, remitente: "Mamá", texto: "¿Vas a cenar en casa?", urgente: false, hora: "14:32" },
  { id: 2, remitente: "Jefe", texto: "🚨 URGENTE: cliente llama en 10 min", urgente: true, hora: "14:41" },
  { id: 3, remitente: "Grupo Amigos", texto: "jajaja mira este meme", urgente: false, hora: "14:45" },
];

export default function MessagesModule() {
  const [mensajeUrgente, setMensajeUrgente] = useState<Mensaje | null>(null);
  const [parpadeo, setParpadeo] = useState(false);

  useEffect(() => {
    // Simula llegada de mensaje urgente a los 5 segundos
    const t = setTimeout(() => {
      const urgente = MENSAJES_SIMULADOS.find((m) => m.urgente) ?? null;
      setMensajeUrgente(urgente);
      setParpadeo(true);
      setTimeout(() => setParpadeo(false), 3000);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  const noUrgentes = MENSAJES_SIMULADOS.filter((m) => !m.urgente).length;

  return (
    <div
      className={`card-glass rounded-2xl p-4 w-44 flex flex-col gap-3 transition-all duration-500 ${
        parpadeo ? "border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.15)]" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span className="text-[11px] text-white/50 font-medium">Mensajes de Emergencia</span>
      </div>

      {mensajeUrgente ? (
        <div className={`rounded-xl p-3 transition-all duration-300 ${parpadeo ? "bg-amber-400/10" : "bg-white/5"}`}>
          <div className="flex items-center gap-1.5 mb-1">
            {parpadeo && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-green" />}
            <span className="text-[10px] text-amber-300 font-medium">{mensajeUrgente.remitente}</span>
            <span className="text-[9px] text-white/20 ml-auto">{mensajeUrgente.hora}</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">{mensajeUrgente.texto}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4 gap-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="text-[10px] text-white/20">Sin urgencias</span>
        </div>
      )}

      <div className="border-t border-white/5 pt-2">
        <span className="text-[9px] text-white/20">
          {noUrgentes} {noUrgentes === 1 ? "mensaje" : "mensajes"} filtrado{noUrgentes !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
