import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return new NextResponse("Missing stripe-signature header", {
        status: 400,
      });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", {
        status: 500,
      });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Stripe webhook event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const customerId =
        typeof session.customer === "string" ? session.customer : null;
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;

      if (!userId) {
        console.error("Webhook sem userId no metadata");
        return NextResponse.json({ received: true });
      }

      let stripePriceId: string | null = null;
      let stripeStatus = "active";

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        stripeStatus = subscription.status;

        const firstItem = subscription.items.data[0];
        stripePriceId = firstItem?.price?.id ?? null;
      }

      await prisma.userPlan.upsert({
        where: { userId },
        update: {
          stripeCustomerId: customerId,
          stripePriceId,
          stripeStatus,
        },
        create: {
          userId,
          stripeCustomerId: customerId,
          stripePriceId,
          stripeStatus,
        },
      });

      console.log("Plano atualizado para usuário:", userId);
    }

    if (
      event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : null;

      if (!customerId) {
        return NextResponse.json({ received: true });
      }

      const firstItem = subscription.items.data[0];
      const stripePriceId = firstItem?.price?.id ?? null;
      const stripeStatus = subscription.status;

      await prisma.userPlan.updateMany({
        where: {
          stripeCustomerId: customerId,
        },
        data: {
          stripePriceId,
          stripeStatus,
        },
      });

      console.log("Assinatura sincronizada:", customerId, stripeStatus);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook Stripe:", error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}