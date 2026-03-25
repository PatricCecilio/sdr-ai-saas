"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function createCheckoutSession() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      stripeCustomerId: true,
    },
  })

  if (!user || !user.email) {
    throw new Error("Usuário não encontrado ou sem e-mail.")
  }

  let customerId = user.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id,
      },
    })

    customerId = customer.id

    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeCustomerId: customerId,
      },
    })
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade`,
    metadata: {
      userId: user.id,
    },
  })

  if (!session.url) {
    throw new Error("Não foi possível criar a sessão de checkout.")
  }

  redirect(session.url)
}