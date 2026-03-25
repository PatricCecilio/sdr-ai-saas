import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const conversationId = String(formData.get("conversationId") || "");
    const temperature = String(formData.get("temperature") || "");

    if (!conversationId) {
      return new Response("conversationId ausente", { status: 400 });
    }

    const allowedTemperatures = ["hot", "warm", "cold", "null"];

    if (!allowedTemperatures.includes(temperature)) {
      return new Response("temperature inválida", { status: 400 });
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        leadTemperature: temperature === "null" ? null : temperature,
      },
    });

    return Response.redirect(
      new URL(`/dashboard/conversations/${conversationId}`, req.url),
      303
    );
  } catch (error) {
    console.error("set temperature error:", error);
    return new Response("Erro interno", { status: 500 });
  }
}