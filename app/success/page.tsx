export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-10 text-center shadow-lg">
        <h1 className="mb-4 text-3xl font-bold">Pagamento realizado</h1>
        <p className="text-zinc-300">
          Sua assinatura foi enviada para processamento com sucesso.
        </p>
      </div>
    </div>
  );
}