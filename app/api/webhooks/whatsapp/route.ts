import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { sendWhatsappMessage } from "@/lib/whatsapp";
import {
  extractAudioUrl,
  isAudioMessage,
  transcribeAudioFromUrl,
} from "@/lib/audio";
import { generateSpeechFromText } from "@/lib/tts";
import { sendWhatsappAudio } from "@/lib/whatsapp-audio";
import { uploadAudioAndGetPublicUrl } from "@/lib/upload-audio";
import { generateLeadSummary } from "@/lib/lead-summary";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractText(body: any) {
  return (
    body?.text?.message ||
    body?.message?.text ||
    body?.message?.conversation ||
    body?.message?.body ||
    body?.message ||
    body?.body ||
    body?.text ||
    body?.data?.text?.message ||
    body?.data?.message?.text ||
    body?.data?.message?.conversation ||
    body?.data?.message?.body ||
    body?.data?.message ||
    body?.data?.body ||
    ""
  );
}

function extractPhone(body: any) {
  return (
    body?.phone ||
    body?.from ||
    body?.chatLid ||
    body?.sender ||
    body?.chatId ||
    body?.data?.phone ||
    body?.data?.from ||
    body?.data?.sender ||
    body?.data?.chatId ||
    ""
  );
}

function extractInstanceId(body: any) {
  const value =
    body?.instanceId ||
    body?.instance_id ||
    body?.instance?.id ||
    body?.instance ||
    body?.data?.instanceId ||
    body?.data?.instance_id ||
    body?.data?.instance?.id ||
    body?.data?.instance ||
    "";

  return String(value || "").trim();
}

function extractMessageId(body: any) {
  return (
    body?.messageId ||
    body?.id ||
    body?.message?.id ||
    body?.message?.messageId ||
    body?.data?.messageId ||
    body?.data?.id ||
    body?.data?.message?.id ||
    body?.data?.message?.messageId ||
    null
  );
}

function extractFromMe(body: any) {
  const value =
    body?.fromMe ??
    body?.from_me ??
    body?.message?.fromMe ??
    body?.message?.from_me ??
    body?.data?.fromMe ??
    body?.data?.from_me ??
    body?.data?.message?.fromMe ??
    body?.data?.message?.from_me;

  return value === true;
}

function extractMessageType(body: any) {
  return (
    body?.messageType ||
    body?.type ||
    body?.message?.type ||
    body?.message?.messageType ||
    body?.data?.messageType ||
    body?.data?.type ||
    body?.data?.message?.type ||
    body?.data?.message?.messageType ||
    "text"
  );
}

function extractStatus(body: any) {
  return body?.status || body?.data?.status || null;
}

function normalizePhone(phone: string) {
  return String(phone || "").replace(/\D/g, "");
}

function isTextLikeMessage(messageType: string, text: string) {
  const normalized = String(messageType || "").toLowerCase();

  if (!normalized && text) return true;

  return [
    "text",
    "chat",
    "conversation",
    "extendedtextmessage",
    "extended_text",
    "extended-text",
    "receivedcallback",
  ].includes(normalized);
}

function buildConversationContext(
  messages: Array<{
    fromMe: boolean;
    content: string;
  }>
) {
  return messages
    .filter((msg) => msg.content?.trim())
    .map((msg) => `${msg.fromMe ? "ASSISTANT" : "CLIENTE"}: ${msg.content}`)
    .join("\n");
}

