'use client';

import { useEffect } from "react";

import { cn } from "@/core/lib/classnames";
import { useProgressStore } from "@/features/progress/model/progressStore";

import styles from "./Checkpoint.module.css";

type CheckpointProps = {
  slug: string;
  checkpointId: string;
  label: string;
};

export function Checkpoint({ slug, checkpointId, label }: CheckpointProps) {
  const isComplete = useProgressStore(
    (state) => state.checkpointsBySlug[slug]?.[checkpointId] ?? false,
  );
  const saveCheckpoint = useProgressStore((state) => state.saveCheckpoint);
  const hydrateFromStorage = useProgressStore((state) => state.hydrateFromStorage);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const handleClick = () => {
    if (isComplete) return;
    saveCheckpoint(slug, checkpointId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(styles.button, isComplete && styles.completed)}
      aria-pressed={isComplete}
    >
      <span className={styles.status} aria-hidden>
        {isComplete ? "✓" : "○"}
      </span>
      <span className={styles.label}>{label}</span>
      <span className={styles.action}>{isComplete ? "Completed" : "Mark complete"}</span>
    </button>
  );
}
