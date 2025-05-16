// utils/pdfExport.ts
import { Timestamp } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PaqueteDto } from "../firebase/firestore/paquetes";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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

export async function exportPDF(fileName: string, rows: PaqueteDto[], name: string, range: string) {
  const doc = new jsPDF({ orientation: "landscape" });

  const logoUrl = "/logo.png";
  let logoBase64: string | null = null;

  try {
    logoBase64 = await loadImageAsBase64(logoUrl);
  } catch (error) {
    console.warn("No se pudo cargar el logo:", error);
  }

  // Name's agency
  doc.setFontSize(18);
  doc.text(name, 30, 20);
  // Range of dates
  doc.setFontSize(14);
  doc.text(range, 90, 20);

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 15, 12.5, 10, 10);
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

export async function exportExcel(
  fileName: string,
  rows: PaqueteDto[],
  agencyName: string,
  dateRange: string
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Paquetes");

  const logoUrl = "/logo.png";
  const base64 = await loadImageAsBase64(logoUrl);
  const imageId = workbook.addImage({
    base64,
    extension: "png",
  });

  sheet.addImage(imageId, 'A1:A2');

  sheet.getCell("A1").border = {
    bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
  }
  sheet.getCell("B1").value = agencyName;
  sheet.getCell("B1").font = { bold: true, size: 16 };
  sheet.getCell("B2").value = dateRange;
  sheet.getCell("B2").font = { italic: true, size: 12 };

  const headers = [
    "ID",
    "Contenido",
    "Usuario",
    "Vía",
    "Estado",
    "Últ. Rastreo",
    "Total",
  ];

  const headerRow = sheet.addRow(headers);

  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEFEFEF" },
    };
  });

  // Filas de datos
  rows.forEach((row) => {
    const fechaActualizacion =
      row.updatedAt instanceof Timestamp
        ? row.updatedAt.toDate().toLocaleString("es-NI")
        : String(row.updatedAt ?? "");

    sheet.addRow([
      row.idRastreo,
      row.contenido ?? "-",
      `${row.usuario.name} ${row.usuario.lastName} - ${row.usuario.lockerCode}`,
      row.via,
      row.estado.replaceAll("_", " "),
      fechaActualizacion,
      row.total,
    ]);
  });

  sheet.columns.forEach((column) => {
    let maxLength = 12;
    column.eachCell?.((cell) => {
      const text = cell.value?.toString() ?? "";
      maxLength = Math.max(maxLength, text.length);
    });
    column.width = maxLength + 2;
  });

  sheet.getColumn(1).width = 20;

  const colWidth = sheet.getColumn(1).width ?? 10;

  const altura = colWidth * 1.5;
  sheet.getRow(1).height = altura;
  sheet.getRow(2).height = altura;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
}