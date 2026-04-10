import { create } from "zustand";
import { User } from "@/types";
import { usersApi } from "@/lib/api";
import { MOCK_USERS } from "@/lib/mockData";

interface UserStore {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, "id">) => Promise<void>;
  updateUser: (id: number, user: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await usersApi.getAll();
      set({ users: data ?? [], isLoading: false });
    } catch {
      set({ users: MOCK_USERS, isLoading: false });
    }
  },

  addUser: async (user) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await usersApi.create(user);
      set((state) => ({ users: [...state.users, data], isLoading: false }));
    } catch {
      set({ error: "Failed to add user", isLoading: false });
      throw new Error("Failed to add user");
    }
  },

  updateUser: async (id: number, updatedUser: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      await usersApi.update(id, updatedUser);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)),
        isLoading: false,
      }));
    } catch {
      set({ error: "Failed to update user", isLoading: false });
      throw new Error("Failed to update user");
    }
  },

  deleteUser: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await usersApi.delete(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        isLoading: false,
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
      }));
    } catch {
      set({ error: "Failed to delete user", isLoading: false });
      throw new Error("Failed to delete user");
    }
  },

  setSelectedUser: (user: User | null) => set({ selectedUser: user }),

  clearError: () => set({ error: null }),
}));
