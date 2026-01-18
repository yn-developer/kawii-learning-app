'use client';

import clsx from "clsx";
import type { ReactNode } from "react";

import styles from "./AppShell.module.css";

type AppShellProps = {
  header: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  mainClassName?: string;
  stickyHeader?: boolean;
};

export function AppShell({
  header,
  children,
  className,
  headerClassName,
  mainClassName,
  stickyHeader = false,
}: AppShellProps) {
  return (
    <div className={clsx(styles.shell, className)}>
      <header
        className={clsx(
          styles.header,
          stickyHeader && styles.sticky,
          headerClassName,
        )}
      >
        {header}
      </header>
      <main className={clsx(styles.main, mainClassName)}>{children}</main>
    </div>
  );
}
