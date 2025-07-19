import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Timestamp } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Analytics, PaqueteDto } from "../firebase/firestore/paquetes";
import { UsuarioConStats } from "../firebase/firestore/usuarios";
import html2canvas from "html2canvas";

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

  // Generation date
  const fechaActual = "Fecha de generación " + dayjs().format("DD/MM/YYYY");
  // Range of dates
  const rangeText = "Paquetes desde " + range;

  doc.setFontSize(12);

  const pageWidth = doc.internal.pageSize.getWidth();
  const fechaTextWidth = doc.getTextWidth(fechaActual);
  const rangeTextWidth = doc.getTextWidth(rangeText);

  doc.text(fechaActual, pageWidth - fechaTextWidth - 30, 17.5);
  doc.text(rangeText, pageWidth - rangeTextWidth - 30, 22.5);

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

export async function exportPDFUsers(fileName: string, rows: UsuarioConStats[], name: string) {
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

  // Generation date
  const fechaActual = "Fecha de generación " + dayjs().format("DD/MM/YYYY");

  doc.setFontSize(12);

  const pageWidth = doc.internal.pageSize.getWidth();
  const fechaTextWidth = doc.getTextWidth(fechaActual);

  doc.text(fechaActual, pageWidth - fechaTextWidth - 30, 20);

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 15, 12.5, 10, 10);
  }

  const tableColumn = [
    "ID",
    "Cliente",
    "Nombre",
    "Apellido",
    "Correo",
    "Télefono",
    "# Aereos",
    "# Maritimo",
    "$ Ventas"
  ];

  const tableRows = rows.map((row) => {
    return [
      row.id,
      row.lockerCode,
      row.name,
      row.lastName,
      row.email,
      `${row.countryCode} ${row.phone}`,
      row.aereo,
      row.maritimo,
      row.total
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

  // Image base 64
  const logoUrl = "/logo.png";
  const base64 = await loadImageAsBase64(logoUrl);
  const imageId = workbook.addImage({
    base64,
    extension: "png",
  });

  sheet.addImage(imageId, {
    tl: { col: 0 + 0.25, row: 0 + 0.2 },
    ext: { width: 45, height: 45 },
  });

  sheet.getCell("A1").border = {
    bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
  }

  // Generation date
  const generationDate = "Fecha de generación " + dayjs().format("DD/MM/YYYY");
  // Range of dates
  const rangeText = "Paquetes desde " + dateRange;

  // Merge cells A1:A2 (Logo)
  sheet.mergeCells("A1:A2");
  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  // Merge cells B1:B2 (Name)
  sheet.mergeCells("B1:C2");
  sheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
  // Merge cells F1:G1 (Generation date)
  sheet.mergeCells("F1:G1");
  sheet.getCell('F1').alignment = { horizontal: 'right', vertical: 'middle' };
  // Merge cells F1:G1 (range of dates)
  sheet.mergeCells("F2:G2");
  sheet.getCell('F2').alignment = { horizontal: 'right', vertical: 'middle' };

  // Add name's agency
  sheet.getCell("B1").value = agencyName;
  sheet.getCell("B1").font = { bold: true, size: 16 };
  // Add generation date
  sheet.getCell("F1").value = generationDate;
  sheet.getCell("F1").font = { bold: true, size: 12 };
  // Add range of dates
  sheet.getCell("F2").value = rangeText;
  sheet.getCell("F2").font = { bold: true, size: 12 };

  const headers = [
    "ID",
    "Contenido",
    "Usuario",
    "Vía",
    "Estado",
    "Últ. Rastreo",
    "Total",
    "# Aereos",
    "# Maritimo",
    "$ Ventas"
  ];

  sheet.addRow(1);

  const headerRow = sheet.addRow(headers);

  // Row column names
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

  // Data row
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

  sheet.getColumn(1).width = 12;
  sheet.getRow(1).height = 20;
  sheet.getRow(2).height = 20;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
}

export async function exportExcelUsers(
  fileName: string,
  rows: UsuarioConStats[],
  agencyName: string
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Paquetes");

  // Image base 64
  const logoUrl = "/logo.png";
  const base64 = await loadImageAsBase64(logoUrl);
  const imageId = workbook.addImage({
    base64,
    extension: "png",
  });

  sheet.addImage(imageId, {
    tl: { col: 0 + 0.25, row: 0 + 0.2 },
    ext: { width: 45, height: 45 },
  });

  sheet.getCell("A1").border = {
    bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
  }

  // Generation date
  const generationDate = "Fecha de generación " + dayjs().format("DD/MM/YYYY");

  // Merge cells A1:A2 (Logo)
  sheet.mergeCells("A1:A2");
  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  // Merge cells B1:B2 (Name)
  sheet.mergeCells("B1:C2");
  sheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
  // Merge cells F1:G1 (Generation date)
  sheet.mergeCells("F1:F2");
  sheet.getCell('F1').alignment = { horizontal: 'right', vertical: 'middle' };

  // Add name's agency
  sheet.getCell("B1").value = agencyName;
  sheet.getCell("B1").font = { bold: true, size: 16 };
  // Add generation date
  sheet.getCell("F1").value = generationDate;
  sheet.getCell("F1").font = { bold: true, size: 12 };

  const headers = [
    "ID",
    "Cliente",
    "Nombre",
    "Apellido",
    "Correo",
    "Télefono",
    "# Aereos",
    "# Maritimo",
    "$ Ventas"
  ];

  sheet.addRow(1);

  const headerRow = sheet.addRow(headers);

  // Row column names
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

  // Data row
  rows.forEach((row) =>
    sheet.addRow([
      row.id,
      row.lockerCode,
      row.name,
      row.lastName,
      row.email,
      `${row.countryCode} ${row.phone}`,
      row.aereo,
      row.maritimo,
      row.total
    ])
  );

  sheet.columns.forEach((column) => {
    let maxLength = 12;
    column.eachCell?.((cell) => {
      const text = cell.value?.toString() ?? "";
      maxLength = Math.max(maxLength, text.length);
    });
    column.width = maxLength + 2;
  });

  sheet.getColumn(1).width = 12;
  sheet.getRow(1).height = 20;
  sheet.getRow(2).height = 20;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
}

export async function exportPDFStatistics(
  fileName: string,
  chartElementId: string,
  agencyName: string,
  analytics: Analytics | undefined
) {
  if (!analytics) return

  const doc = new jsPDF({ orientation: "landscape" });

  // Logo
  const logoUrl = "/logo.png";
  let logoBase64: string | null = null;

  try {
    logoBase64 = await loadImageAsBase64(logoUrl);
  } catch (error) {
    console.warn("No se pudo cargar el logo:", error);
  }

  doc.setFontSize(18);
  doc.text(agencyName, 30, 20);

  const fechaActual = "Fecha de generación " + dayjs().format("DD/MM/YYYY");
  const pageWidth = doc.internal.pageSize.getWidth();
  const fechaTextWidth = doc.getTextWidth(fechaActual);
  doc.setFontSize(12);
  doc.text(fechaActual, pageWidth - fechaTextWidth, 20);

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 15, 12.5, 10, 10);
  }

  const chartElement = document.getElementById(chartElementId);
  if (!chartElement) {
    console.error(`Elemento con ID "${chartElementId}" no encontrado.`);
    return;
  }

  const canvas = await html2canvas(chartElement, { backgroundColor: "#fff" });
  const chartImg = canvas.toDataURL("image/png");

  const imageWidth = 300;
  const imageHeight = 75;
  const imageX = (pageWidth - imageWidth) / 2;
  const imageY = 40;

  doc.addImage(chartImg, "PNG", imageX, imageY, imageWidth, imageHeight);

  const tableColumn = [
    "Total paquetes",
    "Total ventas",
    "Paquetes aéreos",
    "Paquetes marítimos"
  ];

  const tableRows = [
    [analytics.packages,
    "$" + analytics.sales,
    analytics.aereo,
    analytics.maritimo]
  ];

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 120,
  });

  doc.save(fileName);
}

