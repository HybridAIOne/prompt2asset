# prompt2asset

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](package.json)
[![CI](https://github.com/HybridAIOne/prompt2asset/actions/workflows/ci.yml/badge.svg)](https://github.com/HybridAIOne/prompt2asset/actions/workflows/ci.yml)

**prompt2asset** ist eine kleine Web-UI: Du beschreibst in einem Prompt, was erscheinen soll — ein **Gemini**-Modell liefert **ein vollständiges HTML-Dokument** (inline CSS/JS, optional Chart.js / D3 / Mermaid per CDN laut System-Prompt). Das Ergebnis wird in einem **sandboxed** `iframe` als `srcdoc` angezeigt (gleiches Muster wie serverseitig HTML erzeugen und eingebettet anzeigen).

**Lizenz:** [MIT](LICENSE) · **Changelog:** [CHANGELOG.md](CHANGELOG.md) · **Mitwirken:** [CONTRIBUTING.md](CONTRIBUTING.md) · **Repo:** [HybridAIOne/prompt2asset](https://github.com/HybridAIOne/prompt2asset)

**Live (GitHub Pages):** [hybridaione.github.io/prompt2asset](https://hybridaione.github.io/prompt2asset/) — öffentlicher Build **ohne** eingetragenen Key; zum Ausprobieren Gemini-Key im gelben **Demo-Banner** für diese Browser-Sitzung speichern.

## Features

- Mehrzeiliger Prompt, optional **Beispiel-Chips** (Spiele & Didaktik)
- **Vorschau** in `sandbox="allow-scripts allow-pointer-lock"` **ohne** `allow-same-origin`
- **Teilen:** Direktlink (`asset-viewer.html#d=…`, LZ-Kompression), Iframe-Snippet, Roh-HTML kopieren
- **Verlauf** der letzten Artefakte (lokal im Browser)
- Markdown/Code-Fences in der Modellantwort werden bereinigt
- **GitHub Pages:** Workflow baut mit `base=/Repository-Name/`; API-Key optional per **Sitzung** im Browser (kein Secret im Repo)

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

## GitHub Pages

- Workflow: [.github/workflows/pages.yml](.github/workflows/pages.yml) (Deploy bei Push auf `main` oder manuell „Run workflow“).
- **Einmalig im Repository:** *Settings* → *Pages* → *Build and deployment* → **Source: GitHub Actions**.
- **Wenn der Deploy-Job rot ist:** *Settings* → *Actions* → *General* → **Workflow permissions** → **Read and write permissions** aktivieren (und ggf. „Allow GitHub Actions to create and approve pull requests“ nur wenn ihr es braucht). Ohne Schreibrechte kann `deploy-pages` die Seite nicht veröffentlichen.
- Die App liegt unter `https://<USER>.github.io/<REPO>/` (bei dir z. B. [hybridaione.github.io/prompt2asset](https://hybridaione.github.io/prompt2asset/)).
- Der öffentliche Build enthält **keinen** Gemini-Key. Nutzer können im **Demo-Banner** einen Key nur für die **aktuelle Browser-Sitzung** setzen (`sessionStorage`); es wird nicht an unsere Infrastruktur gesendet, nur an Google im API-Call.

## GitHub

Empfohlene **Topics:** `gemini`, `vite`, `react`, `iframe`, `sandbox`, `llm`, `html-generation`, `prompt`

Optional **Releases** (z. B. v0.1.1) anlegen — siehe [CHANGELOG.md](CHANGELOG.md).