function buildCompanyContext(connection: {
  companyName?: string | null;
  companySegment?: string | null;
  companyCity?: string | null;
  companyWebsite?: string | null;
  companyInstagram?: string | null;
  companyDescription?: string | null;
  companyServices?: string | null;
  companyDifferentials?: string | null;
  companyToneOfVoice?: string | null;
  companyInstructions?: string | null;
}) {
  return `
Informações da empresa atendida:
- Nome da empresa: ${connection.companyName || "não informado"}
- Segmento: ${connection.companySegment || "não informado"}
- Cidade/região: ${connection.companyCity || "não informado"}
- Site: ${connection.companyWebsite || "não informado"}
- Instagram: ${connection.companyInstagram || "não informado"}
- Descrição da empresa: ${connection.companyDescription || "não informado"}
- Serviços/produtos principais: ${connection.companyServices || "não informado"}
- Diferenciais: ${connection.companyDifferentials || "não informado"}
- Tom de voz desejado: ${connection.companyToneOfVoice || "não informado"}
- Instruções extras de atendimento: ${connection.companyInstructions || "não informado"}
`.trim();
}

async function generateAiReply(params: {
  customerMessage: string;
  history: Array<{
    fromMe: boolean;
    content: string;
  }>;
  connection: {
    companyName?: string | null;
    companySegment?: string | null;
    companyCity?: string | null;
    companyWebsite?: string | null;
    companyInstagram?: string | null;
    companyDescription?: string | null;
    companyServices?: string | null;
    companyDifferentials?: string | null;
    companyToneOfVoice?: string | null;
    companyInstructions?: string | null;
  };
}) {
  const { customerMessage, history, connection } = params;

  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY não configurada");
    return "Olá! Recebi sua mensagem. Em instantes um atendente continua seu atendimento.";
  }

  const conversationHistory = buildConversationContext(history);
  const companyContext = buildCompanyContext(connection);

  const hasCompanyContext = [
    connection.companyName,
    connection.companySegment,
    connection.companyDescription,
    connection.companyServices,
    connection.companyInstructions,
  ].some((value) => String(value || "").trim().length > 0);

  const prompt = `
Você é uma atendente profissional de WhatsApp da empresa do contexto abaixo.

PRIORIDADE ABSOLUTA:
1. Responder como representante da empresa do contexto.
2. Usar o histórico apenas para manter continuidade.
3. Não voltar para um assunto antigo se a mensagem atual mudou de direção.
4. Não responder com contexto genérico de automação se a empresa cadastrada for de outro segmento.
5. Se houver conflito entre histórico antigo e contexto atual da empresa, priorize o contexto atual da empresa e a mensagem mais recente do cliente.

Contexto da empresa:
${companyContext}

Informações importantes:
- Se o contexto da empresa estiver preenchido, você deve agir como se trabalhasse nessa empresa.
- Não diga que a empresa "não trabalha com isso" se o contexto mostrar que trabalha.
- Não mude para assunto de SaaS, automação de atendimento, botão de WhatsApp em site ou captação de leads, a menos que isso esteja claramente no contexto da empresa.
- Se a empresa for de móveis, decoração, automação residencial ou algo parecido, responda dentro desse nicho.
- Se a empresa tiver serviços descritos, use esses serviços como base principal da resposta.
- Nunca invente serviços fora do contexto.
- Se faltar alguma informação, diga isso com naturalidade e peça mais detalhes.

Forma de falar:
- Responda em português do Brasil.
- Seja natural, simpática, objetiva e profissional.
- Use frases curtas e claras.
- Não use markdown.
- Não use listas.
- Não diga que é uma IA.

Como conduzir:
- Responda diretamente a pergunta atual do cliente.
- Depois, se fizer sentido, faça no máximo 1 pergunta curta para avançar a conversa.
- Não repita perguntas já respondidas.
- Não force assunto comercial se o cliente está perguntando algo específico sobre produto ou serviço.
- Se o cliente perguntar sobre um produto da empresa, responda primeiro sobre o produto.
- Só leve para orçamento, especialista ou próximo passo quando isso fizer sentido.

Regras comerciais para orçamento, prazo e fechamento:
- Quando o cliente perguntar sobre valores, não invente preço exato sem contexto.
- Quando perguntarem preço, explique de forma breve que o valor depende do projeto e peça 1 ou 2 informações essenciais.
- As informações mais importantes para orçamento são: tipo de móvel, tamanho aproximado, acabamento desejado e se quer LED, automação ou Alexa.
- Quando perguntarem prazo, diga que depende do projeto e da complexidade, e peça detalhes antes de estimar.
- Sempre que possível, conduza para o próximo passo de forma natural.
- Evite respostas vagas demais como "depende" sem explicar de quê depende.
- Seja consultiva: ajude o cliente a entender como funciona e o que influencia no valor.
- Quando perceber interesse real, conduza para orçamento ou atendimento humano.
- Não seja insistente. Seja útil e objetiva.

Exemplos de condução:
- Se perguntarem valores: "Os valores variam conforme tamanho, acabamento e nível de automação. Se tu quiser, me passa o tipo de móvel e uma medida aproximada que eu já consigo te orientar melhor."
- Se perguntarem prazo: "O prazo varia conforme o projeto e o nível de personalização. Se tu me disser o que imagina, eu consigo te orientar melhor sobre isso."
- Se perguntarem como funciona: "A gente entende o que você procura, define o modelo, acabamento e tecnologia, e a partir disso orienta a melhor solução para o teu caso."

Variação de linguagem:
- Evite repetir sempre "se você quiser".
- Varie entre:
  - "Se fizer sentido pra você..."
  - "Se puder me passar..."
  - "Com isso eu já consigo te orientar melhor..."
  - "Assim já consigo te dar uma ideia mais próxima..."
  - "Se quiser, já te ajudo com isso agora"

Condução comercial leve:
- Quando o cliente já deu sinais claros (medida, tipo de móvel, interesse), avance um pouco mais.
- Em vez de só perguntar, também sugira próximo passo.

Exemplo:
- "Com essas informações, já dá pra montar uma ideia inicial. Se quiser, posso te orientar com uma faixa de valor ou já avançamos para um orçamento mais detalhado."

Histórico da conversa:
${conversationHistory || "Sem histórico anterior."}

Mensagem atual do cliente:
${customerMessage}

Observação final:
${
  hasCompanyContext
    ? "O contexto da empresa está preenchido. Você DEVE priorizá-lo acima do contexto genérico."
    : "O contexto da empresa não está preenchido, então responda de forma mais geral."
}
`.trim();

  const response = await openai.responses.create({
    model: "gpt-5.4",
    input: prompt,
  });

  const reply = response.output_text?.trim();

  if (!reply) {
    return "Olá! Recebi sua mensagem. Pode me passar mais detalhes para eu te ajudar melhor?";
  }

  return reply;
}

