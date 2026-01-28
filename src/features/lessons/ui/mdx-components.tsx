import type { HTMLAttributes } from "react";

import { Diagram } from "./Diagram";
import { MatchArrows } from "./MatchArrows";
import { ExcalidrawBoard } from "@/features/whiteboard/ExcalidrawBoard";
import { Flashcards } from "./Flashcards";
import { Reveal } from "./Reveal";
import { QuizSingleChoice } from "./QuizSingleChoice";
import { Checkpoint } from "./Checkpoint";
import styles from "./mdx-markup.module.css";

const Strong = (props: HTMLAttributes<HTMLElement>) => (
  <strong className={styles.strong} {...props} />
);

const Em = (props: HTMLAttributes<HTMLElement>) => (
  <em className={styles.em} {...props} />
);

export const mdxComponents = {
  Reveal,
  QuizSingleChoice,
  Checkpoint,
  Flashcards,
  MatchArrows,
  ExcalidrawBoard,
  Diagram,
  strong: Strong,
  em: Em,
};
