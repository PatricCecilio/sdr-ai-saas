"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { OpenAI } from "openai/index.js";

export async function createLead(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const company = formData.get("company")?.toString().trim() || null;
  const status = formData.get("status")?.toString().trim() || "NOVO";

  if (!name) {
    throw new Error("Nome é obrigatório");
  }

  await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      company,
      status,
      userId,
    },
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/analytics");
  redirect("/?success=created");
}

export async function updateLead(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const company = formData.get("company")?.toString().trim() || null;
  const status = formData.get("status")?.toString().trim() || "NOVO";

  if (!id) {
    throw new Error("ID inválido");
  }

  if (!name) {
    throw new Error("Nome é obrigatório");
  }

  const lead = await prisma.lead.findFirst({
    where: { id, userId },
  });

  if (!lead) {
    throw new Error("Lead não encontrado");
  }

  await prisma.lead.update({
    where: { id },
    data: {
      name,
      email,
      phone,
      company,
      status,
    },
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath(`/conversation?id=${id}`);
  redirect("/?success=updated");
}

export async function deleteLead(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const id = formData.get("id")?.toString();

  if (!id) {
    throw new Error("ID inválido");
  }

  const lead = await prisma.lead.findFirst({
    where: { id, userId },
  });

  if (!lead) {
    throw new Error("Lead não encontrado");
  }

  await prisma.lead.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/analytics");
  redirect("/?success=deleted");
}

export async function createMessage(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const leadId = formData.get("leadId")?.toString();
  const role = formData.get("role")?.toString().trim() || "assistant";
  const content = formData.get("content")?.toString().trim();

  if (!leadId) {
    throw new Error("Lead inválido");
  }

  if (!content) {
    throw new Error("Mensagem vazia");
  }

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, userId },
  });

  if (!lead) {
    throw new Error("Lead não encontrado");
  }

  await prisma.message.create({
    data: {
      leadId,
      role,
      content,
    },
  });

  revalidatePath(`/conversation?id=${leadId}`);
  redirect(`/conversation?id=${leadId}`);
}

export async function generateAIMessage(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const leadId = formData.get("leadId")?.toString();

  if (!leadId) {
    throw new Error("Lead inválido");
  }

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!lead) {
    throw new Error("Lead não encontrado");
  }

  if (lead.handoffStatus === "EM_ATENDIMENTO_HUMANO") {
    throw new Error("Este lead já está em atendimento humano.");
  }

  const history = lead.messages.map(
    (m: { role: string; content: string }) => ({
      role:
        m.role === "assistant"
          ? "assistant"
          : m.role === "user"
            ? "user"
            : "assistant",
      content: m.content,
    })
  );

  const historyMessages =
    history as OpenAI.Chat.Completions.ChatCompletionMessageParam[];

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "Você é um SDR humano e simpático que conversa com leads pelo WhatsApp. Responda de forma natural e curta.",
    },
    ...historyMessages,
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  const responseText = completion.choices[0]?.message?.content ?? "";

  await prisma.message.create({
    data: {
      leadId,
      role: "assistant",
      content: responseText,
    },
  });

  revalidatePath(`/conversation?id=${leadId}`);
  redirect(`/conversation?id=${leadId}`);
}

export async function markLeadReadyForCloser(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const leadId = formData.get("leadId")?.toString();

  if (!leadId) {
    throw new Error("Lead inválido");
  }

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, userId },
  });

  if (!lead) {
    throw new Error("Lead não encontrado");
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      handoffStatus: "PRONTO_CLOSER",
      status: "NEGOCIANDO",
    },
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/analytics");
  revalidatePath(`/conversation?id=${leadId}`);
  redirect(`/conversation?id=${leadId}`);
}

export async function assumeHumanService(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const leadId = formData.get("leadId")?.toString();

  if (!leadId) {
    throw new Error("Lead inválido");
  }

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, userId },
  });

  if (!lead) {
    throw new Error("Lead não encontrado");
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      handoffStatus: "EM_ATENDIMENTO_HUMANO",
      status: "NEGOCIANDO",
    },
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/analytics");
  revalidatePath(`/conversation?id=${leadId}`);
}

export async function returnLeadToAI(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const leadId = formData.get("leadId")?.toString();

  if (!leadId) {
    throw new Error("Lead inválido");
  }

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, userId },
  });

  if (!lead) {
    throw new Error("Lead não encontrado");
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      handoffStatus: "PENDENTE",
    },
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/analytics");
  revalidatePath(`/conversation?id=${leadId}`);
}

export async function updateLeadStatus(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const leadId = formData.get("leadId")?.toString();
  const status = formData.get("status")?.toString();

  if (!leadId) {
    throw new Error("Lead inválido");
  }

  if (!status) {
    throw new Error("Status inválido");
  }

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, userId },
  });

  if (!lead) {
    throw new Error("Lead não encontrado");
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { status },
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/analytics");
  revalidatePath(`/conversation?id=${leadId}`);
}

export async function saveAiSettings(formData: FormData) {
  const companyName = formData.get("companyName")?.toString().trim();
  const tone = formData.get("tone")?.toString().trim() || "amigável";
  const goal =
    formData.get("goal")?.toString().trim() ||
    "qualificar leads e encaminhar para closer";
  const extraInstructions =
    formData.get("extraInstructions")?.toString().trim() || null;

  if (!companyName) {
    throw new Error("Nome da empresa é obrigatório");
  }

  const existing = await prisma.aiSettings.findFirst();

  if (existing) {
    await prisma.aiSettings.update({
      where: { id: existing.id },
      data: {
        companyName,
        tone,
        goal,
        extraInstructions,
      },
    });
  } else {
    await prisma.aiSettings.create({
      data: {
        companyName,
        tone,
        goal,
        extraInstructions,
      },
    });
  }

  revalidatePath("/settings");
}