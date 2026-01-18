'use client';

import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import styles from "./Stack.module.css";

type StackGap = "none" | "xs" | "sm" | "md" | "lg";
type StackAlign = "start" | "center" | "end" | "stretch";
type StackJustify = "start" | "center" | "end" | "between";

type StackProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
} & ComponentPropsWithoutRef<T>;

const gapClassName: Record<StackGap, string> = {
  none: styles.gapNone,
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
};

const alignClassName: Record<StackAlign, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
};

const justifyClassName: Record<StackJustify, string> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
};

export function Stack<T extends ElementType = "div">({
  as,
  children,
  className,
  gap = "md",
  align = "stretch",
  justify = "start",
  ...rest
}: StackProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={clsx(
        styles.stack,
        gapClassName[gap],
        alignClassName[align],
        justifyClassName[justify],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
