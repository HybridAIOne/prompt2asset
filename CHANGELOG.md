# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Das Format orientiert sich lose an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

## [0.1.1] - 2026-05-03

### Added

- Gemini API-Key optional in der **Browser-Sitzung** (`sessionStorage`), wenn kein `VITE_GEMINI_API_KEY` beim Build gesetzt ist (öffentliche Demo ohne Secret im Repo).
- UI-Banner „Demo“ mit Speichern/Entfernen; Hinweistext zu Google AI Studio.
- GitHub Pages Deploy-Workflow (`pages.yml`) mit `--base=/<Repository>/`.

## [0.1.0] - 2026-05-02

### Added

- Erste öffentliche Version: Vite + React, Gemini-Integration, **sandboxed** iframe-Vorschau
- Teilen (Direktlink mit LZ-Kompression, Iframe-Snippet, HTML kopieren)
- Prompt-Verlauf (lokal), Beispiel-Chips inkl. Spiel-Prompts
- CI-Workflow (Lint + Build), Maintainer-Dokumentation (SECURITY, CONTRIBUTING, Verhaltenskodex)
