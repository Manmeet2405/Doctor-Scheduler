"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FiCalendar, FiClock, FiEdit2, FiTrash2 } from "react-icons/fi";

import type { Appointment, Doctor } from "@/lib/types";
import {
  cancelAppointment,
  getAppointments,
  getDoctors,
  rescheduleAppointment,
} from "@/lib/api";
import { makeDaySlots, toISO, isSlotBooked } from "@/lib/slots";
import emptyAnim from "@/lib/lottie/empty.json";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function byDateAsc(a: Appointment, b: Appointment) {
  return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
    time: d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  };
}

export default function PatientDashboardPage() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [reschedDate, setReschedDate] = React.useState<Date | undefined>(new Date());
  const [reschedSlot, setReschedSlot] = React.useState<Date | undefined>();
  const [busy, setBusy] = React.useState(false);

  const daySlots = React.useMemo(
    () => (reschedDate ? makeDaySlots(reschedDate) : []),
    [reschedDate]
  );

  async function refresh() {
    const [d, a] = await Promise.all([getDoctors(), getAppointments()]);
    setDoctors(d);
    setAppointments(a.sort(byDateAsc));
  }

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const enriched = appointments.map((a) => ({
    ...a,
    doctor: doctors.find((d) => d.id === a.doctorId),
    isPast: new Date(a.dateTime).getTime() < Date.now(),
  }));

  const upcoming = enriched.filter((a) => !a.isPast);
  const history = enriched.filter((a) => a.isPast).reverse();

  return (
    <main className="site-bg relative">
      <div className="pointer-events-none absolute inset-0 noise opacity-60 dark:opacity-45" />
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Patient Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upcoming appointments, reschedules, and history—presented as a calm
            timeline.
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Loading appointments…
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-sm text-rose-300">{error}</CardContent>
          </Card>
        ) : upcoming.length === 0 ? (
          <Card className="overflow-hidden">
            <CardContent className="grid place-items-center gap-2 p-10 text-center">
              <div className="w-44">
                <Lottie animationData={emptyAnim} />
              </div>
              <p className="text-sm font-semibold tracking-tight">No upcoming appointments</p>
              <p className="text-sm text-muted-foreground">
                When you book, your timeline will appear here.
              </p>
              <Button asChild className="mt-2">
                <a href="/book">Book now</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-4">
              {upcoming.map((a) => {
                const when = formatWhen(a.dateTime);
                return (
                  <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <CardTitle className="truncate text-xl">
                              {a.doctor?.name ?? `Doctor #${a.doctorId}`}
                            </CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {a.doctor?.specialty ?? "—"} · {a.doctor?.location ?? "—"}
                            </p>
                          </div>
                          <Badge variant="success">Upcoming</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-2">
                            <FiCalendar />
                            {when.date}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-2">
                            <FiClock />
                            {when.time}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full sm:w-auto">
                                <FiEdit2 />
                                Reschedule
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reschedule appointment</DialogTitle>
                                <DialogDescription>
                                  Pick a new date and available time slot.
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-3xl border border-border/60 bg-background/55 p-3 backdrop-blur-xl">
                                  <DayPicker
                                    mode="single"
                                    selected={reschedDate}
                                    onSelect={setReschedDate}
                                    fromDate={new Date()}
                                  />
                                </div>
                                <div className="space-y-3">
                                  <p className="text-xs font-semibold text-muted-foreground">
                                    Time slots
                                  </p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {daySlots.map((s) => {
                                      const iso = toISO(s);
                                      const booked = isSlotBooked({
                                        appointments,
                                        doctorId: a.doctorId,
                                        slotISO: iso,
                                      });
                                      const selected =
                                        reschedSlot?.toISOString() === iso;
                                      return (
                                        <button
                                          key={iso}
                                          disabled={booked}
                                          onClick={() => !booked && setReschedSlot(s)}
                                          className={[
                                            "rounded-2xl border border-border/60 px-3 py-2 text-sm font-medium transition-[opacity,border-color,transform] hover:-translate-y-0.5",
                                            booked
                                              ? "bg-muted/30 text-muted-foreground opacity-50"
                                              : "bg-background/55",
                                            selected ? "border-primary/70" : "",
                                          ].join(" ")}
                                        >
                                          {new Date(iso).toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                          })}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <Button
                                    className="w-full"
                                    disabled={!reschedSlot || busy}
                                    onClick={async () => {
                                      setBusy(true);
                                      setError(null);
                                      try {
                                        await rescheduleAppointment(a.id, {
                                          dateTime: toISO(reschedSlot!),
                                        });
                                        await refresh();
                                      } catch (e) {
                                        setError(
                                          e instanceof Error
                                            ? e.message
                                            : "Reschedule failed"
                                        );
                                      } finally {
                                        setBusy(false);
                                      }
                                    }}
                                  >
                                    {busy ? "Saving…" : "Save new time"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            disabled={busy}
                            onClick={async () => {
                              setBusy(true);
                              setError(null);
                              try {
                                await cancelAppointment(a.id);
                                await refresh();
                              } catch (e) {
                                setError(
                                  e instanceof Error ? e.message : "Cancel failed"
                                );
                              } finally {
                                setBusy(false);
                              }
                            }}
                          >
                            <FiTrash2 />
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="lg:sticky lg:top-28 lg:h-fit">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Completed appointments will appear here.
                    </p>
                  ) : (
                    history.slice(0, 5).map((a) => {
                      const when = formatWhen(a.dateTime);
                      return (
                        <div
                          key={a.id}
                          className="rounded-3xl border border-border/60 bg-background/55 p-4 text-sm backdrop-blur-xl"
                        >
                          <p className="font-semibold tracking-tight">
                            {a.doctor?.name ?? `Doctor #${a.doctorId}`}
                          </p>
                          <p className="mt-1 text-muted-foreground">
                            {when.date} · {when.time}
                          </p>
                          <Badge variant="secondary" className="mt-2">
                            Past
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

