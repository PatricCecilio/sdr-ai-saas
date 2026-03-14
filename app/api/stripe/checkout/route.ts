import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    console.log("==== INICIANDO CHECKOUT STRIPE ====");

    const { userId } = await auth();

    console.log("UserId:", userId);

    if (!userId) {
      console.log("ERRO: usuário não está logado");

      return NextResponse.json(
        { error: "Você precisa estar logado para assinar." },
        { status: 401 }
      );
    }

    console.log("STRIPE_SECRET_KEY existe:", !!process.env.STRIPE_SECRET_KEY);
    console.log("STRIPE_PRICE_ID:", process.env.STRIPE_PRICE_ID);
    console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

    if (!process.env.STRIPE_PRICE_ID) {
      console.log("ERRO: STRIPE_PRICE_ID não configurado");

      return NextResponse.json(
        { error: "STRIPE_PRICE_ID não configurado." },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.log("ERRO: NEXT_PUBLIC_APP_URL não configurado");

      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL não configurado." },
        { status: 500 }
      );
    }

    console.log("Criando sessão do Stripe...");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId,
      },
    });

    console.log("Sessão criada com sucesso:", session.id);

    console.log("Salvando no banco com Prisma...");

    await prisma.userPlan.upsert({
      where: { userId },
      update: {
        stripeSessionId: session.id,
      },
      create: {
        userId,
        stripeSessionId: session.id,
        stripeStatus: "pending",
      },
    });

    console.log("Registro salvo no banco");

    console.log("Retornando URL do checkout:", session.url);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("ERRO AO CRIAR CHECKOUT DO STRIPE:");
    console.error(error);

    return NextResponse.json(
      { error: "Erro interno ao criar checkout." },
      { status: 500 }
    );
  }
}