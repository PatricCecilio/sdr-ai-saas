"use client";

import { useTransition } from "react";
import { generateAIMessage, createMessage } from "@/app/actions"; // Ajuste o caminho se necessário
import  PlanBadge  from "@/app/components/PlanBadge"; // O componente que corrigimos antes

interface Message {
  id: string;
  role: string;
  content: string;
}

export function ChatInterface({ leadId, messages, isPro }: { leadId: string, messages: Message[], isPro: boolean }) {
  const [isPending, startTransition] = useTransition();

  async function handleSendMessage(formData: FormData) {
    startTransition(async () => {
      // 1. Cria a mensagem do usuário no banco
      await createMessage(formData);
      
      // 2. Chama a IA para gerar a resposta
      const aiFormData = new FormData();
      aiFormData.append("leadId", leadId);
      await generateAIMessage(aiFormData);
    });
  }

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
        <h2 className="font-medium text-zinc-100">Atendimento IA</h2>
        <PlanBadge isPro={isPro} />
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === "user"
                ? "self-end bg-purple-600 text-white"
                : "self-start bg-zinc-800 text-zinc-100"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isPending && (
          <div className="self-start bg-zinc-800 text-zinc-400 px-4 py-2 rounded-2xl text-xs animate-pulse">
            IA está digitando...
          </div>
        )}
      </div>

      {/* Input */}
      <form action={handleSendMessage} className="p-4 border-t border-zinc-800 flex gap-2">
        <input type="hidden" name="leadId" value={leadId} />
        <input type="hidden" name="role" value="user" />
        <input
          name="content"
          placeholder="Digite uma mensagem para o lead..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}