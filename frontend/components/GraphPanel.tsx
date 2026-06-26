"use client";

import { useEffect, useState } from "react";

interface Nodo {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface Arista {
  desde: string;
  hasta: string;
}

const NODOS: Nodo[] = [
  { id: "intencion", label: "Intención: Estudiar", x: 300, y: 200, color: "#ffffff" },
  { id: "spotify",   label: "API_Spotify",          x: 160, y: 100, color: "#1db954" },
  { id: "cifrado",   label: "Cifrado_Local Ed25519", x: 440, y: 100, color: "#818cf8" },
  { id: "motor",     label: "Motor Go",              x: 300, y: 330, color: "#f59e0b" },
  { id: "whatsapp",  label: "WhatsApp_Filter",       x: 160, y: 330, color: "#25d366" },
];

const ARISTAS: Arista[] = [
  { desde: "intencion", hasta: "spotify" },
  { desde: "intencion", hasta: "cifrado" },
  { desde: "intencion", hasta: "motor" },
  { desde: "motor",     hasta: "whatsapp" },
  { desde: "cifrado",   hasta: "motor" },
];

const LOG_LINES = [
  "[OK] Conector Spotify Autoverificado (0 fallos)",
  "[OK] Firma Criptográfica Ed25519 Generada Localmente",
  "[OK] Datos en memoria interna (Servidor externo: 0 KB almacenados)",
  "[OK] Motor de Intención — latencia: 2ms",
  "[OK] Protocolo Cero Confianza — sesión local activa",
];

function posicion(nodos: Nodo[], id: string) {
  return nodos.find((n) => n.id === id) ?? { x: 0, y: 0 };
}

export default function GraphPanel({ visible }: { visible: boolean }) {
  const [logIdx, setLogIdx] = useState(0);
  const [pulsando, setPulsando] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setLogIdx((i) => (i + 1) % LOG_LINES.length), 2000);
    return () => clearInterval(t);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const nodoIds = NODOS.map((n) => n.id);
    const tick = () => {
      const aleatorio = nodoIds[Math.floor(Math.random() * nodoIds.length)];
      setPulsando(aleatorio);
      setTimeout(() => setPulsando(null), 600);
    };
    const t = setInterval(tick, 1200);
    return () => clearInterval(t);
  }, [visible]);

  return (
    <div
      className={`fixed inset-0 bg-black/95 backdrop-blur-sm z-40 transition-transform duration-500 ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col p-8 gap-6">
        <div>
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
            Mapa del Grafo Vivo
          </h2>
          <p className="text-xs text-white/20 mt-1">Arquitectura de intenciones en tiempo real</p>
        </div>

        {/* Grafo SVG */}
        <div className="flex-1 card-glass rounded-2xl overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 600 450">
            {/* Aristas */}
            {ARISTAS.map((a) => {
              const desde = posicion(NODOS, a.desde);
              const hasta = posicion(NODOS, a.hasta);
              return (
                <line
                  key={`${a.desde}-${a.hasta}`}
                  x1={desde.x} y1={desde.y}
                  x2={hasta.x} y2={hasta.y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Nodos */}
            {NODOS.map((nodo) => {
              const activo = pulsando === nodo.id;
              return (
                <g key={nodo.id}>
                  {activo && (
                    <circle cx={nodo.x} cy={nodo.y} r="20" fill={nodo.color} opacity="0.15" />
                  )}
                  <circle
                    cx={nodo.x} cy={nodo.y} r="8"
                    fill={activo ? nodo.color : "rgba(255,255,255,0.1)"}
                    stroke={nodo.color}
                    strokeWidth={activo ? "2" : "1"}
                    style={{ transition: "all 0.3s ease" }}
                  />
                  <text
                    x={nodo.x} y={nodo.y + 22}
                    textAnchor="middle"
                    fontSize="10"
                    fill="rgba(255,255,255,0.4)"
                  >
                    {nodo.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Consola */}
        <div className="card-glass rounded-xl p-4 h-28 overflow-hidden">
          <div className="console-text">
            {LOG_LINES.map((linea, i) => (
              <div
                key={i}
                className={`transition-opacity duration-500 ${i === logIdx ? "opacity-100" : "opacity-30"}`}
              >
                {linea}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
