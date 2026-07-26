import { create } from "zustand";
import { persist } from "zustand/middleware";

type SortKey = "firstName" | "lastName" | "username" | "rsaId";
type SortDir = "asc" | "desc";

interface Filters {
  query:      string;
  hasBooking: string;
  ageMin:     string;
  ageMax:     string;
  agePreset:  string;
  nameStart:  string;
}

const EMPTY: Filters = { query: "", hasBooking: "", ageMin: "", ageMax: "", agePreset: "", nameStart: "" };

interface UsersUIStore {
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

export const useUsersUIStore = create<UsersUIStore>()(
  persist(
    (set) => ({
      filters:      EMPTY,
      panelOpen:    false,
      sortKey:      "firstName",
      sortDir:      "asc",
      setFilters:   (f)    => set(s => ({ filters:   typeof f === "function" ? f(s.filters)   : f })),
      setPanelOpen: (v)    => set(s => ({ panelOpen: typeof v === "function" ? v(s.panelOpen) : v })),
      setSortKey:   (k)    => set({ sortKey: k }),
      setSortDir:   (d)    => set(s => ({ sortDir:   typeof d === "function" ? d(s.sortDir)   : d })),
      clearFilters: ()     => set({ filters: EMPTY }),
    }),
    { name: "vrs-users-ui" }
  )
);
