import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createMessage, assumeHumanService, returnLeadToAI } from "@/app/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ConversationPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { userId } = await auth();
  const params = await searchParams;
  const id = params.id;

  if (!userId || !id) redirect("/");

  const lead = await prisma.lead.findUnique({
    where: { id, userId },
    include: { messages: { orderBy: { createdAt: "asc" } } }
  });

  if (!lead) redirect("/");

  const isHumanService = lead.handoffStatus === "EM_ATENDIMENTO_HUMANO";

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-200 font-sans">
      {/* Coluna de Informações do Lead */}
      <aside className="w-80 border-r border-white/5 bg-zinc-900/10 p-6 hidden xl:flex flex-col">
        <div className="mb-8">
          <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
            ← Voltar ao Dashboard
          </Link>
        </div>

        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6">Perfil do Lead</h2>
        
        <div className="space-y-6">
          <div className="group">
            <label className="text-[10px] text-zinc-600 uppercase font-bold">Nome Completo</label>
            <p className="text-sm font-medium mt-1 group-hover:text-purple-400 transition-colors">{lead.name}</p>
          </div>

          <div>
            <label className="text-[10px] text-zinc-600 uppercase font-bold">Status do Funil</label>
            <div className="mt-2">
              <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-1 text-[10px] font-bold text-purple-400 border border-purple-500/20">
                {lead.status}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-600 uppercase font-bold">Qualificação IA</label>
            <div className="mt-2 p-3 rounded-xl bg-zinc-900/50 border border-white/5">
              <p className="text-[11px] leading-relaxed text-zinc-400 italic">
                {lead.leadTemperature === 'HOT' 
                  ? "🔥 Lead altamente qualificado pela IA. Pronto para fechamento." 
                  : "🧊 Em fase de nutrição inicial."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
           <p className="text-[10px] text-zinc-700 text-center">ID: {lead.id}</p>
        </div>
      </aside>

      {/* Área Principal do Chat */}
      <main className="flex flex-1 flex-col relative">
        {/* Header de Controle */}
        <header className="flex items-center justify-between border-b border-white/5 px-6 py-4 bg-zinc-900/20 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">{lead.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`h-1.5 w-1.5 rounded-full ${isHumanService ? 'bg-orange-500' : 'bg-green-500 animate-pulse'}`} />
                <span className="text-[10px] font-medium text-zinc-500">
                  {isHumanService ? "Atendimento Humano" : "SDR IA Ativo"}
                </span>
              </div>
            </div>
          </div>

          <form action={isHumanService ? returnLeadToAI : assumeHumanService}>
            <input type="hidden" name="leadId" value={lead.id} />
            <button className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 border ${
              isHumanService 
              ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700" 
              : "bg-purple-600/10 border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white"
            }`}>
              {isHumanService ? "Ativar Automação IA" : "Assumir Conversa"}
            </button>
          </form>
        </header>

        {/* Scroll de Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {lead.messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <div className="p-4 rounded-full bg-zinc-900 border border-white/5">💬</div>
              <p className="text-xs font-medium">Nenhuma mensagem trocada ainda.</p>
            </div>
          )}
          
          {lead.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`group relative max-w-[75%] px-4 py-3 text-sm leading-relaxed shadow-2xl transition-all ${
                msg.role === 'user' 
                ? 'bg-zinc-900 border border-white/5 text-zinc-300 rounded-2xl rounded-tl-none' 
                : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl rounded-tr-none'
              }`}>
                {msg.content}
                <span className="absolute -bottom-5 right-0 text-[9px] text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé de Envio */}
        <footer className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-4xl mx-auto">
            <form action={createMessage} className="relative flex items-center">
              <input type="hidden" name="leadId" value={lead.id} />
              <input type="hidden" name="role" value="user" />
              <input 
                name="content"
                autoComplete="off"
                placeholder={isHumanService ? "Escreva sua resposta..." : "Pause a IA para responder manualmente..."}
                disabled={!isHumanService}
                className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl pl-5 pr-28 py-4 text-sm outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all disabled:cursor-not-allowed disabled:opacity-30"
              />
              <div className="absolute right-2 flex gap-2">
                <button 
                  disabled={!isHumanService}
                  className="bg-white text-black px-5 py-2 rounded-xl text-xs font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-0"
                >
                  ENVIAR
                </button>
              </div>
            </form>
            <p className="mt-3 text-[10px] text-zinc-600 text-center font-medium tracking-wide">
              {isHumanService 
                ? "MODO MANUAL: Suas mensagens serão enviadas diretamente ao lead." 
                : "MODO AUTOMÁTICO: A IA está processando as interações com base nas suas configurações."}
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}