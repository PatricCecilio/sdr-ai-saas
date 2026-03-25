"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { OpenAI } from "openai";
import { getCurrentUserPlan } from "@/lib/subscription";
import { getUserLeadCount } from "@/lib/usage";
import { FREE_PLAN_MAX_LEADS } from "@/lib/plan-limits";
import { sendWhatsappMessage } from "@/lib/whatsapp";



// --- Funções de Gerenciamento de Lead ---

export async function createLead(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const { isPro } = await getCurrentUserPlan();
  if (!isPro) {
    const currentLeadCount = await getUserLeadCount(userId);
    if (currentLeadCount >= FREE_PLAN_MAX_LEADS) {
      redirect("/upgrade");
    }
  }

  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim() || null;

  if (!name) throw new Error("Nome é obrigatório");

  await prisma.lead.create({
    data: { 
      name, 
      phone,
      email: formData.get("email")?.toString().trim() || null,
      company: formData.get("company")?.toString().trim() || null,
      status: formData.get("status")?.toString().trim() || "NOVO",
      userId 
    },
  });

  revalidatePath("/");
  redirect("/?success=created");
}

export async function updateLead(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  if (!id || !name) throw new Error("Dados inválidos");

  await prisma.lead.update({
    where: { id },
    data: {
      name,
      phone: formData.get("phone")?.toString().trim() || null,
      status: formData.get("status")?.toString().trim() || "NOVO",
    },
  });

  revalidatePath("/leads");
  revalidatePath(`/conversation?id=${id}`);
  redirect("/leads?success=updated");
}

export async function deleteLead(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("ID inválido");

  await prisma.lead.delete({ where: { id } });

  revalidatePath("/leads");
  redirect("/leads?success=deleted");
}

// --- Funções de Mensagens e IA ---

export async function createMessage(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const leadId = formData.get("leadId")?.toString();
  const content = formData.get("content")?.toString().trim();
  const role = formData.get("role")?.toString().trim() || "assistant";

  if (!leadId || !content) throw new Error("Dados inválidos");

  const lead = await prisma.lead.findFirst({ where: { id: leadId, userId } });
  if (!lead) throw new Error("Lead não encontrado");

  // 1. Salva no banco de dados local
  await prisma.message.create({
    data: { leadId, role, content },
  });

  // 2. Se a mensagem for enviada pelo atendente (Dashboard), envia para o WhatsApp real
  if (role === "assistant" && lead.phone) {
    await sendWhatsappMessage(lead.phone, content);
  }

  revalidatePath(`/conversation?id=${leadId}`);
}

export async function generateAIMessage(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Usuário não autenticado");

  const leadId = formData.get("leadId")?.toString();
  if (!leadId) throw new Error("Lead inválido");

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!lead || !lead.phone) throw new Error("Lead não encontrado ou sem telefone");

  const historyMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = 
    lead.messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Você é um SDR humano. Responda de forma natural." },
      ...historyMessages,
    ],
  });

  const responseText = completion.choices[0]?.message?.content ?? "";

  // Salva e envia para o WhatsApp
  await prisma.message.create({ data: { leadId, role: "assistant", content: responseText } });
  await sendWhatsAppMessage(lead.phone, responseText);

  revalidatePath(`/conversation?id=${leadId}`);
}

// --- Funções de Handoff ---

export async function assumeHumanService(formData: FormData) {
  const { userId } = await auth();
  const leadId = formData.get("leadId")?.toString();
  if (!userId || !leadId) throw new Error("Acesso negado");

  await prisma.lead.update({
    where: { id: leadId },
    data: { handoffStatus: "EM_ATENDIMENTO_HUMANO" },
  });

  revalidatePath(`/conversation?id=${leadId}`);
}

export async function returnLeadToAI(formData: FormData) {
  const { userId } = await auth();
  const leadId = formData.get("leadId")?.toString();
  if (!userId || !leadId) throw new Error("Acesso negado");

  await prisma.lead.update({
    where: { id: leadId },
    data: { handoffStatus: "PENDENTE" },
  });

  revalidatePath(`/conversation?id=${leadId}`);
}

export async function saveAiSettings(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Acesso negado");

  const companyName = formData.get("companyName")?.toString().trim();
  if (!companyName) throw new Error("Nome da empresa é obrigatório");

  const data = {
    companyName,
    tone: formData.get("tone")?.toString().trim() || "amigável",
    goal: formData.get("goal")?.toString().trim() || "qualificar leads",
  };

  const existing = await prisma.aiSettings.findFirst();
  if (existing) {
    await prisma.aiSettings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.aiSettings.create({ data });
  }

  revalidatePath("/settings");
}

export async function startTrialActivation(formData: FormData) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const accepted = formData.get("acceptActivation")

  if (!accepted) {
    throw new Error("Você precisa aceitar os termos de ativação.")
  }

  const now = new Date()
  const trialEndsAt = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

  await prisma.user.update({
    where: { id: userId },
    data: {
      activationAcceptedAt: now,
      trialStartedAt: now,
      trialEndsAt,
    },
  })

  redirect("/dashboard/conectar-whatsapp")
}