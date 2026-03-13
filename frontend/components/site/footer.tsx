import Link from "next/link";
import { Logo } from "@/components/site/logo";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-sm text-sm text-muted-foreground">
              A premium scheduling experience for patients and doctors—fast,
              calm, and delightfully smooth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Product</p>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <Link href="/doctors" className="hover:text-foreground">
                  Directory
                </Link>
                <Link href="/book" className="hover:text-foreground">
                  Book
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Dashboards</p>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard/patient" className="hover:text-foreground">
                  Patient
                </Link>
                <Link href="/dashboard/doctor" className="hover:text-foreground">
                  Doctor
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Company</p>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <a className="hover:text-foreground" href="#">
                  Privacy
                </a>
                <a className="hover:text-foreground" href="#">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} DoctorScheduler</p>
          <p>Built with Next.js, Tailwind, Framer Motion, GSAP & Lenis.</p>
        </div>
      </div>
    </footer>
  );
}

