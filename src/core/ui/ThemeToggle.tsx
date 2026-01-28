'use client';

import clsx from "clsx";

import { useTheme } from "@/core/lib/theme";

import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      className={clsx(styles.button, className)}
      onClick={toggle}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
