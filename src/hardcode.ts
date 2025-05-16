import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { faker } from "@faker-js/faker";

const ESTADOS = ["recibido", "en_transito", "listo_para_retirar", "entregado"];

export async function seedRandomPackages(cantidad = 120) {
  const db = getFirestore();
  const paquetesRef = collection(db, "paquetes");

  for (let i = 0; i < cantidad; i++) {
    const estado = faker.helpers.arrayElement(ESTADOS);
    const peso = parseFloat(
      faker.finance.amount({ min: 0.5, max: 10, dec: 1 })
    );
    const fechaCreacion = faker.date.between({
      from: new Date("2025-05-01"),
      to: new Date(),
    });

    const paquete = {
      idUsuario: "", // Agregar el id de un usuario de tu tabla
      idRastreo: faker.string.alphanumeric({ length: 10 }).toUpperCase(),
      estado,
      peso: { monto: peso, unidad: "lb" },
      tarifa: { moneda: "USD", monto: 5 },
      total: peso * 5,
      rastreo: [
        {
          estado,
          fecha: fechaCreacion.toISOString().split("T")[0],
          hora: fechaCreacion.toTimeString().slice(0, 5),
        },
      ],
      createdAt: Timestamp.fromDate(fechaCreacion),
      updatedAt: Timestamp.fromDate(fechaCreacion),
      contenido: faker.commerce.productName(),
      via: faker.helpers.arrayElement(["marítimo", "aéreo"]),
    };

    await addDoc(paquetesRef, paquete);
  }

  console.log(`${cantidad} paquetes generados correctamente.`);
}
