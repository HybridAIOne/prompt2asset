# Sicherheit

## Unterstützte Versionen

| Version | Unterstützt |
|--------|-------------|
| `main` / aktuelle Releases | Ja |

## Melden von Schwachstellen

Bitte **keine** Sicherheitsdetails in öffentlichen Issues posten.

- Nutze bei GitHub die Funktion **„Report a vulnerability“** (Security → Advisories), wenn verfügbar, oder
- kontaktiere die Maintainer_innen privat (E-Mail kann im Profil oder im Repo-„About“ ergänzt werden).

## API-Keys und Deployments

Dieses Projekt kann den Gemini-API-Key über `VITE_GEMINI_API_KEY` im **Browser** einbinden. Das ist für Demos und lokale Entwicklung gedacht.

- **Niemals** echte Keys ins Repository committen (`.env` ist gitignored; bei Leak den Key bei Google **sofort rotieren**).
- Für **öffentliche** Installationen: Key nur **serverseitig** verwenden (eigenes Backend oder Edge-Proxy), nicht als `VITE_*` ausliefern.

## Sandbox

Generierte Artefakte laufen in einem **sandboxed** `iframe`. Details stehen in der [README](README.md) unter „Sicherheit“.
