import { useId, type ReactNode } from "react";
import { Label } from "@/features/admin/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldControlProps {
  id: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

interface FormFieldProps {
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  // element obok etykiety (np. przełącznik "Nie wygasa")
  labelAside?: ReactNode;
  className?: string;
  // render-prop: pole dostaje id i atrybuty aria powiązane z etykietą i błędem
  children: (control: FieldControlProps) => ReactNode;
}

export function FormField({
  label,
  required,
  hint,
  error,
  labelAside,
  className,
  children,
}: FormFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && !error && hintId, error && errorId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex min-h-5 items-center justify-between gap-2">
        <Label htmlFor={id}>
          {label}
          {required && (
            <span className="text-destructive" aria-hidden>
              *
            </span>
          )}
        </Label>
        {labelAside}
      </div>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
      })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
