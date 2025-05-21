import { collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, where } from "firebase/firestore";
import { database } from "../..";
import { capitalizeString } from "../../../utils/capitalizeString";
import { toast } from "react-toastify";

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
  lastDoc?: QueryDocumentSnapshot,
): Promise<{
  usuarios: Usuario[];
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

  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return {
    usuarios: usuariosRaw,
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