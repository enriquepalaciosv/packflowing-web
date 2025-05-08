import {
  QueryDocumentSnapshot,
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../..";
import { Usuario } from "../usuarios";

const ESTADOS = [
  "entregado",
  "recibido",
  "listo_para_retirar",
  "en_transito",
] as const;

export interface Paquete {
  id: string;
  idRastreo: string;
  idUsuario: string;
  contenido: string;
  estado: "entregado" | "listo_para_retirar" | "en_transito" | "recibido";
  peso: {
    monto: number;
    unidad: "kg" | "lb";
  };
  tarifa: {
    monto: number;
    moneda: string;
  };
  total: number;
  via: "maritimo" | "aereo";
}

export interface PaqueteDto extends Paquete {
  usuario: Usuario;
}

// Contar paquetes por estado
export async function countPackagesByEstado() {
  const db = getFirestore();
  const paquetesRef = collection(db, "paquetes");

  const counts = await Promise.all(
    ESTADOS.map(async (estado) => {
      const queryRef = query(paquetesRef, where("estado", "==", estado));
      const snapshot = await getCountFromServer(queryRef);
      return { estado, count: snapshot.data().count };
    })
  );

  return counts.reduce(
    (acc, curr) => ({ ...acc, [curr.estado]: curr.count }),
    {} as Record<(typeof ESTADOS)[number], number>
  );
}

export async function fetchPaquetesLoteado(
  lastDoc?: QueryDocumentSnapshot
): Promise<{
  paquetes: (Paquete & { usuario?: any })[]; // ← Incluye objeto usuario
  lastDoc?: QueryDocumentSnapshot;
}> {
  const db = getFirestore();
  const paquetesRef = collection(db, "paquetes");

  const paquetesQuery = query(
    paquetesRef,
    orderBy("idRastreo", "desc"),
    ...(lastDoc ? [startAfter(lastDoc)] : []),
    limit(100)
  );

  const snapshot = await getDocs(paquetesQuery);

  const paquetesRaw = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Partial<Paquete>),
  })) as Paquete[];

  const userIds = Array.from(
    new Set(paquetesRaw.map((p) => p.idUsuario).filter(Boolean))
  );

  const userMap: Record<string, any> = {};

  await Promise.all(
    userIds.map(async (idUsuario) => {
      const userDoc = await getDoc(doc(db, "users", idUsuario));
      if (userDoc.exists()) {
        userMap[idUsuario] = { id: userDoc.id, ...userDoc.data() };
      }
    })
  );

  const paquetesConUsuario = paquetesRaw.map((p) => ({
    ...p,
    usuario: userMap[p.idUsuario] || null,
  }));

  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return {
    paquetes: paquetesConUsuario,
    lastDoc: lastVisible,
  };
}

export async function updatePaquete(id: string, data: Partial<Paquete>) {
  const db = getFirestore();
  const paqueteRef = doc(db, "paquetes", id);
  await updateDoc(paqueteRef, data);
}

export const savePaquete = async (data: Paquete) => {
  const fechaLocal = new Date().toLocaleString("en-US", {
    timeZone: "America/Managua",
  });
  const fechaObj = new Date(fechaLocal);
  const fecha = fechaObj.toISOString().split("T")[0];
  const hora = fechaObj.toTimeString().slice(0, 5);

  const docRef = await addDoc(collection(database, "paquetes"), {
    ...data,
    rastreo: [
      {
        fecha,
        hora,
        estado: "recibido",
      },
    ],
    estado: "recibido",
  });
  return docRef.id;
};
