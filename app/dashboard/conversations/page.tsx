import Link from "next/link";
import { prisma } from "@/lib/prisma";

function getTemperatureBadge(temperature: string | null) {
  if (temperature === "hot") {
    return "bg-red-500/15 text-red-300 border-red-500/30";
  }

  if (temperature === "warm") {
    return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
  }

  if (temperature === "cold") {
    return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  }

  return "bg-zinc-800 text-zinc-300 border-zinc-700";
}

function getTemperatureLabel(temperature: string | null) {
  if (temperature === "hot") return "Hot";
  if (temperature === "warm") return "Warm";
  if (temperature === "cold") return "Cold";
  return "Sem classificação";
}

function getModeBadge(humanTakeover: boolean) {
  return humanTakeover
    ? "bg-orange-500/15 text-orange-300 border-orange-500/30"
    : "bg-purple-500/15 text-purple-300 border-purple-500/30";
}

function getModeLabel(humanTakeover: boolean) {
  return humanTakeover ? "Humano" : "IA";
}

function getTemperatureWeight(temperature: string | null) {
  if (temperature === "hot") return 3;
  if (temperature === "warm") return 2;
  if (temperature === "cold") return 1;
  return 0;
}

type SearchParams = Promise<{
  filter?: string;
  q?: string;
}>;

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { filter, q } = await searchParams;

  const conversations = await prisma.conversation.findMany({
    orderBy: {
      lastMessageAt: "desc",
    },
  });

  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.humanTakeover !== b.humanTakeover) {
      return a.humanTakeover ? -1 : 1;
    }

    const tempDiff =
      getTemperatureWeight(b.leadTemperature) -
      getTemperatureWeight(a.leadTemperature);

    if (tempDiff !== 0) {
      return tempDiff;
    }

    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;

    return bTime - aTime;
  });

  const humanCount = sortedConversations.filter((c) => c.humanTakeover).length;
  const hotCount = sortedConversations.filter(
    (c) => c.leadTemperature === "hot"
  ).length;
  const unclassifiedCount = sortedConversations.filter(
    (c) => !c.leadTemperature
  ).length;

  const filteredByStatus = sortedConversations.filter((c) => {
    switch (filter) {
      case "human":
        return c.humanTakeover;
      case "ai":
        return !c.humanTakeover;
      case "hot":
        return c.leadTemperature === "hot";
      case "warm":
        return c.leadTemperature === "warm";
      case "cold":
        return c.leadTemperature === "cold";
      case "unclassified":
        return !c.leadTemperature;
      default:
        return true;
    }
  });

  const query = (q || "").trim().toLowerCase();

  const filteredConversations = filteredByStatus.filter((c) => {
    if (!query) return true;

    const searchable = [
      c.leadName || "",
      c.companyName || "",
      c.contactPhone || "",
      c.summary || "",
      c.interest || "",
      c.objective || "",
      c.nextStep || "",
      c.website || "",
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });

  const filters = [
    { key: "all", label: "Todos", href: q ? `/dashboard/conversations?q=${encodeURIComponent(q)}` : "/dashboard/conversations" },
    {
      key: "human",
      label: "Humanos",
      href: q
        ? `/dashboard/conversations?filter=human&q=${encodeURIComponent(q)}`
        : "/dashboard/conversations?filter=human",
    },
    {
      key: "ai",
      label: "IA",
      href: q
        ? `/dashboard/conversations?filter=ai&q=${encodeURIComponent(q)}`
        : "/dashboard/conversations?filter=ai",
    },
    {
      key: "hot",
      label: "Hot",
      href: q
        ? `/dashboard/conversations?filter=hot&q=${encodeURIComponent(q)}`
        : "/dashboard/conversations?filter=hot",
    },
    {
      key: "warm",
      label: "Warm",
      href: q
        ? `/dashboard/conversations?filter=warm&q=${encodeURIComponent(q)}`
        : "/dashboard/conversations?filter=warm",
    },
    {
      key: "cold",
      label: "Cold",
      href: q
        ? `/dashboard/conversations?filter=cold&q=${encodeURIComponent(q)}`
        : "/dashboard/conversations?filter=cold",
    },
    {
      key: "unclassified",
      label: "Sem classificação",
      href: q
        ? `/dashboard/conversations?filter=unclassified&q=${encodeURIComponent(q)}`
        : "/dashboard/conversations?filter=unclassified",
    },
  ];

  const activeFilter = filter || "all";

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm text-zinc-400">CRM / Inbox</p>
          <h1 className="text-3xl font-bold mt-2">Conversas</h1>
          <p className="text-zinc-400 mt-2">
            Leads atendidos pela IA no WhatsApp com resumo comercial automático.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Humanos ativos</p>
            <p className="text-3xl font-bold text-orange-300 mt-2">
              {humanCount}
            </p>
            <p className="text-sm text-zinc-400 mt-2">
              Conversas assumidas manualmente
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Leads hot</p>
            <p className="text-3xl font-bold text-red-300 mt-2">{hotCount}</p>
            <p className="text-sm text-zinc-400 mt-2">
              Leads com maior prioridade comercial
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">Sem classificação</p>
            <p className="text-3xl font-bold text-zinc-300 mt-2">
              {unclassifiedCount}
            </p>
            <p className="text-sm text-zinc-400 mt-2">
              Conversas que ainda precisam de mais contexto
            </p>
          </div>
        </div>

        <form
          action="/dashboard/conversations"
          method="GET"
          className="mb-6 flex flex-col md:flex-row gap-3"
        >
          {filter && filter !== "all" ? (
            <input type="hidden" name="filter" value={filter} />
          ) : null}

          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Buscar por nome, empresa, telefone, site..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            className="rounded-xl bg-purple-600 hover:bg-purple-700 transition px-5 py-3 text-sm font-medium"
          >
            Buscar
          </button>

          {(q || filter) && (
            <Link
              href="/dashboard/conversations"
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-900 transition text-center"
            >
              Limpar
            </Link>
          )}
        </form>

        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((item) => {
            const isActive = activeFilter === item.key;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="space-y-4">
          {filteredConversations.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-400">
              Nenhuma conversa encontrada para essa busca ou filtro.
            </div>
          ) : (
            filteredConversations.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/conversations/${c.id}`}
                className="block rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:border-purple-500/40 hover:bg-zinc-900 transition"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div>
                      <p className="text-lg font-semibold">
                        {c.leadName || "Lead desconhecido"}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {c.companyName || "Empresa não informada"}
                      </p>
                    </div>

                    <p className="text-sm text-zinc-500">{c.contactPhone}</p>

                    <p className="text-sm text-zinc-300 line-clamp-2">
                      {c.summary || "Sem resumo ainda"}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3 min-w-[220px]">
                    <div className="flex flex-wrap gap-2">
                      <div
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getModeBadge(
                          c.humanTakeover
                        )}`}
                      >
                        {getModeLabel(c.humanTakeover)}
                      </div>

                      <div
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getTemperatureBadge(
                          c.leadTemperature
                        )}`}
                      >
                        {getTemperatureLabel(c.leadTemperature)}
                      </div>
                    </div>

                    <div className="text-sm text-zinc-400 text-left md:text-right">
                      <p>
                        <span className="text-zinc-500">Interesse:</span>{" "}
                        {c.interest || "-"}
                      </p>
                      <p>
                        <span className="text-zinc-500">Objetivo:</span>{" "}
                        {c.objective || "-"}
                      </p>
                      <p>
                        <span className="text-zinc-500">Próximo passo:</span>{" "}
                        {c.nextStep || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}