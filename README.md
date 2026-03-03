# ShopEase Demo

Proof-of-Concept für eine automatisierte Teststrategie mit CI/CD-Pipeline-Integration, entwickelt mit Next.js 16+ und dem App Router.

## Architektur

Das Projekt setzt auf das **Repository-Pattern** mit **Stub-Implementierungen**. Sämtliche Datenzugriffe und Authentifizierungsoperationen laufen über TypeScript-Interfaces. Die Stubs implementieren diese Interfaces mit lokalen In-Memory-Daten – keine externen Abhängigkeiten, keine Datenbank, keine `.env`-Datei erforderlich.

```
IAuthService        → AuthServiceStub        (In-Memory-Testnutzer)
IProductRepository  → ProductRepositoryStub  (lokale Seed-Daten)
IOrderRepository    → OrderRepositoryStub    (In-Memory-Bestellungen)
```

**Routenschutz:** In Next.js 16 wurde `middleware.ts` durch `proxy.ts` ersetzt. Die Datei `src/proxy.ts` enthält den Routenschutz via Cookie-Prüfung und leitet nicht authentifizierte Zugriffe auf `/orders` und `/admin` zur Login-Seite um.

## Tech-Stack

| Bereich           | Technologie                                             |
|-------------------|---------------------------------------------------------|
| Framework         | Next.js 16+ (App Router)                               |
| Sprache           | TypeScript (strict mode)                               |
| Validierung       | Zod                                                    |
| State Management  | React Context (Auth + Warenkorb)                       |
| Styling           | Tailwind CSS                                           |
| Unit-Tests        | Jest + ts-jest + @testing-library/react                |
| E2E-Tests         | Playwright                                             |
| CI/CD             | GitHub Actions (4 Stages, keine Secrets erforderlich)  |

## Setup

```bash
npm install
npm run dev     # http://localhost:3000
```

**Testkonten:**
- Kunde: `kunde@shopease.de` / `testpasswort123`
- Admin: `admin@shopease.de` / `testpasswort123`

## Skripte

| Befehl                  | Beschreibung                                  |
|-------------------------|-----------------------------------------------|
| `npm run dev`           | Entwicklungsserver starten                    |
| `npm run build`         | Produktions-Build erstellen                   |
| `npm run lint`          | ESLint ausführen                              |
| `npm test`              | Unit- & Integrationstests ausführen           |
| `npm run test:ci`       | Tests mit Coverage-Report (für CI)            |
| `npm run test:e2e`      | Playwright End-to-End-Tests ausführen         |
| `npm run test:e2e:ui`   | Playwright im UI-Modus starten                |

## Projektstruktur

```
src/
├── app/                        # Next.js App Router – Seiten
│   ├── (auth)/login/           # Anmeldeseite
│   ├── (auth)/register/        # Registrierungsseite
│   ├── products/               # Produktliste & Detailseite
│   ├── orders/                 # Meine Bestellungen (geschützt)
│   └── admin/                  # Adminbereich (geschützt)
├── components/
│   ├── auth/                   # AuthProvider, LoginForm, RegisterForm
│   ├── products/               # ProductCard, ProductList, ProductSearch
│   ├── orders/                 # CartProvider, CartDrawer, OrderSummary, OrderStatusBadge
│   └── ui/                     # Button, Input
├── lib/
│   ├── data/                   # Seed-Produkte & Testnutzer
│   ├── services/               # Interfaces + Stub-Implementierungen
│   ├── utils/                  # formatCurrency, formatDate, calculateOrderTotal
│   └── validators/             # Zod-Schemas (auth, product, order)
├── proxy.ts                    # Routenschutz (Next.js 16 Proxy, ersetzt middleware.ts)
└── types/                      # Gemeinsame TypeScript-Interfaces
tests/
├── unit/                       # Jest-Unit-Tests (Validators, Utils, Komponenten)
├── integration/                # React Testing Library – Integrationstests
└── e2e/                        # Playwright End-to-End-Tests
.github/workflows/
└── ci.yml                      # 4-stufige CI-Pipeline (Lint → Test → Build → E2E)
```

## CI/CD-Pipeline

Die GitHub Actions Pipeline läuft in 4 sequenziellen Stages, jede abhängig von der vorherigen:

1. **Stage 1 – Lint & Type-Check:** ESLint + `tsc --noEmit`
2. **Stage 2 – Unit- & Integrationstests:** Jest mit Coverage-Report (als Artefakt hochgeladen)
3. **Stage 3 – Build:** `next build` (validiert den Produktions-Build)
4. **Stage 4 – E2E-Tests:** Playwright mit Chromium (Report als Artefakt hochgeladen)

Die Pipeline benötigt **keine Secrets** und läuft vollständig mit Stub-Implementierungen.
