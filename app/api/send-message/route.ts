import { prisma } from "@/lib/prisma";
import { sendWhatsappMessage } from "@/lib/whatsapp";

export async function POST(req: Request) {
  const formData = await req.formData();

  const conversationId = String(formData.get("conversationId"));
  const message = String(formData.get("message"));

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { connection: true },
  });

  if (!conversation) {
    return new Response("Conversation not found", { status: 404 });
  }

  await prisma.message.create({
    data: {
      conversationId,
      content: message,
      role: "assistant",
      messageType: "text",
      fromMe: true,
    },
  });

  if (conversation.contactPhone) {
    await sendWhatsappMessage({
      instanceId: conversation.connection.instanceId,
      instanceToken: conversation.connection.instanceToken,
      clientToken: conversation.connection.clientToken || undefined,
      phone: conversation.contactPhone,
      message,
    });
  }

  return Response.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/conversations/${conversationId}`
  );
}