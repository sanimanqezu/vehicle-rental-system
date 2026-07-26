import { create } from "zustand";
import { persist } from "zustand/middleware";

type SortKey = "make" | "year" | "price" | "mileage";
type SortDir = "asc" | "desc";

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

interface CarsUIStore {
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

export const useCarsUIStore = create<CarsUIStore>()(
  persist(
    (set) => ({
      filters:      EMPTY,
      panelOpen:    false,
      sortKey:      "make",
      sortDir:      "asc",
      setFilters:   (f) => set(s => ({ filters:   typeof f === "function" ? f(s.filters)   : f })),
      setPanelOpen: (v) => set(s => ({ panelOpen: typeof v === "function" ? v(s.panelOpen) : v })),
      setSortKey:   (k) => set({ sortKey: k }),
      setSortDir:   (d) => set(s => ({ sortDir:   typeof d === "function" ? d(s.sortDir)   : d })),
      clearFilters: ()  => set({ filters: EMPTY }),
    }),
    { name: "vrs-cars-ui" }
  )
);
