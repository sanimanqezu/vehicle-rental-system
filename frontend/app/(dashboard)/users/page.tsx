"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, SlidersHorizontal, X, ChevronDown, ArrowUpDown, RotateCcw, UserCheck, UserX, Users, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { UsersTable } from "@/components/users/UsersTable";
import { UserForm } from "@/components/users/UserForm";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { useReservationStore } from "@/store/useReservationStore";
import { User } from "@/types";
import { UserFormValues } from "@/schemas";

type ModalMode = "create" | "edit" | "delete" | null;
type SortKey   = "firstName" | "lastName" | "username" | "rsaId";
type SortDir   = "asc" | "desc";

interface Filters {
  query:      string;
  hasBooking: string;
  ageMin:     string;
  ageMax:     string;
  agePreset:  string;
  nameStart:  string;
}

const EMPTY: Filters = { query: "", hasBooking: "", ageMin: "", ageMax: "", agePreset: "", nameStart: "" };

const AGE_BRACKETS = [
  { label: "18–25", min: "18", max: "25" },
  { label: "26–35", min: "26", max: "35" },
  { label: "36–50", min: "36", max: "50" },
  { label: "51+",   min: "51", max: ""   },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function getAge(dob: string): number {
  const d = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) age--;
  return age;
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

export default function UsersPage() {
  const { users, isLoading, fetchUsers, addUser, updateUser, deleteUser } = useUserStore();
  const { reservations, fetchReservations } = useReservationStore();
  const [modalMode, setModalMode]         = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser]   = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters]             = useState<Filters>(EMPTY);
  const [panelOpen, setPanelOpen]         = useState(false);
  const [sortKey, setSortKey]             = useState<SortKey>("firstName");
  const [sortDir, setSortDir]             = useState<SortDir>("asc");

  useEffect(() => { fetchUsers(); fetchReservations(); }, [fetchUsers, fetchReservations]);

  const setF   = (k: keyof Filters, v: string) => setFilters(f => ({ ...f, [k]: v }));
  const clearAll = () => setFilters(EMPTY);

  const usersWithBookings = useMemo(() => new Set(reservations.map(r => r.userId)), [reservations]);

  const bookingCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    reservations.forEach(r => { counts[r.userId] = (counts[r.userId] ?? 0) + 1; });
    return counts;
  }, [reservations]);

  // first-letter counts for alphabet filter
  const letterCounts = useMemo(() => {
    const c: Record<string, number> = {};
    users.forEach(u => {
      const l = u.firstName.charAt(0).toUpperCase();
      c[l] = (c[l] ?? 0) + 1;
    });
    return c;
  }, [users]);

  const applyAgeBracket = (b: typeof AGE_BRACKETS[0]) => {
    const active = filters.ageMin === b.min && filters.ageMax === b.max;
    setFilters(f => ({ ...f, ageMin: active ? "" : b.min, ageMax: active ? "" : b.max, agePreset: active ? "" : b.label }));
  };

  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    if (filters.hasBooking === "yes") chips.push({ label: "Has bookings",  clear: () => setF("hasBooking", "") });
    if (filters.hasBooking === "no")  chips.push({ label: "No bookings",   clear: () => setF("hasBooking", "") });
    if (filters.agePreset)            chips.push({ label: `Age: ${filters.agePreset}`, clear: () => setFilters(f => ({ ...f, ageMin: "", ageMax: "", agePreset: "" })) });
    else if (filters.ageMin || filters.ageMax) chips.push({ label: `Age: ${filters.ageMin || "0"}–${filters.ageMax || "∞"}`, clear: () => setFilters(f => ({ ...f, ageMin: "", ageMax: "" })) });
    if (filters.nameStart) chips.push({ label: `Name: ${filters.nameStart}…`, clear: () => setF("nameStart", "") });
    return chips;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase();
    return users.filter(u => {
      if (q && !`${u.firstName} ${u.lastName} ${u.username} ${u.rsaId}`.toLowerCase().includes(q)) return false;
      if (filters.hasBooking === "yes" && !usersWithBookings.has(u.id)) return false;
      if (filters.hasBooking === "no"  &&  usersWithBookings.has(u.id)) return false;
      if (filters.nameStart && !u.firstName.toUpperCase().startsWith(filters.nameStart)) return false;
      if (u.dateOfBirth) {
        const age = getAge(u.dateOfBirth);
        if (filters.ageMin && age < Number(filters.ageMin)) return false;
        if (filters.ageMax && age > Number(filters.ageMax)) return false;
      }
      return true;
    });
  }, [users, filters, usersWithBookings]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const va = (a[sortKey] ?? "").toLowerCase();
    const vb = (b[sortKey] ?? "").toLowerCase();
    return (va < vb ? -1 : va > vb ? 1 : 0) * (sortDir === "asc" ? 1 : -1);
  }), [filtered, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => { if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("asc"); } };
  const openModal  = (mode: ModalMode, user?: User) => { setSelectedUser(user ?? null); setModalMode(mode); };

  const handleSubmit = async (data: UserFormValues) => {
    setActionLoading(true);
    try {
      const payload = data.password ? data : { ...data, password: undefined };
      if (modalMode === "create") { await addUser(payload as Omit<User, "id">); toast.success("Client registered"); }
      else if (modalMode === "edit" && selectedUser) { await updateUser(selectedUser.id, payload); toast.success("Client updated"); }
      setModalMode(null);
    } catch { toast.error(modalMode === "create" ? "Failed to register client" : "Failed to update client"); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try { await deleteUser(selectedUser.id); toast.success(`${selectedUser.firstName} ${selectedUser.lastName} removed`); setModalMode(null); }
    catch { toast.error("Failed to delete client"); }
    finally { setActionLoading(false); }
  };

  const inputStyle = { height: 36, padding: "0 11px", background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "var(--color-text-primary)", fontFamily: "var(--font-body)", fontSize: 13, outline: "none", width: "100%" } as React.CSSProperties;
  const withBookingsCount    = users.filter(u => usersWithBookings.has(u.id)).length;
  const withoutBookingsCount = users.length - withBookingsCount;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <Header title="Clients" subtitle={`${users.length} registered clients`} />

      <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── Toolbar ── */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)", pointerEvents: "none" }} />
            <input value={filters.query} onChange={e => setF("query", e.target.value)} placeholder="Search name, username, RSA ID…" style={{ ...inputStyle, paddingLeft: 32, paddingRight: filters.query ? 32 : 11 }} />
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
              <option value="firstName-asc">First name A–Z</option>
              <option value="firstName-desc">First name Z–A</option>
              <option value="lastName-asc">Last name A–Z</option>
              <option value="lastName-desc">Last name Z–A</option>
              <option value="username-asc">Username A–Z</option>
            </select>
          </div>

          {activeChips.length > 0 && (
            <button onClick={clearAll} style={{ height: 36, display: "flex", alignItems: "center", gap: 5, padding: "0 12px", background: "none", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "var(--color-text-tertiary)", fontSize: 12.5, cursor: "pointer", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-error)"; e.currentTarget.style.color = "var(--color-error)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-tertiary)"; }}>
              <RotateCcw size={11} /> Clear all
            </button>
          )}
          <Button size="sm" onClick={() => openModal("create")} leftIcon={<Plus size={13} />} style={{ flexShrink: 0, marginLeft: "auto" }}>Add Client</Button>
        </motion.div>

        {/* ── Filter panel ── */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: "hidden" }}>
              <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>

                {/* ── Booking status ── */}
                <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--color-border)" }}>
                  <SectionLabel>Booking status</SectionLabel>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { value: "",    label: "All clients",       icon: Users,     count: users.length,            color: "var(--color-text-secondary)" },
                      { value: "yes", label: "Has reservations",  icon: UserCheck, count: withBookingsCount,       color: "var(--color-success)"  },
                      { value: "no",  label: "No reservations",   icon: UserX,     count: withoutBookingsCount,    color: "var(--color-text-tertiary)" },
                    ].map(({ value, label, icon: Icon, count, color }) => {
                      const active = filters.hasBooking === value;
                      return (
                        <button key={value} onClick={() => setF("hasBooking", value)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: "var(--radius-md)", border: `1px solid ${active ? "var(--color-accent-border)" : "var(--color-border)"}`, background: active ? "var(--color-accent-muted)" : "var(--color-surface-2)", cursor: "pointer", transition: "all 120ms" }}>
                          <Icon size={14} style={{ color: active ? "var(--color-accent-bright)" : color }} />
                          <div style={{ textAlign: "left" }}>
                            <p style={{ fontSize: 12.5, fontWeight: 500, color: active ? "var(--color-accent-bright)" : "var(--color-text-primary)", lineHeight: 1.2 }}>{label}</p>
                            <p style={{ fontSize: 11, color: active ? "var(--color-accent)" : "var(--color-text-tertiary)", marginTop: 1 }}>{count} clients</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Age ── */}
                <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <CalendarDays size={11} style={{ color: "var(--color-text-tertiary)" }} />
                    <SectionLabel>Age bracket</SectionLabel>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {AGE_BRACKETS.map(b => {
                      const cnt = users.filter(u => u.dateOfBirth && (() => { const a = getAge(u.dateOfBirth); return a >= Number(b.min) && (b.max === "" || a <= Number(b.max)); })()).length;
                      return (
                        <PillBtn key={b.label} active={filters.agePreset === b.label} onClick={() => applyAgeBracket(b)}>
                          {b.label}
                          <span style={{ fontSize: 10, opacity: 0.7 }}>{cnt}</span>
                        </PillBtn>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11.5, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>Custom:</span>
                    <input value={filters.ageMin} onChange={e => { setF("ageMin", e.target.value); setF("agePreset", ""); }} type="number" min={18} max={120} placeholder="Min age" style={{ ...inputStyle, flex: 1 }} />
                    <span style={{ color: "var(--color-text-tertiary)" }}>–</span>
                    <input value={filters.ageMax} onChange={e => { setF("ageMax", e.target.value); setF("agePreset", ""); }} type="number" min={18} max={120} placeholder="Max age" style={{ ...inputStyle, flex: 1 }} />
                  </div>
                </div>

                {/* ── First-letter alphabet filter ── */}
                <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--color-border)" }}>
                  <SectionLabel>First name starts with</SectionLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {ALPHABET.map(l => {
                      const cnt = letterCounts[l] ?? 0;
                      const active = filters.nameStart === l;
                      return (
                        <button key={l} onClick={() => setF("nameStart", active ? "" : l)} disabled={cnt === 0}
                          style={{ width: 30, height: 30, borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, cursor: cnt > 0 ? "pointer" : "default", transition: "all 120ms", background: active ? "var(--color-accent)" : cnt > 0 ? "var(--color-surface-2)" : "transparent", border: `1px solid ${active ? "var(--color-accent)" : cnt > 0 ? "var(--color-border)" : "transparent"}`, color: active ? "#060708" : cnt > 0 ? "var(--color-text-secondary)" : "var(--color-text-tertiary)", opacity: cnt === 0 ? 0.25 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {l}
                        </button>
                      );
                    })}
                    {filters.nameStart && <button onClick={() => setF("nameStart", "")} style={{ height: 30, padding: "0 10px", borderRadius: "var(--radius-sm)", fontSize: 11.5, cursor: "pointer", background: "none", border: "1px solid var(--color-border)", color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}><X size={10} /> Clear</button>}
                  </div>
                </div>

                {/* ── Footer stats ── */}
                <div style={{ padding: "12px 22px", background: "var(--color-surface-2)", display: "flex", gap: 28, alignItems: "center" }}>
                  {[
                    { label: "Total",           value: users.length },
                    { label: "With bookings",   value: withBookingsCount },
                    { label: "No bookings",     value: withoutBookingsCount },
                    { label: "Avg bookings",    value: users.length > 0 ? (reservations.length / users.length).toFixed(1) : "0" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ fontSize: 10, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
                      <p style={{ fontSize: 19, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>{value}</p>
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
            {filtered.length === users.length ? `Showing all ${users.length} clients` : `Showing ${filtered.length} of ${users.length} clients`}
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            {(["firstName", "lastName", "username"] as SortKey[]).map(k => (
              <button key={k} onClick={() => toggleSort(k)} style={{ height: 26, padding: "0 10px", background: sortKey === k ? "var(--color-surface-3)" : "none", border: `1px solid ${sortKey === k ? "var(--color-border-strong)" : "transparent"}`, borderRadius: "var(--radius-sm)", fontSize: 11, color: sortKey === k ? "var(--color-text-primary)" : "var(--color-text-tertiary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 100ms" }}>
                {{ firstName: "First name", lastName: "Last name", username: "Username", rsaId: "RSA ID" }[k]}
                {sortKey === k && <span style={{ fontSize: 9 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 6, overflow: "hidden" }}>
          <UsersTable users={sorted} isLoading={isLoading} onEdit={u => openModal("edit", u)} onDelete={u => openModal("delete", u)} />
        </motion.div>
      </div>

      {(modalMode === "create" || modalMode === "edit") && (
        <Modal isOpen onClose={() => setModalMode(null)}
          title={modalMode === "create" ? "Register Client" : "Edit Client"}
          description={modalMode === "create" ? "Add a new client to the system" : `Editing ${selectedUser?.firstName} ${selectedUser?.lastName}`}
          size="md">
          <UserForm defaultValues={selectedUser ?? undefined} onSubmit={handleSubmit} onCancel={() => setModalMode(null)} isLoading={actionLoading} />
        </Modal>
      )}
      <ConfirmModal isOpen={modalMode === "delete"} onClose={() => setModalMode(null)} onConfirm={handleDelete} title="Remove Client" confirmLabel="Remove Client" isLoading={actionLoading} message={`Remove ${selectedUser?.firstName} ${selectedUser?.lastName} from the system? This action cannot be undone.`} />
    </div>
  );
}
