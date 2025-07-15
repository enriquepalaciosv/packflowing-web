import { create } from "zustand";
import dayjs, { Dayjs } from "dayjs";

interface DateRangeStore {
  fechaInicio: Dayjs;
  fechaFin: Dayjs;
  setFechas: (inicio: Dayjs, fin: Dayjs) => void;
}

export const useDateRangeStore = create<DateRangeStore>((set) => ({
  fechaInicio: dayjs().startOf("month"),
  fechaFin: dayjs(),
  setFechas: (inicio, fin) => set({ fechaInicio: inicio, fechaFin: fin }),
}));
