import { create } from "zustand";
import dayjs, { Dayjs } from "dayjs";

interface DateRangeStore {
  fechaInicio: Dayjs;
  fechaFin: Dayjs;
  setFechas: (inicio: Dayjs, fin: Dayjs) => void;
}

export const useDateRangeStore = create<DateRangeStore>((set) => ({
  fechaInicio: dayjs(), // Por defecto hoy
  fechaFin: dayjs(),
  setFechas: (inicio, fin) => set({ fechaInicio: inicio, fechaFin: fin }),
}));
