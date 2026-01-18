import { AppShell } from "@/core/ui/AppShell";
import { Container } from "@/core/ui/Container";
import { LessonList } from "@/features/lessons/ui/LessonList";
import { getAllLessonMeta } from "@/features/lessons/lib/mdx";

export default async function LearnPage() {
  const lessons = await getAllLessonMeta();

  return (
    <AppShell header={<Header />}>
      <Container size="lg">
        <LessonList lessons={lessons} />
      </Container>
    </AppShell>
  );
}

function Header() {
  return (
    <Container size="lg">
      <h1>Learning Path</h1>
    </Container>
  );
}
