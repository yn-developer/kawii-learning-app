import { notFound } from "next/navigation";
import { cache } from "react";

import { availableLocales, defaultLocale, lessonMeta, lessonMetaByLocale, lessonSlugs, lessonLoaders } from "@/content/lessons";
import type { Lesson, LessonMeta, Locale } from "@/features/lessons/model/types";

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
  const category =
    typeof meta.category === "string" && meta.category.trim().length > 0
      ? meta.category.trim()
      : "general";

  assertSafeSlug(resolvedSlug);
  assertSafeSlug(category);

  if (!title || typeof order !== "number" || !Number.isFinite(order)) {
    notFound();
  }

  return {
    slug: resolvedSlug,
    category,
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

export const getAllLessonMeta = cache(async (locale?: string): Promise<LessonMeta[]> => {
  const resolvedLocale = normalizeLocale(locale);
  const metas = lessonSlugs.map((slug) => {
    const base = getMetaBySlug(slug);
    return lessonMetaByLocale[slug]?.[resolvedLocale] ?? base;
  });

  return metas.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    if (a.order !== b.order) return a.order - b.order;
    return a.slug.localeCompare(b.slug);
  });
});

function normalizeLocale(locale: string | undefined): Locale {
  const normalized = (locale ?? "").toLowerCase();
  if (availableLocales.includes(normalized)) return normalized as Locale;
  return defaultLocale as Locale;
}

export const getLessonBySlug = cache(
  async (slug: string | undefined, locale?: string | undefined): Promise<Lesson> => {
    const meta = getMetaBySlug(slug);
    const resolvedLocale = normalizeLocale(locale);
    const localizedMeta = lessonMetaByLocale[meta.slug]?.[resolvedLocale] ?? meta;

    return {
      meta: localizedMeta,
    };
  },
);

export function getLessonLoader(slug: string, locale: string | undefined) {
  const resolvedLocale = normalizeLocale(locale);
  const loaders = lessonLoaders[slug];
  if (!loaders) return undefined;
  return loaders[resolvedLocale] ?? loaders[defaultLocale] ?? Object.values(loaders)[0];
}
