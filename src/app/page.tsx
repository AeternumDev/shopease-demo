import Link from "next/link";
import { ShoppingBag, Package, ClipboardList, ShieldCheck, LayoutDashboard } from "lucide-react";

const navItems = [
  {
    href: "/products",
    icon: Package,
    label: "Produkte",
    description: "Alle verfügbaren Produkte durchstöbern und in den Warenkorb legen.",
  },
  {
    href: "/orders",
    icon: ClipboardList,
    label: "Meine Bestellungen",
    description: "Den Status Ihrer aktuellen und vergangenen Bestellungen einsehen.",
  },
  {
    href: "/admin/performance",
    icon: LayoutDashboard,
    label: "Performance",
    description: "Umsatz, Bestellstatistiken und wichtige Kennzahlen auf einen Blick.",
  },
  {
    href: "/admin/products",
    icon: ShieldCheck,
    label: "Admin-Bereich",
    description: "Produkte verwalten, hinzufügen oder entfernen (Admin-Zugang erforderlich).",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="pt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white">
            <ShoppingBag size={20} className="text-zinc-800" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">ShopEase Demo</h1>
            <p className="text-xs text-zinc-400">v&#8239;0.1.0</p>
          </div>
        </div>
        <p className="max-w-xl text-zinc-600 leading-relaxed">
          Demo-Projekt für eine automatisierte Teststrategie mit CI/CD-Pipeline-Integration.
          Repository-Pattern mit Stub-Implementierungen – keine externen Abhängigkeiten.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            <Package size={15} />
            Produkte ansehen
          </Link>
          <Link
            href="/admin/performance"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <LayoutDashboard size={15} />
            Performance
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Anmelden
          </Link>
        </div>
      </section>

      {/* Navigation cards */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Bereiche</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {navItems.map(({ href, icon: Icon, label, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-zinc-500 group-hover:text-zinc-700 transition-colors" />
                <span className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-900">{label}</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Test credentials */}
      <section className="rounded-lg border border-zinc-100 bg-zinc-50 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Testdaten</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-zinc-500 text-xs mb-1">Kunde</p>
            <code className="block font-mono text-xs bg-white border border-zinc-200 rounded px-2 py-1.5 text-zinc-700">
              kunde@shopease.de
            </code>
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-1">Admin</p>
            <code className="block font-mono text-xs bg-white border border-zinc-200 rounded px-2 py-1.5 text-zinc-700">
              admin@shopease.de
            </code>
          </div>
          <div className="sm:col-span-2">
            <p className="text-zinc-500 text-xs mb-1">Passwort (beide Konten)</p>
            <code className="block font-mono text-xs bg-white border border-zinc-200 rounded px-2 py-1.5 text-zinc-700">
              testpasswort123
            </code>
          </div>
        </div>
      </section>
    </div>
  );
}

