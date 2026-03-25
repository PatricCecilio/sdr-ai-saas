import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      termsAcceptedAt: true,
      privacyAcceptedAt: true,
      trialStartedAt: true,
      trialEndsAt: true,
      accessStatus: true,
      leads: true,
      userPlan: true,
      connections: true,
      _count: {
        select: {
          leads: true,
          connections: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/registrar")
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-sm text-zinc-400 tracking-[0.2em]">DASHBOARD</p>
          <h1 className="text-4xl font-bold mt-3">
            Olá, {user.name ?? "usuário"}
          </h1>
          <p className="text-zinc-400 mt-4">
            Gerencie seu atendimento, conexões e leads.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-zinc-400 text-sm">Status do acesso</p>
            <h2 className="text-2xl font-bold mt-2">{user.accessStatus}</h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-zinc-400 text-sm">Leads</p>
            <h2 className="text-2xl font-bold mt-2">{user._count.leads}</h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-zinc-400 text-sm">Conexões WhatsApp</p>
            <h2 className="text-2xl font-bold mt-2">{user._count.connections}</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/conectar-whatsapp"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-700 transition"
          >
            <h2 className="text-xl font-semibold">Conectar WhatsApp</h2>
            <p className="text-zinc-400 mt-3 text-sm">
              Configure seu número e mantenha a integração ativa.
            </p>
          </Link>

          <Link
            href="/dashboard/leads"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-700 transition"
          >
            <h2 className="text-xl font-semibold">Leads</h2>
            <p className="text-zinc-400 mt-3 text-sm">
              Veja contatos e oportunidades.
            </p>
          </Link>

          <Link
            href="/dashboard/billing"
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-700 transition"
          >
            <h2 className="text-xl font-semibold">Billing</h2>
            <p className="text-zinc-400 mt-3 text-sm">
              Gerencie assinatura e cobrança.
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}