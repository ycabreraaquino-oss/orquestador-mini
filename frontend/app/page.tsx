"use client";

import { useState, useRef, KeyboardEvent } from "react";
import SecurityBadge from "@/components/SecurityBadge";
import TimerModule from "@/components/TimerModule";
import AudioModule from "@/components/AudioModule";
import MessagesModule from "@/components/MessagesModule";
import GraphPanel from "@/components/GraphPanel";

type Pantalla = "bienvenida" | "inicio" | "dinamica";

interface EstadoSesion {
  intencion: string;
  minutos: number;
  artista: string;
  resultado: string;
}

function extraerMinutos(texto: string): number {
  const horaMatch = texto.match(/(\d+)\s*hora/i);
  if (horaMatch) return parseInt(horaMatch[1]) * 60;
  const minMatch = texto.match(/(\d+)\s*min/i);
  if (minMatch) return parseInt(minMatch[1]);
  return 25;
}

// Extrae el artista o tema del texto libre
// Ej: "musicas de Rochy" → "Rochy"  |  "ver tik tok" → "TikTok"
function extraerArtista(texto: string): string {
  // Patrón: "músicas de X", "música de X", "canciones de X"
  const deMatch = texto.match(/m[uú]sicas?\s+de\s+(.+?)(?:\s+por\s+\d|\s*$)/i);
  if (deMatch) return deMatch[1].trim();

  // Patrón: "ver X", "escuchar X", "poner X"
  const verMatch = texto.match(/(?:ver|escuchar|poner|pon)\s+(.+?)(?:\s+por\s+\d|\s*$)/i);
  if (verMatch) return verMatch[1].trim();

  // Si no encuentra nada, usa las primeras palabras significativas
  const palabras = texto.replace(/quiero|por favor|pon|me|la|las|los|el/gi, "").trim();
  return palabras.split(/\s+/).slice(0, 3).join(" ");
}

