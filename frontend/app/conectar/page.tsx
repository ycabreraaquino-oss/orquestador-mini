"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import { FaWhatsapp, FaSpotify, FaInstagram, FaTiktok, FaUber, FaGoogle } from "react-icons/fa";
import { SiUbereats } from "react-icons/si";
import { MdDeliveryDining, MdDirectionsCar } from "react-icons/md";
import { parsearIntencion, type AccionNexus, type ServicioId } from "@/lib/nexus-engine";

// ── Iconos por servicio ────────────────────────────────────────────
const ICONOS: Record<ServicioId, React.ReactNode> = {
  whatsapp: <FaWhatsapp />,
  spotify: <FaSpotify />,
  gmail: <FaGoogle />,
  uber: <FaUber />,
  indrive: <MdDirectionsCar />,
  pedidosya: <MdDeliveryDining />,
};

// ── Definición de apps ─────────────────────────────────────────────
interface AppInfo {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  icono: React.ReactNode;
  disponible: boolean;
  url?: string;
}

const APPS: AppInfo[] = [
  { id: "whatsapp", nombre: "WhatsApp", descripcion: "Envía mensajes a contactos y grupos", color: "#25D366", icono: <FaWhatsapp />, disponible: true },
  { id: "gmail", nombre: "Gmail", descripcion: "Lee, clasifica y responde correos", color: "#EA4335", icono: <FaGoogle />, disponible: true, url: "/api/auth/google" },
  { id: "spotify", nombre: "Spotify", descripcion: "Reproduce música por artista o estado de ánimo", color: "#1DB954", icono: <FaSpotify />, disponible: true },
  { id: "instagram", nombre: "Instagram", descripcion: "Gestiona mensajes y contenido", color: "#E1306C", icono: <FaInstagram />, disponible: false },
  { id: "tiktok", nombre: "TikTok", descripcion: "Controla tu feed y contenido", color: "#ff0050", icono: <FaTiktok />, disponible: false },
  { id: "uber", nombre: "Uber", descripcion: "Pide viajes con una frase", color: "#FFFFFF", icono: <FaUber />, disponible: false },
  { id: "ubereats", nombre: "Uber Eats", descripcion: "Pide comida describiendo qué quieres comer", color: "#06C167", icono: <SiUbereats />, disponible: false },
  { id: "indrive", nombre: "InDriver", descripcion: "Solicita viajes negociando el precio", color: "#2EB85C", icono: <MdDirectionsCar />, disponible: false },
  { id: "pedidosya", nombre: "Pedidos Ya", descripcion: "Pide a tus restaurantes favoritos", color: "#FF441F", icono: <MdDeliveryDining />, disponible: false },
];

