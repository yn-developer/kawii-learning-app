'use client';

import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import styles from "./Card.module.css";

type CardPadding = "sm" | "md" | "lg";

type CardProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
} & ComponentPropsWithoutRef<T>;

const paddingClassName: Record<CardPadding, string> = {
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

export function Card<T extends ElementType = "div">({
  as,
  children,
  className,
  padding = "md",
  ...rest
}: CardProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={clsx(styles.card, paddingClassName[padding], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
