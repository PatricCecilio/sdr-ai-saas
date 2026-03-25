import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    console.log("🔥 [API ONBOARDING]")

    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const clerkUser = await currentUser()

    if (!clerkUser?.primaryEmailAddress?.emailAddress) {
      return new NextResponse("User without email", { status: 400 })
    }

    const now = new Date()
    const trialEndsAt = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

    await prisma.user.upsert({
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

    console.log("✅ Usuário criado/atualizado")

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("🚨 ERRO ONBOARDING:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}