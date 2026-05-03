# Mitwirken

Danke für dein Interesse an **prompt2asset**!

## Entwicklungsumgebung

- **Node.js** 20 oder neuer (siehe `package.json` → `engines`)
- `npm ci` oder `npm install`
- `cp .env.example .env` und einen gültigen `VITE_GEMINI_API_KEY` eintragen (lokal nur für dich)

## Befehle

```bash
npm run dev      # Entwicklungsserver
npm run lint     # ESLint
npm run build    # Produktionsbuild (Typecheck + Vite)
npm run preview  # Vorschau des dist/-Builds
```

**GitHub Pages:** Der Deploy-Workflow baut mit `npm run build -- --base=/<Repository-Name>/` (siehe `.github/workflows/pages.yml`).

## Pull Requests

- Ein Issue zu eröffnen ist willkommen, aber für kleine Fixes nicht Pflicht.
- PRs sollten **lint** und **build** bestehen (identisch zur CI).
- Bitte **keine** Secrets, keine `.env` und keine API-Keys committen.
- Beschreibe kurz **Was** und **Warum** (1–3 Sätze reichen oft).

## Verhaltenskodex

Siehe [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
