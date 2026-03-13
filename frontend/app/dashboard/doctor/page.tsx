"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { motion } from "framer-motion";
import { FiCalendar, FiUser } from "react-icons/fi";

import type { Appointment, Doctor } from "@/lib/types";
import { getAppointments, getDoctors } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function DoctorDashboardPage() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [doctorId, setDoctorId] = React.useState<number | undefined>();
  const [day, setDay] = React.useState<Date | undefined>(new Date());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const [d, a] = await Promise.all([getDoctors(), getAppointments()]);
      setDoctors(d);
      setAppointments(a);
      setDoctorId((prev) => prev ?? d[0]?.id);
      setLoading(false);
    })();
  }, []);

  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  const dayKey = React.useMemo(() => {
    if (!day) return "";
    const x = new Date(day);
    x.setHours(0, 0, 0, 0);
    return x.toISOString().slice(0, 10);
  }, [day]);

  const forDoctor = appointments.filter((a) => (doctorId ? a.doctorId === doctorId : true));
  const forDay = forDoctor
    .filter((a) => a.dateTime.slice(0, 10) === dayKey)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const patientList = Array.from(
    new Map(forDoctor.map((a) => [a.patientName.trim().toLowerCase(), a.patientName])).values()
  );

  return (
    <main className="site-bg relative">
      <div className="pointer-events-none absolute inset-0 noise opacity-60 dark:opacity-45" />
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Doctor Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Daily schedule, patient list, and a modern calendar view.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-xl">Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="inline-flex items-center gap-2">
                    <FiUser />
                    <span className="tabular-nums">
                      {patientList.length} patients
                    </span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl border border-border/60 bg-background/55 p-3 backdrop-blur-xl">
                <DayPicker mode="single" selected={day} onSelect={setDay} />
              </div>

              <div className="rounded-3xl border border-border/60 bg-background/55 p-4 backdrop-blur-xl">
                <p className="text-xs font-semibold text-muted-foreground">
                  Viewing
                </p>
                <select
                  value={doctorId ?? ""}
                  onChange={(e) => setDoctorId(Number(e.target.value))}
                  className="mt-2 h-11 w-full rounded-2xl border border-border/70 bg-background/60 px-4 text-sm shadow-sm backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-xl">Daily schedule</CardTitle>
                  <Badge variant="secondary" className="inline-flex items-center gap-2">
                    <FiCalendar />
                    <span className="tabular-nums">{forDay.length} appts</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : forDay.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No appointments on this day.
                  </p>
                ) : (
                  forDay.map((a) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl border border-border/60 bg-background/55 p-4 backdrop-blur-xl"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold tracking-tight">
                            {formatTime(a.dateTime)} — {a.patientName}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {a.reason || "General consultation"}
                          </p>
                        </div>
                        <Badge variant="success">Booked</Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">Patient list</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {patientList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No patients yet. Once appointments are booked, you’ll see them here.
                  </p>
                ) : (
                  patientList.slice(0, 12).map((p) => (
                    <div
                      key={p}
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/55 px-4 py-3 text-sm backdrop-blur-xl"
                    >
                      <span className="font-medium">{p}</span>
                      <span className="text-xs text-muted-foreground">
                        {selectedDoctor?.specialty ?? "—"}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

