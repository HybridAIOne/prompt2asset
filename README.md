# prompt2asset

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](package.json)

**prompt2asset** ist eine kleine Web-UI: Du beschreibst in einem Prompt, was erscheinen soll — ein **Gemini**-Modell liefert **ein vollständiges HTML-Dokument** (inline CSS/JS, optional Chart.js / D3 / Mermaid per CDN laut System-Prompt). Das Ergebnis wird in einem **sandboxed** `iframe` als `srcdoc` angezeigt (gleiches Muster wie serverseitig HTML erzeugen und eingebettet anzeigen).

**Lizenz:** [MIT](LICENSE) · **Changelog:** [CHANGELOG.md](CHANGELOG.md) · **Mitwirken:** [CONTRIBUTING.md](CONTRIBUTING.md)

<!-- Nach dem Anlegen des GitHub-Repos: `DEIN_USER` durch deinen Account ersetzen. -->
<!-- [![CI](https://github.com/DEIN_USER/prompt2asset/actions/workflows/ci.yml/badge.svg)](https://github.com/DEIN_USER/prompt2asset/actions) -->

## Features

- Mehrzeiliger Prompt, optional **Beispiel-Chips** (Spiele & Didaktik)
- **Vorschau** in `sandbox="allow-scripts allow-pointer-lock"` **ohne** `allow-same-origin`
- **Teilen:** Direktlink (`asset-viewer.html#d=…`, LZ-Kompression), Iframe-Snippet, Roh-HTML kopieren
- **Verlauf** der letzten Artefakte (lokal im Browser)
- Markdown/Code-Fences in der Modellantwort werden bereinigt

## Voraussetzungen

- **Node.js** 20 oder neuer  
- Ein [Gemini API-Key](https://aistudio.google.com/apikey) (nur lokal / Demo im Frontend, siehe unten)

## Setup

1. Repository klonen  
2. `npm ci` oder `npm install`  
3. `cp .env.example .env` und `VITE_GEMINI_API_KEY` eintragen.  
4. Optional: `VITE_GEMINI_MODEL` setzen (Standard: `gemini-3-flash-preview`, siehe [Gemini-Modelle](https://ai.google.dev/gemini-api/docs/models)).

## Entwicklung

```bash
npm run dev
```

## Produktionsbuild

```bash
npm run build    # Ausgabe: dist/
npm run preview  # Vorschau von dist/
```

`asset-viewer.html` liegt nach dem Build unter `dist/` (aus `public/`). Für funktionierende Share-Links müssen App und `asset-viewer.html` unter **derselben Origin** ausgeliefert werden.

## Teilen

Im Teilen-Dialog gibt es einen **Direktlink** (`asset-viewer.html#d=…`): Das HTML wird mit [lz-string](https://github.com/pieroxy/lz-string) in der URL transportiert und in einem sandboxed iframe angezeigt. Sehr große Artefakte können Browser-URL-Limits sprengen — dann Iframe-Snippet oder HTML kopieren.

## Sicherheit

- Der API-Key liegt bei dieser Variante im **Frontend** (`VITE_*`); das ist für **Demos und lokale Entwicklung** gedacht. Für **öffentliche Deployments** bitte ein **Backend oder Proxy** nutzen, der den Key nur serverseitig verwendet.  
- **Niemals** `.env` oder echte Keys ins Repository committen; Details: [SECURITY.md](SECURITY.md).

Die Vorschau nutzt `sandbox="allow-scripts allow-pointer-lock"` **ohne** `allow-same-origin`. Externe Skripte von CDNs können im Artefakt geladen werden; das Artefakt bleibt gegen die Parent-App isoliert.

## Community

- [Verhaltenskodex](CODE_OF_CONDUCT.md)  
- [Security-Meldungen](SECURITY.md)  
- [Mitwirken](CONTRIBUTING.md)

## GitHub (nach dem ersten Push)

Empfohlene **Topics:** `gemini`, `vite`, `react`, `iframe`, `sandbox`, `llm`, `html-generation`, `prompt`

Optional **GitHub Release** `v0.1.0` anlegen und den CI-Badge in dieser README aktivieren (Kommentar oben entfernen, `DEIN_USER` einsetzen).
