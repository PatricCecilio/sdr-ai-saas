import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { openBillingPortal } from "./actions"

function formatDate(date: Date | null) {
  if (!date) return "—"

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeZone: "America/Sao_Paulo",
  }).format(date)
}

function getStatusLabel(status?: string | null) {
  switch (status) {
    case "active":
      return "Ativa"
    case "trialing":
      return "Em trial"
    case "past_due":
      return "Pagamento pendente"
    case "canceled":
      return "Cancelada"
    case "unpaid":
      return "Não paga"
    case "incomplete":
      return "Incompleta"
    default:
      return "Sem assinatura"
  }
}

export default async function BillingPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      accessStatus: true,
      subscriptionStatus: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      trialStartedAt: true,
      trialEndsAt: true,
      stripePriceId: true,
    },
  })

  if (!user) {
    redirect("/sign-in")
  }

  const hasStripeCustomer = Boolean(user.stripeCustomerId)

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-sm text-zinc-400 tracking-[0.2em]">BILLING</p>
          <h1 className="text-4xl font-bold mt-3">Assinatura e cobrança</h1>
          <p className="text-zinc-400 mt-4">
            Gerencie seu plano, forma de pagamento e status da assinatura.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-2xl font-semibold">Plano atual</h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                <span className="text-zinc-400">Plano</span>
                <span className="font-medium text-white">Plano Pro</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                <span className="text-zinc-400">Preço</span>
                <span className="font-medium text-white">R$ 397/mês</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                <span className="text-zinc-400">Status de acesso</span>
                <span className="font-medium text-white">{user.accessStatus ?? "—"}</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                <span className="text-zinc-400">Status da assinatura</span>
                <span className="font-medium text-white">
                  {getStatusLabel(user.subscriptionStatus)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                <span className="text-zinc-400">Trial iniciado em</span>
                <span className="font-medium text-white">
                  {formatDate(user.trialStartedAt)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-zinc-400">Trial termina em</span>
                <span className="font-medium text-white">
                  {formatDate(user.trialEndsAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="text-2xl font-semibold">Gerenciar cobrança</h2>
            <p className="text-zinc-400 mt-4">
              Atualize cartão, acompanhe cobranças e cancele sua assinatura pelo portal seguro.
            </p>

            {hasStripeCustomer ? (
              <form action={openBillingPortal} className="mt-8">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-white text-black font-semibold py-4 hover:opacity-90 transition"
                >
                  Gerenciar assinatura
                </button>
              </form>
            ) : (
              <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                Você ainda não possui uma assinatura ativa no Stripe.
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/30 p-4 text-sm">
              <p className="text-zinc-400">Conta</p>
              <p className="mt-1 font-medium text-white">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}