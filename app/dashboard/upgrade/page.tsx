import Link from "next/link"

export default function UpgradePage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">

        <h1 className="text-3xl font-bold">
          Seu trial expirou 🚫
        </h1>

        <p className="text-zinc-400 mt-4">
          Para continuar usando a automação no WhatsApp, ative seu plano.
        </p>

        <div className="mt-8 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Plano Pro</h2>

          <p className="text-3xl font-bold mt-4">
            R$ 397<span className="text-base text-zinc-400">/mês</span>
          </p>

          <ul className="text-sm text-zinc-400 mt-6 space-y-2">
            <li>✔ IA respondendo no WhatsApp</li>
            <li>✔ Leads ilimitados</li>
            <li>✔ Dashboard completo</li>
            <li>✔ Suporte prioritário</li>
          </ul>

          <button className="mt-8 w-full bg-white text-black py-3 rounded-xl font-semibold">
            Assinar agora
          </button>
        </div>

        <Link
          href="/dashboard"
          className="block mt-6 text-sm text-zinc-500 hover:text-white"
        >
          Voltar ao dashboard
        </Link>
      </div>
    </main>
  )
}