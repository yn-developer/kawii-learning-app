import Link from "next/link";

import { cn } from "@/core/lib/classnames";
import { Card } from "@/core/ui/Card";
import { Row } from "@/core/ui/Row";
import { Stack } from "@/core/ui/Stack";
import type { LessonMeta } from "@/features/lessons/model/types";

import styles from "./LessonList.module.css";

type LessonListProps = {
  lessons: LessonMeta[];
};

export function LessonList({ lessons }: LessonListProps) {
  const sorted = [...lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <Stack gap="md" className={styles.list}>
      {sorted.map((lesson) => (
        <Link
          key={lesson.slug}
          href={`/learn/${lesson.slug}`}
          className={cn(styles.cardLink)}
          prefetch
        >
          <Card className={styles.card} padding="lg">
            <Row className={styles.header} justify="between" align="center" gap="sm" wrap={false}>
              <span className={styles.order}>
                {(lesson.order ?? 0).toString().padStart(2, "0")}
              </span>
              <h3 className={styles.title}>{lesson.title}</h3>
            </Row>
            <p className={styles.description}>{lesson.description ?? ""}</p>
            <span aria-hidden className={styles.chevron}>
              →
            </span>
          </Card>
        </Link>
      ))}
    </Stack>
  );
}
