"use client";

import * as React from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiCalendar, FiClock, FiShield, FiZap } from "react-icons/fi";

import type { Doctor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DoctorCard } from "@/components/doctor/doctor-card";

gsap.registerPlugin(ScrollTrigger);

function useSectionReveals() {
  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });

      // Hero background gradient drift (subtle, premium).
      gsap.to("[data-hero-bg]", {
        backgroundPosition: "120% 0%",
        duration: 8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Parallax floating chips.
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, idx) => {
        gsap.to(el, {
          y: idx % 2 === 0 ? -18 : 18,
          duration: 3.2 + idx * 0.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    });

    return () => ctx.revert();
  }, []);
}

export function Landing({ previewDoctors }: { previewDoctors: Doctor[] }) {
  useSectionReveals();

  return (
    <main className="site-bg relative">
      <div className="pointer-events-none absolute inset-0 noise opacity-70 dark:opacity-50" />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pb-10 pt-10 md:pt-16">
        <div
          data-hero-bg
          className="absolute inset-x-4 top-6 -z-10 h-[520px] rounded-[40px] bg-[linear-gradient(120deg,rgba(99,102,241,0.22),rgba(168,85,247,0.18),rgba(16,185,129,0.16))] bg-[length:200%_200%] blur-2xl"
        />

        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur-xl"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
              Premium scheduling, built for speed and calm.
            </motion.p>

            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Book a doctor appointment with{" "}
              <span className="gradient-text">startup-grade polish</span>.
            </h1>

            <p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground md:text-lg">
              A modern experience for patients and clinicians: delightful
              micro-interactions, smooth motion, and an interface that feels
              expensive.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href="/book">Book an appointment</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/doctors">Browse doctors</a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <div data-float className="glass-light dark:glass rounded-2xl px-4 py-3">
                <p className="text-xs text-muted-foreground">Avg. booking time</p>
                <p className="text-sm font-semibold tracking-tight">under 45s</p>
              </div>
              <div data-float className="glass-light dark:glass rounded-2xl px-4 py-3">
                <p className="text-xs text-muted-foreground">Patient satisfaction</p>
                <p className="text-sm font-semibold tracking-tight">4.8 / 5</p>
              </div>
              <div data-float className="glass-light dark:glass rounded-2xl px-4 py-3">
                <p className="text-xs text-muted-foreground">No surprises</p>
                <p className="text-sm font-semibold tracking-tight">clear slots</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-primary/20 via-fuchsia-500/15 to-emerald-400/10 blur-2xl" />

            <div className="grid gap-4">
              <DoctorCard doctor={previewDoctors[0]} />
              <div className="grid gap-4 sm:grid-cols-2">
                {previewDoctors.slice(1, 3).map((d) => (
                  <DoctorCard key={d.id} doctor={d} className="sm:aspect-[1.35/1]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div data-reveal className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Designed like a premium product.
          </h2>
          <p className="mt-2 text-muted-foreground">
            Subtle blur, soft shadows, confident typography, and motion that
            reinforces clarity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              icon: <FiZap />,
              title: "Fast booking flow",
              desc: "A step-by-step experience that stays out of the way—until it matters.",
            },
            {
              icon: <FiCalendar />,
              title: "Modern calendar UX",
              desc: "Clear availability with disabled states and satisfying selection feedback.",
            },
            {
              icon: <FiClock />,
              title: "Slots at a glance",
              desc: "Time slots are grouped, animated, and easy to scan on mobile.",
            },
            {
              icon: <FiShield />,
              title: "Reliable state handling",
              desc: "Loading states, empty states, and transitions that feel intentional.",
            },
          ].map((f) => (
            <Card key={f.title} data-reveal className="group overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                    {f.icon}
                  </span>
                  {f.title}
                </CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-1 w-full rounded-full bg-gradient-to-r from-primary/60 via-fuchsia-500/40 to-emerald-400/40 opacity-60" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div data-reveal className="rounded-[40px] border border-border/60 bg-background/60 p-6 backdrop-blur-2xl md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            How it works
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A calm, guided process with premium motion cues.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { n: "01", title: "Select a doctor", desc: "Browse specializations and ratings." },
              { n: "02", title: "Choose a date + slot", desc: "See what’s available instantly." },
              { n: "03", title: "Confirm booking", desc: "Get a satisfying confirmation state." },
            ].map((s) => (
              <div
                key={s.n}
                className="glass-light dark:glass rounded-3xl p-5"
              >
                <p className="text-xs font-semibold text-muted-foreground">{s.n}</p>
                <p className="mt-2 text-base font-semibold tracking-tight">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="/book">Start booking</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/dashboard/patient">View dashboard</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

