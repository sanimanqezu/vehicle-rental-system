"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Car, Users, CalendarDays, DollarSign } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReservationsChart } from "@/components/dashboard/ReservationsChart";
import { CarsByMakeChart } from "@/components/dashboard/CarsByMakeChart";
import { SkeletonCard, Skeleton } from "@/components/ui/Skeleton";
import { useCarStore } from "@/store/useCarStore";
import { useUserStore } from "@/store/useUserStore";
import { useReservationStore } from "@/store/useReservationStore";
import { formatCurrency, formatDate, getDurationDays } from "@/lib/utils";

export default function DashboardPage() {
  const { cars, fetchCars, isLoading: carsLoading }          = useCarStore();
  const { users, fetchUsers, isLoading: usersLoading }       = useUserStore();
  const { reservations, fetchReservations, isLoading: resLoading } = useReservationStore();

  useEffect(() => {
    fetchCars();
    fetchUsers();
    fetchReservations();
  }, [fetchCars, fetchUsers, fetchReservations]);

  const isLoading = carsLoading || usersLoading || resLoading;

  const now = new Date();
  const activeReservations = reservations.filter(
    r => new Date(r.fromDate) <= now && new Date(r.toDate) >= now
  ).length;

  const totalRevenue = reservations.reduce((acc, r) => {
    const car = cars.find(c => c.vin === r.carId);
    if (!car) return acc;
    return acc + car.price * getDurationDays(r.fromDate, r.toDate);
  }, 0);

  const recent = [...reservations].reverse().slice(0, 6);

  return (
    <div>
      <Header title="Overview" subtitle="Vehicle Rental System" />

      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Stats ──────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatsCard
                title="Total Fleet"
                value={cars.length}
                icon={<Car size={15} strokeWidth={1.8} />}
                description={`${cars.length} vehicles registered`}
                index={0}
              />
              <StatsCard
                title="Clients"
                value={users.length}
                icon={<Users size={15} strokeWidth={1.8} />}
                description="Registered accounts"
                index={1}
              />
              <StatsCard
                title="Active Bookings"
                value={activeReservations}
                icon={<CalendarDays size={15} strokeWidth={1.8} />}
                description={`${reservations.length} total reservations`}
                trend={{ value: 12, label: "this month" }}
                index={2}
              />
              <StatsCard
                title="Est. Revenue"
                value={formatCurrency(totalRevenue)}
                icon={<DollarSign size={15} strokeWidth={1.8} />}
                trend={{ value: 8, label: "vs last month" }}
                accent
                index={3}
              />
            </>
          )}
        </div>

        {/* ── Charts ─────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Reservations chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.35 }}
            className="card"
          >
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, letterSpacing: "0.03em", color: "var(--color-text-primary)" }}>
                    Reservation Activity
                  </p>
                  <p style={{ fontSize: 11.5, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                    Last 6 months
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    padding: "3px 9px", borderRadius: 99,
                    background: "var(--color-success-muted)",
                    color: "var(--color-success)",
                    border: "1px solid rgba(29,185,84,0.2)",
                  }}
                >
                  {reservations.length} total
                </span>
              </div>
            </div>
            <div style={{ padding: "20px 20px 8px" }}>
              {isLoading
                ? <Skeleton className="w-full" style={{ height: 180 }} />
                : <ReservationsChart reservations={reservations} />
              }
            </div>
          </motion.div>

          {/* Fleet by make chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.35 }}
            className="card"
          >
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, letterSpacing: "0.03em", color: "var(--color-text-primary)" }}>
                    Fleet Distribution
                  </p>
                  <p style={{ fontSize: 11.5, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                    Vehicles by make
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    padding: "3px 9px", borderRadius: 99,
                    background: "var(--color-surface-3)",
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-border-strong)",
                  }}
                >
                  {cars.length} cars
                </span>
              </div>
            </div>
            <div style={{ padding: "20px 20px 8px" }}>
              {isLoading
                ? <Skeleton className="w-full" style={{ height: 180 }} />
                : <CarsByMakeChart cars={cars} />
              }
            </div>
          </motion.div>
        </div>

        {/* ── Recent Reservations ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.35 }}
          className="card"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, letterSpacing: "0.03em", color: "var(--color-text-primary)" }}>
                Recent Reservations
              </p>
              <p style={{ fontSize: 11.5, color: "var(--color-text-tertiary)" }}>
                Latest {recent.length} bookings
              </p>
            </div>
          </div>

          {recent.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center" style={{ padding: "48px 24px" }}>
              <p style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>No reservations yet</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>ID</th>
                  <th>Client</th>
                  <th>Vehicle</th>
                  <th>Pick-up</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(r => {
                  const car  = cars.find(c => c.vin === r.carId);
                  const user = users.find(u => u.id === r.userId);
                  const isPast   = new Date(r.toDate) < now;
                  const isActive = new Date(r.fromDate) <= now && new Date(r.toDate) >= now;

                  return (
                    <tr key={r.id}>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--color-accent-bright)", background: "var(--color-accent-muted)", padding: "2px 6px", borderRadius: "var(--radius-xs)" }}>
                          #{r.id}
                        </span>
                      </td>
                      <td>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
                            {user ? `${user.firstName} ${user.lastName}` : `User #${r.userId}`}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                            @{user?.username ?? r.userId}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>
                          {car ? `${car.make} ${car.model}` : r.carId}
                        </p>
                        {car && <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{car.vin}</p>}
                      </td>
                      <td>
                        <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>{r.pickUpLocation}</p>
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-text-secondary)" }}>
                        {formatDate(r.fromDate)}
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-text-secondary)" }}>
                        {formatDate(r.toDate)}
                      </td>
                      <td>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                          padding: "3px 9px", borderRadius: 99,
                          background: isActive ? "var(--color-success-muted)" : isPast ? "var(--color-surface-3)" : "var(--color-info-muted)",
                          color: isActive ? "var(--color-success)" : isPast ? "var(--color-text-tertiary)" : "var(--color-info)",
                          border: `1px solid ${isActive ? "rgba(29,185,84,0.2)" : isPast ? "var(--color-border)" : "rgba(41,121,255,0.2)"}`,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                          {isActive ? "Active" : isPast ? "Completed" : "Upcoming"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </motion.div>

      </div>
    </div>
  );
}
