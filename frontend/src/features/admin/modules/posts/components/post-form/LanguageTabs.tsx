import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LANGS } from "../../model/constants";
import type { LangCode } from "../../model/types";

interface LanguageTabsProps {
  value: LangCode;
  onValueChange: (lang: LangCode) => void;
  isComplete: (lang: LangCode) => boolean;
  hasError: (lang: LangCode) => boolean;
  children: (lang: LangCode) => ReactNode;
}

export function LanguageTabs({
  value,
  onValueChange,
  isComplete,
  hasError,
  children,
}: LanguageTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onValueChange(v as LangCode)}
      className="gap-4"
    >
      <TabsList variant="line" className="w-full justify-start border-b">
        {LANGS.map((lang) => {
          const complete = isComplete(lang.code);
          const error = hasError(lang.code);
          const status = error
            ? "błędy do poprawy"
            : complete
              ? "uzupełniony"
              : "nieuzupełniony";
          return (
            <TabsTrigger
              key={lang.code}
              value={lang.code}
              className={cn("flex-none px-4", error && "text-destructive!")}
              aria-label={`${lang.name} (${status})`}
            >
              {lang.label}
              <span
                aria-hidden
                className={cn(
                  "inline-block size-1.5 rounded-full",
                  error
                    ? "bg-destructive"
                    : complete
                      ? "bg-green-500"
                      : "bg-amber-400",
                )}
              />
            </TabsTrigger>
          );
        })}
      </TabsList>
      {LANGS.map((lang) => (
        <TabsContent key={lang.code} value={lang.code} className="space-y-4">
          {children(lang.code)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
