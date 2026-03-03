import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">ShopEase Demo</h1>
        <p className="text-gray-600 max-w-md">
          Demo-Projekt für eine automatisierte Teststrategie mit CI/CD-Pipeline-Integration.
          Repository-Pattern mit Stub-Implementierungen – keine externen Abhängigkeiten.
        </p>
      </div>

      <nav className="flex flex-wrap gap-4 justify-center">
        <Link href="/products" className="rounded bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700">
          Produkte ansehen
        </Link>
        <Link href="/login" className="rounded bg-gray-200 px-5 py-2.5 text-gray-800 font-medium hover:bg-gray-300">
          Anmelden
        </Link>
        <Link href="/register" className="rounded bg-gray-200 px-5 py-2.5 text-gray-800 font-medium hover:bg-gray-300">
          Registrieren
        </Link>
        <Link href="/orders" className="rounded bg-gray-200 px-5 py-2.5 text-gray-800 font-medium hover:bg-gray-300">
          Meine Bestellungen
        </Link>
        <Link href="/admin/products" className="rounded bg-gray-200 px-5 py-2.5 text-gray-800 font-medium hover:bg-gray-300">
          Admin: Produkte
        </Link>
      </nav>

      <div className="text-sm text-gray-500 max-w-sm text-center">
        <p>Testuser: <code>kunde@shopease.de</code></p>
        <p>Admin: <code>admin@shopease.de</code></p>
        <p>Passwort: <code>testpasswort123</code></p>
      </div>
    </main>
  );
}
