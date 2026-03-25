import { openai } from "@/lib/openai"

type ChatMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

export async function generateAiReply(messages: ChatMessage[]) {
  const systemPrompt = `
Você é um atendente virtual profissional de uma empresa.
Responda de forma curta, clara e útil.
Se o cliente perguntar preço, prazo ou algo que não exista no contexto, diga que um atendente humano pode confirmar.
Nunca invente informações.
Responda sempre em português do Brasil.
`.trim()

  const inputText = [
    { role: "system", content: systemPrompt },
    ...messages,
  ]
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n")

  const response = await openai.responses.create({
    model: "gpt-5.4",
    input: inputText,
  })

  return response.output_text?.trim() || "Desculpe, não consegui responder agora."
}