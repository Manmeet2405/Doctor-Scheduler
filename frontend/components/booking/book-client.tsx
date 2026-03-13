"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";

import type { Appointment, Doctor } from "@/lib/types";
import { createAppointment, getAppointments, getDoctors } from "@/lib/api";
import { makeDaySlots, toISO, isSlotBooked } from "@/lib/slots";
import successAnim from "@/lib/lottie/success.json";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Step = 1 | 2 | 3 | 4;

function StepShell({
  title,
  step,
  children,
}: {
  title: string;
  step: Step;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="secondary" className="tabular-nums">
            Step {step} / 4
          </Badge>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function formatSlot(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function BookClient({ presetDoctorId }: { presetDoctorId?: number }) {
  const [step, setStep] = React.useState<Step>(1);
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [doctorId, setDoctorId] = React.useState<number | undefined>(
    presetDoctorId
  );

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [slot, setSlot] = React.useState<Date | undefined>();

  const [patientName, setPatientName] = React.useState("");
  const [reason, setReason] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState<Appointment | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const [d, a] = await Promise.all([getDoctors(), getAppointments()]);
      setDoctors(d);
      setAppointments(a);
    })();
  }, []);

  React.useEffect(() => {
    setSlot(undefined);
  }, [date, doctorId]);

  const selectedDoctor = doctors.find((d) => d.id === doctorId);
  const daySlots = React.useMemo(() => {
    if (!date) return [];
    return makeDaySlots(date);
  }, [date]);

  const canGoNext =
    (step === 1 && !!doctorId) ||
    (step === 2 && !!date) ||
    (step === 3 && !!slot) ||
    (step === 4 && !!patientName.trim() && !!slot && !!doctorId);

  async function onConfirm() {
    if (!doctorId || !slot) return;
    setError(null);
    setSubmitting(true);
    try {
      const appt = await createAppointment({
        doctorId,
        patientName: patientName.trim(),
        dateTime: toISO(slot),
        reason: reason.trim() || undefined,
      });
      setSuccess(appt);
      const a = await getAppointments();
      setAppointments(a);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="site-bg relative">
      <div className="pointer-events-none absolute inset-0 noise opacity-60 dark:opacity-45" />
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Book Appointment
          </h1>
          <p className="mt-2 text-muted-foreground">
            A guided flow with premium transitions, interactive slots, and
            satisfying confirmation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StepShell title="Select a doctor" step={1}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {doctors.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setDoctorId(d.id)}
                          className={[
                            "rounded-3xl border border-border/60 bg-background/55 p-4 text-left backdrop-blur-xl transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:shadow-lg",
                            doctorId === d.id
                              ? "border-primary/60 shadow-primary/10"
                              : "",
                          ].join(" ")}
                        >
                          <p className="text-sm font-semibold tracking-tight">
                            {d.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {d.specialty} · {d.location}
                          </p>
                        </button>
                      ))}
                    </div>
                  </StepShell>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StepShell title="Choose a date" step={2}>
                    <div className="rounded-3xl border border-border/60 bg-background/55 p-3 backdrop-blur-xl">
                      <DayPicker
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        fromDate={new Date()}
                        className="mx-auto"
                      />
                    </div>
                  </StepShell>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StepShell title="Pick a time slot" step={3}>
                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="secondary">
                          {selectedDoctor?.name ?? "Doctor"}
                        </Badge>
                        <span className="text-muted-foreground">
                          {date?.toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {daySlots.map((s) => {
                          const iso = toISO(s);
                          const booked =
                            !!doctorId &&
                            isSlotBooked({
                              appointments,
                              doctorId,
                              slotISO: iso,
                            });
                          const selected = slot?.toISOString() === iso;
                          return (
                            <motion.button
                              key={iso}
                              onClick={() => !booked && setSlot(s)}
                              disabled={booked}
                              whileHover={!booked ? { y: -2 } : undefined}
                              whileTap={!booked ? { scale: 0.98 } : undefined}
                              className={[
                                "rounded-2xl border border-border/60 px-3 py-3 text-sm font-medium transition-[opacity,transform,box-shadow,border-color] backdrop-blur-xl",
                                booked
                                  ? "bg-muted/30 text-muted-foreground opacity-50"
                                  : "bg-background/55 hover:shadow-md",
                                selected
                                  ? "border-primary/70 shadow-primary/10"
                                  : "",
                              ].join(" ")}
                            >
                              {formatSlot(s)}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </StepShell>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="s4"
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StepShell title="Confirm booking" step={4}>
                    <div className="grid gap-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="mb-2 text-xs font-semibold text-muted-foreground">
                            Patient name
                          </p>
                          <Input
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="e.g. Manmeet Singh"
                          />
                        </div>
                        <div>
                          <p className="mb-2 text-xs font-semibold text-muted-foreground">
                            Reason (optional)
                          </p>
                          <Input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. follow-up consultation"
                          />
                        </div>
                      </div>

                      <div className="rounded-3xl border border-border/60 bg-background/55 p-4 text-sm backdrop-blur-xl">
                        <p className="text-xs text-muted-foreground">Booking</p>
                        <p className="mt-1 font-semibold tracking-tight">
                          {selectedDoctor?.name} · {selectedDoctor?.specialty}
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          {date?.toLocaleDateString()} ·{" "}
                          {slot ? formatSlot(slot) : ""}
                        </p>
                      </div>

                      {error && <p className="text-sm text-rose-300">{error}</p>}

                      <Button
                        size="lg"
                        onClick={onConfirm}
                        disabled={!canGoNext || submitting}
                        className="w-full"
                      >
                        {submitting ? "Confirming..." : "Confirm booking"}
                        <FiCheck />
                      </Button>
                    </div>
                  </StepShell>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  setStep((s) => (s === 1 ? 1 : ((s - 1) as Step)))
                }
                disabled={step === 1 || submitting}
              >
                <FiArrowLeft />
                Back
              </Button>

              <Button
                onClick={() => setStep((s) => (Math.min(4, s + 1) as Step))}
                disabled={!canGoNext || step === 4 || submitting}
              >
                Next
                <FiArrowRight />
              </Button>
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:h-fit">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!success ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      You’ll see a booking confirmation animation here after
                      checkout.
                    </p>
                    <div className="glass-light dark:glass rounded-3xl p-4">
                      <p className="text-xs text-muted-foreground">Selected</p>
                      <p className="mt-1 text-sm font-semibold tracking-tight">
                        {selectedDoctor?.name ?? "—"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {date?.toLocaleDateString() ?? "—"} ·{" "}
                        {slot ? formatSlot(slot) : "—"}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="grid place-items-center gap-3 py-4 text-center">
                    <div className="w-44">
                      <Lottie animationData={successAnim} loop={false} />
                    </div>
                    <p className="text-sm font-semibold tracking-tight">
                      Booking confirmed.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Appointment #{success.id} created successfully.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setSuccess(null);
                        setStep(1);
                        setPatientName("");
                        setReason("");
                        setSlot(undefined);
                      }}
                    >
                      Book another
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

