"use client";

export default function ManageSubscriptionButton() {
  const handleManageSubscription = async () => {
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await res.json();

      console.log("PORTAL response:", data);

      if (!res.ok) {
        alert(data.error || "Erro ao abrir portal");
        return;
      }

      if (!data.url) {
        alert("Portal não retornou URL.");
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Erro inesperado no botão do portal:", error);
      alert("Erro inesperado ao abrir portal.");
    }
  };

  return (
    <button
      onClick={handleManageSubscription}
      className="rounded-lg border border-white/20 px-5 py-3 text-white hover:bg-white/5"
    >
      Gerenciar assinatura
    </button>
  );
}