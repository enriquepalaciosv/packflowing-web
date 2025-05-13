import {
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  Timestamp,
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
  where,
  writeBatch,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { database, functions } from "../..";
import Fee from "../../../interfaces/Fee";
import { Usuario } from "../usuarios";

const ESTADOS = [
  "entregado",
  "recibido",
  "listo_para_retirar",
  "en_transito",
] as const;

interface Rastreo {
  estado: "entregado" | "listo_para_retirar" | "en_transito" | "recibido";
  fecha: Timestamp;
  hora: Timestamp;
}

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
  tarifa: Fee;
  total: number;
  via: "maritimo" | "aereo";
  rastreo: Rastreo[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PaqueteDto extends Paquete {
  usuario: Usuario;
}

const guardarPaquete = httpsCallable(functions, "guardarPaquete");

export async function countPackagesByEstado(fromDate?: Date, toDate?: Date) {
  const db = getFirestore();
  const paquetesRef = collection(db, "paquetes");

  const fechaFilters: QueryFieldFilterConstraint[] = [];

  if (fromDate) fechaFilters.push(where("createdAt", ">=", fromDate));

  if (toDate) fechaFilters.push(where("createdAt", "<=", toDate));

  const counts = await Promise.all(
    ESTADOS.map(async (estado) => {
      const queryRef = query(
        paquetesRef,
        where("estado", "==", estado),
        ...fechaFilters
      );
      const snapshot = await getCountFromServer(queryRef);
      return { estado, count: snapshot.data().count };
    })
  );

  const totalQuery = query(paquetesRef, ...fechaFilters);
  const totalSnapshot = await getCountFromServer(totalQuery);
  const total = totalSnapshot.data().count;

  const countsByEstado = counts.reduce(
    (acc, curr) => ({ ...acc, [curr.estado]: curr.count }),
    {} as Record<(typeof ESTADOS)[number], number>
  );

  return {
    ...countsByEstado,
    total,
  };
}

export async function fetchPaquetesLoteado(
  lastDoc?: QueryDocumentSnapshot,
  fromDate?: Date,
  toDate?: Date
): Promise<{
  paquetes: PaqueteDto[];
  lastDoc?: QueryDocumentSnapshot;
}> {
  const db = getFirestore();
  const paquetesRef = collection(db, "paquetes");

  const paquetesQuery = query(
    paquetesRef,
    where("createdAt", ">=", fromDate),
    where("createdAt", "<=", toDate),
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

export async function updatePaquete(data: Paquete) {
  try {
    const result = await guardarPaquete({ paquete: data, edit: true });
    console.log({ result });
    return result;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

export async function savePaquete(data: Paquete) {
  try {
    const { id, ...paquete } = data;
    const result = await guardarPaquete({ paquete, edit: false });
    console.log({ result });
    return result;
  } catch (error) {
    console.log({ error });
    throw error;
  }
}

type UpdateField = "estado" | "idUsuario" | "via" | "tarifa";

export const updatePackagesInBatch = async ({
  ids,
  field,
  value,
}: {
  ids: string[];
  field: UpdateField;
  value: any;
}) => {
  const batch = writeBatch(database);

  for (const id of ids) {
    const ref = doc(database, "paquetes", id);

    if (field === "estado") {
      const snap = await getDoc(ref);
      if (!snap.exists()) continue;

      const data = snap.data();
      const rastreoActual = data.rastreo ?? [];
      const fechaNicaragua = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Managua" })
      );
      const fechaStr = fechaNicaragua.toISOString().split("T")[0];
      const horaStr = fechaNicaragua.toTimeString().slice(0, 5);

      const lastState = rastreoActual[rastreoActual.length - 1]?.estado;
      const changeState = value !== lastState;

      const nuevoRastreo = changeState
        ? [
            ...rastreoActual,
            {
              estado: value,
              fecha: fechaStr,
              hora: horaStr,
            },
          ]
        : rastreoActual;

      batch.update(ref, {
        estado: value,
        rastreo: nuevoRastreo,
      });
    } else if (field === "tarifa") {
      const snap = await getDoc(ref);
      if (!snap.exists()) continue;
      const data = snap.data() as Paquete;
      const fee = value as Fee;
      batch.update(ref, {
        [field]: value,
        total: fee.monto * data.peso.monto,
      });
    } else {
      batch.update(ref, { [field]: value });
    }
  }

  await batch.commit();

  const enviarNotificaciones = httpsCallable(
    functions,
    "enviarNotificacionesEnBatch"
  );

  try {
    await enviarNotificaciones({ paqueteIds: ids });
  } catch (error) {
    console.error("Error enviando notificaciones:", error);
  }
};
