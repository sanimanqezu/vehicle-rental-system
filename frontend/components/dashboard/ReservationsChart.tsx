"use client";

import { Reservation } from "@/types";
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, startOfMonth, eachMonthOfInterval, subMonths } from "date-fns";

interface ReservationsChartProps {
  reservations: Reservation[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 shadow-xl">
      <p className="text-xs text-[var(--color-text-muted)] mb-1">{label}</p>
      <p className="text-sm font-semibold text-[var(--color-accent)]">
        {payload[0].value} reservations
      </p>
    </div>
  );
};

export function ReservationsChart({ reservations }: ReservationsChartProps) {
  const data = useMemo(() => {
    const now = new Date();
    const months = eachMonthOfInterval({ start: subMonths(now, 5), end: now });

    return months.map((month) => {
      const count = reservations.filter((r) => {
        try {
          const d = startOfMonth(parseISO(r.fromDate));
          return d.getTime() === month.getTime();
        } catch { return false; }
      }).length;

      return { month: format(month, "MMM"), count };
    });
  }, [reservations]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="reservationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E8A020" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#E8A020" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="month"
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
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#E8A020"
          strokeWidth={2}
          fill="url(#reservationGradient)"
          dot={{ fill: "#E8A020", r: 3, strokeWidth: 0 }}
          activeDot={{ fill: "#E8A020", r: 5, strokeWidth: 2, stroke: "var(--color-surface)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
