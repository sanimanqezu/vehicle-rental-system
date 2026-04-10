"use client";

import { motion } from "framer-motion";
import { Edit2, Trash2, Car } from "lucide-react";
import { Car as CarType } from "@/types";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { formatCurrency, formatNumber } from "@/lib/utils";

const fuelBadge: Record<string, { bg: string; color: string; border: string }> = {
  PETROL:   { bg: "var(--color-warning-muted)", color: "var(--color-warning)",  border: "rgba(245,158,11,0.2)"  },
  DIESEL:   { bg: "var(--color-surface-3)",     color: "var(--color-text-secondary)", border: "var(--color-border-strong)" },
  ELECTRIC: { bg: "var(--color-success-muted)", color: "var(--color-success)",  border: "rgba(29,185,84,0.2)"   },
  HYBRID:   { bg: "var(--color-info-muted)",    color: "var(--color-info)",     border: "rgba(41,121,255,0.2)"  },
};

interface CarsTableProps {
  cars: CarType[];
  isLoading: boolean;
  onEdit: (car: CarType) => void;
  onDelete: (car: CarType) => void;
}

export function CarsTable({ cars, isLoading, onEdit, onDelete }: CarsTableProps) {
  if (isLoading) return <SkeletonTable rows={6} />;

  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ padding: "64px 24px", gap: 12 }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface-3)",
          border: "1px solid var(--color-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Car size={18} style={{ color: "var(--color-text-tertiary)" }} />
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>No vehicles in the fleet</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table className="data-table" style={{ minWidth: 960 }}>
        <thead>
          <tr>
            <th>VIN</th>
            <th>Make & Model</th>
            <th>Year</th>
            <th>Color</th>
            <th>Transmission</th>
            <th>Fuel</th>
            <th style={{ textAlign: "right" }}>Mileage</th>
            <th style={{ textAlign: "right" }}>Price</th>
            <th style={{ width: 80 }}></th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, i) => {
            const fuel = fuelBadge[car.fuelType] ?? fuelBadge.PETROL;
            return (
              <motion.tr
                key={car.vin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
              >
                <td>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 11.5,
                    color: "var(--color-accent-bright)",
                    background: "var(--color-accent-muted)",
                    border: "1px solid var(--color-accent-border)",
                    padding: "2px 7px", borderRadius: "var(--radius-xs)",
                  }}>
                    {car.vin}
                  </span>
                </td>
                <td>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
                    {car.make} {car.model}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 1 }}>
                    {car.engine}
                  </p>
                </td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--color-text-secondary)" }}>
                  {car.year}
                </td>
                <td>
                  <div className="flex items-center" style={{ gap: 7 }}>
                    <div style={{
                      width: 12, height: 12,
                      borderRadius: "50%",
                      background: car.color.toLowerCase(),
                      border: "1px solid rgba(255,255,255,0.12)",
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>
                      {car.color}
                    </span>
                  </div>
                </td>
                <td style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>
                  {car.transmission.charAt(0) + car.transmission.slice(1).toLowerCase()}
                </td>
                <td>
                  <span style={{
                    display: "inline-block",
                    fontSize: 10.5, fontWeight: 600,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    padding: "3px 8px", borderRadius: 99,
                    background: fuel.bg,
                    color: fuel.color,
                    border: `1px solid ${fuel.border}`,
                  }}>
                    {car.fuelType}
                  </span>
                </td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--color-text-secondary)" }}>
                  {formatNumber(car.mileage)} km
                </td>
                <td style={{ textAlign: "right", fontWeight: 600, fontSize: 13, color: "var(--color-text-primary)" }}>
                  {formatCurrency(car.price)}
                </td>
                <td>
                  <div className="flex items-center justify-end" style={{ gap: 4 }}>
                    <button
                      onClick={() => onEdit(car)}
                      className="flex items-center justify-center rounded-[var(--radius-sm)] transition-colors"
                      style={{ width: 28, height: 28, color: "var(--color-text-tertiary)", background: "transparent" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface-3)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-primary)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-tertiary)";
                      }}
                    >
                      <Edit2 size={13} strokeWidth={1.8} />
                    </button>
                    <button
                      onClick={() => onDelete(car)}
                      className="flex items-center justify-center rounded-[var(--radius-sm)] transition-colors"
                      style={{ width: 28, height: 28, color: "var(--color-text-tertiary)", background: "transparent" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "var(--color-error-muted)";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-error)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-tertiary)";
                      }}
                    >
                      <Trash2 size={13} strokeWidth={1.8} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
