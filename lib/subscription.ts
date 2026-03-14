import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserPlan() {
  const { userId } = await auth();

  if (!userId) {
    return {
      userId: null,
      isPro: false,
      plan: null,
    };
  }

  const userPlan = await prisma.userPlan.findUnique({
    where: { userId },
  });

  const isPro = userPlan?.stripeStatus === "active";

  return {
    userId,
    isPro,
    plan: userPlan ?? null,
  };
}