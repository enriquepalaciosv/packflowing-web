// utils/pdfExport.ts
import { Timestamp } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PaqueteDto } from "../firebase/firestore/paquetes";
import { useAgenciaStore } from "../zustand/useAgenciaStore";

function loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("No se pudo obtener el contexto del canvas");

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default async function exportPDF(fileName: string, rows: PaqueteDto[]) {
  const { agencia } = useAgenciaStore();
  const doc = new jsPDF({ orientation: "landscape" });

  const logoUrl = "/logo.png";
  let logoBase64: string | null = null;

  try {
    logoBase64 = await loadImageAsBase64(logoUrl);
  } catch (error) {
    console.warn("No se pudo cargar el logo:", error);
  }

  doc.setFontSize(18);
  doc.text(agencia?.nombre ?? "", 30, 20);

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 15, 10, 10, 10);
  }

  const tableColumn = [
    "ID",
    "Contenido",
    "Usuario",
    "Vía",
    "Estado",
    "Últ. Rastreo",
    "Total",
  ];

  const tableRows = rows.map((row) => {
    const fechaActualizacion =
      row.updatedAt instanceof Timestamp
        ? row.updatedAt.toDate().toLocaleString("es-NI")
        : String(row.updatedAt ?? "");

    return [
      row.idRastreo,
      row.contenido ?? "-",
      `${row.usuario.name} ${row.usuario.lastName} - ${row.usuario.lockerCode}`,
      row.via,
      row.estado.replaceAll("_", " "),
      fechaActualizacion,
      row.total,
    ];
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
  });

  doc.save(fileName);
}
