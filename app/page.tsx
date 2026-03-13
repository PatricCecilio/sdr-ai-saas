import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="p-10">
        <h1 className="text-xl font-bold">Usuário não autenticado</h1>
      </div>
    );
  }

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