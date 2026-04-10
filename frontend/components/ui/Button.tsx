"use client";

import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const base = "inline-flex items-center justify-center font-medium transition-all duration-120 select-none disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-bright)] shadow-[0_0_16px_var(--color-accent-glow)]",
  secondary:
    "bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text-primary)]",
  danger:
    "bg-[var(--color-error-muted)] text-[var(--color-error)] border border-[rgba(229,57,53,0.2)] hover:bg-[var(--color-error)] hover:text-white hover:border-transparent",
  outline:
    "bg-transparent text-[var(--color-accent-bright)] border border-[var(--color-accent-border)] hover:bg-[var(--color-accent-muted)]",
};

const sizes: Record<Size, { height: number; paddingX: number; fontSize: number; gap: number; radius: string }> = {
  sm: { height: 30, paddingX: 11, fontSize: 12,   gap: 6,  radius: "var(--radius-sm)" },
  md: { height: 36, paddingX: 14, fontSize: 13,   gap: 7,  radius: "var(--radius-sm)" },
  lg: { height: 42, paddingX: 18, fontSize: 13.5, gap: 8,  radius: "var(--radius-md)" },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, className, disabled, style, ...props }, ref) => {
    const s = sizes[size];
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.08 }}
        className={cn(base, variants[variant], className)}
        disabled={disabled || isLoading}
        style={{
          height: s.height,
          paddingLeft: s.paddingX,
          paddingRight: s.paddingX,
          fontSize: s.fontSize,
          gap: s.gap,
          borderRadius: s.radius,
          fontFamily: "var(--font-body)",
          letterSpacing: "0.01em",
          ...style,
        }}
        {...props}
      >
        {isLoading ? (
          <span
            style={{
              width: 13, height: 13,
              border: "1.5px solid currentColor",
              borderTopColor: "transparent",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.65s linear infinite",
            }}
          />
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