export default function Home() {
  const [pantalla, setPantalla] = useState<Pantalla>("bienvenida");
  const [grafoPanelVisible, setGrafoPanelVisible] = useState(false);
  const [intencionTexto, setIntencionTexto] = useState("");
  const [sesion, setSesion] = useState<EstadoSesion | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function procesarIntencion() {
    if (!intencionTexto.trim()) return;
    setCargando(true);
    setError("");

    try {
      let resultado = "";
      try {
        const res = await fetch("http://localhost:8080/intencion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: "usuario_local", texto: `reproducir ${intencionTexto}` }),
          signal: AbortSignal.timeout(2000),
        });
        const data = await res.json();
        resultado = data.ok ? data.resultado : data.error;
      } catch {
        resultado = `[SIMULADO] Intención procesada: "${intencionTexto}"`;
      }

      const minutos = extraerMinutos(intencionTexto);
      const artista = extraerArtista(intencionTexto);
      setSesion({ intencion: intencionTexto, minutos, artista, resultado });
      setPantalla("dinamica");
    } catch {
      setError("No pude procesar esa intención. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  function manejarTecla(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      procesarIntencion();
    }
  }

  function reiniciar() {
    setPantalla("bienvenida");
    setSesion(null);
    setIntencionTexto("");
    setGrafoPanelVisible(false);
  }

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden select-none">

      {/* ── PANTALLA 0: BIENVENIDA ── */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
          pantalla === "bienvenida"
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-10 px-8 w-full max-w-xs">

          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-white tracking-tight">Orquestador</h1>
              <p className="text-[12px] text-white/30 mt-1">Una sola pantalla para todo</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3 w-full">
            <a
              href="/login"
              className="w-full py-3.5 rounded-2xl bg-white text-black text-sm font-semibold tracking-wide hover:bg-white/90 transition-all duration-200 text-center"
            >
              Iniciar sesión
            </a>
            <a
              href="/registro"
              className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium text-center hover:bg-white/10 hover:text-white/80 transition-all duration-200"
            >
              Crear cuenta gratis
            </a>
          </div>

          <p className="text-[10px] text-white/15 text-center">
            v0.1 · Todo se procesa en tu dispositivo
          </p>
        </div>
      </div>

      {/* ── PANTALLA 1: EL LIENZO EN BLANCO ── */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
          pantalla === "inicio"
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="w-full max-w-2xl px-6 flex flex-col gap-4">
          <p className="text-center text-xs text-white/15 uppercase tracking-[0.3em] mb-8">
            Orquestador de Intenciones · v0.1
          </p>

          <div className="relative glow-white rounded-2xl overflow-hidden border border-white/8">
            <textarea
              ref={inputRef}
              value={intencionTexto}
              onChange={(e) => setIntencionTexto(e.target.value)}
              onKeyDown={manejarTecla}
              rows={3}
              placeholder="¿Qué quieres resolver hoy? Describe tu intención..."
              className="w-full bg-transparent px-6 py-5 text-white placeholder-white/20 text-base resize-none outline-none font-light leading-relaxed"
              autoFocus
            />
            <div className="flex items-center justify-between px-6 py-3 border-t border-white/5">
              <span className="text-[11px] text-white/15">
                Ej: &quot;Estudiar 1 hora con Jazz, bloqueando WhatsApp&quot;
              </span>
              <button
                onClick={procesarIntencion}
                disabled={!intencionTexto.trim() || cargando}
                type="button"
              className="px-4 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 disabled:opacity-30 text-xs text-white/70 transition-all duration-200"
              >
                {cargando ? "procesando..." : "activar →"}
              </button>
            </div>
          </div>

          {error && <p className="text-center text-xs text-red-400/60">{error}</p>}

          <p className="text-center text-[10px] text-white/10 mt-4">
            Enter para activar · Shift+Enter para nueva línea
          </p>

          <div className="flex justify-center mt-2">
            <a
              href="/conectar"
              className="text-[11px] text-white/20 hover:text-white/50 transition-colors border border-white/8 px-4 py-2 rounded-xl hover:border-white/20"
            >
              ⚡ Conectar mis apps
            </a>
          </div>
        </div>
      </div>

      {/* ── PANTALLA 2: EL LIENZO DINÁMICO ── */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          pantalla === "dinamica"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full pointer-events-none"
        }`}
      >
        {/* Barra de intención compacta */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-4 z-10">
          <button
            onClick={reiniciar}
            type="button"
            className="text-white/20 hover:text-white/50 transition-colors text-xs"
          >
            ← nueva intención
          </button>
          <div className="flex-1 px-4 py-2 rounded-xl card-glass">
            <p className="text-xs text-white/40 truncate">{sesion?.intencion}</p>
          </div>
          <button
            onClick={() => setGrafoPanelVisible(true)}
            type="button"
            className="text-white/20 hover:text-white/50 transition-colors text-xs"
          >
            grafo →
          </button>
        </div>

        {sesion?.resultado && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10">
            <p className="text-[10px] text-green-400/50 console-text">{sesion.resultado}</p>
          </div>
        )}

        {/* Los tres módulos */}
        <div className="h-full flex items-center justify-center gap-8 px-8 pt-20">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] text-white/15 uppercase tracking-widest">audio</span>
            <AudioModule artista={sesion?.artista ?? "música"} />
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] text-white/15 uppercase tracking-widest">foco</span>
            <TimerModule totalMinutes={sesion?.minutos ?? 25} />
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] text-white/15 uppercase tracking-widest">mensajes</span>
            <MessagesModule />
          </div>
        </div>
      </div>

      {/* ── PANTALLA 3: PANEL DE GRAFO ── */}
      <GraphPanel visible={grafoPanelVisible} />
      {grafoPanelVisible && (
        <button
          type="button"
          onClick={() => setGrafoPanelVisible(false)}
          className="fixed top-6 right-6 z-50 text-white/30 hover:text-white/60 transition-colors text-sm"
        >
          ← volver
        </button>
      )}

      <SecurityBadge />
    </main>
  );
}
