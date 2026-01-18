'use client';

import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import styles from "./Row.module.css";

type RowGap = "none" | "xs" | "sm" | "md" | "lg";
type RowAlign = "start" | "center" | "end" | "stretch" | "baseline";
type RowJustify = "start" | "center" | "end" | "between" | "around";

type RowProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  gap?: RowGap;
  align?: RowAlign;
  justify?: RowJustify;
  wrap?: boolean;
} & ComponentPropsWithoutRef<T>;

const gapClassName: Record<RowGap, string> = {
  none: styles.gapNone,
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
};

const alignClassName: Record<RowAlign, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
  baseline: styles.alignBaseline,
};

const justifyClassName: Record<RowJustify, string> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
  around: styles.justifyAround,
};

export function Row<T extends ElementType = "div">({
  as,
  children,
  className,
  gap = "sm",
  align = "center",
  justify = "start",
  wrap = true,
  ...rest
}: RowProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={clsx(
        styles.row,
        gapClassName[gap],
        alignClassName[align],
        justifyClassName[justify],
        !wrap && styles.noWrap,
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
