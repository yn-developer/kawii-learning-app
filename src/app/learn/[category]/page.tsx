import { notFound } from "next/navigation";

import { AppShell } from "@/core/ui/AppShell";
import { Container } from "@/core/ui/Container";
import { getAllLessonMeta } from "@/features/lessons/lib/mdx";
import { LessonList } from "@/features/lessons/ui/LessonList";
import { cookies } from "next/headers";

type CategoryPageProps = {
  params: { category: string } | Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value;
  const lessons = await getAllLessonMeta(lang);
  const filtered = lessons.filter((lesson) => lesson.category === category);

  if (filtered.length === 0) {
    notFound();
  }

  return (
    <AppShell header={<Header category={category} />}>
      <Container size="lg">
        <LessonList lessons={filtered} />
      </Container>
    </AppShell>
  );
}

function Header({ category }: { category: string }) {
  return (
    <Container size="lg">
      <h1 style={{ textTransform: "capitalize" }}>{category}</h1>
    </Container>
  );
}
