"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export async function startTrialActivation(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // ✅ Verifica checkbox obrigatório
  const accepted = formData.get("acceptActivation")

  if (!accepted) {
    throw new Error("Você precisa aceitar os termos para continuar.")
  }

  // 🔎 Busca usuário
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error("Usuário não encontrado.")
  }

  // 🛑 Evita reativar trial
  if (user.trialStartedAt) {
    redirect("/dashboard")
  }

  const now = new Date()

  // ⏳ Trial de 2 dias
  const trialEnd = new Date()
  trialEnd.setDate(now.getDate() + 2)

  // 💾 Atualiza usuário
  await prisma.user.update({
    where: { id: userId },
    data: {
      activationAcceptedAt: now,
      trialStartedAt: now,
      trialEndsAt: trialEnd,
    },
  })

  // 🚀 Redireciona para próxima etapa
  redirect("/dashboard/conectar-whatsapp")
}