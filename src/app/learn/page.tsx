import { AppShell } from "@/core/ui/AppShell";
import { Container } from "@/core/ui/Container";
import { LessonList } from "@/features/lessons/ui/LessonList";
import { getAllLessonMeta } from "@/features/lessons/lib/mdx";
import { LearnHeader } from "@/features/lessons/ui/LearnHeader";
import { cookies } from "next/headers";

export default async function LearnPage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value;
  const lessons = await getAllLessonMeta(lang);

  return (
    <AppShell header={<LearnHeader />}>
      <Container size="lg">
        <LessonList lessons={lessons} />
      </Container>
    </AppShell>
  );
}
