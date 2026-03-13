import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2 select-none",
        className
      )}
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-primary/90 via-fuchsia-500/70 to-emerald-400/70 shadow-[0_12px_40px_-24px_rgba(99,102,241,0.8)]">
        <span className="absolute inset-0 rounded-2xl blur-xl opacity-35 bg-gradient-to-br from-primary via-fuchsia-500 to-emerald-400" />
        <span className="relative text-sm font-semibold tracking-tight text-white">
          DS
        </span>
      </span>
      <span className="text-sm font-semibold tracking-tight">
        Doctor<span className="gradient-text">Scheduler</span>
      </span>
    </Link>
  );
}

