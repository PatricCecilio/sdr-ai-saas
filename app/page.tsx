import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LeadStatusForm from "./components/LeadStatusForm";

function getTemperatureBadge(temp?: string | null) {
  if (temp === "quente") return "bg-red-100 text-red-700 border-red-200";
  if (temp === "morno") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
}

export default async function Home() {
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const hotLeads = leads.filter(
    (lead: any) => lead.handoffStatus === "PRONTO_CLOSER"
  );

  const humanLeads = leads.filter(
    (lead: any) => lead.handoffStatus === "EM_ATENDIMENTO_HUMANO"
  );

  const warmLeads = leads.filter(
    (lead: any) =>
      lead.leadTemperature === "morno" &&
      lead.handoffStatus !== "PRONTO_CLOSER" &&
      lead.handoffStatus !== "EM_ATENDIMENTO_HUMANO"
  );

  const newLeads = leads.filter(
    (lead: any) =>
      lead.status === "NOVO" &&
      lead.handoffStatus !== "PRONTO_CLOSER" &&
      lead.handoffStatus !== "EM_ATENDIMENTO_HUMANO"
  );

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-8 text-3xl font-bold">Painel SDR IA</h1>

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-2xl font-bold">{leads.length}</p>
        </div>

        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 shadow">
          <p className="text-sm text-red-700">Leads Quentes</p>
          <p className="text-2xl font-bold">{hotLeads.length}</p>
        </div>

        <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4 shadow">
          <p className="text-sm text-purple-700">Humano</p>
          <p className="text-2xl font-bold">{humanLeads.length}</p>
        </div>

        <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 shadow">
          <p className="text-sm text-yellow-700">Mornos</p>
          <p className="text-2xl font-bold">{warmLeads.length}</p>
        </div>

        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 shadow">
          <p className="text-sm text-blue-700">Novos</p>
          <p className="text-2xl font-bold">{newLeads.length}</p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Leads</h2>
        <Link
          href="/leads"
          className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90"
        >
          Ver todos
        </Link>
      </div>

      <div className="grid gap-6">
        {leads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-gray-500">
            Nenhum lead encontrado.
          </div>
        ) : (
          leads.map((lead: any) => (
            <div
              key={lead.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{lead.name}</h3>

                    {lead.leadTemperature && (
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-semibold ${getTemperatureBadge(
                          lead.leadTemperature
                        )}`}
                      >
                        {lead.leadTemperature}
                      </span>
                    )}

                    {lead.handoffStatus === "PRONTO_CLOSER" && (
                      <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                        PRONTO_CLOSER
                      </span>
                    )}

                    {lead.handoffStatus === "EM_ATENDIMENTO_HUMANO" && (
                      <span className="rounded-full bg-purple-600 px-2 py-1 text-xs font-bold text-white">
                        HUMANO
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600">
                    {lead.company && <p>Empresa: {lead.company}</p>}
                    {lead.email && <p>Email: {lead.email}</p>}
                    {lead.phone && <p>Telefone: {lead.phone}</p>}
                    {lead.status && <p>Status: {lead.status}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[220px]">
                  <LeadStatusForm leadId={lead.id} currentStatus={lead.status} />

                  <Link
                    href={`/conversation?leadId=${lead.id}`}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white hover:opacity-90"
                  >
                    Abrir conversa
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}