import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { canAccessApp } from "@/lib/access"

export default async function ProtectedDashboardLayout({
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
      trialEndsAt: true,
      accessStatus: true,
      subscriptionStatus: true,
    },
  })

  if (!user) {
    redirect("/sign-in")
  }

  const now = new Date()

  if (
    user.accessStatus === "trial" &&
    user.trialEndsAt &&
    user.trialEndsAt <= now
  ) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        accessStatus: "expired",
      },
    })

    redirect("/dashboard/upgrade")
  }

  const allowed = canAccessApp(user)

  if (!allowed) {
    redirect("/dashboard/upgrade")
  }

  return <>{children}</>
}