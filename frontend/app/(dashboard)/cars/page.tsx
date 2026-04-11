"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, RotateCcw, SlidersHorizontal, X, ChevronDown, ArrowUpDown, Fuel, Settings2, Palette, Calendar, DollarSign, Gauge } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { CarsTable } from "@/components/cars/CarsTable";
import { CarModal } from "@/components/cars/CarModal";
import { Button } from "@/components/ui/Button";
import { useCarStore } from "@/store/useCarStore";
import { useCarsUIStore } from "@/store/useCarsUIStore";
import { Car } from "@/types";
import { CarFormValues } from "@/schemas";

type ModalMode = "create" | "edit" | "delete" | null;
type SortKey   = "make" | "year" | "price" | "mileage";
type SortDir   = "asc" | "desc";

interface Filters {
  query:        string;
  makes:        string[];
  fuelTypes:    string[];
  transmission: string;
  color:        string;
  yearMin:      string;
  yearMax:      string;
  priceMin:     string;
  priceMax:     string;
  mileageMax:   string;
}

const EMPTY: Filters = {
  query: "", makes: [], fuelTypes: [], transmission: "", color: "",
  yearMin: "", yearMax: "", priceMin: "", priceMax: "", mileageMax: "",
};

// map color names → approximate CSS colors for swatches
const COLOR_CSS: Record<string, string> = {
  "Black": "#111", "Deep Black": "#0d0d0d", "Santorini Black": "#1a1a2e",
  "Obsidian Black": "#1c1c1e", "Nera Black": "#1e2030",
  "White": "#f5f5f5", "Alpine White": "#f0f0ee", "Pearl White": "#f8f7f2",
  "Crystal White": "#f4f4f2",
  "Silver": "#a8a9ad", "Lunar Silver": "#b0b2b8", "Sonic Chrome": "#c0c5ce",
  "Graphite": "#4a4e56", "Charcoal": "#36454f", "Steel Grey": "#708090",
  "Magnetic Grey": "#6c6f73", "Daytona Grey": "#5a5e65", "Highland Grey": "#7b8291",
  "Blue": "#1a73e8", "Mosaic Blue": "#2962ff",
  "Red": "#cc0000", "Race Red": "#c41e3a", "Rapid Red": "#b71c1c", "Runway Red": "#a81c2e",
  "Green": "#2e7d32",
};

const FUEL_META: Record<string, { color: string; dot: string }> = {
  PETROL:   { color: "var(--color-warning)",  dot: "#F59E0B" },
  DIESEL:   { color: "var(--color-text-secondary)", dot: "#7C808C" },
  ELECTRIC: { color: "var(--color-success)",  dot: "#1DB954" },
  HYBRID:   { color: "var(--color-info)",     dot: "#2979FF" },
};

const YEAR_PRESETS = [
  { label: "Pre-2020", min: "",     max: "2019" },
  { label: "2020–21",  min: "2020", max: "2021" },
  { label: "2022–23",  min: "2022", max: "2023" },
  { label: "2024+",    min: "2024", max: ""     },
];

const PRICE_PRESETS = [
  { label: "Under R5k",  min: "",     max: "5000"  },
  { label: "R5k–R8k",    min: "5000", max: "8000"  },
  { label: "R8k–R12k",   min: "8000", max: "12000" },
  { label: "R12k+",      min: "12000",max: ""      },
];

const MILEAGE_PRESETS = [
  { label: "Under 15k",  max: "15000"  },
  { label: "Under 40k",  max: "40000"  },
  { label: "Under 80k",  max: "80000"  },
];

// ── tiny helpers ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 10 }}>
      {children}
    </p>
  );
}

function PillBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 28, padding: "0 11px", borderRadius: 99, fontSize: 12, fontWeight: 500,
        display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer",
        transition: "all 120ms",
        background: active ? "var(--color-accent-muted)" : "var(--color-surface-2)",
        border:     `1px solid ${active ? "var(--color-accent-border)" : "var(--color-border)"}`,
        color:      active ? "var(--color-accent-bright)" : "var(--color-text-secondary)",
      }}
    >
      {children}
    </button>
  );
}

