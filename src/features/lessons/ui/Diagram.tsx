'use client';

import { useEffect, useId, useState } from "react";
import clsx from "clsx";
import mermaid from "mermaid";

import styles from "./Diagram.module.css";

type DiagramProps = {
  title?: string;
  code: string;
  className?: string;
};

export function Diagram({ title, code, className }: DiagramProps) {
  const renderId = useId();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function renderDiagram() {
      try {
        setError(null);
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
        });

        const { svg } = await mermaid.render(`diagram-${renderId}`, code);
        if (!isActive) return;
        setSvg(svg);
      } catch (err) {
        if (!isActive) return;
        setSvg(null);
        setError(
          err instanceof Error ? err.message : "Unable to render diagram right now.",
        );
      }
    }

    renderDiagram();

    return () => {
      isActive = false;
    };
  }, [code, renderId]);

  return (
    <section className={clsx(styles.wrapper, className)}>
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      <div className={styles.surface} role="img" aria-label={title ?? "Diagram"}>
        {error ? (
          <div className={styles.error}>
            <p>Could not render diagram.</p>
            <p className={styles.errorDetail}>{error}</p>
          </div>
        ) : svg ? (
          <div
            className={styles.diagram}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <p className={styles.loading}>Rendering diagram…</p>
        )}
      </div>
    </section>
  );
}
