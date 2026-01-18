'use client';

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/core/lib/classnames";
import { Button } from "@/core/ui/Button";
import { Card } from "@/core/ui/Card";
import { Row } from "@/core/ui/Row";
import { Stack } from "@/core/ui/Stack";

import styles from "./Flashcards.module.css";

type Flashcard = {
  id?: string;
  front: string;
  back: string;
};

type FlashcardsProps = {
  cards: Flashcard[];
  storageKey?: string;
};

function readKnown(storageKey?: string): Set<string> {
  if (!storageKey || typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((item) => typeof item === "string"));
  } catch {
    return new Set();
  }
}

export function Flashcards({ cards, storageKey }: FlashcardsProps) {
  const safeCards = useMemo(() => cards.filter((c) => c.front && c.back), [cards]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(() => readKnown(storageKey));

  const card = safeCards[index];
  const total = safeCards.length;

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    const serialized = JSON.stringify(Array.from(known));
    window.localStorage.setItem(storageKey, serialized);
  }, [known, storageKey]);

  if (!card) {
    return <p className={styles.empty}>No flashcards available.</p>;
  }

  const cardId = card.id ?? `${index}`;
  const isKnown = known.has(cardId);
  const progress = total > 0 ? Math.round((known.size / total) * 100) : 0;

  const goNext = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % total);
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + total) % total);
  };

  const toggleKnown = () => {
    setKnown((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  return (
    <Stack gap="md" className={styles.wrapper}>
      <Row className={styles.meta}>
        <span className={styles.counter}>
          Card {index + 1} / {total}
        </span>
        <span className={styles.progress}>Known: {progress}%</span>
      </Row>

      <Card
        className={cn(styles.card, flipped && styles.flipped)}
        padding="lg"
        role="button"
        tabIndex={0}
        onClick={() => setFlipped((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            setFlipped((v) => !v);
          }
        }}
        aria-pressed={flipped}
      >
        <div className={styles.face}>{flipped ? card.back : card.front}</div>
      </Card>

      <Row className={styles.actions}>
        <Button variant="ghost" onClick={goPrev} aria-label="Previous card">
          Prev
        </Button>
        <Button variant={isKnown ? "ghost" : "primary"} onClick={toggleKnown} fullWidth>
          {isKnown ? "Mark unknown" : "Mark known"}
        </Button>
        <Button variant="ghost" onClick={goNext} aria-label="Next card">
          Next
        </Button>
      </Row>
    </Stack>
  );
}
