import { prisma } from "@/lib/prisma";

export async function getUserLeadCount(userId: string) {
  return prisma.lead.count({
    where: { userId },
  });
}

export async function getUserAiMessageCount(userId: string) {
  return prisma.message.count({
    where: {
      lead: {
        userId,
      },
      fromMe: true,
    },
  })
}