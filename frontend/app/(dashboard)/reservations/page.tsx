"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, SlidersHorizontal, X, ChevronDown, ArrowUpDown, RotateCcw, CalendarDays, MapPin, Clock, Car } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { ReservationsTable } from "@/components/reservations/ReservationsTable";
import { ReservationForm } from "@/components/reservations/ReservationForm";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useReservationStore } from "@/store/useReservationStore";
import { useCarStore } from "@/store/useCarStore";
import { useUserStore } from "@/store/useUserStore";
import { useReservationsUIStore } from "@/store/useReservationsUIStore";
import { Reservation } from "@/types";
import { ReservationFormValues } from "@/schemas";

type ModalMode    = "create" | "edit" | "delete" | null;
type SortKey      = "fromDate" | "toDate" | "userId" | "carId";
type SortDir      = "asc" | "desc";
type StatusFilter = "" | "upcoming" | "active" | "completed";

interface Filters {
  query:        string;
  status:       StatusFilter;
  userId:       string;
  carMakes:     string[];
  dateFrom:     string;
  dateTo:       string;
  location:     string;
  durationPreset: string;   // "1-3" | "4-7" | "8-14" | "15+"
}

const EMPTY: Filters = { query: "", status: "", userId: "", carMakes: [], dateFrom: "", dateTo: "", location: "", durationPreset: "" };

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  active:    { bg: "rgba(29,185,84,0.1)",   color: "#1DB954",  border: "rgba(29,185,84,0.25)"  },
  upcoming:  { bg: "rgba(41,121,255,0.1)",  color: "#5C9BFF",  border: "rgba(41,121,255,0.25)" },
  completed: { bg: "rgba(124,128,140,0.1)", color: "#7C808C",  border: "rgba(124,128,140,0.2)" },
};

const DURATION_PRESETS = [
  { label: "1–3 days",  key: "1-3",  min: 1,  max: 3  },
  { label: "4–7 days",  key: "4-7",  min: 4,  max: 7  },
  { label: "8–14 days", key: "8-14", min: 8,  max: 14 },
  { label: "15+ days",  key: "15+",  min: 15, max: 999 },
];

const DATE_PRESETS = [
  { label: "Today",       getDates: () => { const d = new Date().toISOString().split("T")[0]; return [d, d]; } },
  { label: "This week",   getDates: () => { const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate() - now.getDay() + 1); const sun = new Date(mon); sun.setDate(mon.getDate() + 6); return [mon.toISOString().split("T")[0], sun.toISOString().split("T")[0]]; } },
  { label: "This month",  getDates: () => { const now = new Date(); const first = new Date(now.getFullYear(), now.getMonth(), 1); const last  = new Date(now.getFullYear(), now.getMonth() + 1, 0); return [first.toISOString().split("T")[0], last.toISOString().split("T")[0]]; } },
  { label: "Last 30 days",getDates: () => { const now = new Date(); const past = new Date(now); past.setDate(now.getDate() - 30); return [past.toISOString().split("T")[0], now.toISOString().split("T")[0]]; } },
  { label: "Last 90 days",getDates: () => { const now = new Date(); const past = new Date(now); past.setDate(now.getDate() - 90); return [past.toISOString().split("T")[0], now.toISOString().split("T")[0]]; } },
];

function getStatus(r: Reservation): "active" | "upcoming" | "completed" {
  const now = new Date(); const from = new Date(r.fromDate); const to = new Date(r.toDate);
  if (now < from) return "upcoming";
  if (now > to)   return "completed";
  return "active";
}

function getDays(r: Reservation) {
  return Math.ceil((new Date(r.toDate).getTime() - new Date(r.fromDate).getTime()) / 86400000);
}

function PillBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ height: 28, padding: "0 11px", borderRadius: 99, fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer", transition: "all 120ms", background: active ? "var(--color-accent-muted)" : "var(--color-surface-2)", border: `1px solid ${active ? "var(--color-accent-border)" : "var(--color-border)"}`, color: active ? "var(--color-accent-bright)" : "var(--color-text-secondary)" }}>
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 10 }}>{children}</p>;
}

