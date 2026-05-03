import { type AssetHistoryEntry, formatHistoryAge, MAX_HISTORY } from "../lib/assetHistory";
import "./AssetHistory.css";

type AssetHistoryProps = {
  entries: AssetHistoryEntry[];
  activeSrcDoc: string | null;
  onSelect: (entry: AssetHistoryEntry) => void;
  disabled?: boolean;
};

export function AssetHistory({ entries, activeSrcDoc, onSelect, disabled }: AssetHistoryProps) {
  if (entries.length === 0) return null;

  return (
    <nav className="asset-history" aria-label={`Letzte ${MAX_HISTORY} Artefakte`}>
      <span className="asset-history__label">Zuletzt</span>
      <ul className="asset-history__list" role="list">
        {entries.map((entry) => {
          const active = activeSrcDoc != null && entry.srcDoc === activeSrcDoc;
          const label =
            entry.prompt.length > 72 ? `${entry.prompt.slice(0, 72).trim()}…` : entry.prompt || "(ohne Text)";
          return (
            <li key={entry.id} className="asset-history__item" role="listitem">
              <button
                type="button"
                className={active ? "asset-history__btn asset-history__btn--active" : "asset-history__btn"}
                disabled={disabled}
                onClick={() => onSelect(entry)}
                title={`${entry.prompt}\n— ${new Date(entry.createdAt).toLocaleString("de")}`}
                aria-current={active ? "true" : undefined}
              >
                <span className="asset-history__btn-text">{label}</span>
                <span className="asset-history__btn-meta">{formatHistoryAge(entry.createdAt)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
