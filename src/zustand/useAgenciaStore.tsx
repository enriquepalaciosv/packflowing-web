import { create } from "zustand";

export type Agencia = {
  nombre: string;
  activo: boolean;
  politicaPrivacidad: string;
  contacto: string;
  suscripcion: {
    plan: string;
    limite: number;
  };
  AI: boolean;
  registrarUsuarios: boolean;
  tarifas: { nombre: string; monto: number; moneda: string }[];
};

type AgenciaStore = {
  agencia: Agencia | null;
  setAgencia: (agencia: Agencia) => void;
  clearAgencia: () => void;
};

export const useAgenciaStore = create<AgenciaStore>(
  (set: (arg: { agencia: any }) => any) => ({
    agencia: null,
    setAgencia: (agencia: Agencia) => set({ agencia }),
    clearAgencia: () => set({ agencia: null }),
  })
);
