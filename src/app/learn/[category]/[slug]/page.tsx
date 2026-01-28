import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { AppShell } from "@/core/ui/AppShell";
import { Container } from "@/core/ui/Container";
import { getLessonBySlug } from "@/features/lessons/lib/mdx";
import { LessonPage } from "@/features/lessons/ui/LessonPage";
import { lessonSlugs, lessonMeta } from "@/content/lessons";

type LessonRouteProps = {
  params: { category: string; slug: string } | Promise<{ category: string; slug: string }>;
};

export default async function LessonRoute({ params }: LessonRouteProps) {
  const { category, slug } = await params;
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value;
  const lesson = await getLessonBySlug(slug, lang);

  if (lesson.meta.category !== category) {
    // Redirect to the canonical category path if mismatched
    return redirect(`/learn/${lesson.meta.category}/${lesson.meta.slug}`);
  }

  return (
    <AppShell header={<Header title={lesson.meta.title} />}>
      <Container size="lg">
        <LessonPage lesson={lesson} />
      </Container>
    </AppShell>
  );
}

function Header({ title }: { title: string }) {
  return (
    <Container size="lg">
      <h1>{title}</h1>
    </Container>
  );
}

export function generateStaticParams() {
  return lessonSlugs.map((slug) => {
    const meta = lessonMeta[slug];
    if (!meta) return null;
    return { category: meta.category, slug: meta.slug };
  }).filter(Boolean) as { category: string; slug: string }[];
}
