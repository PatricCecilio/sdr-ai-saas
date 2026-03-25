import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      termsAcceptedAt: true,
      privacyAcceptedAt: true,
      trialStartedAt: true,
      trialEndsAt: true,
      accessStatus: true,
    },
  })

  if (!user) {
    redirect("/registrar")
  }

  if (!user.termsAcceptedAt || !user.privacyAcceptedAt) {
    redirect("/registrar")
  }

  const now = new Date()

  if (
    user.accessStatus === "trial" &&
    user.trialEndsAt &&
    user.trialEndsAt <= now
  ) {
    redirect("/upgrade")
  }

  return <>{children}</>
}