"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveWhatsappConnection(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const instanceId = String(formData.get("instanceId") || "").trim();
  const instanceToken = String(formData.get("instanceToken") || "").trim();
  const phoneNumber = String(formData.get("phoneNumber") || "").trim();
  const webhookSecret = String(formData.get("webhookSecret") || "").trim();

  if (!instanceId || !instanceToken) {
    throw new Error("Instance ID e Instance Token são obrigatórios");
  }

  const existingConnection = await prisma.whatsappConnection.findFirst({
    where: { userId },
  });

  if (existingConnection) {
    await prisma.whatsappConnection.update({
      where: { id: existingConnection.id },
      data: {
        instanceId,
        instanceToken,
        phoneNumber: phoneNumber || null,
        webhookSecret: webhookSecret || null,
        status: "connected",
        isActive: true,
      },
    });
  } else {
    await prisma.whatsappConnection.create({
      data: {
        userId,
        provider: "zapi",
        instanceId,
        instanceToken,
        phoneNumber: phoneNumber || null,
        webhookSecret: webhookSecret || null,
        status: "connected",
        isActive: true,
      },
    });
  }

  revalidatePath("/settings/whatsapp");
}