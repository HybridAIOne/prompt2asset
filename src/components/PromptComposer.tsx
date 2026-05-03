import { useCallback, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { PROMPT_EXAMPLES } from "../data/promptExamples";
import "./PromptComposer.css";

type PromptComposerProps = {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
};

export function PromptComposer({ onSubmit, disabled }: PromptComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = useCallback(() => {
    const t = value.trim();
    if (!t || disabled) return;
    onSubmit(t);
  }, [value, disabled, onSubmit]);

  const onFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      submit();
    },
    [submit],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );

  const applyExample = useCallback((prompt: string) => {
    setValue(prompt);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  return (
    <form className="composer" onSubmit={onFormSubmit}>
      <div className="composer__field">
        <label className="composer__label" htmlFor="prompt-input">
          Prompt
        </label>
        <div className="composer__examples">
          <span className="composer__examples-label" id="prompt-examples-label">
            Beispiele
          </span>
          <div className="composer__chips" role="group" aria-labelledby="prompt-examples-label">
            {PROMPT_EXAMPLES.map((ex) => (
              <button
                key={ex.label + ex.kind}
                type="button"
                className={
                  ex.kind === "play"
                    ? "composer__chip composer__chip--play"
                    : "composer__chip composer__chip--info"
                }
                disabled={disabled}
                onClick={() => applyExample(ex.prompt)}
                title={ex.prompt}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          ref={textareaRef}
          id="prompt-input"
          className="composer__textarea"
          placeholder="z. B. ein minimalistisches Flappy-Bird-Klon mit einem Tastendruck zum Springen …"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          rows={3}
          autoComplete="off"
        />
      </div>
      <div className="composer__row">
        <p className="composer__hint">
          Ausgabe: ein HTML-Dokument (wie im Server-Projekt). Der API-Key liegt nur im Browser — für Produktion bitte ein
          Backend nutzen.
        </p>
        <button className="composer__submit" type="submit" disabled={disabled || !value.trim()}>
          Generieren
          <kbd className="composer__kbd">⏎ ⌘</kbd>
        </button>
      </div>
    </form>
  );
}
