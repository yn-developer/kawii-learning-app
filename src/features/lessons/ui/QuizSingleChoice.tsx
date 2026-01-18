'use client';

import { useState } from "react";

import { cn } from "@/core/lib/classnames";

import styles from "./QuizSingleChoice.module.css";

type Option = {
  id: string;
  label: string;
};

type QuizSingleChoiceProps = {
  question: string;
  options: Option[];
  correctId: string;
  onAnswer?: (isCorrect: boolean) => void;
};

export function QuizSingleChoice({
  question,
  options,
  correctId,
  onAnswer,
}: QuizSingleChoiceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isAnswered = selectedId !== null;
  const isCorrect = selectedId === correctId;

  const handleSelect = (id: string) => {
    if (isAnswered) return;
    setSelectedId(id);
    onAnswer?.(id === correctId);
  };

  return (
    <section className={styles.quiz} aria-live="polite">
      <h3 className={styles.question}>{question}</h3>
      <div className={styles.options} role="radiogroup" aria-label={question}>
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const isOptionCorrect = option.id === correctId;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isAnswered}
              disabled={isAnswered}
              onClick={() => handleSelect(option.id)}
              className={cn(
                styles.option,
                isSelected && styles.selected,
                isAnswered && isOptionCorrect && styles.correct,
                isAnswered && isSelected && !isOptionCorrect && styles.incorrect,
              )}
            >
              <span className={styles.optionLabel}>{option.label}</span>
              {isAnswered && isOptionCorrect && <span className={styles.tag}>Correct</span>}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          className={cn(
            styles.feedback,
            isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect,
          )}
        >
          {isCorrect ? "Nice work! That is correct." : "Not quite. Review and try the next one."}
        </div>
      )}
    </section>
  );
}
