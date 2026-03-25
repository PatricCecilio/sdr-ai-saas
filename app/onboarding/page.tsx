import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { completeOnboarding } from "./actions"

export default async function OnboardingPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      termsAcceptedAt: true,
      privacyAcceptedAt: true,
    },
  })

  if (user?.termsAcceptedAt && user?.privacyAcceptedAt) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mt-3">
          Antes de começar, confirme seu acesso
        </h1>

        <form action={completeOnboarding}>
            <div className="mt-10 space-y-6">

                <label className="flex items-start gap-3">
                <input
                    type="checkbox"
                    name="acceptedTerms"
                    required
                />
                <span>Li e aceito os Termos de Uso</span>
                </label>

                <label className="flex items-start gap-3">
                <input
                    type="checkbox"
                    name="acceptedPrivacy"
                    required
                />
                <span>Li e aceito a Política de Privacidade</span>
                </label>

                <button
                type="submit"
                className="bg-white text-black px-6 py-3 rounded-xl"
                >
                Continuar cadastro
                </button>

            </div>
        </form>
      </div>
    </main>
  )
}