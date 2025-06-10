import { getDoc, setDoc, doc } from "firebase/firestore";
import { database } from "../..";
import { Agency } from "../../../interfaces/Agency";
import { toast } from "react-toastify";

// Obtener agencia
const obtenerAgencia = async () => {
  try {
    const docRef = doc(database, "agencia", "default");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Agencia default:", data);
      return data;
    } else {
      console.log("No existe el documento 'default' en agencia");
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo agencia default:", error);
    return null;
  }
};

// Actualizar agencia
const actualizarAgencia = async (agencia: Partial<Agency>) => {
  try {
    const docRef = doc(database, "agencia", "default");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setDoc(docRef, { ...data, ...agencia });
      toast.success("Datos actualizados con éxito");
      return { ...data, ...agencia } as Agency;
    } else {
      console.log("No existe el documento 'default' en agencia");
      return null;
    }
  } catch (error) {
    console.error("Error actualizando agencia: ", error);
    toast.error("Ocurrio un error al actualizar agencia");
    return null;
  }
};

export { obtenerAgencia, actualizarAgencia };