export default function ReservationsPage() {
  const { reservations, isLoading, fetchReservations, addReservation, updateReservation, deleteReservation } = useReservationStore();
  const { cars, fetchCars }   = useCarStore();
  const { users, fetchUsers } = useUserStore();

  const { filters, setFilters, panelOpen, setPanelOpen, sortKey, setSortKey, sortDir, setSortDir, clearFilters } = useReservationsUIStore();
  const [modalMode, setModalMode]         = useState<ModalMode>(null);
  const [selected, setSelected]           = useState<Reservation | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [clientSearch, setClientSearch]   = useState("");

  useEffect(() => { fetchReservations(); fetchCars(); fetchUsers(); }, [fetchReservations, fetchCars, fetchUsers]);

  const setF   = (k: keyof Filters, v: string) => setFilters(f => ({ ...f, [k]: v }));
  const clearAll = () => { clearFilters(); setClientSearch(""); };

  const toggleMake = (m: string) => setFilters(f => ({ ...f, carMakes: f.carMakes.includes(m) ? f.carMakes.filter(x => x !== m) : [...f.carMakes, m] }));

  const applyDatePreset = (label: string, getDates: () => string[]) => {
    const [from, to] = getDates();
    const active = filters.dateFrom === from && filters.dateTo === to;
    setFilters(f => ({ ...f, dateFrom: active ? "" : from, dateTo: active ? "" : to }));
  };

  const carMakes       = useMemo(() => [...new Set(cars.map(c => c.make))].sort(), [cars]);
  const makeCounts     = useMemo(() => Object.fromEntries(carMakes.map(m => [m, reservations.filter(r => cars.find(c => c.vin === r.carId)?.make === m).length])), [carMakes, reservations, cars]);
  const statusCounts   = useMemo(() => { const c = { upcoming: 0, active: 0, completed: 0 }; reservations.forEach(r => c[getStatus(r)]++); return c; }, [reservations]);

  const usersWithReservations = useMemo(() => users.filter(u => reservations.some(r => r.userId === u.id)), [users, reservations]);
  const filteredClientList    = useMemo(() => {
    const q = clientSearch.toLowerCase();
    return usersWithReservations.filter(u => !q || `${u.firstName} ${u.lastName} ${u.username}`.toLowerCase().includes(q));
  }, [usersWithReservations, clientSearch]);

  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    if (filters.status)   chips.push({ label: filters.status.charAt(0).toUpperCase() + filters.status.slice(1), clear: () => setF("status", "") });
    if (filters.userId)   { const u = users.find(x => String(x.id) === filters.userId); chips.push({ label: u ? `${u.firstName} ${u.lastName}` : `User ${filters.userId}`, clear: () => setF("userId", "") }); }
    filters.carMakes.forEach(m => chips.push({ label: m, clear: () => toggleMake(m) }));
    if (filters.dateFrom || filters.dateTo) chips.push({ label: `${filters.dateFrom || "…"} → ${filters.dateTo || "…"}`, clear: () => setFilters(f => ({ ...f, dateFrom: "", dateTo: "" })) });
    if (filters.location) chips.push({ label: `📍 ${filters.location}`, clear: () => setF("location", "") });
    if (filters.durationPreset) chips.push({ label: `Duration: ${DURATION_PRESETS.find(p => p.key === filters.durationPreset)?.label}`, clear: () => setF("durationPreset", "") });
    return chips;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, users]);

  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase();
    return reservations.filter(r => {
      const user = users.find(u => u.id === r.userId);
      const car  = cars.find(c => c.vin === r.carId);
      if (q && !`${r.pickUpLocation} ${r.dropOffLocation} ${r.carId} ${user ? `${user.firstName} ${user.lastName} ${user.username}` : ""} ${car ? `${car.make} ${car.model}` : ""}`.toLowerCase().includes(q)) return false;
      if (filters.status   && getStatus(r) !== filters.status) return false;
      if (filters.userId   && String(r.userId) !== filters.userId) return false;
      if (filters.carMakes.length && !filters.carMakes.includes(car?.make ?? "")) return false;
      if (filters.dateFrom && new Date(r.fromDate) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo   && new Date(r.toDate)   > new Date(filters.dateTo))   return false;
      if (filters.location && !`${r.pickUpLocation} ${r.dropOffLocation}`.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.durationPreset) {
        const preset = DURATION_PRESETS.find(p => p.key === filters.durationPreset);
        if (preset) { const days = getDays(r); if (days < preset.min || days > preset.max) return false; }
      }
      return true;
    });
  }, [reservations, filters, users, cars]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const va = String(a[sortKey] ?? ""); const vb = String(b[sortKey] ?? "");
    return (va < vb ? -1 : va > vb ? 1 : 0) * (sortDir === "asc" ? 1 : -1);
  }), [filtered, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => { if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("desc"); } };
  const openModal  = (mode: ModalMode, r?: Reservation) => { setSelected(r ?? null); setModalMode(mode); };

  const handleSubmit = async (data: ReservationFormValues) => {
    setActionLoading(true);
    try {
      if (modalMode === "create") { await addReservation(data); toast.success("Reservation created"); }
      else if (modalMode === "edit" && selected) { await updateReservation(selected.id, data); toast.success("Reservation updated"); }
      setModalMode(null);
    } catch { toast.error(modalMode === "create" ? "Failed to create" : "Failed to update"); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setActionLoading(true);
    try { await deleteReservation(selected.id); toast.success(`Reservation #${selected.id} deleted`); setModalMode(null); }
    catch { toast.error("Failed to delete"); }
    finally { setActionLoading(false); }
  };

  const inputStyle = { height: 36, padding: "0 11px", background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "var(--color-text-primary)", fontFamily: "var(--font-body)", fontSize: 13, outline: "none" } as React.CSSProperties;

  return (
    <div>
      <Header title="Reservations" subtitle={`${reservations.length} total bookings`} />

      <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Status pills ── */}
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", gap: 8 }}>
          {(["", "active", "upcoming", "completed"] as StatusFilter[]).map(s => {
            const isAll = s === ""; const st = STATUS_STYLES[s] ?? {}; const active = filters.status === s;
            const count = isAll ? reservations.length : statusCounts[s as keyof typeof statusCounts];
            return (
              <button key={s || "all"} onClick={() => setF("status", s)} style={{ height: 32, padding: "0 14px", borderRadius: 99, fontSize: 12.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 7, cursor: "pointer", transition: "all 120ms", background: active ? (isAll ? "var(--color-accent-muted)" : st.bg) : "var(--color-surface)", border: `1px solid ${active ? (isAll ? "var(--color-accent-border)" : st.border) : "var(--color-border)"}`, color: active ? (isAll ? "var(--color-accent-bright)" : st.color) : "var(--color-text-secondary)" }}>
                {isAll ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                <span style={{ minWidth: 18, height: 18, padding: "0 5px", borderRadius: 99, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", background: active ? (isAll ? "var(--color-accent)" : st.color) : "var(--color-surface-3)", color: active ? "#060708" : "var(--color-text-tertiary)" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Toolbar ── */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
          style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)", pointerEvents: "none" }} />
            <input value={filters.query} onChange={e => setF("query", e.target.value)} placeholder="Search client, vehicle, location…" style={{ ...inputStyle, width: "100%", paddingLeft: 32, paddingRight: filters.query ? 32 : 11 }} />
            {filters.query && <button onClick={() => setF("query", "")} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", display: "flex" }}><X size={12} /></button>}
          </div>

          <button onClick={() => setPanelOpen(v => !v)} style={{ height: 36, display: "flex", alignItems: "center", gap: 7, padding: "0 14px", background: panelOpen ? "var(--color-accent-muted)" : "var(--color-surface)", border: `1px solid ${panelOpen ? "var(--color-accent-border)" : "var(--color-border)"}`, borderRadius: "var(--radius-sm)", color: panelOpen ? "var(--color-accent-bright)" : "var(--color-text-secondary)", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 120ms", flexShrink: 0 }}>
            <SlidersHorizontal size={13} />
            Filters
            {activeChips.length > 0 && <span style={{ minWidth: 18, height: 18, padding: "0 5px", background: "var(--color-accent)", color: "#060708", borderRadius: 99, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{activeChips.length}</span>}
            <ChevronDown size={12} style={{ transform: panelOpen ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <ArrowUpDown size={13} style={{ color: "var(--color-text-tertiary)" }} />
            <select value={`${sortKey}-${sortDir}`} onChange={e => { const [k, d] = e.target.value.split("-"); setSortKey(k as SortKey); setSortDir(d as SortDir); }} style={{ ...inputStyle, width: "auto", cursor: "pointer", color: "var(--color-text-secondary)" }}>
              <option value="fromDate-desc">Newest first</option>
              <option value="fromDate-asc">Oldest first</option>
              <option value="toDate-desc">Return: latest</option>
              <option value="toDate-asc">Return: earliest</option>
            </select>
          </div>

          {activeChips.length > 0 && (
            <button onClick={clearAll} style={{ height: 36, display: "flex", alignItems: "center", gap: 5, padding: "0 12px", background: "none", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "var(--color-text-tertiary)", fontSize: 12.5, cursor: "pointer", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-error)"; e.currentTarget.style.color = "var(--color-error)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-tertiary)"; }}>
              <RotateCcw size={11} /> Clear all
            </button>
          )}
          <Button size="sm" onClick={() => openModal("create")} leftIcon={<Plus size={13} />} style={{ flexShrink: 0, marginLeft: "auto" }}>New Reservation</Button>
        </motion.div>

        {/* ── Filter panel ── */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: "hidden" }}>
              <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>

                {/* ── Date range ── */}
                <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <CalendarDays size={11} style={{ color: "var(--color-text-tertiary)" }} />
                    <SectionLabel>Date range</SectionLabel>
                  </div>
                  {/* Quick presets */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {DATE_PRESETS.map(p => {
                      const [from, to] = p.getDates();
                      const active = filters.dateFrom === from && filters.dateTo === to;
                      return (
                        <PillBtn key={p.label} active={active} onClick={() => applyDatePreset(p.label, p.getDates)}>
                          {p.label}
                        </PillBtn>
                      );
                    })}
                  </div>
                </div>

                {/* ── Vehicle ── */}
                <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--color-border)" }}>
                  {/* Vehicle make */}
                  <div style={{ padding: "18px 22px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                      <Car size={11} style={{ color: "var(--color-text-tertiary)" }} />
                      <SectionLabel>Vehicle make {filters.carMakes.length > 0 && `(${filters.carMakes.length})`}</SectionLabel>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {carMakes.map(m => (
                        <PillBtn key={m} active={filters.carMakes.includes(m)} onClick={() => toggleMake(m)}>
                          {m}
                          <span style={{ fontSize: 10, opacity: 0.7 }}>{makeCounts[m]}</span>
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                </div>
                {/* ── Footer stats ── */}
                <div style={{ padding: "12px 22px", background: "var(--color-surface-2)", borderTop: "1px solid var(--color-border)", display: "flex", gap: 28, alignItems: "center" }}>
                  {[
                    { label: "Active",    value: statusCounts.active,    color: "#1DB954" },
                    { label: "Upcoming",  value: statusCounts.upcoming,  color: "#5C9BFF" },
                    { label: "Completed", value: statusCounts.completed, color: "#7C808C" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
                      <div>
                        <p style={{ fontSize: 10, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
                        <p style={{ fontSize: 19, fontWeight: 800, fontFamily: "var(--font-display)", color, letterSpacing: "-0.02em" }}>{value}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginLeft: "auto" }}>
                    <p style={{ fontSize: 10, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Showing</p>
                    <p style={{ fontSize: 19, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--color-accent-bright)", letterSpacing: "-0.02em" }}>{filtered.length}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Active chips ── */}
        <AnimatePresence>
          {activeChips.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontWeight: 500 }}>Active:</span>
              {activeChips.map((chip, i) => (
                <motion.span key={i} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 24, padding: "0 9px", background: "var(--color-accent-muted)", border: "1px solid var(--color-accent-border)", borderRadius: 99, fontSize: 11.5, fontWeight: 500, color: "var(--color-accent-bright)" }}>
                  {chip.label}
                  <button onClick={chip.clear} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--color-accent)", display: "flex" }}><X size={10} strokeWidth={2.5} /></button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results bar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
            {filtered.length === reservations.length ? `Showing all ${reservations.length} reservations` : `Showing ${filtered.length} of ${reservations.length} reservations`}
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            {(["fromDate", "toDate"] as SortKey[]).map(k => (
              <button key={k} onClick={() => toggleSort(k)} style={{ height: 26, padding: "0 10px", background: sortKey === k ? "var(--color-surface-3)" : "none", border: `1px solid ${sortKey === k ? "var(--color-border-strong)" : "transparent"}`, borderRadius: "var(--radius-sm)", fontSize: 11, color: sortKey === k ? "var(--color-text-primary)" : "var(--color-text-tertiary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                {{ fromDate: "Pickup", toDate: "Return", userId: "Client", carId: "Vehicle" }[k]}
                {sortKey === k && <span style={{ fontSize: 9 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 6, overflow: "hidden" }}>
          <ReservationsTable reservations={sorted} cars={cars} users={users} isLoading={isLoading} onEdit={r => openModal("edit", r)} onDelete={r => openModal("delete", r)} />
        </motion.div>
      </div>

      {(modalMode === "create" || modalMode === "edit") && (
        <Modal isOpen onClose={() => setModalMode(null)} title={modalMode === "create" ? "New Reservation" : "Edit Reservation"} description={modalMode === "create" ? "Book a vehicle for a client" : `Editing reservation #${selected?.id}`} size="md">
          <ReservationForm defaultValues={selected ?? undefined} cars={cars} users={users} onSubmit={handleSubmit} onCancel={() => setModalMode(null)} isLoading={actionLoading} />
        </Modal>
      )}
      <ConfirmModal isOpen={modalMode === "delete"} onClose={() => setModalMode(null)} onConfirm={handleDelete} title="Delete Reservation" confirmLabel="Delete Reservation" isLoading={actionLoading} message={`Delete reservation #${selected?.id}? This action cannot be undone.`} />
    </div>
  );
}
