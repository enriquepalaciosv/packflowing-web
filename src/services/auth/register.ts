import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, database } from "../../firebase";
import getCustomErrorMessage from "../../utils/firebaseErrors";
import { FirebaseError } from "firebase/app";
import generateLockerCode from "../../utils/generateLockerCode";

interface UserAdminRegister {
  name: string;
  lastName: string;
  email: string;
  password: string;
  countryCode: string;
  lockerCode: string;
  phone: string;
  role: string;
}

// Método para determinar si ya existe el lockerCode
async function isLockerCodeUnique(lockerCode: string) {
  const usersRef = collection(database, "users");
  const q = query(usersRef, where("lockerCode", "==", lockerCode));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
}

export async function registerUserService(user: Partial<UserAdminRegister>) {
  const { email, password, name, lastName, phone, countryCode } = user;

  if (!email || !name || !password || !name || !lastName) return null;

  try {
    // Registrar usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // Generar código único de casillero
    let lockerCode = generateLockerCode(name, lastName);
    while (!(await isLockerCodeUnique(lockerCode))) {
      // Regenerar si ya existe
      lockerCode = generateLockerCode(name, lastName);
    }

    // Guardar usuario en Firestore
    await setDoc(doc(database, "users", uid), {
      name,
      lastName,
      email,
      countryCode,
      token: "", // Este campo se completa cuando el usuario inicia sesión desde la app
      phone,
      lockerCode,
      role: "Admin",
    });

    toast.success("Usuario registrado con éxito");
    return userCredential.user;
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    toast.error(getCustomErrorMessage(firebaseError.code));
    return null;
  }
}
