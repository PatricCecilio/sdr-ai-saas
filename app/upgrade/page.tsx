import Link from "next/link";

export default function UpgradePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center shadow-lg">
        <h1 className="mb-4 text-3xl font-bold">Recurso disponível no Plano Pro</h1>

        <p className="mb-8 text-zinc-300">
          Para acessar esta funcionalidade, ative sua assinatura Pro.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/pricing"
            className="rounded-lg bg-purple-600 px-6 py-3 text-white hover:opacity-90"
          >
            Ver planos
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-white/20 px-6 py-3 text-white hover:bg-white/5"
          >
            Voltar ao dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}