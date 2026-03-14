import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserPlan } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { isPro } = await getCurrentUserPlan();

  if (!isPro) {
    redirect("/upgrade");
  }

  const leads = await prisma.lead.findMany({
    where: {
      userId,
    },
  });

  const total = leads.length;
  const quentes = leads.filter((l) => l.handoffStatus === "PRONTO_CLOSER").length;
  const mornos = leads.filter((l) => l.leadTemperature === "morno").length;
  const frios = leads.filter((l) => l.leadTemperature === "frio").length;
  const novos = leads.filter((l) => l.status === "NOVO").length;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-8 text-3xl font-bold">Analytics</h1>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>

        <div className="rounded-xl bg-red-100 p-4">
          <p className="text-sm text-red-700">Quentes</p>
          <p className="text-2xl font-bold">{quentes}</p>
        </div>

        <div className="rounded-xl bg-yellow-100 p-4">
          <p className="text-sm text-yellow-700">Mornos</p>
          <p className="text-2xl font-bold">{mornos}</p>
        </div>

        <div className="rounded-xl bg-blue-100 p-4">
          <p className="text-sm text-blue-700">Frios</p>
          <p className="text-2xl font-bold">{frios}</p>
        </div>

        <div className="rounded-xl bg-green-100 p-4">
          <p className="text-sm text-green-700">Novos</p>
          <p className="text-2xl font-bold">{novos}</p>
        </div>
      </div>
    </div>
  );
}