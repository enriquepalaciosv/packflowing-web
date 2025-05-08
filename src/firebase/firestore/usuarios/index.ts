import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../..";

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

  const [q1Snapshot, q2Snapshot, q3Snapshot] = await Promise.all([
    getDocs(query(usuariosRef, where("name", "==", valor))),
    getDocs(query(usuariosRef, where("lastName", "==", valor))),
    getDocs(query(usuariosRef, where("lockerCode", "==", valor))),
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
