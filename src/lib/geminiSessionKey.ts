const SESSION_API_KEY = "prompt2asset_session_gemini_api_key";

export function getSessionGeminiApiKey(): string | null {
  try {
    const v = sessionStorage.getItem(SESSION_API_KEY);
    return v?.trim() || null;
  } catch {
    return null;
  }
}

/** Nur für Demos (z. B. GitHub Pages): Key liegt nur in dieser Browser-Sitzung. */
export function setSessionGeminiApiKey(key: string): void {
  sessionStorage.setItem(SESSION_API_KEY, key.trim());
}

export function clearSessionGeminiApiKey(): void {
  sessionStorage.removeItem(SESSION_API_KEY);
}

/**
 * Build-Zeit-Key (.env) hat Vorrang; sonst Sitzungs-Key (z. B. statisches Hosting ohne Secrets).
 */
export function resolveGeminiApiKey(): string | null {
  const fromEnv = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  return getSessionGeminiApiKey();
}
