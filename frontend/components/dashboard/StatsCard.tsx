"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: { value: number; label: string };
  accent?: boolean;
  index?: number;
}

export function StatsCard({ title, value, icon, description, trend, accent, index = 0 }: StatsCardProps) {
  const trendPositive = trend && trend.value > 0;
  const trendNeutral  = trend && trend.value === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden"
      style={{
        background: accent ? "linear-gradient(135deg, rgba(212,147,10,0.12) 0%, rgba(212,147,10,0.04) 100%)" : "var(--color-surface)",
        border: `1px solid ${accent ? "var(--color-accent-border)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "22px 24px 20px",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between" style={{ marginBottom: 16 }}>
        <p
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: accent ? "var(--color-accent)" : "var(--color-text-tertiary)",
            lineHeight: 1,
          }}
        >
          {title}
        </p>
        <div
          className="flex items-center justify-center"
          style={{
            width: 34,
            height: 34,
            borderRadius: "var(--radius-sm)",
            background: accent ? "rgba(212,147,10,0.18)" : "var(--color-surface-3)",
            color: accent ? "var(--color-accent-bright)" : "var(--color-text-secondary)",
          }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <p className="stat-value" style={{ color: accent ? "var(--color-accent-bright)" : "var(--color-text-primary)" }}>
        {value}
      </p>

      {/* Bottom row */}
      <div className="flex items-center" style={{ marginTop: 12, minHeight: 18 }}>
        {trend ? (
          <div className="flex items-center gap-1.5">
            <div
              className="flex items-center justify-center"
              style={{
                width: 16, height: 16,
                borderRadius: 4,
                background: trendNeutral
                  ? "rgba(124,128,140,0.12)"
                  : trendPositive
                    ? "var(--color-success-muted)"
                    : "var(--color-error-muted)",
              }}
            >
              {trendNeutral
                ? <Minus size={9} style={{ color: "var(--color-text-tertiary)" }} />
                : trendPositive
                  ? <TrendingUp size={9} style={{ color: "var(--color-success)" }} />
                  : <TrendingDown size={9} style={{ color: "var(--color-error)" }} />
              }
            </div>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 500,
                color: trendNeutral
                  ? "var(--color-text-tertiary)"
                  : trendPositive
                    ? "var(--color-success)"
                    : "var(--color-error)",
              }}
            >
              {trendPositive ? "+" : ""}{trend.value}%
            </span>
            <span style={{ fontSize: 11.5, color: "var(--color-text-tertiary)" }}>
              {trend.label}
            </span>
          </div>
        ) : description ? (
          <span style={{ fontSize: 11.5, color: "var(--color-text-tertiary)" }}>{description}</span>
        ) : null}
      </div>

      {/* Accent bottom border */}
      {accent && (
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 2, background: "linear-gradient(90deg, var(--color-accent) 0%, transparent 60%)" }}
        />
      )}
    </motion.div>
  );
}
