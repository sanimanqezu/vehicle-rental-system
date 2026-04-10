import { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        borderRadius: "var(--radius-sm)",
        background: "var(--color-surface-3)",
        animation: "pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        ...style,
      }}
    />
  );
}

export function SkeletonRow() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "0 20px", height: 52,
      borderBottom: "1px solid var(--color-border)",
    }}>
      <Skeleton style={{ width: 68, height: 20, borderRadius: 4 }} />
      <Skeleton style={{ width: 140, height: 18 }} />
      <Skeleton style={{ width: 40, height: 18 }} />
      <Skeleton style={{ width: 80, height: 20, borderRadius: 99 }} />
      <Skeleton style={{ width: 90, height: 18, marginLeft: "auto" }} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      <div style={{
        height: 40, background: "var(--color-surface-2)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex", alignItems: "center", gap: 20, padding: "0 20px",
      }}>
        {[80, 160, 50, 70, 90, 60, 80].map((w, i) => (
          <Skeleton key={i} style={{ width: w, height: 10 }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      padding: "22px 24px 20px",
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Skeleton style={{ width: 80, height: 10 }} />
        <Skeleton style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)" }} />
      </div>
      <Skeleton style={{ width: 100, height: 34 }} />
      <Skeleton style={{ width: 130, height: 11 }} />
    </div>
  );
}

export function SkeletonChartCard() {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "20px 24px 16px",
        borderBottom: "1px solid var(--color-border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Skeleton style={{ width: 140, height: 14 }} />
          <Skeleton style={{ width: 90, height: 10 }} />
        </div>
        <Skeleton style={{ width: 70, height: 22, borderRadius: 99 }} />
      </div>
      <div style={{ padding: "20px 20px 12px" }}>
        <Skeleton style={{ width: "100%", height: 180 }} />
      </div>
    </div>
  );
}
