import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateLead } from "@/app/actions";

type EditPageProps = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export default async function EditPage({ searchParams }: EditPageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Lead não encontrado
          </h1>

          <p className="mb-6 text-gray-700">ID recebido: {id}</p>

          <Link
            href="/"
            className="rounded-xl bg-black px-4 py-2 text-white"
          >
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Editar Lead</h1>

          <Link
            href="/"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Voltar
          </Link>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow">
          <form action={updateLead} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="id" value={lead.id} />

            <input
              name="name"
              defaultValue={lead.name}
              placeholder="Nome"
              className="rounded-xl border border-gray-300 p-3 outline-none text-gray-900 placeholder-gray-500 focus:border-black"
              required
            />

            <input
              name="email"
              type="email"
              defaultValue={lead.email ?? ""}
              placeholder="Email"
              className="rounded-xl border border-gray-300 p-3 outline-none text-gray-900 placeholder-gray-500 focus:border-black"
            />

            <input
              name="phone"
              defaultValue={lead.phone ?? ""}
              placeholder="Telefone"
              className="rounded-xl border border-gray-300 p-3 outline-none text-gray-900 placeholder-gray-500 focus:border-black"
            />

            <input
              name="company"
              defaultValue={lead.company ?? ""}
              placeholder="Empresa"
              className="rounded-xl border border-gray-300 p-3 outline-none text-gray-900 placeholder-gray-500 focus:border-black"
            />

            <select
              name="status"
              defaultValue={lead.status}
              className="rounded-xl border border-gray-300 p-3 outline-none text-gray-900 md:col-span-2 focus:border-black"
            >
              <option value="NOVO">NOVO</option>
              <option value="CONTATO_FEITO">CONTATO_FEITO</option>
              <option value="NEGOCIANDO">NEGOCIANDO</option>
              <option value="FECHADO">FECHADO</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-3 text-white transition hover:opacity-90 md:col-span-2"
            >
              Salvar alterações
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}