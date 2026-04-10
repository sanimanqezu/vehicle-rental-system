import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "error" | "warning" | "info" | "accent";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
  success: "bg-[var(--color-success-muted)] text-[var(--color-success)] border-[rgba(34,197,94,0.2)]",
  error: "bg-[var(--color-error-muted)] text-[var(--color-error)] border-[rgba(239,68,68,0.2)]",
  warning: "bg-[var(--color-warning-muted)] text-[var(--color-warning)] border-[rgba(245,158,11,0.2)]",
  info: "bg-[var(--color-info-muted)] text-[var(--color-info)] border-[rgba(59,130,246,0.2)]",
  accent: "bg-[var(--color-accent-muted)] text-[var(--color-accent)] border-[var(--color-accent-border)]",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-text-muted)]",
  success: "bg-[var(--color-success)]",
  error: "bg-[var(--color-error)]",
  warning: "bg-[var(--color-warning)]",
  info: "bg-[var(--color-info)]",
  accent: "bg-[var(--color-accent)]",
};

export function Badge({ variant = "default", children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotStyles[variant])} />
      )}
      {children}
    </span>
  );
}
