"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function createLead(formData: FormData) {
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
    },
  });

  revalidatePath("/");
  redirect("/?success=created");
}

export async function updateLead(formData: FormData) {
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
  redirect("/?success=updated");
}

export async function deleteLead(formData: FormData) {
  const id = formData.get("id")?.toString();

  if (!id) {
    throw new Error("ID inválido");
  }

  await prisma.lead.delete({
    where: { id },
  });

  revalidatePath("/");
  redirect("/?success=deleted");
}

export async function createMessage(formData: FormData) {
  const leadId = formData.get("leadId")?.toString();
  const role = formData.get("role")?.toString().trim() || "assistant";
  const content = formData.get("content")?.toString().trim();

  if (!leadId) {
    throw new Error("Lead inválido");
  }

  if (!content) {
    throw new Error("Mensagem vazia");
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
  const leadId = formData.get("leadId")?.toString();

  if (!leadId) {
    throw new Error("Lead inválido");
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
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

  const history = lead.messages.map((m) => ({
    role:
      m.role === "assistant"
        ? "assistant"
        : m.role === "user"
        ? "user"
        : "assistant",
    content: m.content,
  }));

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um SDR humano e simpático que conversa com leads pelo WhatsApp. Responda de forma natural e curta.",
      },
      ...history,
    ],
  });

  const message = completion.choices[0].message.content;

  await prisma.message.create({
    data: {
      leadId,
      role: "assistant",
      content: message || "",
    },
  });

  revalidatePath(`/conversation?id=${leadId}`);
  redirect(`/conversation?id=${leadId}`);
}

export async function markLeadReadyForCloser(formData: FormData) {
  const leadId = formData.get("leadId")?.toString();

  if (!leadId) {
    throw new Error("Lead inválido");
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      handoffStatus: "PRONTO_CLOSER",
      status: "NEGOCIANDO",
    },
  });

  revalidatePath("/");
  revalidatePath(`/conversation?id=${leadId}`);
  redirect(`/conversation?id=${leadId}`);
}

export async function assumeHumanService(formData: FormData) {
  const leadId = formData.get("leadId")?.toString()

  if (!leadId) {
    throw new Error("Lead inválido")
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      handoffStatus: "EM_ATENDIMENTO_HUMANO",
      status: "NEGOCIANDO",
    },
  })

  revalidatePath("/")
  revalidatePath(`/conversation?id=${leadId}`)
}

export async function returnLeadToAI(formData: FormData) {
  const leadId = formData.get("leadId")?.toString();

  if (!leadId) {
    throw new Error("Lead inválido");
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      handoffStatus: "PENDENTE",
    },
  });

  revalidatePath("/");
  revalidatePath(`/conversation?id=${leadId}`);
}

export async function updateLeadStatus(formData: FormData) {
  const leadId = formData.get("leadId")?.toString();
  const status = formData.get("status")?.toString();

  if (!leadId) {
    throw new Error("Lead inválido");
  }

  if (!status) {
    throw new Error("Status inválido");
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { status },
  });

  revalidatePath("/");
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