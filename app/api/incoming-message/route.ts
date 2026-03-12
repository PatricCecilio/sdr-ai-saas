import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type HistoryMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message = body.message ?? "";

    const history: HistoryMessage[] = Array.isArray(body.history)
      ? body.history.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        }))
      : [];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Você é um SDR humano e simpático que conversa com leads pelo WhatsApp.

Classifique o lead:

frio = curioso
morno = interessado
quente = quer proposta, preço, reunião ou contratação

Se o lead pedir valores, proposta, reunião ou contratação:
handoffStatus = "PRONTO_CLOSER"

Caso contrário:
handoffStatus = "PENDENTE"

Retorne SOMENTE JSON válido no formato:

{
  "reply": "mensagem da IA para o lead",
  "qualification": {
    "interestLevel": "baixo|medio|alto",
    "leadTemperature": "frio|morno|quente",
    "mainInterest": "resumo do interesse principal",
    "budgetInfo": "informação sobre orçamento ou não identificado",
    "timelineInfo": "informação sobre prazo ou não identificado",
    "qualifiedSummary": "resumo útil para o closer",
    "handoffStatus": "PENDENTE|PRONTO_CLOSER"
  }
}
          `.trim(),
        },

        ...history,

        {
          role: "user",
          content: message,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({
      success: true,
      raw,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao processar mensagem" },
      { status: 500 }
    );
  }
}