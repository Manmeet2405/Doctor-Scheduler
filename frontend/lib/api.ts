import type { Appointment, Doctor } from "@/lib/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { message?: string };
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export async function getDoctors(): Promise<Doctor[]> {
  const doctors = await apiFetch<Doctor[]>("/api/doctors");

  // Enrich with UI-only fields (rating + avatar) without changing backend
  const avatars = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=512&h=512&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=512&h=512&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=512&h=512&fit=crop&crop=faces",
  ];

  return doctors.map((d, idx) => ({
    ...d,
    rating: d.rating ?? (4.6 + (idx % 3) * 0.1),
    avatarUrl: d.avatarUrl ?? avatars[idx % avatars.length],
  }));
}

export async function getAppointments(): Promise<Appointment[]> {
  return await apiFetch<Appointment[]>("/api/appointments");
}

export async function createAppointment(input: {
  doctorId: number;
  patientName: string;
  dateTime: string;
  reason?: string;
}): Promise<Appointment> {
  return await apiFetch<Appointment>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function cancelAppointment(id: number): Promise<Appointment> {
  return await apiFetch<Appointment>(`/api/appointments/${id}`, {
    method: "DELETE",
  });
}

export async function rescheduleAppointment(
  id: number,
  input: { dateTime: string; reason?: string }
): Promise<Appointment> {
  return await apiFetch<Appointment>(`/api/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

