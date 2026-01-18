import type { ComponentType } from "react";

export type LessonMeta = {
  slug: string;
  title: string;
  description: string;
  order: number;
};

export type LessonModule = {
  default: ComponentType;
  meta?: Partial<LessonMeta>;
};

export type Lesson = {
  meta: LessonMeta;
  mdxSource?: string;
};
