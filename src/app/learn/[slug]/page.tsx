import { AppShell } from "@/core/ui/AppShell";
import { Container } from "@/core/ui/Container";
import { getLessonBySlug } from "@/features/lessons/lib/mdx";
import { LessonPage } from "@/features/lessons/ui/LessonPage";
import { lessonSlugs } from "@/content/lessons";

type LessonPageProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export default async function LessonRoute({ params }: LessonPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const lesson = await getLessonBySlug(slug);

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
  return lessonSlugs.map((slug) => ({ slug }));
}
