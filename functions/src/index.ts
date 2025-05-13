import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

enum Currency {
  "USD",
  "C$",
}

interface Fee {
  nombre: string;
  monto: number;
  moneda: Currency;
}

interface Paquete {
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
}

export const guardarPaquete = functions.https.onCall(async (request) => {
  const { data, auth } = request;
  const { paquete, edit } = data;

  if (!auth) {
    throw new functions.https.HttpsError("unauthenticated", "No autenticado");
  }

  const agenciaRef = db.collection("agencia").doc("default");
  const agenciaSnap = await agenciaRef.get();

  if (!agenciaSnap.exists) {
    throw new functions.https.HttpsError("not-found", "Agencia no encontrada");
  }

  const agencia = agenciaSnap.data();
  const plan = agencia?.suscripcion?.plan ?? "";
  const limiteActual = agencia?.suscripcion?.limite ?? 0;

  const fechaNicaragua = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Managua" })
  );
  const fechaStr = fechaNicaragua.toISOString().split("T")[0];
  const horaStr = fechaNicaragua.toTimeString().slice(0, 5);

  const paquetesRef = db.collection("paquetes");

  if (edit && paquete.id) {
    const paqueteRef = paquetesRef.doc(paquete.id);
    const paqueteSnap = await paqueteRef.get();

    if (!paqueteSnap.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Paquete no encontrado"
      );
    }

    const datosActuales = paqueteSnap.data();
    const rastreoActual = datosActuales?.rastreo ?? [];
    const ultimoEstado = rastreoActual[rastreoActual.length - 1]?.estado;

    const nuevoRastreo = [...rastreoActual];
    const seDebeAgregarNuevoEstado = paquete.estado !== ultimoEstado;

    if (seDebeAgregarNuevoEstado) {
      nuevoRastreo.push({
        fecha: fechaStr,
        hora: horaStr,
        estado: paquete.estado,
      });
    }

    await paqueteRef.update({
      ...paquete,
      rastreo: nuevoRastreo,
      createdAt: new admin.firestore.Timestamp(
        paquete.createdAt.seconds,
        paquete.createdAt.nanoseconds
      ),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      total: paquete.tarifa.monto * paquete.peso.monto,
    });

    await enviarNotificacion(paquete);
  } else {
    if (plan === "Básico" && limiteActual <= 0) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Límite insuficiente"
      );
    }

    const rastreoInicial = {
      fecha: fechaStr,
      hora: horaStr,
      estado: "recibido",
    };

    const nuevoPaqueteRef = await paquetesRef.add({
      ...paquete,
      rastreo: [rastreoInicial],
      estado: "recibido",
      total: paquete.tarifa.monto * paquete.peso.monto,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (plan === "Básico") {
      await agenciaRef.update({
        "suscripcion.limite": admin.firestore.FieldValue.increment(-1),
      });
    }

    await enviarNotificacion({
      ...paquete,
      id: nuevoPaqueteRef.id,
      estado: "recibido",
    });
  }

  return { success: true };
});

export const enviarNotificacionesEnBatch = functions.https.onCall(
  async (request) => {
    const { data, auth } = request;
    const { paqueteIds } = data;

    if (!auth) {
      throw new functions.https.HttpsError("unauthenticated", "No autenticado");
    }

    if (!Array.isArray(paqueteIds)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Datos inválidos"
      );
    }

    for (const id of paqueteIds) {
      const paqueteRef = db.collection("paquetes").doc(id);
      const snap = await paqueteRef.get();

      if (!snap.exists) continue;

      const data = snap.data() as Paquete;

      await enviarNotificacion(data);
    }

    return { success: true };
  }
);

/**
 * Envía una notificación push al usuario asociado con el paquete.
 *
 * @param {Paquete} paquete - El paquete actualizado con datos del usuario.
 */
async function enviarNotificacion(paquete: Paquete) {
  try {
    const usuarioSnap = await db
      .collection("users")
      .doc(paquete.idUsuario)
      .get();

    if (!usuarioSnap.exists) return;

    const usuario = usuarioSnap.data();

    if (!usuario?.token) return;

    const mensaje = {
      token: usuario.token,
      notification: {
        title: "Actualización de tu paquete",
        body: `Hola ${usuario.name}, 
        tu paquete con ID ${paquete.idRastreo} ha sido actualizado`,
      },
      data: {
        screen: "detailPackage",
        id: paquete.id,
      },
    };

    await admin.messaging().send(mensaje);
  } catch (error) {
    console.error("Error enviando notificación:", error);
  }
}
