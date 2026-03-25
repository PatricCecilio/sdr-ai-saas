import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const userPlan = await prisma.userPlan.findUnique({
      where: { userId },
    });

    if (!userPlan?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Cliente Stripe não encontrado no banco." },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.billingPortal.sessions.create({
      customer: userPlan.stripeCustomerId,
      return_url: `${appUrl}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao abrir portal Stripe:", error);

    return NextResponse.json(
      { error: "Erro ao abrir portal Stripe." },
      { status: 500 }
    );
  }
}