import { QueryDocumentSnapshot } from "firebase/firestore";
import { create } from "zustand";
import { countUsuarios, fetchTopUsuariosByPaquetes, fetchUsuariosLoteado, TopUsuarios, UsuarioConStats } from "../firebase/firestore/usuarios";
import { useDateRangeStore } from "./useDateRangeStore";

type UsuariosStore = {
    countTotal: number;
    allUsuarios: UsuarioConStats[];
    lastDoc?: QueryDocumentSnapshot;
    hasMore: boolean;
    topUsuarios: TopUsuarios[];
    fetchTopUsuarios: () => void;
    fetchCounts: () => Promise<void>;
    fetchAllUsuarios: () => Promise<void>;
    fetchNextPage: () => Promise<void>;
    resetUsuarios: () => void;
};

export const useUsuariosStore = create<UsuariosStore>((set, get) => ({
    countTotal: 0,
    allUsuarios: [],
    lastDoc: undefined,
    hasMore: true,
    topUsuarios: [],

    fetchCounts: async () => {
        const total = await countUsuarios();
        set({
            countTotal: total,
        });
    },

    fetchAllUsuarios: async () => {
        const { fechaInicio, fechaFin } = useDateRangeStore.getState();
        const { usuarios, lastDoc } = await fetchUsuariosLoteado(
            fechaInicio.toDate(),
            fechaFin.toDate(),
            undefined,
        );
        console.log({ usuarios })
        set({
            allUsuarios: usuarios,
            lastDoc,
            hasMore: !!lastDoc,
        });
    },

    fetchNextPage: async () => {
        const { fechaInicio, fechaFin } = useDateRangeStore.getState();
        const { lastDoc: currentLastDoc, hasMore } = get();

        if (!hasMore) return;

        const { usuarios, lastDoc: newLastDoc } = await fetchUsuariosLoteado(
            fechaInicio.toDate(),
            fechaFin.toDate(),
            currentLastDoc
        );

        set((state) => ({
            allUsuarios: [...state.allUsuarios, ...usuarios],
            lastDoc: newLastDoc,
            hasMore: !!newLastDoc,
        }));
    },

    resetUsuarios: () => {
        set({
            allUsuarios: [],
            lastDoc: undefined,
            hasMore: true,
        });
    },

    fetchTopUsuarios: async () => {
        const { fechaInicio, fechaFin } = useDateRangeStore.getState();
        const topUsuarios = await fetchTopUsuariosByPaquetes(fechaInicio.toDate(), fechaFin.toDate());
        set({ topUsuarios });
    },
}));
