'use server';

import { notFound } from "next/navigation";
import { cache } from "react";

import { lessonMeta, lessonSlugs } from "@/content/lessons";
import type { Lesson, LessonMeta } from "@/features/lessons/model/types";

const SAFE_SLUG = /^[a-z0-9-]+$/i;

function assertSafeSlug(slug: string) {
  if (typeof slug !== "string" || !SAFE_SLUG.test(slug)) {
    notFound();
  }
}

function normalizeMeta(meta: LessonMeta | undefined, fallbackSlug: string): LessonMeta {
  if (!meta) {
    notFound();
  }

  const { title, description, order } = meta;
  const resolvedSlug =
    typeof meta.slug === "string" && meta.slug.trim().length > 0 ? meta.slug.trim() : fallbackSlug;
  assertSafeSlug(resolvedSlug);

  if (!title || typeof order !== "number" || !Number.isFinite(order)) {
    notFound();
  }

  return {
    slug: resolvedSlug,
    title: title.trim(),
    description: (description ?? "").trim(),
    order,
  };
}

const getMetaBySlug = (slug: string | undefined) => {
  if (!slug) notFound();
  const meta = lessonMeta[slug];
  if (!meta) {
    notFound();
  }
  return normalizeMeta(meta, slug);
};

export const getAllLessonMeta = cache(async (): Promise<LessonMeta[]> => {
  const metas = lessonSlugs.map((slug) => getMetaBySlug(slug));

  return metas.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.slug.localeCompare(b.slug);
  });
});

export const getLessonBySlug = cache(async (slug: string | undefined): Promise<Lesson> => {
  const meta = getMetaBySlug(slug);

  return {
    meta,
  };
});
