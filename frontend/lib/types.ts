export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating?: number;
  avatarUrl?: string;
};

export type Appointment = {
  id: number;
  doctorId: number;
  patientName: string;
  dateTime: string;
  reason: string;
  createdAt: string;
  updatedAt?: string;
  status?: "upcoming" | "cancelled" | "completed";
};

