"use client";

import { useEffect, useState } from "react";

interface TimerModuleProps {
  totalMinutes: number;
}

export default function TimerModule({ totalMinutes }: TimerModuleProps) {
  const totalSeconds = totalMinutes * 60;
  const [segundos, setSegundos] = useState(totalSeconds);
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (!activo || segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [activo, segundos]);

  const progreso = segundos / totalSeconds;
  const radio = 90;
  const circunferencia = 2 * Math.PI * radio;
  const tramo = circunferencia * progreso;

  const horas = Math.floor(segundos / 3600);
  const mins = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;
  const tiempoTexto = horas > 0
    ? `${horas}:${String(mins).padStart(2, "0")}:${String(segs).padStart(2, "0")}`
    : `${String(mins).padStart(2, "0")}:${String(segs).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative w-52 h-52 timer-ring rounded-full"
        onClick={() => setActivo((a) => !a)}
        style={{ cursor: "pointer" }}
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Pista de fondo */}
          <circle cx="100" cy="100" r={radio} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          {/* Arco de progreso */}
          <circle
            cx="100" cy="100" r={radio}
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeDasharray={`${tramo} ${circunferencia}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-3xl font-light tracking-widest text-white">{tiempoTexto}</span>
          <span className="text-[10px] text-white/30 uppercase tracking-widest">
            {activo ? "en foco" : "pausado"}
          </span>
        </div>
      </div>
      <p className="text-xs text-white/20">toca para {activo ? "pausar" : "reanudar"}</p>
    </div>
  );
}
