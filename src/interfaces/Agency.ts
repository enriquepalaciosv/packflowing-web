import Fee from "./Fee";

export type Agency = {
  nombre: string;
  activo: boolean;
  politicaPrivacidad: string;
  contacto: string;
  suscripcion: {
    plan: string;
    limite: number;
  };
  AI: boolean;
  registrarUsuarios: boolean;
  tarifas: Fee[];
};
