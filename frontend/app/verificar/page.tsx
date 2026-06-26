"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function VerificarContent() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [enviando, setEnviando] = useState(false);
  const [reenviado, setReenviado] = useState(false);

  async function reenviar() {
    if (!email) return;
    setEnviando(true);
    await supabase.auth.resend({ type: "signup", email });
    setReenviado(true);
    setEnviando(false);
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">

        {/* Ícono */}
        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl">
          📧
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-semibold text-white">Revisa tu correo</h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Te enviamos un enlace de confirmación a
          </p>
          {email && (
            <p className="text-sm font-medium text-white/80 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              {email}
            </p>
          )}
          <p className="text-[12px] text-white/30 leading-relaxed">
            Abre el correo y toca el enlace para activar tu cuenta. Revisa también la carpeta de spam.
          </p>
        </div>

        {/* Reenviar */}
        <div className="w-full flex flex-col gap-3">
          {reenviado ? (
            <p className="text-sm text-green-400/70">✓ Correo reenviado</p>
          ) : (
            <button
              type="button"
              onClick={reenviar}
              disabled={enviando || !email}
              className="w-full py-3.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-medium transition-all disabled:opacity-30"
            >
              {enviando ? "Enviando..." : "Reenviar correo"}
            </button>
          )}

          <Link
            href="/login"
            className="w-full py-3.5 rounded-2xl bg-white text-black text-sm font-semibold text-center hover:bg-white/90 transition-all"
          >
            Ya confirmé mi cuenta — Entrar
          </Link>

          <Link href="/registro" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">
            Usar otro correo
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function VerificarPage() {
  return (
    <Suspense>
      <VerificarContent />
    </Suspense>
  );
}
