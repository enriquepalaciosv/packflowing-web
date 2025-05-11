import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import getCustomErrorMessage from "../../utils/firebaseErrors";
import { FirebaseError } from "firebase/app";

export default async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.info(
      "Si el correo esta registrado, recibirá las instrucciones por el mismo"
    );
    return;
  } catch (error) {
    const firebaseError = error as FirebaseError;
    toast.error(getCustomErrorMessage(firebaseError.code));
    return null;
  }
}
