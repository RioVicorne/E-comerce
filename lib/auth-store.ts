import { create } from "zustand";

interface AuthState {
  isOpen: boolean;
  view: "login" | "register";
  openLogin: () => void;
  openRegister: () => void;
  closeAuth: () => void;
  toggleView: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isOpen: false,
  view: "login",
  openLogin: () => set({ isOpen: true, view: "login" }),
  openRegister: () => set({ isOpen: true, view: "register" }),
  closeAuth: () => set({ isOpen: false }),
  toggleView: () =>
    set((state) => ({ view: state.view === "login" ? "register" : "login" })),
}));
