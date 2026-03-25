import { prisma } from "@/lib/prisma"

export async function getCurrentUserPlan(userId: string) {

  const userPlan = await prisma.userPlan.findFirst({
    where: { userId },
  })

  if (!userPlan) {
    return {
      plan: "free",
    }
  }

  return userPlan
}