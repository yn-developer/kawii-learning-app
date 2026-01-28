'use client';

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { MDXProvider } from "@mdx-js/react";

import { cn } from "@/core/lib/classnames";
import { Button } from "@/core/ui/Button";
import { Card } from "@/core/ui/Card";
import { Container } from "@/core/ui/Container";
import { Stack } from "@/core/ui/Stack";
import { defaultLocale, lessonLoaders } from "@/content/lessons";
import { useI18n } from "@/core/lib/i18n";
import { useProgressStore } from "@/features/progress/model/progressStore";
import type { Lesson } from "@/features/lessons/model/types";
import { mdxComponents } from "./mdx-components";

import styles from "./LessonPage.module.css";

type LessonPageProps = {
  lesson: Lesson;
};

export function LessonPage({ lesson }: LessonPageProps) {
  const { meta } = lesson;
  const [Content, setContent] = useState<ComponentType<Record<string, unknown>> | null>(
    null,
  );
  const hydrateFromStorage = useProgressStore((state) => state.hydrateFromStorage);
  const markLessonComplete = useProgressStore((state) => state.markLessonComplete);
  const isComplete = useProgressStore(
    (state) => state.completedBySlug[meta.slug] ?? false,
  );
  const { lang } = useI18n();

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    let isActive = true;
    const loaders = lessonLoaders[meta.slug];
    const loader = loaders?.[lang] ?? loaders?.[defaultLocale] ?? Object.values(loaders ?? {})[0];
    if (!loader) return undefined;

    loader()
      .then((mod) => {
        if (!isActive) return;
        setContent(() => mod.default);
      })
      .catch((error) => {
        console.error(`Failed to load lesson content for slug "${meta.slug}"`, error);
      });

    return () => {
      isActive = false;
    };
  }, [lang, meta.slug]);

  const handleComplete = () => {
    markLessonComplete(meta.slug);
  };

  return (
    <Container size="md" className={styles.page}>
      <Stack gap="lg">
        <header className={styles.header}>
          <p className={styles.kicker}>Lesson {meta.order}</p>
          <h1 className={styles.title}>{meta.title}</h1>
          <p className={styles.description}>{meta.description}</p>
          <Button
            onClick={handleComplete}
            variant={isComplete ? "ghost" : "primary"}
            className={cn(styles.completeButton, isComplete && styles.completeButtonDone)}
            fullWidth
            aria-pressed={isComplete}
          >
            {isComplete ? "Mark incomplete" : "Mark complete"}
          </Button>
        </header>

        <Card className={styles.contentCard} padding="lg">
          <article className={styles.content}>
            {Content ? (
              <MDXProvider components={mdxComponents}>
                <Content components={mdxComponents} />
              </MDXProvider>
            ) : (
              <p className={styles.loading}>Loading lesson...</p>
            )}
          </article>
        </Card>
      </Stack>
    </Container>
  );
}
