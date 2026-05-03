import { useCallback, useState } from "react";
import {
  clearSessionGeminiApiKey,
  getSessionGeminiApiKey,
  setSessionGeminiApiKey,
} from "../lib/geminiSessionKey";
import "./ApiKeySessionBanner.css";

/** Sichtbar wenn beim Build kein VITE_GEMINI_API_KEY gesetzt wurde (z. B. GitHub Pages). */
export function ApiKeySessionBanner() {
  const hasBuildTimeKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY?.trim());
  const [input, setInput] = useState("");
  const [hasSessionKey, setHasSessionKey] = useState(() => Boolean(getSessionGeminiApiKey()));

  const save = useCallback(() => {
    const t = input.trim();
    if (!t) return;
    setSessionGeminiApiKey(t);
    setHasSessionKey(true);
  }, [input]);

  const clear = useCallback(() => {
    clearSessionGeminiApiKey();
    setHasSessionKey(false);
    setInput("");
  }, []);

  if (hasBuildTimeKey) return null;

  return (
    <div className="api-key-banner" role="region" aria-label="Demo API-Key">
      <p className="api-key-banner__text">
        <strong>Demo:</strong> Ohne gebauten Key trägst du deinen{" "}
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="api-key-banner__link"
        >
          Gemini API-Key
        </a>{" "}
        nur für <strong>diese Browser-Sitzung</strong> ein (Tab schließen = weg). Er wird nur von deinem Browser an Google gesendet, nicht an dieses Projekt.
      </p>
      <div className="api-key-banner__row">
        <input
          className="api-key-banner__input"
          type="password"
          autoComplete="off"
          placeholder="API-Key einfügen …"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Gemini API-Key für diese Sitzung"
        />
        <button type="button" className="api-key-banner__btn" onClick={save} disabled={!input.trim()}>
          Speichern
        </button>
        <button
          type="button"
          className="api-key-banner__btn api-key-banner__btn--ghost"
          onClick={clear}
          disabled={!hasSessionKey}
        >
          Entfernen
        </button>
      </div>
      {hasSessionKey ? (
        <p className="api-key-banner__ok" role="status">
          Sitzungs-Key aktiv — Generieren ist möglich.
        </p>
      ) : null}
    </div>
  );
}
