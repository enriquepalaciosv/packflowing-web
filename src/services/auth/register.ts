import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, database } from "../../firebase";
import getCustomErrorMessage from "../../utils/firebaseErrors";
import { FirebaseError } from "firebase/app";

interface UserAdminRegister {
  name: string;
  lastName: string;
  email: string;
  password: string;
  countryCode: string;
  phone: string;
  role: string;
}

export async function registerUserService(user: UserAdminRegister) {
  const { email, password, name, lastName, phone, countryCode } = user;

  try {
    // Registrar usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // Guardar usuario en Firestore
    await setDoc(doc(database, "users", uid), {
      name,
      lastName,
      email,
      countryCode,
      phone,
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
