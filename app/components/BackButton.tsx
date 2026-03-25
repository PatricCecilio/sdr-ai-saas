"use client"

import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()

  return (
    <div className="flex w-full items-center justify-between">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.08]"
      >
        ← Voltar
      </button>

      <a
        href="/"
        className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.08]"
      >
        Início
      </a>
    </div>
  )
}