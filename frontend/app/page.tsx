import { getDoctors } from "@/lib/api";
import { Landing } from "@/components/marketing/landing";

export default async function Home() {
  const doctors = await getDoctors();
  return <Landing previewDoctors={doctors.slice(0, 3)} />;
}
