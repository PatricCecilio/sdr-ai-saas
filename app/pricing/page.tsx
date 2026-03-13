"use client";

export default function PricingPage() {
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao iniciar checkout");
        console.error("Stripe checkout error:", data);
        return;
      }

      if (!data.url) {
        alert("A URL do checkout não foi retornada.");
        console.error("Checkout sem url:", data);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Erro inesperado ao iniciar checkout.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10">
      <h1 className="text-4xl font-bold">Plano Pro</h1>

      <div className="flex flex-col gap-5 rounded-xl border p-10 shadow-lg">
        <h2 className="text-2xl font-bold">$29 / mês</h2>

        <ul className="space-y-2 text-gray-600">
          <li>✔ IA ilimitada</li>
          <li>✔ CRM completo</li>
          <li>✔ Analytics</li>
          <li>✔ Integração WhatsApp</li>
        </ul>

        <button
          onClick={handleCheckout}
          className="rounded-lg bg-purple-600 px-6 py-3 text-white"
        >
          Assinar
        </button>
      </div>
    </div>
  );
}