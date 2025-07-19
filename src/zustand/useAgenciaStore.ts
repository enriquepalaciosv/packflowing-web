import { create } from "zustand";
import { Agency } from "../interfaces/Agency";

type AgenciaStore = {
  agencia: Agency | null;
  setAgencia: (agencia: Agency) => void;
  clearAgencia: () => void;
};

export const useAgenciaStore = create<AgenciaStore>(
  (set: (arg: { agencia: any }) => any) => ({
    agencia: null,
    setAgencia: (agencia: Agency) => set({ agencia }),
    clearAgencia: () => set({ agencia: null }),
  })
);
