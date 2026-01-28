'use client';

import { Diagram } from "./Diagram";
import { Stack } from "@/core/ui/Stack";
import { Card } from "@/core/ui/Card";
import { Container } from "@/core/ui/Container";

const sampleMermaid = `
graph TD
  A[Request] --> B[Controller]
  B --> C[Service]
  C --> D[Repository]
  D --> E[(Database)]
  C --> F[Provider]
`;

export function LessonExtras() {
  return (
    <Container size="lg">
      <Stack gap="lg">
        <Card padding="lg">
          <h3>What&apos;s inside the course</h3>
          <ul>
            <li>Step-by-step lessons with MDX content</li>
            <li>Interactive quizzes and checkpoints</li>
            <li>Flashcards to reinforce core NestJS concepts</li>
          </ul>
        </Card>
        <Card padding="lg">
          <Diagram title="NestJS request flow (sample)" code={sampleMermaid} />
        </Card>
      </Stack>
    </Container>
  );
}