export async function exportExcelStatistics(
  fileName: string,
  agencyName: string,
  analytics: Analytics | undefined
) {
  if (!analytics) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Paquetes");

  const logoUrl = "/logo.png";
  const base64Logo = await loadImageAsBase64(logoUrl);
  const logoId = workbook.addImage({ base64: base64Logo, extension: "png" });

  sheet.addImage(logoId, {
    tl: { col: 0.25, row: 0.2 },
    ext: { width: 45, height: 45 },
  });

  const chartElement = document.getElementById("ventas-chart");
  if (chartElement) {
    const canvas = await html2canvas(chartElement, { backgroundColor: "#fff" });
    const chartBase64 = canvas.toDataURL("image/png");
    const chartImageId = workbook.addImage({
      base64: chartBase64,
      extension: "png",
    });

    sheet.addImage(chartImageId, {
      tl: { col: 0, row: 3 },
      ext: { width: 777, height: 160 },
    });
  } else {
    console.warn("No se encontró el elemento #ventas-chart en el DOM.");
  }

  const generationDate = "Fecha de generación " + dayjs().format("DD/MM/YYYY");
  sheet.mergeCells("A1:A2");
  sheet.mergeCells("B1:C2");
  sheet.mergeCells("F1:F2");

  sheet.getCell("A1").border = {
    bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
  };
  sheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
  sheet.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };
  sheet.getCell("F1").alignment = { horizontal: "right", vertical: "middle" };

  sheet.getCell("B1").value = agencyName;
  sheet.getCell("B1").font = { bold: true, size: 16 };

  sheet.getCell("F1").value = generationDate;
  sheet.getCell("F1").font = { bold: true, size: 12 };

  sheet.addRow(1);
  sheet.addRow(1);
  sheet.addRow(1);
  sheet.addRow(1);
  sheet.addRow(1);
  sheet.addRow(1);
  sheet.addRow(1);
  sheet.addRow(1);

  const headerRow = sheet.addRow([
    "Total paquetes",
    "Total ventas",
    "Paquetes aéreos",
    "Paquetes marítimos",
  ]);

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

  sheet.addRow([
    analytics.packages,
    "$" + analytics.sales,
    analytics.aereo,
    analytics.maritimo,
  ]);

  sheet.columns.forEach((column) => {
    let maxLength = 12;
    column.eachCell?.((cell) => {
      const text = cell.value?.toString() ?? "";
      maxLength = Math.max(maxLength, text.length);
    });
    column.width = maxLength + 2;
  });

  sheet.getColumn(1).width = 12;
  sheet.getRow(1).height = 20;
  sheet.getRow(2).height = 20;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
}