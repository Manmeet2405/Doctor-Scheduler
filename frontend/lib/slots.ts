import type { Appointment } from "@/lib/types";

export const SLOT_MINUTES = 30;

export function toISO(date: Date) {
  return date.toISOString();
}

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addMinutes(d: Date, minutes: number) {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() + minutes);
  return x;
}

export function makeDaySlots(date: Date, opts?: { startHour?: number; endHour?: number }) {
  const startHour = opts?.startHour ?? 10;
  const endHour = opts?.endHour ?? 17;
  const slots: Date[] = [];
  const base = startOfDay(date);
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      const t = new Date(base);
      t.setHours(h, m, 0, 0);
      slots.push(t);
    }
  }
  return slots;
}

export function isSlotBooked(args: {
  appointments: Appointment[];
  doctorId: number;
  slotISO: string;
}) {
  const needle = args.slotISO;
  return args.appointments.some(
    (a) => a.doctorId === args.doctorId && a.dateTime === needle
  );
}

