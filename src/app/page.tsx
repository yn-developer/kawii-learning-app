'use client';

import Link from "next/link";

import { LanguageMenu } from "@/core/ui/LanguageMenu";
import { useI18n } from "@/core/lib/i18n";
import { ThemeToggle } from "@/core/ui/ThemeToggle";
import styles from "./page.module.css";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <div className={styles.brand}>{t("brand")}</div>
        <div className={styles.navActions}>
          <Link href="/learn" className={styles.navLink}>
            {t("goToCourse")}
          </Link>
          <LanguageMenu />
          <ThemeToggle />
        </div>
      </nav>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>{t("heroTitle")}</h1>
          <p className={styles.subtitle}>{t("heroSubtitle")}</p>
          <Link href="/learn" className={styles.cta}>
            {t("startLearning")}
          </Link>
        </section>
      </main>
    </div>
  );
}
