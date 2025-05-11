import { create } from "zustand";
import {
  Paquete,
  countPackagesByEstado,
  fetchPaquetesLoteado,
} from "../firebase/firestore/paquetes";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { useDateRangeStore } from "./useDateRangeStore";

type PaqueteStore = {
  countEnTransito: number;
  countEntregado: number;
  countListoRetiro: number;
  countRecibido: number;
  countTotal: number;
  allPaquetes: Paquete[];
  lastDoc?: QueryDocumentSnapshot;
  hasMore: boolean;
  fetchCounts: () => Promise<void>;
  fetchAllPaquetes: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  resetPackages: () => void;
};

export const usePaqueteStore = create<PaqueteStore>((set, get) => ({
  allPaquetes: [],
  lastDoc: undefined,
  hasMore: true,
  countEnTransito: 0,
  countEntregado: 0,
  countListoRetiro: 0,
  countRecibido: 0,
  countTotal: 0,

  fetchCounts: async () => {
    const { fechaInicio, fechaFin } = useDateRangeStore.getState();
    const counts = await countPackagesByEstado(
      fechaInicio.startOf("day").toDate(),
      fechaFin.endOf("day").toDate()
    );
    set({
      countEnTransito: counts.en_transito,
      countEntregado: counts.entregado,
      countListoRetiro: counts.listo_para_retirar,
      countRecibido: counts.recibido,
      countTotal: counts.total,
    });
  },

  fetchAllPaquetes: async () => {
    const { fechaInicio, fechaFin } = useDateRangeStore.getState();
    const { paquetes, lastDoc } = await fetchPaquetesLoteado(
      undefined,
      fechaInicio.startOf("day").toDate(),
      fechaFin.endOf("day").toDate()
    );

    set({
      allPaquetes: paquetes,
      lastDoc,
      hasMore: !!lastDoc,
    });
  },

  fetchNextPage: async () => {
    const { fechaInicio, fechaFin } = useDateRangeStore.getState();
    const { lastDoc: currentLastDoc, hasMore } = get();

    if (!hasMore) return;

    const { paquetes, lastDoc: newLastDoc } = await fetchPaquetesLoteado(
      currentLastDoc,
      fechaInicio.startOf("day").toDate(),
      fechaFin.endOf("day").toDate()
    );

    set((state) => ({
      allPaquetes: [...state.allPaquetes, ...paquetes],
      lastDoc: newLastDoc,
      hasMore: !!newLastDoc,
    }));
  },

  resetPackages: () => {
    set({
      allPaquetes: [],
      lastDoc: undefined,
      hasMore: true,
    });
  },
}));