function shouldAutoEscalateToHuman(text: string) {
  const normalized = String(text || "").toLowerCase();

  const strongSignals = [
    "quanto custa",
    "qual o valor",
    "quais os valores",
    "preço",
    "precos",
    "valor",
    "orçamento",
    "orcamento",
    "proposta",
    "prazo",
    "quero fazer",
    "quero fechar",
    "quero pedir",
    "quero encomendar",
    "como contratar",
    "como comprar",
    "quero instalar",
    "quero colocar",
    "preciso disso logo",
    "tem como começar",
    "quando pode fazer",
  ];

  return strongSignals.some((term) => normalized.includes(term));
}

async function autoEscalateConversationIfNeeded(params: {
  conversationId: string;
  customerMessage: string;
}) {
  const { conversationId, customerMessage } = params;

  const shouldEscalate = shouldAutoEscalateToHuman(customerMessage);

  if (!shouldEscalate) return;

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      leadTemperature: "hot",
    },
  });

  console.log("AUTO ESCALATE: conversa marcada como HOT");
}

async function updateConversationLeadSummary(conversationId: string) {
  try {
    const existingConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        leadTemperature: true,
      },
    });

    const fullConversation = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      select: {
        fromMe: true,
        content: true,
      },
    });

    const messagesForSummary = fullConversation
      .filter((msg) => msg.content?.trim())
      .map((msg) => ({
        role: msg.fromMe ? "assistant" : "user",
        content: msg.content,
      }));

    if (messagesForSummary.length === 0) {
      console.log("LEAD SUMMARY: conversa vazia, resumo ignorado");
      return;
    }

    const summary = await generateLeadSummary(messagesForSummary);

    const finalTemperature =
      existingConversation?.leadTemperature === "hot"
        ? "hot"
        : summary.leadTemperature ?? null;

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        leadName: summary.leadName ?? null,
        companyName: summary.company ?? null,
        website: summary.website ?? null,
        interest: summary.interest ?? null,
        leadTemperature: finalTemperature,
        objective: summary.nextStep ?? null,
        nextStep: summary.nextStep ?? null,
        summary: summary.closerSummary ?? null,
      },
    });

    console.log("LEAD SUMMARY ATUALIZADO COM SUCESSO");
  } catch (error) {
    console.error("ERRO AO ATUALIZAR LEAD SUMMARY:", error);
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    message: "Webhook WhatsApp ativo",
  });
}

