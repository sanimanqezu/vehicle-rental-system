import { create } from "zustand";
import { Car } from "@/types";
import { carsApi } from "@/lib/api";
import { MOCK_CARS } from "@/lib/mockData";

interface CarStore {
  cars: Car[];
  selectedCar: Car | null;
  isLoading: boolean;
  error: string | null;
  fetchCars: () => Promise<void>;
  addCar: (car: Car) => Promise<void>;
  updateCar: (vin: string, car: Partial<Car>) => Promise<void>;
  deleteCar: (vin: string) => Promise<void>;
  setSelectedCar: (car: Car | null) => void;
  searchCars: (params: Record<string, string | number>) => Promise<void>;
  clearError: () => void;
}

export const useCarStore = create<CarStore>((set, get) => ({
  cars: [],
  selectedCar: null,
  isLoading: false,
  error: null,

  fetchCars: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await carsApi.getAll();
      set({ cars: data ?? [], isLoading: false });
    } catch {
      set({ cars: MOCK_CARS, isLoading: false });
    }
  },

  addCar: async (car: Car) => {
    set({ isLoading: true, error: null });
    try {
      await carsApi.create(car);
      set((state) => ({ cars: [...state.cars, car], isLoading: false }));
    } catch {
      set({ error: "Failed to add car", isLoading: false });
      throw new Error("Failed to add car");
    }
  },

  updateCar: async (vin: string, updatedCar: Partial<Car>) => {
    set({ isLoading: true, error: null });
    try {
      await carsApi.update(vin, updatedCar);
      set((state) => ({
        cars: state.cars.map((c) => (c.vin === vin ? { ...c, ...updatedCar } : c)),
        isLoading: false,
      }));
    } catch {
      set({ error: "Failed to update car", isLoading: false });
      throw new Error("Failed to update car");
    }
  },

  deleteCar: async (vin: string) => {
    set({ isLoading: true, error: null });
    try {
      await carsApi.delete(vin);
      set((state) => ({
        cars: state.cars.filter((c) => c.vin !== vin),
        isLoading: false,
        selectedCar: state.selectedCar?.vin === vin ? null : state.selectedCar,
      }));
    } catch {
      set({ error: "Failed to delete car", isLoading: false });
      throw new Error("Failed to delete car");
    }
  },

  setSelectedCar: (car: Car | null) => set({ selectedCar: car }),

  searchCars: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await carsApi.search(params);
      set({ cars: data ?? [], isLoading: false });
    } catch {
      set({ error: "Search failed", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
