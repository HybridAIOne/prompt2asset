import { useEffect, useRef } from "react";

export type SandboxArtifactIframeProps = {
  /** Full HTML document for {@link HTMLIFrameElement.srcdoc}, or `null` to clear. */
  srcDoc: string | null;
  title: string;
  className?: string;
};

/**
 * Sandboxed iframe shell for LLM-generated HTML/CSS/JS. Opaque origin: no parent access.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox
 */
export function SandboxArtifactIframe({ srcDoc, title, className }: SandboxArtifactIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;
    if (srcDoc == null) {
      el.removeAttribute("srcdoc");
      return;
    }
    el.srcdoc = srcDoc;
  }, [srcDoc]);

  return (
    <iframe
      ref={iframeRef}
      className={className}
      title={title}
      sandbox="allow-scripts allow-pointer-lock"
    />
  );
}
