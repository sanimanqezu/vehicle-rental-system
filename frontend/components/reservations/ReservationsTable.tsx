"use client";

import { motion } from "framer-motion";
import { Edit2, Trash2, CalendarDays, MapPin } from "lucide-react";
import { Reservation, Car, User } from "@/types";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { formatDate, getDurationDays } from "@/lib/utils";

interface ReservationsTableProps {
  reservations: Reservation[];
  cars: Car[];
  users: User[];
  isLoading: boolean;
  onEdit: (r: Reservation) => void;
  onDelete: (r: Reservation) => void;
}

const STATUS_STYLE = {
  active:    { bg: "rgba(29,185,84,0.10)",   color: "#1DB954",  border: "rgba(29,185,84,0.25)"  },
  upcoming:  { bg: "rgba(41,121,255,0.10)",  color: "#5C9BFF",  border: "rgba(41,121,255,0.25)" },
  completed: { bg: "rgba(124,128,140,0.10)", color: "#7C808C",  border: "rgba(124,128,140,0.2)" },
};

function getStatus(r: Reservation): "active" | "upcoming" | "completed" {
  const now  = new Date();
  const from = new Date(r.fromDate);
  const to   = new Date(r.toDate);
  if (now < from) return "upcoming";
  if (now > to)   return "completed";
  return "active";
}

export function ReservationsTable({ reservations, cars, users, isLoading, onEdit, onDelete }: ReservationsTableProps) {
  if (isLoading) return <SkeletonTable rows={6} />;

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ padding: "64px 24px", gap: 12 }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface-3)",
          border: "1px solid var(--color-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <CalendarDays size={18} style={{ color: "var(--color-text-tertiary)" }} />
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>No reservations found</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table className="data-table" style={{ minWidth: 1040 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>Vehicle</th>
            <th>Pickup</th>
            <th>Return</th>
            <th>Locations</th>
            <th>Duration</th>
            <th>Status</th>
            <th style={{ width: 80 }}></th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r, i) => {
            const car    = cars.find(c => c.vin === r.carId);
            const user   = users.find(u => u.id === r.userId);
            const days   = getDurationDays(r.fromDate, r.toDate);
            const status = getStatus(r);
            const st     = STATUS_STYLE[status];

            return (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.025, duration: 0.2 }}
              >
                {/* ID */}
                <td>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 11.5,
                    color: "var(--color-accent-bright)",
                    background: "var(--color-accent-muted)",
                    border: "1px solid var(--color-accent-border)",
                    padding: "2px 7px", borderRadius: "var(--radius-xs)",
                  }}>
                    #{r.id}
                  </span>
                </td>

                {/* Client */}
                <td>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
                    {user ? `${user.firstName} ${user.lastName}` : `User #${r.userId}`}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 1, fontFamily: "var(--font-mono)" }}>
                    @{user?.username ?? r.userId}
                  </p>
                </td>

                {/* Vehicle */}
                <td>
                  {car ? (
                    <>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
                        {car.make} {car.model}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 1, fontFamily: "var(--font-mono)" }}>
                        {car.vin}
                      </p>
                    </>
                  ) : (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--color-text-tertiary)" }}>
                      {r.carId}
                    </span>
                  )}
                </td>

                {/* Pickup date */}
                <td style={{ whiteSpace: "nowrap" }}>
                  <p style={{ fontSize: 12.5, color: "var(--color-text-primary)" }}>{formatDate(r.fromDate)}</p>
                </td>

                {/* Return date */}
                <td style={{ whiteSpace: "nowrap" }}>
                  <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>{formatDate(r.toDate)}</p>
                </td>

                {/* Locations */}
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <MapPin size={10} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: "var(--color-text-secondary)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.pickUpLocation}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <MapPin size={10} style={{ color: "var(--color-error)", flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: "var(--color-text-tertiary)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.dropOffLocation}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Duration */}
                <td style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--color-text-secondary)" }}>
                  {days}d
                </td>

                {/* Status */}
                <td>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 10.5, fontWeight: 600,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    padding: "3px 9px", borderRadius: 99,
                    background: st.bg, color: st.color, border: `1px solid ${st.border}`,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: st.color, flexShrink: 0 }} />
                    {status}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                    <button
                      onClick={() => onEdit(r)}
                      style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", background: "transparent", border: "none", color: "var(--color-text-tertiary)", cursor: "pointer", transition: "all 120ms" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface-3)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-primary)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-tertiary)"; }}
                    >
                      <Edit2 size={13} strokeWidth={1.8} />
                    </button>
                    <button
                      onClick={() => onDelete(r)}
                      style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", background: "transparent", border: "none", color: "var(--color-text-tertiary)", cursor: "pointer", transition: "all 120ms" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-error-muted)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-error)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-tertiary)"; }}
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
