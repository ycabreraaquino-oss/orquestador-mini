"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface App {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  icono: string;
  disponible: boolean;
  oauthUrl?: string;
}

const APPS: App[] = [
  {
    id: "gmail",
    nombre: "Gmail",
    descripcion: "Leer, clasificar y responder correos automáticamente",
    color: "#EA4335",
    icono: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    disponible: true,
    oauthUrl: "/api/auth/google",
  },
  {
    id: "whatsapp",
    nombre: "WhatsApp",
    descripcion: "Enviar mensajes a contactos y grupos con lenguaje natural",
    color: "#25D366",
    icono: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
    disponible: true,
    oauthUrl: "/whatsapp",
  },
  {
    id: "spotify",
    nombre: "Spotify",
    descripcion: "Reproducir música por nombre de artista o estado de ánimo",
    color: "#1DB954",
    icono: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.65c-.2.2-.51.2-.71 0C14.15 14.9 11 14 7.5 14c-.28 0-.5-.22-.5-.5s.22-.5.5-.5c3.75 0 7.15 1 9.15 2.85.2.19.2.51 0 .8zm1.25-2.7c-.24.24-.62.24-.86 0C14.6 12.1 10.9 11 7 11c-.28 0-.5-.22-.5-.5s.22-.5.5-.5c4.2 0 8.2 1.2 11.2 3.2.24.24.24.62 0 .85zm.11-2.8c-.28.28-.74.28-1.02 0C14.3 9.3 9.9 8 7 8c-.28 0-.5-.22-.5-.5S6.72 7 7 7c3.2 0 7.9 1.4 10.3 3.45.28.27.28.72 0 1z",
    disponible: true,
    oauthUrl: "/api/auth/spotify",
  },
  {
    id: "instagram",
    nombre: "Instagram",
    descripcion: "Publicar contenido y gestionar mensajes directos",
    color: "#E1306C",
    icono: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    disponible: false,
  },
  {
    id: "tiktok",
    nombre: "TikTok",
    descripcion: "Controlar reproducción y gestionar contenido",
    color: "#010101",
    icono: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z",
    disponible: false,
  },
  {
    id: "uber",
    nombre: "Uber",
    descripcion: "Pedir viajes con una sola frase",
    color: "#000000",
    icono: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z",
    disponible: false,
  },
  {
    id: "pedidosya",
    nombre: "Pedidos Ya",
    descripcion: "Pedir comida describiendo lo que quieres comer",
    color: "#FF441F",
    icono: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
    disponible: false,
  },
  {
    id: "indriver",
    nombre: "InDriver",
    descripcion: "Solicitar viajes negociando el precio",
    color: "#3DDC84",
    icono: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
    disponible: false,
  },
];

export default function ConectarPage() {
  const [conectadas, setConectadas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const guardadas = localStorage.getItem("apps_conectadas");
    if (guardadas) setConectadas(JSON.parse(guardadas));
  }, []);

  function toggleConexion(appId: string, oauthUrl?: string) {
    if (conectadas[appId]) {
      const nuevas = { ...conectadas };
      delete nuevas[appId];
      setConectadas(nuevas);
      localStorage.setItem("apps_conectadas", JSON.stringify(nuevas));
    } else if (oauthUrl) {
      if (oauthUrl.startsWith("/")) {
        window.location.href = oauthUrl;
      } else {
        const nuevas = { ...conectadas, [appId]: true };
        setConectadas(nuevas);
        localStorage.setItem("apps_conectadas", JSON.stringify(nuevas));
      }
    }
  }

  const totalConectadas = Object.keys(conectadas).length;

  return (
    <main className="min-h-screen bg-black px-6 py-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="text-white/20 hover:text-white/50 transition-colors text-xs">
          ← volver
        </Link>
        <div className="text-center">
          <h1 className="text-sm font-medium text-white/70">Conecta tus apps</h1>
          <p className="text-[11px] text-white/25">
            {totalConectadas === 0
              ? "Ninguna app conectada todavía"
              : `${totalConectadas} app${totalConectadas > 1 ? "s" : ""} conectada${totalConectadas > 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="w-16" />
      </div>

      {/* Barra de progreso */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/30 rounded-full transition-all duration-500"
            style={{ width: `${(totalConectadas / APPS.filter(a => a.disponible).length) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid de apps */}
      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {APPS.map((app) => {
          const estaConectada = !!conectadas[app.id];
          return (
            <div
              key={app.id}
              className={`card-glass rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 ${
                !app.disponible ? "opacity-40" : "hover:border-white/15"
              } ${estaConectada ? "border-white/20" : ""}`}
            >
              {/* Icono */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${app.color}22`, border: `1px solid ${app.color}33` }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill={app.color}>
                  <path d={app.icono} />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-medium text-white/80">{app.nombre}</p>
                <p className="text-[10px] text-white/30 leading-relaxed mt-0.5">{app.descripcion}</p>
              </div>

              {/* Botón */}
              {app.disponible ? (
                <button
                  type="button"
                  onClick={() => toggleConexion(app.id, app.oauthUrl)}
                  className={`w-full py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    estaConectada
                      ? "bg-white/8 text-white/40 hover:bg-red-600/20 hover:text-red-400"
                      : "text-white/70 hover:text-white"
                  }`}
                  style={!estaConectada ? {
                    background: `${app.color}22`,
                    border: `1px solid ${app.color}33`,
                    color: app.color,
                  } : {}}
                >
                  {estaConectada ? "desconectar" : "vincular"}
                </button>
              ) : (
                <div className="w-full py-1.5 rounded-xl text-[10px] text-center text-white/20 border border-white/5">
                  próximamente
                </div>
              )}

              {/* Indicador conectado */}
              {estaConectada && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-green" />
                  <span className="text-[9px] text-green-400/60">activo</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mensaje de seguridad */}
      <div className="max-w-2xl mx-auto w-full card-glass rounded-xl p-4 flex items-start gap-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" className="mt-0.5 shrink-0">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <p className="text-[11px] text-white/30 leading-relaxed">
          Cada app usa <strong className="text-white/50">OAuth</strong> — el estándar de seguridad de la industria.
          Nunca guardamos tus contraseñas. Tú autorizas el acceso y puedes revocarlo en cualquier momento desde tu cuenta de cada plataforma.
        </p>
      </div>
    </main>
  );
}
