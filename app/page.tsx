import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getCurrentUserPlan } from "@/lib/subscription";

export default async function HomePage() {
 const { userId } = await auth();

  if (!userId) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold">Painel SDR IA</h1>
        <p className="mt-2 text-gray-500">Faça login para acessar o sistema.</p>
      </div>
    );
  }

const { isPro, plan } = await getCurrentUserPlan();

  const leads = await prisma.lead.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-10 space-y-6">
      <div className="mb-6 rounded-2xl border border-white/10 bg-zinc-900 p-5 text-white shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Plano atual</p>
            <h2 className="text-2xl font-bold">{isPro ? "PRO" : "FREE"}</h2>
            <p className="text-sm text-zinc-400">
              Status: {plan?.stripeStatus ?? "sem assinatura"}
            </p>
          </div>

          {!isPro && (
            <Link
              href="/pricing"
              className="rounded-lg bg-purple-600 px-5 py-3 text-white hover:opacity-90"
            >
              Fazer upgrade
            </Link>
          )}
        </div>
      </div>

      <h1 className="text-2xl font-bold">Leads</h1>

      <Link
        href="/leads/new"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Novo Lead
      </Link>

      <div className="space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="p-4 border rounded flex justify-between"
          >
            <div>
              <p className="font-bold">{lead.name}</p>
              <p className="text-sm text-gray-500">{lead.company}</p>
            </div>

            <Link
              href={`/conversation?id=${lead.id}`}
              className="text-blue-600"
            >
              Conversar
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}