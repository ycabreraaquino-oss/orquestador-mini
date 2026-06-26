"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaGoogle } from "react-icons/fa";

export default function RegistroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function registrar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setCargando(false);
    } else {
      router.push(`/verificar?email=${encodeURIComponent(email)}`);
    }
  }

  async function entrarConGoogle() {
    setCargando(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/conectar` },
    });
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-8">

        {/* Header */}
        <div className="text-center flex flex-col gap-1">
          <Link href="/" className="text-white/20 hover:text-white/50 text-xs transition-colors mb-2 block">← volver</Link>
          <h1 className="text-xl font-semibold text-white">Crea tu cuenta</h1>
          <p className="text-[12px] text-white/30">Accede a todas tus apps desde un solo lugar</p>
        </div>

        {/* Google — próximamente */}
        <button
          type="button"
          disabled
          className="w-full py-3.5 rounded-2xl border border-white/8 bg-white/[0.02] text-white/20 text-sm font-medium flex items-center justify-center gap-3 cursor-not-allowed"
        >
          <FaGoogle size={16} className="text-white/20" />
          Continuar con Google — próximamente
        </button>

        {/* Divisor */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[11px] text-white/20">o con email</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Formulario */}
        <form onSubmit={registrar} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/30 uppercase tracking-widest">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-white/30 uppercase tracking-widest">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {error && <p className="text-xs text-red-400/70 text-center">{error}</p>}

          <button
            type="submit"
            disabled={cargando || !email || !password}
            className="w-full py-3.5 rounded-2xl bg-white text-black text-sm font-semibold disabled:opacity-30 hover:bg-white/90 transition-all"
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-[11px] text-white/25">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-white/50 hover:text-white transition-colors">
            Inicia sesión
          </Link>
        </p>

      </div>
    </main>
  );
}
