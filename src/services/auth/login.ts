import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import getCustomErrorMessage from "../../utils/firebaseErrors";
import { FirebaseError } from "firebase/app";

interface UserAdmin {
  name: string;
  lastName: string;
  email: string;
  password: string;
  countryCode: string;
  phone: string;
  role: string;
}

export async function loginAdminService(credential: {
  email: string;
  password: string;
}) {
  const { email, password } = credential;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    const userDocRef = doc(database, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error(
        "No se encontró información del usuario en la base de datos."
      );
    }

    const userData = { id: user.uid, ...(userDocSnap.data() as UserAdmin) };

    if (!userData?.role) {
      await auth.signOut();
      toast.error("No tienes permisos para acceder.");
      return null;
    }

    toast.success("Ingreso exitoso");
    return userData as UserAdmin;
  } catch (error) {
    const firebaseError = error as FirebaseError;
    toast.error(getCustomErrorMessage(firebaseError.code));
    return null;
  }
}
