"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaWhatsapp, FaSpotify, FaInstagram, FaTiktok, FaUber, FaGoogle } from "react-icons/fa";
import { SiUbereats, SiIndrive } from "react-icons/si";
import { MdDeliveryDining } from "react-icons/md";

interface App {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  icono: React.ReactNode;
  disponible: boolean;
  url?: string;
}

function AppCard({ app, conectada, onToggle }: {
  app: App;
  conectada: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300 ${
      conectada
        ? "border-white/20 bg-white/5"
        : app.disponible
        ? "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/5"
        : "border-white/5 bg-white/[0.01] opacity-40"
    }`}>

      {/* Logo + nombre */}
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${app.color}20`, border: `1px solid ${app.color}40` }}
        >
          <span style={{ color: app.color, fontSize: 22 }}>{app.icono}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{app.nombre}</p>
          <p className="text-[11px] text-white/35 leading-snug">{app.descripcion}</p>
        </div>
      </div>

      {/* Botón */}
      {app.disponible ? (
        <button
          type="button"
          onClick={onToggle}
          className={`w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
            conectada
              ? "bg-white/5 text-white/30 hover:bg-red-500/15 hover:text-red-400 border border-white/8"
              : "text-white border"
          }`}
          style={!conectada ? {
            backgroundColor: `${app.color}25`,
            borderColor: `${app.color}50`,
            color: app.color,
          } : {}}
        >
          {conectada ? "✓ Conectado — toca para desconectar" : `Conectar ${app.nombre}`}
        </button>
      ) : (
        <div className="w-full py-2.5 rounded-xl text-[11px] text-center text-white/20 border border-white/5">
          Próximamente
        </div>
      )}

      {conectada && (
        <div className="flex items-center gap-2 -mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-green" />
          <span className="text-[10px] text-green-400/60">Activo y sincronizado</span>
        </div>
      )}
    </div>
  );
}

export default function ConectarPage() {
  const [conectadas, setConectadas] = useState<Record<string, boolean>>({});

  const APPS: App[] = [
    {
      id: "whatsapp",
      nombre: "WhatsApp",
      descripcion: "Envía mensajes a contactos y grupos",
      color: "#25D366",
      icono: <FaWhatsapp />,
      disponible: true,
      url: "/whatsapp",
    },
    {
      id: "gmail",
      nombre: "Gmail",
      descripcion: "Lee, clasifica y responde correos",
      color: "#EA4335",
      icono: <FaGoogle />,
      disponible: true,
      url: "/api/auth/google",
    },
    {
      id: "spotify",
      nombre: "Spotify",
      descripcion: "Reproduce música por artista o estado de ánimo",
      color: "#1DB954",
      icono: <FaSpotify />,
      disponible: true,
    },
    {
      id: "instagram",
      nombre: "Instagram",
      descripcion: "Gestiona mensajes y publica contenido",
      color: "#E1306C",
      icono: <FaInstagram />,
      disponible: false,
    },
    {
      id: "tiktok",
      nombre: "TikTok",
      descripcion: "Controla tu feed y contenido",
      color: "#ff0050",
      icono: <FaTiktok />,
      disponible: false,
    },
    {
      id: "uber",
      nombre: "Uber",
      descripcion: "Pide viajes con una frase",
      color: "#000000",
      icono: <FaUber />,
      disponible: false,
    },
    {
      id: "ubereats",
      nombre: "Uber Eats",
      descripcion: "Pide comida describiendo qué quieres comer",
      color: "#06C167",
      icono: <SiUbereats />,
      disponible: false,
    },
    {
      id: "indriver",
      nombre: "InDriver",
      descripcion: "Solicita viajes negociando el precio",
      color: "#2EB85C",
      icono: <SiIndrive />,
      disponible: false,
    },
    {
      id: "pedidosya",
      nombre: "Pedidos Ya",
      descripcion: "Pide a tus restaurantes favoritos",
      color: "#FF441F",
      icono: <MdDeliveryDining />,
      disponible: false,
    },
  ];

  useEffect(() => {
    const guardadas = localStorage.getItem("apps_conectadas");
    if (guardadas) setConectadas(JSON.parse(guardadas));
  }, []);

  function toggleConexion(app: App) {
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

  return (
    <main className="min-h-screen bg-black px-5 py-8 flex flex-col gap-7">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/" className="text-white/20 hover:text-white/50 transition-colors text-xs">← volver</Link>
        <div className="flex-1 text-center">
          <h1 className="text-base font-semibold text-white">Conecta tus apps</h1>
          <p className="text-[11px] text-white/30 mt-0.5">Una sola vez — activo para siempre</p>
        </div>
        <div className="w-12" />
      </div>

      {/* Progreso */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-[11px] text-white/30">{totalConectadas} de {totalDisponibles} disponibles conectadas</span>
          {totalConectadas === totalDisponibles && totalDisponibles > 0 && (
            <span className="text-[11px] text-green-400">✓ Todo listo</span>
          )}
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${totalDisponibles > 0 ? (totalConectadas / totalDisponibles) * 100 : 0}%`,
              background: "linear-gradient(90deg, #25D366, #1DB954)",
            }}
          />
        </div>
      </div>

      {/* Grid de apps */}
      <div className="flex flex-col gap-3">
        {APPS.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            conectada={!!conectadas[app.id]}
            onToggle={() => toggleConexion(app)}
          />
        ))}
      </div>

      {/* Badge de seguridad */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 flex gap-3 items-start">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" className="shrink-0 mt-0.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-white/60">Conexión 100% segura</p>
          <p className="text-[11px] text-white/30 leading-relaxed">
            Usamos <strong className="text-white/50">OAuth</strong> — el mismo estándar que usa Google, Apple y Microsoft.
            Nunca vemos ni guardamos tus contraseñas. Puedes desconectar cualquier app en cualquier momento.
          </p>
        </div>
      </div>

    </main>
  );
}
