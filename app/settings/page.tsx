import { prisma } from "@/lib/prisma";
import { saveAiSettings } from "../actions";

export default async function SettingsPage() {
  const settings = await prisma.aiSettings.findFirst();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold">Configurações da IA</h1>

      <section className="rounded-2xl bg-white p-6 shadow">
        <form action={saveAiSettings} className="grid gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nome da empresa
            </label>
            <input
              name="companyName"
              defaultValue={settings?.companyName || ""}
              placeholder="Ex.: Intelli SDR"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none text-gray-900"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tom da conversa
            </label>
            <select
              name="tone"
              defaultValue={settings?.tone || "amigável"}
              className="w-full rounded-xl border border-gray-300 p-3 outline-none text-gray-900"
            >
              <option value="amigável">amigável</option>
              <option value="profissional">profissional</option>
              <option value="consultivo">consultivo</option>
              <option value="direto">direto</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Objetivo do SDR
            </label>
            <input
              name="goal"
              defaultValue={
                settings?.goal || "qualificar leads e encaminhar para closer"
              }
              className="w-full rounded-xl border border-gray-300 p-3 outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Instruções extras
            </label>
            <textarea
              name="extraInstructions"
              defaultValue={settings?.extraInstructions || ""}
              rows={6}
              placeholder="Ex.: nunca falar de forma robótica, usar frases curtas, perguntar orçamento sem parecer questionário..."
              className="w-full rounded-xl border border-gray-300 p-3 outline-none text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-black px-4 py-3 text-white hover:opacity-90"
          >
            Salvar configurações
          </button>
        </form>
      </section>
    </div>
  );
}