import Currency from "./Currency";

export default interface Fee {
  nombre: string;
  monto: number;
  moneda: Currency;
}
