"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";

import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/site/logo";

const navLinks = [
  { href: "/doctors", label: "Doctors" },
  { href: "/book", label: "Book" },
  { href: "/dashboard/patient", label: "Patient" },
  { href: "/dashboard/doctor", label: "Doctor" },
];

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        active && "text-foreground"
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 -z-10 rounded-full bg-muted/60"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      {label}
    </Link>
  );
}

export function SiteNavbar() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-3 rounded-3xl border border-border/60 bg-background/70 backdrop-blur-2xl shadow-[0_20px_70px_-60px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo />

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((l) => (
                <NavLink key={l.href} href={l.href} label={l.label} />
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                aria-label="Toggle theme"
                className="rounded-full"
              >
                <motion.span
                  key={theme}
                  initial={{ rotate: -20, opacity: 0, scale: 0.9 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === "dark" ? <FiSun /> : <FiMoon />}
                </motion.span>
              </Button>
              <Button variant="outline">Login</Button>
              <Button>Register</Button>
            </div>

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <FiMenu />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader className="flex flex-row items-center justify-between">
                    <SheetTitle className="flex items-center gap-2">
                      <Logo />
                    </SheetTitle>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" aria-label="Close menu">
                        <FiX />
                      </Button>
                    </SheetClose>
                  </SheetHeader>

                  <div className="mt-3 grid gap-2 p-2">
                    {navLinks.map((l) => (
                      <SheetClose asChild key={l.href}>
                        <div>
                          <NavLink href={l.href} label={l.label} />
                        </div>
                      </SheetClose>
                    ))}
                  </div>

                  <Separator className="my-3" />

                  <div className="grid gap-2 p-2">
                    <Button
                      variant="outline"
                      onClick={toggle}
                      className="justify-between rounded-2xl"
                    >
                      Theme
                      <span className="text-muted-foreground">
                        {theme === "dark" ? <FiSun /> : <FiMoon />}
                      </span>
                    </Button>
                    <Button variant="outline" className="rounded-2xl">
                      Login
                    </Button>
                    <Button className="rounded-2xl">Register</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

