import { create } from "zustand";
import { Reservation } from "@/types";
import { reservationsApi } from "@/lib/api";
import { MOCK_RESERVATIONS } from "@/lib/mockData";

interface ReservationStore {
  reservations: Reservation[];
  selectedReservation: Reservation | null;
  isLoading: boolean;
  error: string | null;
  fetchReservations: () => Promise<void>;
  addReservation: (r: Omit<Reservation, "id">) => Promise<void>;
  updateReservation: (id: number, r: Partial<Reservation>) => Promise<void>;
  deleteReservation: (id: number) => Promise<void>;
  setSelectedReservation: (r: Reservation | null) => void;
  searchReservations: (params: Record<string, string | number>) => Promise<void>;
  clearError: () => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservations: [],
  selectedReservation: null,
  isLoading: false,
  error: null,

  fetchReservations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await reservationsApi.getAll();
      set({ reservations: data ?? [], isLoading: false });
    } catch {
      set({ reservations: MOCK_RESERVATIONS, isLoading: false });
    }
  },

  addReservation: async (reservation) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await reservationsApi.create(reservation);
      set((state) => ({ reservations: [...state.reservations, data], isLoading: false }));
    } catch {
      set({ error: "Failed to add reservation", isLoading: false });
      throw new Error("Failed to add reservation");
    }
  },

  updateReservation: async (id: number, updatedReservation: Partial<Reservation>) => {
    set({ isLoading: true, error: null });
    try {
      await reservationsApi.update(id, updatedReservation);
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === id ? { ...r, ...updatedReservation } : r
        ),
        isLoading: false,
      }));
    } catch {
      set({ error: "Failed to update reservation", isLoading: false });
      throw new Error("Failed to update reservation");
    }
  },

  deleteReservation: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await reservationsApi.delete(id);
      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
        isLoading: false,
        selectedReservation: state.selectedReservation?.id === id ? null : state.selectedReservation,
      }));
    } catch {
      set({ error: "Failed to delete reservation", isLoading: false });
      throw new Error("Failed to delete reservation");
    }
  },

  setSelectedReservation: (r: Reservation | null) => set({ selectedReservation: r }),

  searchReservations: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await reservationsApi.search(params);
      set({ reservations: data ?? [], isLoading: false });
    } catch {
      set({ error: "Search failed", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
