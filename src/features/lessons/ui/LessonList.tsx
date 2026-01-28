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
  const sorted = [...lessons].sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return (a.order ?? 0) - (b.order ?? 0);
  });

  const grouped = sorted.reduce<Record<string, LessonMeta[]>>((acc, lesson) => {
    const key = lesson.category ?? "general";
    if (!acc[key]) acc[key] = [];
    acc[key].push(lesson);
    return acc;
  }, {});

  const categoryOrder = Object.keys(grouped);

  return (
    <Stack gap="lg" className={styles.list}>
      {categoryOrder.map((category) => (
        <section key={category} className={styles.section}>
          <Row className={styles.sectionHeader} justify="between" align="center">
            <h2 className={styles.sectionTitle}>{category}</h2>
            <span className={styles.sectionCount}>
              {grouped[category].length} lesson{grouped[category].length === 1 ? "" : "s"}
            </span>
          </Row>
          <Stack gap="md">
            {grouped[category].map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/learn/${lesson.category}/${lesson.slug}`}
                className={cn(styles.cardLink)}
                prefetch
              >
                <Card className={styles.card} padding="lg">
                  <Row
                    className={styles.header}
                    justify="between"
                    align="center"
                    gap="sm"
                    wrap={false}
                  >
                    <span className={styles.order}>
                      {(lesson.order ?? 0).toString().padStart(2, "0")}
                    </span>
                    <h3 className={styles.title}>{lesson.title}</h3>
                  </Row>
                  <p className={styles.description}>{lesson.description ?? ""}</p>
                  <span aria-hidden className={styles.chevron}>→</span>
                </Card>
              </Link>
            ))}
          </Stack>
        </section>
      ))}
    </Stack>
  );
}
