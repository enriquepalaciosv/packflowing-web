import {
  getFirestore,
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";

const ESTADOS = [
  "entregado",
  "recibido",
  "listo_para_retirar",
  "en_transito",
] as const;

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