export async function POST(req: Request) {
  console.log("=== WEBHOOK WHATSAPP CHAMOU ===");

  try {
    const body = await req.json();

    console.log("BODY RAW:", JSON.stringify(body, null, 2));

    const text = String(extractText(body) || "").trim();
    const rawPhone = extractPhone(body);
    const phone = normalizePhone(rawPhone);
    const instanceId = extractInstanceId(body);
    const externalMessageId = extractMessageId(body);
    const fromMe = extractFromMe(body);
    const messageType = extractMessageType(body);
    const status = extractStatus(body);

    console.log("DADOS EXTRAÍDOS:", {
      text,
      rawPhone,
      phone,
      instanceId,
      externalMessageId,
      fromMe,
      messageType,
      status,
    });

    if (status !== "RECEIVED") {
      console.log("IGNORADO: não é mensagem recebida");
      return Response.json({ ok: true, ignored: "not_received" });
    }

    if (fromMe) {
      console.log("IGNORADO: mensagem enviada pelo próprio número");
      return Response.json({ ok: true, ignored: "message_from_me" });
    }

    const isText = isTextLikeMessage(messageType, text);
    const isAudio = isAudioMessage(messageType, body);

    console.log("IS TEXT:", isText);
    console.log("IS AUDIO:", isAudio);

    if (!isText && !isAudio) {
      console.log("IGNORADO: tipo de mensagem não suportado");
      return Response.json({
        ok: true,
        ignored: "unsupported_message_type",
        messageType,
      });
    }

    if ((!text && !isAudio) || !phone || !instanceId) {
      console.log("ERRO: payload incompleto");
      return Response.json(
        {
          ok: false,
          error: "Payload incompleto",
          debug: {
            text,
            rawPhone,
            phone,
            instanceId,
            externalMessageId,
            messageType,
            status,
          },
        },
        { status: 400 }
      );
    }

    const connection = await prisma.whatsappConnection.findFirst({
      where: {
        instanceId,
        isActive: true,
      },
    });

    if (!connection) {
      console.log("ERRO: conexão não encontrada para instanceId:", instanceId);

      const allConnections = await prisma.whatsappConnection.findMany({
        select: {
          id: true,
          instanceId: true,
          isActive: true,
          phoneNumber: true,
        },
      });

      console.log("CONEXÕES DISPONÍVEIS:", allConnections);

      return Response.json(
        { ok: false, error: "Conexão não encontrada" },
        { status: 404 }
      );
    }

    const resolvedClientToken =
      connection.clientToken || process.env.ZAPI_CLIENT_TOKEN;

    console.log("CONEXÃO ENCONTRADA:", {
      id: connection.id,
      instanceId: connection.instanceId,
      phoneNumber: connection.phoneNumber,
      hasInstanceToken: Boolean(connection.instanceToken),
      hasClientTokenInDb: Boolean(connection.clientToken),
      hasClientTokenInEnv: Boolean(process.env.ZAPI_CLIENT_TOKEN),
      hasResolvedClientToken: Boolean(resolvedClientToken),
    });

    if (!connection.instanceToken) {
      console.log("ERRO: instanceToken ausente");

      return Response.json(
        {
          ok: false,
          error: "Instance token não configurado",
        },
        { status: 400 }
      );
    }

    if (externalMessageId) {
      const existingMessage = await prisma.message.findFirst({
        where: {
          externalId: String(externalMessageId),
        },
      });

      if (existingMessage) {
        console.log("IGNORADO: mensagem duplicada", externalMessageId);
        return Response.json({ ok: true, ignored: "duplicate_message" });
      }
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        connectionId: connection.id,
        contactPhone: phone,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          connectionId: connection.id,
          contactPhone: phone,
          lastMessageAt: new Date(),
        },
      });

      console.log("CONVERSA CRIADA:", conversation.id);
    } else {
      conversation = await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });

      console.log("CONVERSA ATUALIZADA:", conversation.id);
    }

    let finalCustomerText = text;

    if (isAudio) {
      const audioUrl = extractAudioUrl(body);

      console.log("AUDIO URL:", audioUrl);

      if (!audioUrl) {
        console.log("IGNORADO: áudio sem URL");

        return Response.json({
          ok: true,
          ignored: "audio_without_url",
        });
      }

      try {
        finalCustomerText = await transcribeAudioFromUrl(audioUrl);

        console.log("TEXTO TRANSCRITO DO ÁUDIO:", finalCustomerText);

        if (!finalCustomerText) {
          const fallbackResult = await sendWhatsappMessage({
            instanceId: connection.instanceId,
            instanceToken: connection.instanceToken,
            clientToken: resolvedClientToken,
            phone,
            message:
              "Recebi seu áudio, mas não consegui entender. Pode enviar em texto?",
          });

          console.log("FALLBACK ÁUDIO VAZIO:", fallbackResult);

          return Response.json({
            ok: true,
            fallback: "empty_audio_transcription",
          });
        }
      } catch (error) {
        console.error("ERRO AO TRANSCRIBIR ÁUDIO:", error);

        const fallbackResult = await sendWhatsappMessage({
          instanceId: connection.instanceId,
          instanceToken: connection.instanceToken,
          clientToken: resolvedClientToken,
          phone,
          message:
            "Recebi seu áudio, mas não consegui processá-lo agora. Pode enviar em texto?",
        });

        console.log("FALLBACK ERRO TRANSCRIÇÃO:", fallbackResult);

        return Response.json({
          ok: true,
          fallback: "audio_transcription_failed",
        });
      }
    }

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        externalId: externalMessageId ? String(externalMessageId) : null,
        fromMe: false,
        senderPhone: phone,
        content: finalCustomerText,
        messageType: isAudio ? "audio" : "text",
      },
    });

    console.log("1. MENSAGEM RECEBIDA SALVA NO BANCO");

    await autoEscalateConversationIfNeeded({
      conversationId: conversation.id,
      customerMessage: finalCustomerText,
    });

    conversation = await prisma.conversation.findUniqueOrThrow({
      where: { id: conversation.id },
    });

    if (conversation.humanTakeover) {
      console.log("MODO HUMANO ATIVO: IA não respondeu");

      await updateConversationLeadSummary(conversation.id);

      return Response.json({
        ok: true,
        humanTakeover: true,
        replyType: null,
      });
    }

    const recentMessages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 20,
      select: {
        fromMe: true,
        content: true,
      },
    });

    console.log("2. HISTÓRICO CARREGADO:", recentMessages.length);

    let aiReply = "";

    try {
      aiReply = await generateAiReply({
        customerMessage: finalCustomerText,
        history: recentMessages,
        connection: {
          companyName: connection.companyName,
          companySegment: connection.companySegment,
          companyCity: connection.companyCity,
          companyWebsite: connection.companyWebsite,
          companyInstagram: connection.companyInstagram,
          companyDescription: connection.companyDescription,
          companyServices: connection.companyServices,
          companyDifferentials: connection.companyDifferentials,
          companyToneOfVoice: connection.companyToneOfVoice,
          companyInstructions: connection.companyInstructions,
        },
      });

      console.log("3. RESPOSTA DA IA:", aiReply);
    } catch (aiError) {
      console.error("ERRO AO GERAR RESPOSTA DA IA:", aiError);

      aiReply =
        "Olá! Recebi sua mensagem. No momento estou com uma instabilidade no atendimento automático, mas em instantes alguém continua com você.";
    }

    const shouldReplyWithVoice = isAudio;

    console.log("SHOULD_REPLY_WITH_VOICE:", shouldReplyWithVoice);

    if (shouldReplyWithVoice) {
      try {
        console.log("4. INICIANDO GERAÇÃO DE VOZ...");

        const speechFilePath = await generateSpeechFromText(aiReply);
        console.log("5. ARQUIVO DE VOZ GERADO:", speechFilePath);

        const publicAudioUrl = await uploadAudioAndGetPublicUrl(speechFilePath);
        console.log("6. URL PÚBLICA DO ÁUDIO:", publicAudioUrl);

        const voiceSendResult = await sendWhatsappAudio({
          instanceId: connection.instanceId,
          instanceToken: connection.instanceToken,
          clientToken: resolvedClientToken,
          phone,
          audioUrl: publicAudioUrl,
        });

        console.log("7. RESULTADO ENVIO ÁUDIO Z-API:", voiceSendResult);

        if (voiceSendResult?.ok) {
          await prisma.message.create({
            data: {
              conversationId: conversation.id,
              fromMe: true,
              senderPhone: connection.phoneNumber || null,
              content: aiReply,
              messageType: "audio",
            },
          });

          console.log("8. RESPOSTA EM ÁUDIO SALVA NO BANCO");

          await updateConversationLeadSummary(conversation.id);

          console.log("=== WEBHOOK FINALIZADO COM SUCESSO (ÁUDIO) ===");

          return Response.json({
            ok: true,
            replyType: "audio",
          });
        }

        console.log("FALLBACK: envio de áudio falhou, tentando texto...");
      } catch (voiceError) {
        console.error("ERRO AO GERAR/ENVIAR VOZ:", voiceError);
        console.log("FALLBACK: erro na voz, tentando texto...");
      }
    }

    const sendResult = await sendWhatsappMessage({
      instanceId: connection.instanceId,
      instanceToken: connection.instanceToken,
      clientToken: resolvedClientToken,
      phone,
      message: aiReply,
    });

    console.log("9. RESULTADO ENVIO TEXTO Z-API:", sendResult);

    if (!sendResult?.ok) {
      console.log("ERRO: falha ao enviar mensagem para o WhatsApp");

      return Response.json(
        {
          ok: false,
          error: "Falha ao enviar mensagem para o WhatsApp",
          sendResult,
        },
        { status: 500 }
      );
    }

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        fromMe: true,
        senderPhone: connection.phoneNumber || null,
        content: aiReply,
        messageType: "text",
      },
    });

    console.log("10. MENSAGEM DE RESPOSTA SALVA NO BANCO");

    await updateConversationLeadSummary(conversation.id);

    console.log("=== WEBHOOK FINALIZADO COM SUCESSO (TEXTO) ===");

    return Response.json({
      ok: true,
      replyType: "text",
    });
  } catch (error) {
    console.error("Webhook WhatsApp error:", error);

    return Response.json(
      { ok: false, error: "Erro interno no webhook" },
      { status: 500 }
    );
  }
}