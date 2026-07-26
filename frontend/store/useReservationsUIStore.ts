import { create } from "zustand";
import { persist } from "zustand/middleware";

type SortKey      = "fromDate" | "toDate" | "userId" | "carId";
type SortDir      = "asc" | "desc";
type StatusFilter = "" | "upcoming" | "active" | "completed";

interface Filters {
  query:          string;
  status:         StatusFilter;
  userId:         string;
  carMakes:       string[];
  dateFrom:       string;
  dateTo:         string;
  location:       string;
  durationPreset: string;
}

const EMPTY: Filters = {
  query: "", status: "", userId: "", carMakes: [],
  dateFrom: "", dateTo: "", location: "", durationPreset: "",
};

interface ReservationsUIStore {
  filters:      Filters;
  panelOpen:    boolean;
  sortKey:      SortKey;
  sortDir:      SortDir;
  setFilters:   (f: Filters | ((prev: Filters) => Filters)) => void;
  setPanelOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  setSortKey:   (k: SortKey) => void;
  setSortDir:   (d: SortDir | ((prev: SortDir) => SortDir)) => void;
  clearFilters: () => void;
}

export const useReservationsUIStore = create<ReservationsUIStore>()(
  persist(
    (set) => ({
      filters:      EMPTY,
      panelOpen:    false,
      sortKey:      "fromDate",
      sortDir:      "desc",
      setFilters:   (f) => set(s => ({ filters:   typeof f === "function" ? f(s.filters)   : f })),
      setPanelOpen: (v) => set(s => ({ panelOpen: typeof v === "function" ? v(s.panelOpen) : v })),
      setSortKey:   (k) => set({ sortKey: k }),
      setSortDir:   (d) => set(s => ({ sortDir:   typeof d === "function" ? d(s.sortDir)   : d })),
      clearFilters: ()  => set({ filters: EMPTY }),
    }),
    { name: "vrs-reservations-ui" }
  )
);
