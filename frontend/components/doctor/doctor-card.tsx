"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FiStar } from "react-icons/fi";

import type { Doctor } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function DoctorCard({
  doctor,
  availableSlotsLabel,
  ctaHref = "/book",
  className,
}: {
  doctor: Doctor;
  availableSlotsLabel?: string;
  ctaHref?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 20, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 180, damping: 20, mass: 0.2 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-10, 10]);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function onPointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group relative rounded-3xl border border-border/60 bg-card/60 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_24px_80px_-56px_rgba(0,0,0,0.6)] backdrop-blur-xl",
        className
      )}
    >
      <div
        className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(99,102,241,0.16), transparent 40%)",
        }}
      />

      <div className="relative flex items-start gap-4" style={{ transform: "translateZ(24px)" }}>
        <div className="relative h-14 w-14 overflow-hidden rounded-2xl ring-1 ring-border/60">
          <Image
            src={doctor.avatarUrl || "/favicon.ico"}
            alt={doctor.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-base font-semibold tracking-tight">
              {doctor.name}
            </p>
            <Badge variant="secondary" className="gap-1">
              <FiStar className="opacity-80" />
              <span className="tabular-nums">
                {(doctor.rating ?? 4.7).toFixed(1)}
              </span>
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {doctor.specialty} · {doctor.location}
          </p>
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-3" style={{ transform: "translateZ(18px)" }}>
        <p className="text-xs text-muted-foreground">
          {availableSlotsLabel ?? "Next slots: Today · 3:30 PM · 5:00 PM"}
        </p>
        <Button asChild size="sm" className="rounded-full">
          <a href={ctaHref}>Book</a>
        </Button>
      </div>
    </motion.div>
  );
}

