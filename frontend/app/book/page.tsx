import * as React from "react";
import { Suspense } from "react";
import { BookClient } from "@/components/booking/book-client";

export const dynamic = "force-dynamic";

export default function BookPage({
  searchParams,
}: {
  searchParams?: { doctorId?: string };
}) {
  const presetDoctorId = searchParams?.doctorId
    ? Number(searchParams.doctorId) || undefined
    : undefined;

  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
      <BookClient presetDoctorId={presetDoctorId} />
    </Suspense>
  );
}

