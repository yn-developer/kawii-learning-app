'use client';

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/core/ui/Button";
import { useProgressStore } from "@/features/progress/model/progressStore";

import styles from "./MatchArrows.module.css";

type MatchPair = { left: string; right: string };

type AnswerKey = Array<[string, string]>;

type Checkpoint = { slug: string; id: string; label: string };

type MatchArrowsProps = {
  leftItems: Array<{ id: string; label: string }>;
  rightItems: Array<{ id: string; label: string }>;
  answerKey: AnswerKey;
  autoCheck?: boolean;
  checkpoint?: Checkpoint;
  className?: string;
};

type Anchor = { x: number; y: number };

export function MatchArrows({
  leftItems,
  rightItems,
  answerKey,
  autoCheck = false,
  checkpoint,
  className,
}: MatchArrowsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchPair[]>([]);
  const [showFeedback, setShowFeedback] = useState(autoCheck);
  const [anchors, setAnchors] = useState<Array<{ from: Anchor; to: Anchor }>>([]);

  const saveCheckpoint = useProgressStore((state) => state.saveCheckpoint);
  const isCheckpointComplete = useProgressStore(
    (state) => !!(checkpoint && state.checkpointsBySlug[checkpoint.slug]?.[checkpoint.id]),
  );

  const isCorrect = useMemo(() => {
    if (!answerKey || answerKey.length === 0) return false;
    if (matches.length !== answerKey.length) return false;
    const keySet = new Set(answerKey.map(([l, r]) => `${l}::${r}`));
    return matches.every((m) => keySet.has(`${m.left}::${m.right}`));
  }, [matches, answerKey]);

  const hasMatch = (leftId: string) => matches.some((m) => m.left === leftId);
  const rightTaken = (rightId: string) => matches.some((m) => m.right === rightId);

  const removeMatch = (leftId: string) => {
    setMatches((prev) => prev.filter((m) => m.left !== leftId));
  };

  const handleLeftClick = (id: string) => {
    if (hasMatch(id)) {
      removeMatch(id);
      setActiveLeft(null);
      return;
    }
    setActiveLeft((prev) => (prev === id ? null : id));
  };

  const handleRightClick = (id: string) => {
    if (!activeLeft) return;
    if (rightTaken(id)) {
      setActiveLeft(null);
      return;
    }
    setMatches((prev) => {
      const filtered = prev.filter((m) => m.left !== activeLeft);
      return [...filtered, { left: activeLeft, right: id }];
    });
    setActiveLeft(null);
    if (autoCheck) setShowFeedback(true);
  };

  useEffect(() => {
    function computeAnchors() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const nextAnchors: Array<{ from: Anchor; to: Anchor }> = [];

      matches.forEach((pair) => {
        const leftEl = leftRefs.current[pair.left];
        const rightEl = rightRefs.current[pair.right];
        if (!leftEl || !rightEl) return;
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        const from: Anchor = {
          x: leftRect.right - containerRect.left,
          y: leftRect.top - containerRect.top + leftRect.height / 2,
        };
        const to: Anchor = {
          x: rightRect.left - containerRect.left,
          y: rightRect.top - containerRect.top + rightRect.height / 2,
        };
        nextAnchors.push({ from, to });
      });

      setAnchors(nextAnchors);
    }

    computeAnchors();

    const observer = new ResizeObserver(computeAnchors);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", computeAnchors);
    window.addEventListener("scroll", computeAnchors, true);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", computeAnchors);
      window.removeEventListener("scroll", computeAnchors, true);
    };
  }, [matches, leftItems, rightItems]);

  useEffect(() => {
    if (isCorrect && checkpoint && !isCheckpointComplete) {
      saveCheckpoint(checkpoint.slug, checkpoint.id);
    }
  }, [isCorrect, checkpoint, isCheckpointComplete, saveCheckpoint]);

  const handleCheck = () => {
    setShowFeedback(true);
  };

  const showComplete = checkpoint && showFeedback && isCorrect && !isCheckpointComplete;

  return (
    <div className={clsx(styles.root, className)} ref={containerRef}>
      <svg className={styles.canvas}>
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        {anchors.map(({ from, to }, idx) => {
          const midX = (from.x + to.x) / 2;
          const path = `M ${from.x},${from.y} C ${midX},${from.y} ${midX},${to.y} ${to.x},${to.y}`;
          return (
            <path
              key={idx}
              d={path}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              className={styles.arrow}
            />
          );
        })}
      </svg>

      <div className={styles.columns}>
        <div className={styles.column}>
          <p className={styles.columnTitle}>Questions</p>
          {leftItems.map((item) => {
            const matched = hasMatch(item.id);
            const isActive = activeLeft === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  leftRefs.current[item.id] = el;
                }}
                className={clsx(styles.card, matched && styles.matched, isActive && styles.active)}
                onClick={() => handleLeftClick(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <div className={styles.column}>
          <p className={styles.columnTitle}>Answers</p>
          {rightItems.map((item) => {
            const matched = rightTaken(item.id);
            return (
              <button
                key={item.id}
                ref={(el) => {
                  rightRefs.current[item.id] = el;
                }}
                className={clsx(styles.card, matched && styles.matched)}
                onClick={() => handleRightClick(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        {!autoCheck ? (
          <Button onClick={handleCheck} variant="primary">
            Check
          </Button>
        ) : null}
        {showFeedback ? (
          <span
            className={clsx(
              styles.feedback,
              isCorrect ? styles.feedbackSuccess : styles.feedbackError,
            )}
          >
            {isCorrect ? "All matches are correct." : "Some matches are incorrect."}
          </span>
        ) : null}
        {showComplete ? (
          <Button onClick={() => checkpoint && saveCheckpoint(checkpoint.slug, checkpoint.id)}>
            Complete
          </Button>
        ) : null}
        {checkpoint && isCheckpointComplete ? (
          <span className={styles.feedbackSuccess}>Checkpoint saved ✅</span>
        ) : null}
      </div>
    </div>
  );
}
