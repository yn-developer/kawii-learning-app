'use client';

import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./Button.module.css";

type ButtonVariant = "primary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClassName: Record<ButtonVariant, string> = {
  primary: styles.primary,
  ghost: styles.ghost,
};

export function Button({
  children,
  className,
  variant = "primary",
  fullWidth = false,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        variantClassName[variant],
        fullWidth && styles.fullWidth,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
