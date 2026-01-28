'use client';

import clsx from "clsx";

import { useI18n } from "@/core/lib/i18n";

import styles from "./LanguageMenu.module.css";

export function LanguageMenu({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <label className={clsx(styles.wrapper, className)}>
      <span className={styles.label} aria-hidden>
        🌐
      </span>
      <select
        className={styles.select}
        value={lang}
        onChange={(e) => {
          const nextLang = e.target.value as "en" | "my";
          setLang(nextLang);
          if (typeof document !== "undefined") {
            document.cookie = `lang=${nextLang}; path=/; max-age=${60 * 60 * 24 * 365}`;
            window.location.reload();
          }
        }}
        aria-label="Language"
      >
        <option value="en">English</option>
        <option value="my">Burmese</option>
      </select>
    </label>
  );
}
