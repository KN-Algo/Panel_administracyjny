import { CheckCircle2, AlertCircle } from "lucide-react";
import { LANGS } from "../../model/constants";
import type { LangCode } from "../../model/types";

interface TranslationStatusProps {
  missingLangs: LangCode[];
}

export function TranslationStatus({ missingLangs }: TranslationStatusProps) {
  if (missingLangs.length === 0) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
        <CheckCircle2 className="size-3.5" />
        Wszystkie języki uzupełnione
      </span>
    );
  }

  const names = LANGS.filter((l) => missingLangs.includes(l.code)).map(
    (l) => l.name,
  );

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <AlertCircle className="size-3.5 text-amber-500" />
      Brakuje tłumaczeń: {names.join(", ")}
    </span>
  );
}
