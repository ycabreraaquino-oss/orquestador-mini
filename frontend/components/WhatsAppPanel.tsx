"use client";

import { useState, useEffect } from "react";

interface Resultado {
  nombre: string;
  tipo: string;
  ok: boolean;
  error?: string;
}

interface HistorialItem {
  texto: string;
  mensaje: string;
  resultados: Resultado[];
  hora: string;
}

export default function WhatsAppPanel() {
  const [estado, setEstado] = useState<"desconectado" | "iniciando" | "esperando_codigo" | "conectado" | "error">("desconectado");
  const [codigo, setCodigo] = useState<string | null>(null);
  const [numero, setNumero] = useState("");
  const [registrando, setRegistrando] = useState(false);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const verificar = async () => {
      try {
        const res = await fetch("http://localhost:3001/estado");
        const data = await res.json();
        setEstado(data.estado);
        setCodigo(data.codigo ?? null);
      } catch {
        setEstado("desconectado");
      }
    };
    verificar();
    const t = setInterval(verificar, 3000);
    return () => clearInterval(t);
  }, []);

  async function registrar() {
    if (!numero.trim()) return;
    setRegistrando(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero: numero.replace(/\D/g, "") }),
      });
      const data = await res.json();
      if (!data.ok) setError(data.error);
    } catch {
      setError("No se pudo conectar al servicio. ¿Está corriendo en puerto 3001?");
    } finally {
      setRegistrando(false);
    }
  }

  async function enviar() {
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      const data = await res.json();
      if (data.ok || data.resultados) {
        setHistorial((h) => [{
          texto,
          mensaje: data.mensaje,
          resultados: data.resultados ?? [],
          hora: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
        }, ...h]);
        setTexto("");
      } else {
        setError(data.error ?? "Error desconocido");
      }
    } catch {
      setError("No se pudo conectar al servicio WhatsApp.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-5">

      {/* ── ESTADO: DESCONECTADO ── */}
      {(estado === "desconectado" || estado === "error") && (
        <div className="card-glass rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium text-white/70">Conecta tu WhatsApp</h2>
            <p className="text-[11px] text-white/30">Ingresa tu número y recibirás un código de 8 dígitos</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/30 uppercase tracking-widest">Número de teléfono</label>
              <input
                type="tel"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="+1 (809) 000-0000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-green-500/40 transition-colors"
                onKeyDown={(e) => e.key === "Enter" && registrar()}
              />
              <p className="text-[9px] text-white/20">Incluye el código de país. Ej: 1 para RD/USA, 34 para España</p>
            </div>

            <button
              type="button"
              onClick={registrar}
              disabled={!numero.trim() || registrando}
              className="w-full py-3 rounded-xl bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 text-sm font-medium disabled:opacity-30 transition-all"
            >
              {registrando ? "Iniciando..." : "Enviar código →"}
            </button>
          </div>

          {error && <p className="text-xs text-red-400/60 text-center">{error}</p>}
        </div>
      )}

      {/* ── ESTADO: INICIANDO ── */}
      {estado === "iniciando" && (
        <div className="card-glass rounded-2xl p-6 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          <p className="text-sm text-white/50">Iniciando conexión...</p>
          <p className="text-[11px] text-white/25 text-center">Esto tarda unos segundos. El código llegará pronto.</p>
        </div>
      )}

      {/* ── ESTADO: ESPERANDO CÓDIGO ── */}
      {estado === "esperando_codigo" && codigo && (
        <div className="card-glass rounded-2xl p-6 flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[11px] text-white/30 uppercase tracking-widest">Tu código de vinculación</p>
            <div className="flex gap-2">
              {codigo.split("").map((char, i) => (
                <div key={i} className="w-10 h-12 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{char}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass rounded-xl p-4 flex flex-col gap-2 w-full">
            <p className="text-xs text-white/60 font-medium">Cómo ingresarlo en WhatsApp:</p>
            <ol className="flex flex-col gap-1">
              {[
                "Abre WhatsApp en tu teléfono",
                "Toca los 3 puntos (⋮) → Dispositivos vinculados",
                "Toca \"Vincular un dispositivo\"",
                "Toca \"Vincular con número de teléfono\"",
                "Ingresa el código de arriba",
              ].map((paso, i) => (
                <li key={i} className="text-[11px] text-white/35 flex gap-2">
                  <span className="text-green-400/60 shrink-0">{i + 1}.</span>
                  {paso}
                </li>
              ))}
            </ol>
          </div>

          <p className="text-[10px] text-white/20 text-center">El código expira en 60 segundos. Si expira, recarga la página.</p>
        </div>
      )}

      {/* ── ESTADO: CONECTADO ── */}
      {estado === "conectado" && (
        <>
          <div className="card-glass rounded-2xl p-4 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 pulse-green" />
            <div>
              <p className="text-sm text-white/80 font-medium">WhatsApp conectado</p>
              <p className="text-[10px] text-white/30">Listo para enviar mensajes</p>
            </div>
          </div>

          <div className="card-glass rounded-2xl overflow-hidden">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }}
              rows={3}
              placeholder={`Ej: "Envía a Ana y Pedro que hoy no podré ir"`}
              className="w-full bg-transparent px-5 py-4 text-white placeholder-white/20 text-sm resize-none outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
              <span className="text-[10px] text-white/15">Enter para enviar</span>
              <button
                type="button"
                onClick={enviar}
                disabled={!texto.trim() || enviando}
                className="px-4 py-1.5 rounded-xl bg-green-600/20 hover:bg-green-600/40 border border-green-600/20 disabled:opacity-30 text-xs text-green-400 transition-all"
              >
                {enviando ? "enviando..." : "enviar →"}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-400/60 text-center">{error}</p>}

          {historial.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-white/20 uppercase tracking-widest">Enviados</p>
              {historial.map((item, i) => (
                <div key={i} className="card-glass rounded-xl p-4 flex flex-col gap-2">
                  <p className="text-xs text-white/50 italic">"{item.texto}"</p>
                  <p className="text-xs text-white/80">📩 {item.mensaje}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.resultados.map((r, j) => (
                      <span key={j} className={`text-[10px] px-2 py-0.5 rounded-full border ${r.ok ? "border-green-600/30 text-green-400/70" : "border-red-600/30 text-red-400/70"}`}>
                        {r.ok ? "✓" : "✗"} {r.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
