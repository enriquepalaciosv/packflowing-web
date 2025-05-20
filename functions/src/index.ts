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

export const guardarPaquete = functions.https.onCall(
  async (request) => {
    try {
      const {data, auth} = request;
      const {paquete, edit} = data;

      if (!auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "No autenticado"
        );
      }

      const agenciaRef = db.collection("agencia").doc("default");
      const agenciaSnap = await agenciaRef.get();

      if (!agenciaSnap.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Agencia no encontrada"
        );
      }

      const agencia = agenciaSnap.data();
      const limite = agencia?.suscripcion?.limite ?? 0;

      const fechaNicaragua = new Date(
        new Date().toLocaleString("en-US", {timeZone: "America/Managua"})
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

        const createdAt = paquete.createdAt?.seconds &&
          paquete.createdAt?.nanoseconds ?
          new admin.firestore.Timestamp(
            paquete.createdAt.seconds,
            paquete.createdAt.nanoseconds
          ) : paquete.createdAt;

        await paqueteRef.update({
          ...paquete,
          rastreo: nuevoRastreo,
          createdAt,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          total: paquete.tarifa ?
            paquete.tarifa?.monto * paquete.peso?.monto :
            0,
        });

        if (seDebeAgregarNuevoEstado) {
          await enviarNotificacion(paquete);
        }
      } else {
        const limiteActual = await contarPaquetesDelMes();
        if (limite && limite <= limiteActual) {
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
          total: paquete.tarifa ?
            paquete.tarifa?.monto * paquete.peso?.monto :
            0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        await enviarNotificacion({
          ...paquete,
          id: nuevoPaqueteRef.id,
          estado: "recibido",
        });
      }

      return {success: true};
    } catch (error) {
      console.error("Error en guardarPaquete:", error);
      throw new functions.https.HttpsError(
        "internal",
        (error as Error).message || "Error inesperado"
      );
    }
  }
);

export const enviarNotificacionesEnBatch = functions.https.onCall(
  async (request) => {
    const {data, auth} = request;
    const {paqueteIds} = data;

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

    return {success: true};
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

    const getBodyNotification =
      (status:
        "recibido"
        | "en_transito"
        | "listo_para_retirar"
        | "entregado"
      ) => {
        switch (status) {
        case "recibido":
          return "Su paquete ha sido recibido.";
        case "en_transito":
          return "Su paquete va camino a Nicaragua.";
        case "listo_para_retirar":
          return "Su paquete está listo para retirar";
        case "entregado":
          return "Su paquete ha sido entregado";
        default:
          return;
        }
      };

    const mensaje = {
      token: usuario.token,
      notification: {
        title: `Paquete ${paquete.idRastreo}`,
        body: getBodyNotification(paquete.estado),
      },
      data: {
        screen: "detailPackage",
        id: paquete.idRastreo,
      },
    };

    await admin.messaging().send(mensaje);
  } catch (error) {
    console.error("Error enviando notificación:", error);
  }
}

/**
 * Obtiene la cantidad de paquetes creados desde
 * el inicio del mes actual hasta ahora.
 * @return {Promise<number>} La cantidad de paquetes
 * creados en ese rango de fechas.
 */
async function contarPaquetesDelMes() {
  const db = admin.firestore();

  const ahora = admin.firestore.Timestamp.now();

  // Obtener fecha al inicio del mes actual (día 1 a las 00:00)
  const ahoraDate = ahora.toDate();
  const inicioMes = new Date(
    ahoraDate.getFullYear(),
    ahoraDate.getMonth(),
    1,
    0,
    0,
    0
  );
  const timestampInicioMes = admin.firestore.Timestamp.fromDate(inicioMes);

  const snapshot = await db
    .collection("paquetes")
    .where("createdAt", ">=", timestampInicioMes)
    .where("createdAt", "<=", ahora)
    .get();

  return snapshot.size;
}
