import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const phone = String(body.phone || "").trim();
    const content = String(body.content || "").trim();
    const name = String(body.name || "Lead WhatsApp").trim();

    if (!phone || !content) {
      return NextResponse.json(
        { error: "phone e content são obrigatórios" },
        { status: 400 }
      );
    }

    let lead = await prisma.lead.findFirst({
      where: { phone },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          name,
          phone,
          status: "NOVO",
        },
        include: {
          messages: true,
        },
      });
    }

    await prisma.message.create({
      data: {
        leadId: lead.id,
        role: "user",
        content,
      },
    });

    const updatedLead = await prisma.lead.findUnique({
      where: { id: lead.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!updatedLead) {
      return NextResponse.json(
        { error: "Lead não encontrado após salvar mensagem" },
        { status: 404 }
      );
    }

    const history = updatedLead.messages.map((m) => ({
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
            content: `
            Você é um SDR da empresa ${aiSettings?.companyName || "Minha Empresa"}.

            Seu tom de conversa deve ser ${aiSettings?.tone || "amigável"}.

            Seu objetivo é ${aiSettings?.goal || "qualificar leads e encaminhar para closer"}.

            Instruções extras da empresa:
            ${aiSettings?.extraInstructions || "Nenhuma."}

            Você conversa com leads como um humano em WhatsApp.

            Estilo da conversa:
            - natural
            - amigável
            - consultivo
            - objetivo
            - frases curtas
            - no máximo uma pergunta principal por mensagem

            Nunca:
            - faça interrogatório
            - faça várias perguntas na mesma mensagem
            - responda de forma robótica
            - escreva textos longos
            - pressione venda cedo demais

            Fluxo de conversa que você deve seguir internamente:

            1️⃣ entender o que o lead quer  
            2️⃣ entender contexto (empresa, uso, necessidade)  
            3️⃣ entender urgência ou prazo  
            4️⃣ entender potencial de investimento  
            5️⃣ avaliar se o lead está pronto para closer  

            Descoberta de orçamento (IMPORTANTE):

            Nunca pergunte diretamente "qual seu orçamento".

            Use perguntas naturais como:

            - "Você já chegou a ver quanto normalmente se investe nisso?"
            - "Isso seria algo mais simples ou algo maior mesmo?"
            - "A ideia seria algo mais básico ou algo bem completo?"

            Se o lead mencionar preço, orçamento ou investimento, registre isso.

            Temperatura do lead:

            frio → curioso  
            morno → interessado  
            quente → quer proposta, preço, reunião ou contratação

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
                "budgetInfo": "informação sobre orçamento ou Não identificado",
                "timelineInfo": "informação sobre prazo ou Não identificado",
                "qualifiedSummary": "resumo útil para o closer",
                "handoffStatus": "PENDENTE|PRONTO_CLOSER"
              }
            }
            `.trim(),
        }
        history,
      ],
    });

    const raw = completion.choices[0].message.content || "";

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
      return NextResponse.json(
        { error: "A IA retornou JSON inválido", raw },
        { status: 500 }
      );
    }

    await prisma.message.create({
      data: {
        leadId: updatedLead.id,
        role: "assistant",
        content: parsed.reply || "Olá! Como posso te ajudar?",
      },
    });

    const nextStatus =
      parsed.qualification.handoffStatus === "PRONTO_CLOSER"
        ? "NEGOCIANDO"
        : updatedLead.status === "NOVO"
        ? "CONTATO_FEITO"
        : updatedLead.status;

    await prisma.lead.update({
      
      where: { id: updatedLead.id },
      data: {
        status: nextStatus,
        interestLevel: parsed.qualification.interestLevel || "Não identificado",
        leadTemperature:
          parsed.qualification.leadTemperature || "Não identificado",
        mainInterest: parsed.qualification.mainInterest || "Não identificado",
        budgetInfo: parsed.qualification.budgetInfo || "Não identificado",
        timelineInfo: parsed.qualification.timelineInfo || "Não identificado",
        qualifiedSummary:
          parsed.qualification.qualifiedSummary || "Não identificado",
        handoffStatus: parsed.qualification.handoffStatus || "PENDENTE",
      },
    });
    if (updatedLead.handoffStatus === "EM_ATENDIMENTO_HUMANO") {
      return NextResponse.json({
        success: true,
        leadId: updatedLead.id,
        message: "Lead em atendimento humano. IA não respondeu.",
      });
}

    return NextResponse.json({
      success: true,
      leadId: updatedLead.id,
      aiReply: parsed.reply,
      qualification: parsed.qualification,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro interno ao processar mensagem" },
      { status: 500 }
    );
  }
}