import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="min-h-screen w-64 border-r border-gray-200 bg-white p-6">
      <h2 className="mb-8 text-2xl font-bold text-gray-900">SDR IA</h2>

      <nav className="space-y-3">
        <Link
          href="/"
          className="block rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100"
        >
          Dashboard
        </Link>

        <Link
          href="/leads"
          className="block rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100"
        >
          Leads
        </Link>

        <Link
          href="/analytics"
          className="block rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100"
        >
          Analytics
        </Link>

        <Link
          href="/settings"
          className="block rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100"
          >
          Configurações
        </Link>
      </nav>
    </aside>
  );
}