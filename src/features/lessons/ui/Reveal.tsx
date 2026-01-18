'use client';

import { ReactNode } from "react";
import * as Accordion from "@radix-ui/react-accordion";

import { cn } from "@/core/lib/classnames";

import styles from "./Reveal.module.css";

type RevealProps = {
  title: string;
  children: ReactNode;
};

export function Reveal({ title, children }: RevealProps) {
  return (
    <Accordion.Root type="single" collapsible className={styles.root}>
      <Accordion.Item value="reveal" className={styles.item}>
        <Accordion.Header className={styles.header}>
          <Accordion.Trigger className={styles.trigger}>
            <span className={styles.title}>{title}</span>
            <span aria-hidden className={cn(styles.icon)} />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className={styles.content}>
          <div className={styles.panel}>{children}</div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