export default function CarsPage() {
  const { cars, isLoading, fetchCars, addCar, updateCar, deleteCar } = useCarStore();
  const { filters, setFilters, panelOpen, setPanelOpen, sortKey, setSortKey, sortDir, setSortDir, clearFilters } = useCarsUIStore();
  const [modalMode, setModalMode]         = useState<ModalMode>(null);
  const [selectedCar, setSelectedCar]     = useState<Car | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const setF   = (k: keyof Filters, v: string) => setFilters(f => ({ ...f, [k]: v }));
  const clearF = (k: keyof Filters) => setFilters(f => ({ ...f, [k]: EMPTY[k] }));
  const clearAll = () => clearFilters();

  const toggleMake     = (m: string) => setFilters(f => ({ ...f, makes:     f.makes.includes(m)     ? f.makes.filter(x => x !== m)     : [...f.makes, m]     }));
  const toggleFuelType = (ft: string)=> setFilters(f => ({ ...f, fuelTypes: f.fuelTypes.includes(ft) ? f.fuelTypes.filter(x => x !== ft) : [...f.fuelTypes, ft] }));

  const applyYearPreset  = (min: string, max: string) => setFilters(f => ({ ...f, yearMin: min, yearMax: max }));
  const applyPricePreset = (min: string, max: string) => setFilters(f => ({ ...f, priceMin: min, priceMax: max }));

  const makes     = useMemo(() => [...new Set(cars.map(c => c.make))].sort(),     [cars]);
  const colors    = useMemo(() => [...new Set(cars.map(c => c.color))].sort(),    [cars]);
  const fuelTypes = useMemo(() => [...new Set(cars.map(c => c.fuelType))].sort(), [cars]);

  const makeCounts     = useMemo(() => Object.fromEntries(makes.map(m     => [m,  cars.filter(c => c.make     === m).length])),  [cars, makes]);
  const fuelTypeCounts = useMemo(() => Object.fromEntries(fuelTypes.map(ft=> [ft, cars.filter(c => c.fuelType === ft).length])), [cars, fuelTypes]);
  const colorCounts    = useMemo(() => Object.fromEntries(colors.map(c    => [c,  cars.filter(x => x.color    === c).length])),  [cars, colors]);

  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    filters.makes.forEach(m       => chips.push({ label: m,                             clear: () => toggleMake(m) }));
    filters.fuelTypes.forEach(ft  => chips.push({ label: ft.charAt(0) + ft.slice(1).toLowerCase(), clear: () => toggleFuelType(ft) }));
    if (filters.transmission) chips.push({ label: filters.transmission,                  clear: () => clearF("transmission") });
    if (filters.color)        chips.push({ label: filters.color,                         clear: () => clearF("color") });
    if (filters.yearMin || filters.yearMax) chips.push({ label: `Year: ${filters.yearMin || "any"}–${filters.yearMax || "any"}`, clear: () => { clearF("yearMin"); clearF("yearMax"); } });
    if (filters.priceMin || filters.priceMax) chips.push({ label: `Price: R${filters.priceMin || "0"}–${filters.priceMax ? `R${filters.priceMax}` : "any"}`, clear: () => { clearF("priceMin"); clearF("priceMax"); } });
    if (filters.mileageMax) chips.push({ label: `Mileage < ${Number(filters.mileageMax).toLocaleString()}km`, clear: () => clearF("mileageMax") });
    return chips;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase();
    return cars.filter(c => {
      if (q && !`${c.make} ${c.model} ${c.vin} ${c.color} ${c.engine}`.toLowerCase().includes(q)) return false;
      if (filters.makes.length     && !filters.makes.includes(c.make))          return false;
      if (filters.fuelTypes.length && !filters.fuelTypes.includes(c.fuelType))  return false;
      if (filters.transmission     && c.transmission !== filters.transmission)   return false;
      if (filters.color            && c.color        !== filters.color)          return false;
      if (filters.yearMin  && c.year  < Number(filters.yearMin))  return false;
      if (filters.yearMax  && c.year  > Number(filters.yearMax))  return false;
      if (filters.priceMin && c.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && c.price > Number(filters.priceMax)) return false;
      if (filters.mileageMax && c.mileage > Number(filters.mileageMax)) return false;
      return true;
    });
  }, [cars, filters]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    let va: string | number = a[sortKey] ?? 0;
    let vb: string | number = b[sortKey] ?? 0;
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();
    return (va < vb ? -1 : va > vb ? 1 : 0) * (sortDir === "asc" ? 1 : -1);
  }), [filtered, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => { if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("asc"); } };
  const openModal  = (mode: ModalMode, car?: Car) => { setSelectedCar(car ?? null); setModalMode(mode); };

  const handleSubmit = async (data: CarFormValues) => {
    setActionLoading(true);
    try {
      if (modalMode === "create") { await addCar(data as Car); toast.success("Vehicle added to fleet"); }
      else if (modalMode === "edit" && selectedCar) { await updateCar(selectedCar.vin, data); toast.success("Vehicle updated"); }
      setModalMode(null);
    } catch { toast.error(modalMode === "create" ? "Failed to add vehicle" : "Failed to update vehicle"); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedCar) return;
    setActionLoading(true);
    try { await deleteCar(selectedCar.vin); toast.success(`${selectedCar.make} ${selectedCar.model} removed`); setModalMode(null); }
    catch { toast.error("Failed to remove vehicle"); }
    finally { setActionLoading(false); }
  };

  const inputCls = {
    height: 36, padding: "0 11px",
    background: "var(--color-surface-2)", border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-sm)", color: "var(--color-text-primary)",
    fontFamily: "var(--font-body)", fontSize: 13, outline: "none", transition: "border-color 120ms",
    width: "100%",
  } as React.CSSProperties;

  const totalActive = activeChips.length;
  const yearPresetActive = (p: typeof YEAR_PRESETS[0]) => filters.yearMin === p.min && filters.yearMax === p.max;
  const pricePresetActive = (p: typeof PRICE_PRESETS[0]) => filters.priceMin === p.min && filters.priceMax === p.max;

  return (
    <div>
      <Header title="Fleet" subtitle={`${cars.length} vehicles registered`} />

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── Toolbar ── */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)", pointerEvents: "none" }} />
            <input value={filters.query} onChange={e => setF("query", e.target.value)} placeholder="Search make, model, VIN, engine…"
              style={{ ...inputCls, paddingLeft: 32, paddingRight: filters.query ? 32 : 11 }} />
            {filters.query && <button onClick={() => setF("query", "")} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", display: "flex" }}><X size={12} /></button>}
          </div>

          {/* Filters button */}
          <button onClick={() => setPanelOpen(v => !v)} style={{ height: 36, display: "flex", alignItems: "center", gap: 7, padding: "0 14px", background: panelOpen ? "var(--color-accent-muted)" : "var(--color-surface)", border: `1px solid ${panelOpen ? "var(--color-accent-border)" : "var(--color-border)"}`, borderRadius: "var(--radius-sm)", color: panelOpen ? "var(--color-accent-bright)" : "var(--color-text-secondary)", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 120ms", flexShrink: 0 }}>
            <SlidersHorizontal size={13} />
            Filters
            {totalActive > 0 && <span style={{ minWidth: 18, height: 18, padding: "0 5px", background: "var(--color-accent)", color: "#060708", borderRadius: 99, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{totalActive}</span>}
            <ChevronDown size={12} style={{ transform: panelOpen ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
          </button>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <ArrowUpDown size={13} style={{ color: "var(--color-text-tertiary)" }} />
            <select value={`${sortKey}-${sortDir}`} onChange={e => { const [k, d] = e.target.value.split("-"); setSortKey(k as SortKey); setSortDir(d as SortDir); }}
              style={{ ...inputCls, width: "auto", cursor: "pointer", color: "var(--color-text-secondary)" }}>
              <option value="make-asc">Make A–Z</option>
              <option value="make-desc">Make Z–A</option>
              <option value="year-desc">Newest first</option>
              <option value="year-asc">Oldest first</option>
              <option value="price-asc">Price low–high</option>
              <option value="price-desc">Price high–low</option>
              <option value="mileage-asc">Mileage low–high</option>
              <option value="mileage-desc">Mileage high–low</option>
            </select>
          </div>

          {totalActive > 0 && (
            <button onClick={clearAll} style={{ height: 36, display: "flex", alignItems: "center", gap: 5, padding: "0 12px", background: "none", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", color: "var(--color-text-tertiary)", fontSize: 12.5, cursor: "pointer", flexShrink: 0, transition: "all 120ms" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-error)"; e.currentTarget.style.color = "var(--color-error)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-tertiary)"; }}>
              <RotateCcw size={11} /> Clear all
            </button>
          )}
          <Button size="sm" onClick={() => openModal("create")} leftIcon={<Plus size={13} />} style={{ flexShrink: 0, marginLeft: "auto" }}>Add Vehicle</Button>
        </motion.div>

        {/* ── Filter panel ── */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: "hidden" }}>
              <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>

                {/* ── Make ── */}
                <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <SectionLabel>Make {filters.makes.length > 0 && `(${filters.makes.length} selected)`}</SectionLabel>
                    {filters.makes.length > 0 && <button onClick={() => setFilters(f => ({ ...f, makes: [] }))} style={{ fontSize: 11, color: "var(--color-accent)", background: "none", border: "none", cursor: "pointer" }}>Clear</button>}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {makes.map(m => (
                      <PillBtn key={m} active={filters.makes.includes(m)} onClick={() => toggleMake(m)}>
                        {m}
                        <span style={{ fontSize: 10, opacity: 0.7 }}>{makeCounts[m]}</span>
                      </PillBtn>
                    ))}
                  </div>
                </div>

                {/* ── Fuel + Transmission ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--color-border)" }}>
                  <div style={{ padding: "18px 22px", borderRight: "1px solid var(--color-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <Fuel size={11} style={{ color: "var(--color-text-tertiary)" }} />
                      <SectionLabel>Fuel type</SectionLabel>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {fuelTypes.map(ft => {
                        const meta = FUEL_META[ft] ?? { color: "var(--color-text-secondary)", dot: "#7C808C" };
                        const active = filters.fuelTypes.includes(ft);
                        return (
                          <button key={ft} onClick={() => toggleFuelType(ft)} style={{ height: 28, padding: "0 11px", borderRadius: 99, fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", transition: "all 120ms", background: active ? `${meta.dot}18` : "var(--color-surface-2)", border: `1px solid ${active ? `${meta.dot}55` : "var(--color-border)"}`, color: active ? meta.dot : "var(--color-text-secondary)" }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: meta.dot, flexShrink: 0 }} />
                            {ft.charAt(0) + ft.slice(1).toLowerCase()}
                            <span style={{ fontSize: 10, opacity: 0.7 }}>{fuelTypeCounts[ft]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ padding: "18px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <Settings2 size={11} style={{ color: "var(--color-text-tertiary)" }} />
                      <SectionLabel>Transmission</SectionLabel>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["Automatic", "Manual", "CVT"].map(t => (
                        <PillBtn key={t} active={filters.transmission === t} onClick={() => setF("transmission", filters.transmission === t ? "" : t)}>
                          {t}
                          <span style={{ fontSize: 10, opacity: 0.7 }}>{cars.filter(c => c.transmission === t).length}</span>
                        </PillBtn>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Color swatches ── */}
                <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <Palette size={11} style={{ color: "var(--color-text-tertiary)" }} />
                    <SectionLabel>Color</SectionLabel>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {colors.map(c => {
                      const css = COLOR_CSS[c] ?? "#888";
                      const active = filters.color === c;
                      return (
                        <button key={c} onClick={() => setF("color", active ? "" : c)} title={`${c} (${colorCounts[c]})`} style={{ display: "flex", alignItems: "center", gap: 7, height: 28, padding: "0 11px", borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 120ms", background: active ? "var(--color-accent-muted)" : "var(--color-surface-2)", border: `1px solid ${active ? "var(--color-accent-border)" : "var(--color-border)"}`, color: active ? "var(--color-accent-bright)" : "var(--color-text-secondary)" }}>
                          <span style={{ width: 11, height: 11, borderRadius: "50%", background: css, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
                          {c}
                          <span style={{ fontSize: 10, opacity: 0.65 }}>{colorCounts[c]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Year + Price + Mileage ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                  {/* Year */}
                  <div style={{ padding: "18px 22px", borderRight: "1px solid var(--color-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <Calendar size={11} style={{ color: "var(--color-text-tertiary)" }} />
                      <SectionLabel>Year</SectionLabel>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                      {YEAR_PRESETS.map(p => (
                        <PillBtn key={p.label} active={yearPresetActive(p)} onClick={() => applyYearPreset(yearPresetActive(p) ? "" : p.min, yearPresetActive(p) ? "" : p.max)}>
                          {p.label}
                        </PillBtn>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={filters.yearMin} onChange={e => setF("yearMin", e.target.value)} type="number" placeholder="From" style={{ ...inputCls, flex: 1 }} />
                      <input value={filters.yearMax} onChange={e => setF("yearMax", e.target.value)} type="number" placeholder="To"   style={{ ...inputCls, flex: 1 }} />
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ padding: "18px 22px", borderRight: "1px solid var(--color-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <DollarSign size={11} style={{ color: "var(--color-text-tertiary)" }} />
                      <SectionLabel>Price / day (R)</SectionLabel>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                      {PRICE_PRESETS.map(p => (
                        <PillBtn key={p.label} active={pricePresetActive(p)} onClick={() => applyPricePreset(pricePresetActive(p) ? "" : p.min, pricePresetActive(p) ? "" : p.max)}>
                          {p.label}
                        </PillBtn>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={filters.priceMin} onChange={e => setF("priceMin", e.target.value)} type="number" placeholder="Min R" style={{ ...inputCls, flex: 1 }} />
                      <input value={filters.priceMax} onChange={e => setF("priceMax", e.target.value)} type="number" placeholder="Max R" style={{ ...inputCls, flex: 1 }} />
                    </div>
                  </div>

                  {/* Mileage */}
                  <div style={{ padding: "18px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <Gauge size={11} style={{ color: "var(--color-text-tertiary)" }} />
                      <SectionLabel>Max mileage (km)</SectionLabel>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                      {MILEAGE_PRESETS.map(p => (
                        <PillBtn key={p.label} active={filters.mileageMax === p.max} onClick={() => setF("mileageMax", filters.mileageMax === p.max ? "" : p.max)}>
                          {p.label}
                        </PillBtn>
                      ))}
                    </div>
                    <input value={filters.mileageMax} onChange={e => setF("mileageMax", e.target.value)} type="number" placeholder="e.g. 50000" style={{ ...inputCls }} />
                  </div>
                </div>

                {/* ── Footer stats ── */}
                <div style={{ padding: "12px 22px", background: "var(--color-surface-2)", borderTop: "1px solid var(--color-border)", display: "flex", gap: 28, alignItems: "center" }}>
                  {[
                    { label: "Total fleet",  value: cars.length },
                    { label: "Makes",        value: makes.length },
                    { label: "Electric",     value: cars.filter(c => c.fuelType === "ELECTRIC").length },
                    { label: "Hybrid",       value: cars.filter(c => c.fuelType === "HYBRID").length },
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
            {filtered.length === cars.length ? `Showing all ${cars.length} vehicles` : `Showing ${filtered.length} of ${cars.length} vehicles`}
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            {(["make", "year", "price", "mileage"] as SortKey[]).map(k => (
              <button key={k} onClick={() => toggleSort(k)} style={{ height: 26, padding: "0 10px", background: sortKey === k ? "var(--color-surface-3)" : "none", border: `1px solid ${sortKey === k ? "var(--color-border-strong)" : "transparent"}`, borderRadius: "var(--radius-sm)", fontSize: 11, color: sortKey === k ? "var(--color-text-primary)" : "var(--color-text-tertiary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 100ms" }}>
                {k.charAt(0).toUpperCase() + k.slice(1)}
                {sortKey === k && <span style={{ fontSize: 9 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 6, overflow: "hidden" }}>
          <CarsTable cars={sorted} isLoading={isLoading} onEdit={car => openModal("edit", car)} onDelete={car => openModal("delete", car)} />
        </motion.div>
      </div>

      <CarModal mode={modalMode} car={selectedCar} isLoading={actionLoading} onClose={() => setModalMode(null)} onSubmit={handleSubmit} onDelete={handleDelete} />
    </div>
  );
}
