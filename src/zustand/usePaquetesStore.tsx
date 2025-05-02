import { create } from "zustand";
import { countPackagesByEstado } from "../firebase/firestore/paquetes";

type PaqueteStore = {
  countEnTransito: number;
  countEntregado: number;
  countListoRetiro: number;
  countRecibido: number;
  fetchCounts: () => Promise<void>;
};

export const usePaqueteStore = create<PaqueteStore>((set) => ({
  countEnTransito: 0,
  countEntregado: 0,
  countListoRetiro: 0,
  countRecibido: 0,

  fetchCounts: async () => {
    const counts = await countPackagesByEstado();
    set({
      countEnTransito: counts.en_transito,
      countEntregado: counts.entregado,
      countListoRetiro: counts.listo_para_retirar,
      countRecibido: counts.recibido,
    });
  },
}));
