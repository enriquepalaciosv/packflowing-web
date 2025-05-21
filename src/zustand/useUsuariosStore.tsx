import { QueryDocumentSnapshot } from "firebase/firestore";
import { create } from "zustand";
import { countUsuarios, fetchUsuariosLoteado, Usuario } from "../firebase/firestore/usuarios";

type UsuariosStore = {
    countTotal: number;
    allUsuarios: Usuario[];
    lastDoc?: QueryDocumentSnapshot;
    hasMore: boolean;
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

    fetchCounts: async () => {
        const total = await countUsuarios();
        set({
            countTotal: total,
        });
    },

    fetchAllUsuarios: async () => {
        const { usuarios, lastDoc } = await fetchUsuariosLoteado(
            undefined,
        );

        set({
            allUsuarios: usuarios,
            lastDoc,
            hasMore: !!lastDoc,
        });
    },

    fetchNextPage: async () => {
        const { lastDoc: currentLastDoc, hasMore } = get();

        if (!hasMore) return;

        const { usuarios, lastDoc: newLastDoc } = await fetchUsuariosLoteado(currentLastDoc);

        set((state) => ({
            allPaquetes: [...state.allUsuarios, ...usuarios],
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
}));
