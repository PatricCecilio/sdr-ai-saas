import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveWhatsappConnection } from "./actions";

export default async function WhatsappSettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const connection = await prisma.whatsappConnection.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm text-zinc-400">CONFIGURAÇÕES</p>
          <h1 className="mt-2 text-4xl font-bold">Conectar WhatsApp</h1>
          <p className="mt-2 text-zinc-400">
            Configure a conexão do WhatsApp para a IA responder automaticamente.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <form action={saveWhatsappConnection} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Instance ID
              </label>
              <input
                type="text"
                name="instanceId"
                defaultValue={connection?.instanceId ?? ""}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-fuchsia-500"
                placeholder="Digite o Instance ID"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Instance Token
              </label>
              <input
                type="text"
                name="instanceToken"
                defaultValue={connection?.instanceToken ?? ""}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-fuchsia-500"
                placeholder="Digite o Instance Token"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Client Token
              </label>
              <input
                type="text"
                name="clientToken"
                defaultValue={connection?.clientToken ?? ""}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-fuchsia-500"
                placeholder="Opcional"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Número do WhatsApp
              </label>
              <input
                type="text"
                name="phoneNumber"
                defaultValue={connection?.phoneNumber ?? ""}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-fuchsia-500"
                placeholder="Ex: 5541999999999"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Webhook Secret
              </label>
              <input
                type="text"
                name="webhookSecret"
                defaultValue={connection?.webhookSecret ?? ""}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-fuchsia-500"
                placeholder="Opcional"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-zinc-400">
                Status atual:{" "}
                <span className="font-medium text-white">
                  {connection?.status ?? "não conectado"}
                </span>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-fuchsia-600 px-5 py-3 font-medium transition hover:bg-fuchsia-500"
              >
                Salvar conexão
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-3 text-xl font-semibold">Webhook</h2>
          <p className="mb-2 text-sm text-zinc-400">
            Use esta URL no painel da Z-API:
          </p>
          <code className="block rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-fuchsia-400">
            https://seu-dominio.com/api/webhooks/whatsapp
          </code>
        </div>
      </div>
    </main>
  );
}