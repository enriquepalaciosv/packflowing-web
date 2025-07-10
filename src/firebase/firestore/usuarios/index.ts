import { collection, doc, getCountFromServer, getDoc, getDocs, getFirestore, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { database } from "../..";
import { capitalizeString } from "../../../utils/capitalizeString";

export interface Usuario {
  id: string;
  countryCode: string;
  email: string;
  lastName: string;
  lockerCode: string;
  name: string;
  phone: string;
  token?: string;
}

export type UsuarioConStats = Usuario & {
  packages: number;
  total: number;
  aereo: number;
  maritimo: number;
};

export interface TopUsuarios extends Usuario {
  packages: number;
  total: number;
  aereo: number;
  maritimo: number;
}

type ConteoPorUsuario = Record<
  string,
  {
    totalPackages: number;
    total: number;
    aereo: number;
    maritimo: number;
  }
>;

export async function searchUsersByFullNameOrLocker(valor: string) {
  const usuariosRef = collection(database, "users");
  const sanitizeString = capitalizeString(valor);

  const [q1Snapshot, q2Snapshot, q3Snapshot] = await Promise.all([
    getDocs(
      query(
        usuariosRef,
        where("name", ">=", sanitizeString),
        where("name", "<=", sanitizeString + "\uf8ff")
      )
    ),
    getDocs(
      query(
        usuariosRef,
        where("lastName", ">=", sanitizeString),
        where("lastName", "<=", sanitizeString + "\uf8ff")
      )
    ),
    getDocs(
      query(
        usuariosRef,
        where("lockerCode", ">=", sanitizeString.toUpperCase()),
        where("lockerCode", "<=", sanitizeString.toUpperCase() + "\uf8ff")
      )
    ),
  ]);

  const usersList = [
    ...q1Snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Partial<Usuario>),
    })),
    ...q2Snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Partial<Usuario>),
    })),
    ...q3Snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Partial<Usuario>),
    })),
  ];

  const uniqueUsers = usersList.filter(
    (u, i, self) => i === self.findIndex((t) => t.id === u.id)
  );

  return uniqueUsers as Usuario[];
}

export async function fetchUsuariosLoteado(
  startDate: Date,
  endDate: Date,
  lastDoc?: QueryDocumentSnapshot,
): Promise<{
  usuarios: UsuarioConStats[];
  lastDoc?: QueryDocumentSnapshot;
}> {
  const usuariosRef = collection(database, "users");

  const usuariosQuery = query(
    usuariosRef,
    orderBy("lockerCode", "desc"),
    ...(lastDoc ? [startAfter(lastDoc)] : []),
    limit(100)
  );

  const snapshot = await getDocs(usuariosQuery);

  const usuariosRaw = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Partial<Usuario>),
  })) as Usuario[];

  const usuariosConStats: UsuarioConStats[] = await Promise.all(
    usuariosRaw.map(async (usuario) => {
      const paquetesRef = collection(database, "paquetes");

      const q = query(
        paquetesRef,
        where("idUsuario", "==", usuario.id),
        where("createdAt", ">=", startDate),
        where("createdAt", "<=", endDate)
      );

      const paquetesSnap = await getDocs(q);

      let total = 0;
      let aereo = 0;
      let maritimo = 0;

      paquetesSnap.forEach((p) => {
        const { via, peso, tarifa } = p.data();

        if (tarifa && peso) total = total + tarifa?.monto * peso?.monto;

        if (via === "aereo") aereo++;
        else if (via === "maritimo") maritimo++;
      });

      return {
        ...usuario,
        packages: paquetesSnap.size,
        total,
        aereo,
        maritimo,
      };
    })
  );

  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return {
    usuarios: usuariosConStats,
    lastDoc: lastVisible
  };
}

export async function updateUsuario(id: string, usuario: Partial<Usuario>) {
  try {
    const docRef = doc(database, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setDoc(docRef, { ...data, ...usuario });
      toast.success("Usuario actualizado con éxito");
      return null;
    }
  } catch (error) {
    console.error("Error actualizando usuario: ", error);
    toast.error("Ocurrio un error al actualizar usuario");
    return null;
  }
}

export async function countUsuarios() {
  const usuariosRef = collection(database, "users");

  const queryUsuarios = query(usuariosRef);
  const snapshot = await getCountFromServer(queryUsuarios);
  const total = snapshot.data().count;

  return total
}

export async function fetchTopUsuariosByPaquetes(startDate: Date, endDate: Date) {
  const db = getFirestore();
  const paquetesRef = collection(db, "paquetes");

  const q = query(
    paquetesRef,
    where("createdAt", ">=", startDate),
    where("createdAt", "<=", endDate)
  );

  const snapshot = await getDocs(q);

  const conteo: ConteoPorUsuario = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    const idUsuario = data.idUsuario;
    const { via, peso, tarifa } = data;

    if (!idUsuario || !via) return;

    if (!conteo[idUsuario]) {
      conteo[idUsuario] = { totalPackages: 0, total: 0, aereo: 0, maritimo: 0 };
    }

    conteo[idUsuario].totalPackages += 1;


    if (tarifa && peso) conteo[idUsuario].total = conteo[idUsuario].total + tarifa?.monto * peso?.monto;


    if (via === "aereo") conteo[idUsuario].aereo += 1;
    else if (via === "maritimo") conteo[idUsuario].maritimo += 1;
  });

  const top3 = Object.entries(conteo)
    .sort((a, b) => b[1].totalPackages - a[1].totalPackages)
    .slice(0, 3);

  const topUsuarios: TopUsuarios[] = await Promise.all(
    top3.map(async ([usuarioId, { totalPackages, total, aereo, maritimo }]) => {
      const docRef = doc(database, "users", usuarioId);
      const docSnap = await getDoc(docRef);
      const usuario = docSnap.data();

      return {
        ...usuario,
        packages: totalPackages,
        total,
        aereo,
        maritimo,
      } as TopUsuarios;
    })
  );

  return topUsuarios as TopUsuarios[];
}