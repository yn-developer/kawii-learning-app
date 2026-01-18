'use client';

import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import styles from "./Container.module.css";

type ContainerSize = "sm" | "md" | "lg" | "full";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  size?: ContainerSize;
} & ComponentPropsWithoutRef<T>;

const sizeClassName: Record<ContainerSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  full: styles.sizeFull,
};

export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  size = "lg",
  ...rest
}: ContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={clsx(styles.container, sizeClassName[size], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
