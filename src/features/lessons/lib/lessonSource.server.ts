import "server-only";
import path from "path";
import fs from "fs/promises";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import type { Lesson, LessonMeta } from "@/features/lessons/model/types";

const LESSONS_DIR = path.join(process.cwd(), "src", "content", "lessons");

function parseMetaFromMDX(source: string): LessonMeta {
  // We expect: export const meta = { ... };
  const match = source.match(/export\s+const\s+meta\s*=\s*({[\s\S]*?});/m);
  if (!match) throw new Error("Missing `export const meta = {...}` in MDX file.");

  const objLiteral = match[1];
  const meta = new Function(`return (${objLiteral})`)() as LessonMeta;

  if (!meta.slug || !meta.title) throw new Error("meta.slug and meta.title are required.");
  return meta;
}

export async function getAllLessonMeta(): Promise<LessonMeta[]> {
  const files = await fs.readdir(LESSONS_DIR);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  const metas = await Promise.all(
    mdxFiles.map(async (file) => {
      const full = path.join(LESSONS_DIR, file);
      const source = await fs.readFile(full, "utf8");
      return parseMetaFromMDX(source);
    })
  );

  return metas.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getLessonBySlug(slug: string): Promise<Lesson> {
  const files = await fs.readdir(LESSONS_DIR);
  const file = files.find((f) => f.endsWith(".mdx") && f.includes(slug));
  if (!file) throw new Error(`Lesson not found: ${slug}`);

  const full = path.join(LESSONS_DIR, file);
  const source = await fs.readFile(full, "utf8");
  const meta = parseMetaFromMDX(source);

  if (meta.slug !== slug) {
    // safeguard: ensure slug matches meta
    throw new Error(`Slug mismatch: URL=${slug}, meta.slug=${meta.slug}`);
  }

  const mdxSource = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  });

  return { meta, mdxSource: mdxSource as unknown as string };
}
