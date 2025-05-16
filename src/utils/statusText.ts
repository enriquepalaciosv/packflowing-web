export type StatusText =
  | "Paquetes recibidos"
  | "Paquetes en tránsito"
  | "Paquetes listos para recoger"
  | "Paquetes entregados";

export type PackageTitle =
  | "Paquete recibido"
  | "Paquete en tránsito"
  | "Paquete listo"
  | "Paquete entregado";

export const packageMapping: Record<string, PackageTitle> = {
  recibido: "Paquete recibido",
  en_transito: "Paquete en tránsito",
  listo_para_retirar: "Paquete listo",
  entregado: "Paquete entregado",
};
