import { FinishReason, GoogleGenAI } from "@google/genai";
import { normalizeHtmlDocument } from "./cleanModelHtml";

const SYSTEM_INSTRUCTION = `Gib NUR ein vollständiges HTML-Dokument zurück. Kein Markdown, kein Erklärtext davor oder danach.

Anforderungen:
- Eine Datei: <!DOCTYPE html>, <html>, <head> mit <meta charset="UTF-8"> und <meta name="viewport" content="width=device-width, initial-scale=1">, dann <body>.
- CSS in <style>, JavaScript in <script> — keine separaten .css/.js-Dateien, außer CDN wie unten.
- Maximal etwa 200 Zeilen insgesamt; halte dich kompakt. Bei Spielen: Kernmechanik und Bedienung zuerst; lieber spielbar und schlank als überladen.
- Responsive (mobilnutzbar).
- Nutze die volle iframe-Breite: z. B. \`html, body { margin: 0; width: 100%; min-height: 100vh; box-sizing: border-box; }\` und vermeide schmale \`max-width\`-Container ohne Grund.
- Optional: Chart.js, D3 oder Mermaid ausschließlich per <script src="https://…"> von seriösen CDNs (z. B. cdnjs, jsDelivr, unpkg). Keine anderen externen Datenquellen wenn möglich.
- Kein TypeScript-Quelltext im Browser; nur ausführbares JS. Kein import maps.
- Die Seite läuft in einem streng sandboxed iframe (kein Zugriff auf die Parent-Seite).

Spiele und Echtzeit-Demos (wenn der Nutzer ein Spiel oder eine interaktive Action-Demo will):
- Zustände klar trennen, z. B. title / playing / paused / gameOver — mit kurzem Start-Hinweis (Steuerung) vor dem ersten Start.
- Hauptschleife mit \`requestAnimationFrame\`; Zeitdelta nutzen (\`performance.now()\`, dt in Sekunden), nicht mit \`setInterval\` die Physik antreiben.
- Rendering: bevorzugt Canvas 2D; Größe an den Anzeigebereich anpassen (Resize-Listener); optional \`devicePixelRatio\` setzen für schärfere Darstellung, dann Kontext skalieren.
- Steuerung: Tastatur (keydown/keyup oder Set gedrückter Keys) und für Mobil Touch (z. B. Tap oder linke/rechte Hälfte); gezielt \`preventDefault\` auf dem Spielfeld, damit die Seite beim Spielen nicht scrollt.
- UX: HUD mit Score (und ggf. Leben), Pause (z. B. Taste P oder zweites Tap), Game-Over mit „Nochmal“ / Neustart ohne Seitenreload.
- Schwierigkeit leicht steigend (Geschwindigkeit oder Spawn mit Score), aber fair bleiben.
- Audio optional: nur nach erster Nutzeraktion auf „Start“, Button oder erstem Tap aufs Spielfeld (Autoplay-Policy); kurze Beeps reichen.

Ausgabe:
- Rohes HTML. Keine \`\`\` Codefences.`;

/**
 * Optional: Kontext (z. B. Kapiteltext) wie im Server-Projekt, auf 6000 Zeichen gekürzt.
 */
function buildContents(userPrompt: string, context?: string): string {
  const prompt = userPrompt.trim();
  if (!context?.trim()) return prompt;
  const excerpt = context.trim().slice(0, 6000);
  return `Kontext (Auszug, max. 6000 Zeichen):\n${excerpt}\n\n---\n\nAnweisung / Wunsch:\n${prompt}`;
}

export type GenerateHtmlOptions = {
  /** Zusätzlicher Text (z. B. Kapitel), wird auf 6000 Zeichen begrenzt. */
  context?: string;
};

export async function generateHtmlDocument(
  userPrompt: string,
  options?: GenerateHtmlOptions,
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error(
      "VITE_GEMINI_API_KEY fehlt. Kopiere .env.example nach .env und trage deinen Schlüssel von https://aistudio.google.com/apikey ein.",
    );
  }

  const model =
    import.meta.env.VITE_GEMINI_MODEL?.trim() || "gemini-3-flash-preview";

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const contents = buildContents(userPrompt, options?.context);

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 32768,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Leere Antwort vom Modell.");
  }

  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason === FinishReason.MAX_TOKENS && !/<\/html>/i.test(text)) {
    throw new Error(
      "Ausgabe-Token-Limit erreicht; HTML wirkt unvollständig (z. B. fehlendes </html>). Bitte kürzeren Prompt oder einfacheres Artefakt.",
    );
  }

  const html = normalizeHtmlDocument(text);
  if (!html.includes("<body")) {
    throw new Error("Modell lieferte kein brauchbares HTML-Dokument.");
  }
  return html;
}
