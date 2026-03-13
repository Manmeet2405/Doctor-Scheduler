const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory data for now. Replace with a real database later.
const doctors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    location: "City Hospital, Mumbai",
  },
  {
    id: 2,
    name: "Dr. Rahul Verma",
    specialty: "Dermatologist",
    location: "Skin Care Clinic, Delhi",
  },
  {
    id: 3,
    name: "Dr. Ananya Iyer",
    specialty: "Pediatrician",
    location: "Children's Health Center, Bengaluru",
  },
];

const appointments = [];

// Get all doctors
app.get("/api/doctors", (req, res) => {
  res.json(doctors);
});

// Get all appointments (simple view)
app.get("/api/appointments", (req, res) => {
  res.json(appointments);
});

// Create a new appointment
app.post("/api/appointments", (req, res) => {
  const { doctorId, patientName, dateTime, reason } = req.body || {};

  if (!doctorId || !patientName || !dateTime) {
    return res.status(400).json({
      message: "doctorId, patientName and dateTime are required",
    });
  }

  const doctor = doctors.find((d) => d.id === Number(doctorId));
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  const newAppointment = {
    id: appointments.length + 1,
    doctorId: doctor.id,
    patientName,
    dateTime,
    reason: reason || "",
    createdAt: new Date().toISOString(),
  };

  appointments.push(newAppointment);

  res.status(201).json(newAppointment);
});

// Cancel an appointment
app.delete("/api/appointments/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) return res.status(404).json({ message: "Appointment not found" });

  const [removed] = appointments.splice(idx, 1);
  res.json(removed);
});

// Reschedule an appointment
app.put("/api/appointments/:id", (req, res) => {
  const id = Number(req.params.id);
  const appt = appointments.find((a) => a.id === id);
  if (!appt) return res.status(404).json({ message: "Appointment not found" });

  const { dateTime, reason } = req.body || {};
  if (!dateTime) {
    return res.status(400).json({ message: "dateTime is required" });
  }

  appt.dateTime = dateTime;
  if (typeof reason === "string") appt.reason = reason;
  appt.updatedAt = new Date().toISOString();

  res.json(appt);
});

app.get("/", (req, res) => {
  res.send("Doctor Scheduler Backend is running");
});

app.listen(PORT, () => {
  console.log(`Doctor Scheduler backend listening on port ${PORT}`);
});

