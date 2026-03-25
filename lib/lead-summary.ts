// lib/lead-summary.ts
import { openai } from "@/lib/openai";

type LeadSummaryResult = {
  leadName?: string | null;
  company?: string | null;
  website?: string | null;
  interest?: string | null;
  leadTemperature?: "cold" | "warm" | "hot" | null;
  nextStep?: string | null;
  closerSummary?: string | null;
};

function extractJsonObject(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : "{}";
}

function normalizeLeadTemperature(
  value: unknown
): "cold" | "warm" | "hot" | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();

  if (normalized === "cold") return "cold";
  if (normalized === "warm") return "warm";
  if (normalized === "hot") return "hot";

  return null;
}

function normalizeNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (!trimmed) return null;
  if (trimmed.toLowerCase() === "null") return null;
  if (trimmed.toLowerCase() === "não informado") return null;
  if (trimmed.toLowerCase() === "nao informado") return null;
  if (trimmed.toLowerCase() === "desconhecido") return null;

  return trimmed;
}

export async function generateLeadSummary(
  messages: { role: string; content: string }[]
): Promise<LeadSummaryResult> {
  const conversationText = messages
    .filter((m) => m.content?.trim())
    .map((m) => `${m.role === "user" ? "Lead" : "IA"}: ${m.content}`)
    .join("\n");

  if (!conversationText.trim()) {
    return {
      leadName: null,
      company: null,
      website: null,
      interest: null,
      leadTemperature: null,
      nextStep: null,
      closerSummary: null,
    };
  }

  const prompt = `
Você é um assistente de CRM especializado em qualificação de leads no WhatsApp.

Analise a conversa e extraia informações comerciais do lead.

Responda SOMENTE em JSON válido.
Não use markdown.
Não escreva explicações.
Não escreva texto antes ou depois do JSON.

Formato exato:
{
  "leadName": "string ou null",
  "company": "string ou null",
  "website": "string ou null",
  "interest": "string ou null",
  "leadTemperature": "cold, warm, hot ou null",
  "nextStep": "string ou null",
  "closerSummary": "string ou null"
}

Objetivo de cada campo:
- leadName: nome da pessoa, se estiver claro na conversa.
- company: nome da empresa, negócio, clínica, loja, escritório, marca ou tipo de negócio do lead.
- website: site, domínio, link, Instagram comercial ou página mencionada pelo lead.
- interest: o que o lead quer resolver, implantar, automatizar, contratar ou melhorar.
- leadTemperature:
  - cold = pouco contexto, curiosidade inicial, sem urgência clara
  - warm = demonstrou interesse real, explicou necessidade, quer entender solução
  - hot = quer avançar logo, pediu proposta, preço, orçamento, implantação, contato com especialista ou demonstra urgência
- nextStep: próximo passo comercial recomendado, curto e objetivo.
- closerSummary: resumo curto e útil para o vendedor humano continuar a conversa.

Regras:
- Não invente dados.
- Use null quando não houver informação suficiente.
- Se o lead disser apenas "oi", "bom dia" ou algo muito curto, quase tudo deve ficar null.
- Se houver menção a site, domínio, @instagram, link de bio ou página comercial, preencha website.
- Se houver menção ao ramo do negócio, mesmo sem nome formal da empresa, preencha company com o tipo de negócio.
- interest deve ser específico e curto.
- nextStep deve ser uma ação comercial prática, por exemplo:
  - "Entender melhor a operação atual do atendimento"
  - "Agendar conversa com especialista"
  - "Apresentar como funcionaria a automação no WhatsApp"
  - "Coletar mais informações sobre volume de atendimentos"
- closerSummary deve ter no máximo 2 frases curtas.
- leadTemperature deve ser apenas "cold", "warm", "hot" ou null.

Conversa:
${conversationText}
`.trim();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "Você extrai dados comerciais de leads e responde apenas JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const rawContent = response.choices[0]?.message?.content ?? "{}";
    const jsonText = extractJsonObject(rawContent);
    const parsed = JSON.parse(jsonText);

    return {
      leadName: normalizeNullableString(parsed?.leadName),
      company: normalizeNullableString(parsed?.company),
      website: normalizeNullableString(parsed?.website),
      interest: normalizeNullableString(parsed?.interest),
      leadTemperature: normalizeLeadTemperature(parsed?.leadTemperature),
      nextStep: normalizeNullableString(parsed?.nextStep),
      closerSummary: normalizeNullableString(parsed?.closerSummary),
    };
  } catch (error) {
    console.error("ERRO AO GERAR LEAD SUMMARY:", error);

    return {
      leadName: null,
      company: null,
      website: null,
      interest: null,
      leadTemperature: null,
      nextStep: null,
      closerSummary: null,
    };
  }
}