"use client"

import { useTransition } from "react"
import { completeOnboarding } from "./actions"

export default function OnboardingAceitesPage() {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      await completeOnboarding(formData)
    })
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 p-8">

        <h1 className="text-2xl font-bold">Criar conta</h1>

        <p className="text-zinc-400 mt-2 text-sm">
          Antes de continuar, confirme que leu os documentos da plataforma.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="acceptedTerms"
              required
              className="mt-1"
            />
            <span>
              Eu li e concordo com os Termos de Uso
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="acceptedPrivacy"
              required
              className="mt-1"
            />
            <span>
              Eu aceito a Política de Privacidade
            </span>
          </label>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-white text-black font-semibold py-3 rounded-xl"
            >
              {isPending ? "Processando..." : "Continuar cadastro"}
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-3 rounded-xl border border-zinc-700"
            >
              Voltar
            </button>
          </div>

        </form>
      </div>
    </main>
  )
}