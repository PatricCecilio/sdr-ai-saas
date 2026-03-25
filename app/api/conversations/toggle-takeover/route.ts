import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const conversationId = String(formData.get("conversationId") || "");
    const currentValue = String(formData.get("currentValue") || "false");

    if (!conversationId) {
      return new Response("conversationId ausente", { status: 400 });
    }

    const nextValue = currentValue !== "true";

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        humanTakeover: nextValue,
      },
    });

    return Response.redirect(
      new URL(`/dashboard/conversations/${conversationId}`, req.url),
      303
    );
  } catch (error) {
    console.error("toggle takeover error:", error);
    return new Response("Erro interno", { status: 500 });
  }
}