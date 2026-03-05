# ShopEase Demo

Proof-of-Concept für eine automatisierte Teststrategie mit CI/CD-Pipeline-Integration, entwickelt mit Next.js 16+ und dem App Router.

## Architektur

Das Projekt setzt auf das  **Stub-Implementierungen**. Sämtliche Datenzugriffe und Authentifizierungsoperationen laufen über TypeScript-Interfaces. Die Stubs implementieren diese Interfaces mit lokalen In-Memory-Daten.

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
| CI/CD             | GitHub Actions (4 Stages)  |

## Setup

```bash
pnpm install
pnpm run dev     # http://localhost:3000
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

## CI/CD-Pipeline

Die GitHub Actions Pipeline läuft in 4 sequenziellen Stages, jede abhängig von der vorherigen:

1. **Stage 1 – Lint & Type-Check:** ESLint + `tsc --noEmit`
2. **Stage 2 – Unit- & Integrationstests:** Jest mit Coverage-Report (als Artefakt hochgeladen)
3. **Stage 3 – Build:** `next build` (validiert den Produktions-Build)
4. **Stage 4 – E2E-Tests:** Playwright mit Chromium (Report als Artefakt hochgeladen)

Die Pipeline benötigt **keine Secrets** und läuft vollständig mit Stub-Implementierungen.
