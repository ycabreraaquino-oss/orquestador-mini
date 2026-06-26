"use client";

import WhatsAppPanel from "@/components/WhatsAppPanel";
import Link from "next/link";

export default function WhatsAppPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col px-6 py-8 gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/" className="text-white/20 hover:text-white/50 transition-colors text-xs">
          ← volver
        </Link>
        <div>
          <h1 className="text-sm font-medium text-white/70">Conector WhatsApp</h1>
          <p className="text-[11px] text-white/25">
            Di a quién y qué — el sistema envía solo
          </p>
        </div>
      </div>

      {/* Ejemplos de uso */}
      <div className="max-w-xl mx-auto w-full">
        <p className="text-[10px] text-white/20 uppercase tracking-widest mb-3">Ejemplos que puedes escribir</p>
        <div className="flex flex-col gap-2">
          {[
            "Envía a Ana, Juan y Pedro que hoy no podré ir porque tengo un problema",
            "Envía al grupo Familia que llegaré tarde a la cena",
            "Manda a María que confirmo la reunión para mañana a las 3pm",
          ].map((ej, i) => (
            <div key={i} className="card-glass rounded-xl px-4 py-2.5">
              <p className="text-xs text-white/35 italic">"{ej}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel principal */}
      <WhatsAppPanel />
    </main>
  );
}