// ── Tarjeta de acción del plan ─────────────────────────────────────
function TarjetaAccion({ accion, onEjecutar }: { accion: AccionNexus; onEjecutar: () => void }) {
  const [ejecutada, setEjecutada] = useState(false);

  function ejecutar() {
    setEjecutada(true);
    onEjecutar();
  }

  return (
    <div
      className="rounded-2xl border p-4 flex items-start gap-4 transition-all duration-300"
      style={{
        borderColor: ejecutada ? `${accion.color}50` : "rgba(255,255,255,0.08)",
        backgroundColor: ejecutada ? `${accion.color}10` : "rgba(255,255,255,0.02)",
      }}
    >
      {/* Ícono del servicio */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${accion.color}20`, border: `1px solid ${accion.color}40` }}
      >
        <span style={{ color: accion.color, fontSize: 18 }}>
          {ICONOS[accion.servicio] ?? "⚡"}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: accion.color }}>
          {accion.servicio}
        </p>
        <p className="text-sm font-medium text-white">{accion.titulo}</p>
        <p className="text-[12px] text-white/40 mt-0.5 leading-snug">{accion.detalle}</p>
      </div>

      {/* Botón ejecutar / estado */}
      <div className="shrink-0">
        {ejecutada ? (
          <span className="text-xs font-medium" style={{ color: accion.color }}>✓ Enviado</span>
        ) : accion.disponible ? (
          <button
            type="button"
            onClick={ejecutar}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: `${accion.color}20`,
              border: `1px solid ${accion.color}50`,
              color: accion.color,
            }}
          >
            ▶
          </button>
        ) : (
          <Link
            href="?tab=apps"
            className="px-3 py-1.5 rounded-lg text-[10px] text-white/30 border border-white/8 hover:border-white/20 transition-colors"
          >
            Conectar
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Tarjeta de app ─────────────────────────────────────────────────
function TarjetaApp({ app, conectada, onToggle }: { app: AppInfo; conectada: boolean; onToggle: () => void }) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 ${
        conectada
          ? "border-white/15 bg-white/5"
          : app.disponible
          ? "border-white/8 bg-white/[0.02] hover:border-white/15"
          : "border-white/5 bg-white/[0.01] opacity-40"
      }`}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${app.color}20`, border: `1px solid ${app.color}40` }}
      >
        <span style={{ color: app.color, fontSize: 20 }}>{app.icono}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{app.nombre}</p>
        <p className="text-[11px] text-white/30 leading-snug">{app.descripcion}</p>
      </div>

      {app.disponible ? (
        <button
          type="button"
          onClick={onToggle}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            conectada
              ? "bg-white/5 text-white/30 border border-white/8 hover:bg-red-500/15 hover:text-red-400"
              : "border"
          }`}
          style={!conectada ? { backgroundColor: `${app.color}20`, borderColor: `${app.color}50`, color: app.color } : {}}
        >
          {conectada ? "✓" : "Conectar"}
        </button>
      ) : (
        <span className="shrink-0 text-[10px] text-white/20 border border-white/5 px-3 py-1.5 rounded-xl">Pronto</span>
      )}
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────
export default function NexusPage() {
  const [tab, setTab] = useState<"nexus" | "apps">("nexus");
  const [input, setInput] = useState("");
  const [plan, setPlan] = useState<ReturnType<typeof parsearIntencion> | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [conectadas, setConectadas] = useState<Record<string, boolean>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const guardadas = localStorage.getItem("apps_conectadas");
    if (guardadas) setConectadas(JSON.parse(guardadas));
  }, []);

  // Cambio de tab via URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "apps") setTab("apps");
  }, []);

  function activar() {
    if (!input.trim()) return;
    setProcesando(true);
    // Pequeño delay para efecto visual
    setTimeout(() => {
      const appsIds = Object.keys(conectadas);
      const resultado = parsearIntencion(input, appsIds);
      setPlan(resultado);
      setProcesando(false);
    }, 400);
  }

  function manejarTecla(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      activar();
    }
  }

  function ejecutarTodo() {
    // Ejecutar todas las acciones disponibles — por ahora simulación
    // Cuando los servicios estén conectados, aquí se llamarán sus APIs
  }

  function toggleApp(app: AppInfo) {
    if (conectadas[app.id]) {
      const nuevas = { ...conectadas };
      delete nuevas[app.id];
      setConectadas(nuevas);
      localStorage.setItem("apps_conectadas", JSON.stringify(nuevas));
    } else if (app.url?.startsWith("/")) {
      window.location.href = app.url;
    } else {
      const nuevas = { ...conectadas, [app.id]: true };
      setConectadas(nuevas);
      localStorage.setItem("apps_conectadas", JSON.stringify(nuevas));
    }
  }

  const totalConectadas = Object.keys(conectadas).length;
  const totalDisponibles = APPS.filter((a) => a.disponible).length;
  const accionesEjecutables = plan?.acciones.filter((a) => a.disponible).length ?? 0;

  return (
    <main className="min-h-screen bg-black flex flex-col">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-8 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-white/80 tracking-tight">Nexus</span>
        </div>
        <Link href="/" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">salir</Link>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mx-5 mb-6 p-1 rounded-2xl bg-white/[0.03] border border-white/8">
        <button
          type="button"
          onClick={() => setTab("nexus")}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
            tab === "nexus" ? "bg-white text-black" : "text-white/35 hover:text-white/60"
          }`}
        >
          ⚡ Algoritmo
        </button>
        <button
          type="button"
          onClick={() => setTab("apps")}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
            tab === "apps" ? "bg-white text-black" : "text-white/35 hover:text-white/60"
          }`}
        >
          Mis apps {totalConectadas > 0 && <span className="ml-1 text-[10px] opacity-60">({totalConectadas})</span>}
        </button>
      </div>

      {/* ── TAB: NEXUS ── */}
      {tab === "nexus" && (
        <div className="flex flex-col gap-6 px-5 pb-10">

          {/* Input de intención */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] text-white/30 uppercase tracking-widest">¿Qué quieres hacer?</p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden focus-within:border-white/25 transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={manejarTecla}
                rows={3}
                placeholder={'Dile a Juan que llegamos tarde y ponme música de Karol G'}
                className="w-full bg-transparent px-5 pt-4 pb-2 text-white placeholder-white/15 text-sm resize-none outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                <span className="text-[10px] text-white/15">Enter para activar</span>
                <button
                  type="button"
                  onClick={activar}
                  disabled={!input.trim() || procesando}
                  className="px-4 py-1.5 rounded-xl bg-white text-black text-xs font-bold disabled:opacity-25 hover:bg-white/90 transition-all"
                >
                  {procesando ? "..." : "Activar →"}
                </button>
              </div>
            </div>
          </div>

          {/* Plan de Nexus */}
          {plan && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-white/30 uppercase tracking-widest">El algoritmo ejecutará</p>
                {plan.acciones.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setPlan(null); setInput(""); }}
                    className="text-[10px] text-white/20 hover:text-white/50 transition-colors"
                  >
                    limpiar
                  </button>
                )}
              </div>

              {plan.acciones.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-center">
                  <p className="text-sm text-white/40">{plan.mensaje}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {plan.acciones.map((accion, i) => (
                    <TarjetaAccion key={i} accion={accion} onEjecutar={ejecutarTodo} />
                  ))}

                  {/* Mensaje de estado */}
                  <p className="text-[11px] text-center text-white/25 mt-1">{plan.mensaje}</p>

                  {/* Botón ejecutar todo */}
                  {accionesEjecutables > 0 && (
                    <button
                      type="button"
                      onClick={ejecutarTodo}
                      className="w-full py-3.5 rounded-2xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-all mt-1"
                    >
                      Ejecutar todo →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Estado vacío con ejemplos */}
          {!plan && (
            <div className="flex flex-col gap-3 mt-2">
              <p className="text-[10px] text-white/20 uppercase tracking-widest text-center">Ejemplos</p>
              {[
                "Dile a mamá que ya llegué a casa",
                "Ponme música de Bad Bunny",
                "Dile a Pedro que la reunión cambió y ponme jazz",
                "Pide un taxi al centro",
              ].map((ejemplo) => (
                <button
                  key={ejemplo}
                  type="button"
                  onClick={() => setInput(ejemplo)}
                  className="text-left px-4 py-3 rounded-xl border border-white/6 bg-white/[0.02] text-[12px] text-white/35 hover:text-white/60 hover:border-white/15 hover:bg-white/5 transition-all"
                >
                  &ldquo;{ejemplo}&rdquo;
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: MIS APPS ── */}
      {tab === "apps" && (
        <div className="flex flex-col gap-5 px-5 pb-10">

          {/* Progreso */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[11px] text-white/30">{totalConectadas} de {totalDisponibles} disponibles</span>
              {totalConectadas === totalDisponibles && totalDisponibles > 0 && (
                <span className="text-[11px] text-green-400">✓ Todo listo</span>
              )}
            </div>
            <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${totalDisponibles > 0 ? (totalConectadas / totalDisponibles) * 100 : 0}%`,
                  background: "linear-gradient(90deg, #25D366, #1DB954)",
                }}
              />
            </div>
          </div>

          {/* Lista de apps */}
          <div className="flex flex-col gap-2">
            {APPS.map((app) => (
              <TarjetaApp
                key={app.id}
                app={app}
                conectada={!!conectadas[app.id]}
                onToggle={() => toggleApp(app)}
              />
            ))}
          </div>

          {/* Badge de seguridad */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 flex gap-3 items-start">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" className="shrink-0 mt-0.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <p className="text-[11px] text-white/30 leading-relaxed">
              Usamos <strong className="text-white/50">OAuth</strong> — nunca vemos ni guardamos tus contraseñas.
              Puedes desconectar cualquier app en cualquier momento.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
