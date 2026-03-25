import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveCompanySettings } from "./actions";

export default async function WhatsappSettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Configurações da Empresa (IA)
          </h1>
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            Não foi possível identificar o e-mail do usuário autenticado.
          </div>
        </div>
      </main>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!dbUser) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Configurações da Empresa (IA)
          </h1>
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            Usuário não encontrado no banco de dados.
          </div>
        </div>
      </main>
    );
  }

  const connection = await prisma.whatsappConnection.findFirst({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  if (!connection) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Configurações da Empresa (IA)
          </h1>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200">
            Nenhuma conexão de WhatsApp encontrada para este usuário.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Configurações da Empresa (IA)
        </h1>

        <p className="text-xs text-zinc-500 mb-6">
          Connection ID: {connection.id}
        </p>

        <form action={saveCompanySettings} className="space-y-6">
          <input type="hidden" name="connectionId" value={connection.id} />

          <Input
            label="Nome da empresa"
            name="companyName"
            defaultValue={connection.companyName}
          />

          <Input
            label="Segmento"
            name="companySegment"
            defaultValue={connection.companySegment}
          />

          <Input
            label="Cidade"
            name="companyCity"
            defaultValue={connection.companyCity}
          />

          <Input
            label="Website"
            name="companyWebsite"
            defaultValue={connection.companyWebsite}
          />

          <Input
            label="Instagram"
            name="companyInstagram"
            defaultValue={connection.companyInstagram}
          />

          <Textarea
            label="Descrição da empresa"
            name="companyDescription"
            defaultValue={connection.companyDescription}
          />

          <Textarea
            label="Serviços / Produtos"
            name="companyServices"
            defaultValue={connection.companyServices}
          />

          <Textarea
            label="Diferenciais"
            name="companyDifferentials"
            defaultValue={connection.companyDifferentials}
          />

          <Textarea
            label="Tom de voz (ex: moderno, profissional, descontraído)"
            name="companyToneOfVoice"
            defaultValue={connection.companyToneOfVoice}
          />
          <Textarea
            label="Instruções para IA"
            name="companyInstructions"
            defaultValue={connection.companyInstructions}
          />

          <button className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg font-medium">
            Salvar configurações
          </button>
        </form>
      </div>
    </main>
  );
}

function Input({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <div>
      <label className="text-sm text-zinc-400">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue || ""}
        className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm"
      />
    </div>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <div>
      <label className="text-sm text-zinc-400">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue || ""}
        rows={4}
        className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm"
      />
    </div>
  );
}