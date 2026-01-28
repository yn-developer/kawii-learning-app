'use client';

import { Container } from "@/core/ui/Container";
import { LanguageMenu } from "@/core/ui/LanguageMenu";
import { Row } from "@/core/ui/Row";
import { useI18n } from "@/core/lib/i18n";
import { ThemeToggle } from "@/core/ui/ThemeToggle";

export function LearnHeader() {
  const { t } = useI18n();

  return (
    <Container size="lg">
      <Row justify="between" align="center">
        <h1 style={{ margin: 0 }}>{t("learningPath")}</h1>
        <Row align="center" gap="sm">
          <LanguageMenu />
          <ThemeToggle />
        </Row>
      </Row>
    </Container>
  );
}
