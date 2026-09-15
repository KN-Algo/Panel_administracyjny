import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  // karta klikalna - prowadzi do sekcji, której dotyczy statystyka
  to?: string;
}

export function StatCard({ label, value, icon: Icon, to }: StatCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
    </>
  );

  const className = "block rounded-lg border bg-card p-4";

  return to ? (
    <Link
      to={to}
      className={`${className} outline-none transition-colors hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50`}
    >
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
