import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    const history = Array.isArray(body.history)
      ? (body.history.filter(
          (
            msg: unknown
          ): msg is OpenAI.Chat.Completions.ChatCompletionMessageParam =>
            typeof msg === "object" &&
            msg !== null &&
            "role" in msg &&
            "content" in msg &&
            typeof (msg as { role?: unknown }).role === "string" &&
            ["system", "user", "assistant"].includes(
              (msg as { role: string }).role
            ) &&
            typeof (msg as { content?: unknown }).content === "string"
        ) as OpenAI.Chat.Completions.ChatCompletionMessageParam[])
      : [];

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `
Você é um SDR humano e simpático que conversa com leads pelo WhatsApp.

Seu objetivo é responder de forma natural, curta e útil, como um SDR real.

Classifique o lead assim:
- frio = curioso
- morno = interessado
- quente = quer proposta, preço, reunião ou contratação

Se o lead pedir valores, proposta, reunião ou contratação:
handoffStatus = "PRONTO_CLOSER"

Caso contrário:
handoffStatus = "PENDENTE"

Retorne SOMENTE um JSON válido no formato:

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
        content: message || "Olá",
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    let parsed: {
      reply: string;
      qualification: {
        interestLevel: string;
        leadTemperature: string;
        mainInterest: string;
        budgetInfo: string;
        timelineInfo: string;
        qualifiedSummary: string;
        handoffStatus: string;
      };
    };

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        reply: raw || "Olá! Posso entender melhor o que você procura?",
        qualification: {
          interestLevel: "baixo",
          leadTemperature: "frio",
          mainInterest: "não identificado",
          budgetInfo: "não identificado",
          timelineInfo: "não identificado",
          qualifiedSummary: "resposta não veio em JSON válido",
          handoffStatus: "PENDENTE",
        },
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Erro na rota incoming-message:", error);

    return NextResponse.json(
      {
        reply: "Desculpe, ocorreu um erro ao processar sua mensagem.",
        qualification: {
          interestLevel: "baixo",
          leadTemperature: "frio",
          mainInterest: "erro interno",
          budgetInfo: "não identificado",
          timelineInfo: "não identificado",
          qualifiedSummary: "erro interno ao processar mensagem",
          handoffStatus: "PENDENTE",
        },
      },
      { status: 500 }
    );
  }
}