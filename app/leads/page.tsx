import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LeadStatusForm from "../components/LeadStatusForm";

type LeadsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    temp?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const { q, status, temp } = await searchParams;

  const search = q?.trim() || "";
  const selectedStatus = status || "TODOS";
  const selectedTemp = temp || "TODOS";

  const leads = await prisma.lead.findMany({
    where: {
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                phone: {
                  contains: search,
                },
              },
            ],
          }
        : {}),
      ...(selectedStatus !== "TODOS"
        ? {
            status: selectedStatus,
          }
        : {}),
      ...(selectedTemp !== "TODOS"
        ? {
            leadTemperature: selectedTemp,
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestão completa dos leads do SDR IA
          </p>
        </div>

        <Link
          href="/"
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Voltar ao dashboard
        </Link>
      </div>

      <section className="mb-8 rounded-2xl bg-white p-6 shadow">
        <form method="GET" className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Buscar por nome ou telefone"
            className="rounded-xl border border-gray-300 p-3 outline-none text-gray-900 placeholder-gray-500 md:col-span-2"
          />

          <select
            name="status"
            defaultValue={selectedStatus}
            className="rounded-xl border border-gray-300 p-3 outline-none text-gray-900"
          >
            <option value="TODOS">Todos os status</option>
            <option value="NOVO">NOVO</option>
            <option value="CONTATO_FEITO">CONTATO_FEITO</option>
            <option value="NEGOCIANDO">NEGOCIANDO</option>
            <option value="FECHADO">FECHADO</option>
          </select>

          <select
            name="temp"
            defaultValue={selectedTemp}
            className="rounded-xl border border-gray-300 p-3 outline-none text-gray-900"
          >
            <option value="TODOS">Todas temperaturas</option>
            <option value="frio">frio</option>
            <option value="morno">morno</option>
            <option value="quente">quente</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-black px-4 py-3 text-white hover:opacity-90"
          >
            Filtrar
          </button>

          <Link
            href="/leads"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-center text-gray-700 hover:bg-gray-50"
          >
            Limpar filtros
          </Link>
        </form>
      </section>

      <section className="mb-4">
        <p className="text-sm text-gray-500">
          {leads.length} lead(s) encontrado(s)
        </p>
      </section>

      <section className="grid gap-4">
        {leads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-gray-500">
            Nenhum lead encontrado com esses filtros.
          </div>
        ) : (
          leads.map((lead: any) => (
            <div
              key={lead.id}
              className="rounded-2xl bg-white p-5 shadow"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {lead.name}
                    </p>

                    {lead.leadTemperature && (
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          lead.leadTemperature === "quente"
                            ? "bg-red-100 text-red-700"
                            : lead.leadTemperature === "morno"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
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
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
                        HUMANO
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📱 {lead.phone || "Não informado"}</p>
                    <p>📧 {lead.email || "Não informado"}</p>
                    <p>🏢 {lead.company || "Não informada"}</p>
                    <p>📌 Status: {lead.status}</p>
                    <p>
                      🎯 Interesse: {lead.mainInterest || "não identificado"}
                    </p>
                    <p>
                      🧠 Resumo: {lead.qualifiedSummary || "sem resumo"}
                    </p>
                  </div>

                  <LeadStatusForm
                    leadId={lead.id}
                    currentStatus={lead.status}
                  />
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/conversation?id=${lead.id}`}
                    className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90"
                  >
                    Abrir conversa
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}