"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export async function saveManualWhatsappConnection(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const instanceId = String(formData.get("instanceId") || "").trim()
  const instanceToken = String(formData.get("instanceToken") || "").trim()
  const clientTokenRaw = String(formData.get("clientToken") || "").trim()

  if (!instanceId || !instanceToken) {
    throw new Error("Preencha o ID da instância e o token da instância.")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      activationAcceptedAt: true,
      trialStartedAt: true,
      trialEndsAt: true,
    },
  })

  if (!user) {
    throw new Error("Usuário não encontrado.")
  }

  if (!user.activationAcceptedAt || !user.trialStartedAt) {
    redirect("/dashboard/ativacao")
  }

  const existing = await prisma.whatsappConnection.findFirst({
    where: { userId, isActive: true },
    orderBy: { createdAt: "desc" },
  })

  if (existing) {
    await prisma.whatsappConnection.update({
      where: { id: existing.id },
      data: {
        instanceId,
        instanceToken,
        clientToken: clientTokenRaw || null,
        provider: "zapi",
        status: "pending",
        isActive: true,
      },
    })
  } else {
    await prisma.whatsappConnection.create({
      data: {
        userId,
        provider: "zapi",
        instanceId,
        instanceToken,
        clientToken: clientTokenRaw || null,
        status: "pending",
        isActive: true,
      },
    })
  }

  redirect("/dashboard/conectar-whatsapp")
}

export async function getWhatsappConnectionData() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const connection = await prisma.whatsappConnection.findFirst({
    where: {
      userId,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  })

  if (!connection) {
    return {
      hasConnection: false,
      connected: false,
      smartphoneConnected: false,
      qrCodeBase64: null as string | null,
      status: "pending" as string,
    }
  }

  const clientToken = connection.clientToken || process.env.ZAPI_CLIENT_TOKEN

  if (!clientToken) {
    return {
      hasConnection: true,
      connected: false,
      smartphoneConnected: false,
      qrCodeBase64: null as string | null,
      status: "missing-client-token",
    }
  }

  const headers = {
    "Client-Token": clientToken,
  }

  let connected = false
  let smartphoneConnected = false

  try {
    const statusResponse = await fetch(
      `https://api.z-api.io/instances/${connection.instanceId}/token/${connection.instanceToken}/status`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    )

    if (statusResponse.ok) {
      const statusData = await statusResponse.json()
      connected = Boolean(statusData.connected)
      smartphoneConnected = Boolean(statusData.smartphoneConnected)
    }
  } catch {
    // segue fluxo sem quebrar tela
  }

  if (connected) {
    await prisma.whatsappConnection.update({
      where: { id: connection.id },
      data: { status: "connected" },
    })

    return {
      hasConnection: true,
      connected: true,
      smartphoneConnected,
      qrCodeBase64: null as string | null,
      status: "connected",
    }
  }

  let qrCodeBase64: string | null = null

  try {
    const qrResponse = await fetch(
      `https://api.z-api.io/instances/${connection.instanceId}/token/${connection.instanceToken}/qr-code/image`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    )

    if (qrResponse.ok) {
      const qrData = await qrResponse.json()
      qrCodeBase64 =
        qrData.value ??
        qrData.qrCode ??
        qrData.base64 ??
        qrData.image ??
        null
    }
  } catch {
    // segue fluxo sem quebrar tela
  }

  return {
    hasConnection: true,
    connected: false,
    smartphoneConnected: false,
    qrCodeBase64,
    status: connection.status,
  }
}

export async function refreshWhatsappConnection() {
  redirect("/dashboard/conectar-whatsapp")
}