"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export async function completeOnboarding(formData: FormData) {
  try {
    console.log("🔥 [ONBOARDING] Iniciando action")

    const { userId } = await auth()
    console.log("👉 userId:", userId)

    if (!userId) {
      console.log("❌ Sem userId → redirect /sign-in")
      redirect("/sign-in")
    }

    const clerkUser = await currentUser()

    console.log("👉 clerkUser:", {
      email: clerkUser?.primaryEmailAddress?.emailAddress,
      name: clerkUser?.fullName,
    })

    if (!clerkUser?.primaryEmailAddress?.emailAddress) {
      console.log("❌ Usuário sem email")
      throw new Error("Usuário sem email")
    }

    const acceptedTerms = formData.get("acceptedTerms") === "on"
    const acceptedPrivacy = formData.get("acceptedPrivacy") === "on"

    console.log("👉 acceptedTerms:", acceptedTerms)
    console.log("👉 acceptedPrivacy:", acceptedPrivacy)

    if (!acceptedTerms || !acceptedPrivacy) {
      console.log("❌ Termos não aceitos")
      throw new Error("Você precisa aceitar os termos.")
    }

    const now = new Date()
    const trialEndsAt = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

    console.log("👉 Salvando usuário no banco...")

    const result = await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: clerkUser.primaryEmailAddress.emailAddress,
        name: clerkUser.fullName ?? clerkUser.firstName ?? null,
        termsAcceptedAt: now,
        privacyAcceptedAt: now,
        trialStartedAt: now,
        trialEndsAt,
        accessStatus: "trial",
      },
      create: {
        id: userId,
        email: clerkUser.primaryEmailAddress.emailAddress,
        name: clerkUser.fullName ?? clerkUser.firstName ?? null,
        termsAcceptedAt: now,
        privacyAcceptedAt: now,
        trialStartedAt: now,
        trialEndsAt,
        accessStatus: "trial",
      },
    })

    console.log("✅ Usuário salvo:", result.id)

    console.log("➡️ Redirecionando para /dashboard")

    redirect("/dashboard")
  } catch (error) {
    console.error("🚨 ERRO NO ONBOARDING:", error)

    throw error
  }
}