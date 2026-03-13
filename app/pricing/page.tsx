"use client";

export default function PricingPage() {

  const handleCheckout = async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    });

    const data = await res.json();

    window.location.href = data.url;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10">

      <h1 className="text-4xl font-bold">
        Plano Pro
      </h1>

      <div className="border rounded-xl p-10 shadow-lg flex flex-col gap-5">

        <h2 className="text-2xl font-bold">$29 / mês</h2>

        <ul className="text-gray-600 space-y-2">
          <li>✔ IA ilimitada</li>
          <li>✔ CRM completo</li>
          <li>✔ Analytics</li>
          <li>✔ Integração WhatsApp</li>
        </ul>

        <button
          onClick={handleCheckout}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg"
        >
          Assinar
        </button>

      </div>

    </div>
  );
}