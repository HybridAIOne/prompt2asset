export type AssetHistoryEntry = {
  id: string;
  prompt: string;
  srcDoc: string;
  createdAt: number;
};

const STORAGE_KEY = "prompt2asset:asset-history:v1";
export const MAX_HISTORY = 5;

export function loadHistory(): AssetHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (row): row is AssetHistoryEntry =>
          row != null &&
          typeof row === "object" &&
          typeof (row as AssetHistoryEntry).id === "string" &&
          typeof (row as AssetHistoryEntry).prompt === "string" &&
          typeof (row as AssetHistoryEntry).srcDoc === "string" &&
          typeof (row as AssetHistoryEntry).createdAt === "number",
      )
      .slice(0, MAX_HISTORY);
  } catch {
    return [];
  }
}

export function persistHistory(entries: AssetHistoryEntry[]): void {
  const payload = JSON.stringify(entries.slice(0, MAX_HISTORY));
  try {
    localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 2)));
    } catch {
      /* Quota u. Ä. — History bleibt nur im RAM */
    }
  }
}

/** Neuester Eintrag zuerst; identischer `srcDoc` ersetzt ältere Duplikate. */
export function pushHistory(
  prev: AssetHistoryEntry[],
  prompt: string,
  srcDoc: string,
): AssetHistoryEntry[] {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `h-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const entry: AssetHistoryEntry = {
    id,
    prompt: prompt.trim().slice(0, 400),
    srcDoc,
    createdAt: Date.now(),
  };
  const withoutDup = prev.filter((e) => e.srcDoc !== srcDoc);
  return [entry, ...withoutDup].slice(0, MAX_HISTORY);
}

export function formatHistoryAge(createdAt: number): string {
  const s = Math.floor((Date.now() - createdAt) / 1000);
  if (s < 45) return "gerade";
  if (s < 3600) return `vor ${Math.floor(s / 60)} Min`;
  if (s < 86400) return `vor ${Math.floor(s / 3600)} Std`;
  return `vor ${Math.floor(s / 86400)} Tag(en)`;
}
