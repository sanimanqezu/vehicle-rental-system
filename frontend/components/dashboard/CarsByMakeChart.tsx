"use client";

import { Car } from "@/types";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CarsByMakeChartProps {
  cars: Car[];
}

const COLORS = ["#E8A020", "#3B82F6", "#22C55E", "#F59E0B", "#8B5CF6", "#EF4444", "#06B6D4"];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 shadow-xl">
      <p className="text-xs text-[var(--color-text-muted)] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{payload[0].value} vehicles</p>
    </div>
  );
};

export function CarsByMakeChart({ cars }: CarsByMakeChartProps) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    cars.forEach((car) => {
      counts[car.make] = (counts[car.make] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([make, count]) => ({ make, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [cars]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="make"
          tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={40}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} opacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
