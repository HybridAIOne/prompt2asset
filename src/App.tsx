import { useCallback, useState } from "react";
import { ApiKeySessionBanner } from "./components/ApiKeySessionBanner";
import { PreviewCanvas } from "./components/PreviewCanvas";
import { PromptComposer } from "./components/PromptComposer";
import {
  loadHistory,
  persistHistory,
  pushHistory,
  type AssetHistoryEntry,
} from "./lib/assetHistory";
import { generateHtmlDocument } from "./lib/gemini";
import "./App.css";

function ComposerWindowChrome({
  minimized,
  busy,
  onMinimize,
  onRestore,
}: {
  minimized: boolean;
  busy: boolean;
  onMinimize: () => void;
  onRestore: () => void;
}) {
  return (
    <div className="app__composer-chrome">
      <div className="app__composer-chrome-actions">
        {minimized ? (
          <button
            type="button"
            className="app__composer-winbtn app__composer-winbtn--show"
            onClick={onRestore}
            aria-label="Eingabefeld wieder anzeigen"
            title="Eingabefeld wieder anzeigen"
          >
            <svg className="app__composer-winbtn-icon" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M4 10 8 6l4 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className="app__composer-winbtn app__composer-winbtn--hide"
            onClick={onMinimize}
            disabled={busy}
            aria-label="Eingabefeld ausblenden (nur diese Leiste bleibt)"
            title="Eingabefeld ausblenden"
          >
            <span className="app__composer-winbtn-dash" aria-hidden />
          </button>
        )}
      </div>
      <div className="app__composer-chrome-title-wrap">
        <span className="app__composer-chrome-title">Prompt</span>
        {minimized ? (
          <span className="app__composer-chrome-hint">Eingabe ist ausgeblendet</span>
        ) : null}
      </div>
      <div className="app__composer-chrome-trail" aria-hidden />
    </div>
  );
}

export default function App() {
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AssetHistoryEntry[]>(() => loadHistory());
  const [composerMinimized, setComposerMinimized] = useState(false);

  const onHistorySelect = useCallback((entry: AssetHistoryEntry) => {
    setSrcDoc(entry.srcDoc);
    setError(null);
  }, []);

  const onSubmit = useCallback(async (prompt: string) => {
    setBusy(true);
    setError(null);
    try {
      const html = await generateHtmlDocument(prompt);
      setSrcDoc(html);
      setHistory((h) => {
        const next = pushHistory(h, prompt, html);
        persistHistory(next);
        return next;
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <div className="app">
      <main className="app__main">
        <header className="app__header">
          <h1 className="app__title">prompt2asset</h1>
          <span className="app__badge" title="Konfigurierbar via VITE_GEMINI_MODEL">
            Gemini · Vorschau
          </span>
        </header>
        <ApiKeySessionBanner />
        <div className="app__stage">
          <PreviewCanvas
            srcDoc={srcDoc}
            busy={busy}
            error={error}
            history={history}
            onHistorySelect={onHistorySelect}
          />
          <div className="app__composer-float">
            <div className="app__composer-panel">
              <ComposerWindowChrome
                minimized={composerMinimized}
                busy={busy}
                onMinimize={() => setComposerMinimized(true)}
                onRestore={() => setComposerMinimized(false)}
              />
              {composerMinimized ? null : (
                <div className="app__composer-body">
                  <PromptComposer onSubmit={onSubmit} disabled={busy} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
