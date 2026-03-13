import { getAppointments, getDoctors } from "@/lib/api";
import { makeDaySlots, toISO, isSlotBooked } from "@/lib/slots";
import { DoctorCard } from "@/components/doctor/doctor-card";

export default async function DoctorsPage() {
  const [doctors, appointments] = await Promise.all([
    getDoctors(),
    getAppointments(),
  ]);

  const todaySlots = makeDaySlots(new Date());

  return (
    <main className="site-bg relative">
      <div className="pointer-events-none absolute inset-0 noise opacity-60 dark:opacity-45" />
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Doctor Directory
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse all doctors and book in seconds. Cards tilt on hover for a
            premium feel.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => {
            const available = todaySlots.filter(
              (s) =>
                !isSlotBooked({
                  appointments,
                  doctorId: d.id,
                  slotISO: toISO(s),
                })
            );
            const label =
              available.length === 0
                ? "No slots today — try tomorrow"
                : `Available today: ${available.length} slots`;

            return (
              <DoctorCard
                key={d.id}
                doctor={d}
                availableSlotsLabel={label}
                ctaHref={`/book?doctorId=${d.id}`}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}

