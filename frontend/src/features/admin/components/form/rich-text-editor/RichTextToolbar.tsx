import { Fragment } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  type LucideIcon,
} from "lucide-react";

interface ToolbarAction {
  label: string;
  icon: LucideIcon;
  command: string;
}

// grupy oddzielone separatorem
const TOOLBAR_GROUPS: ToolbarAction[][] = [
  [
    { label: "Pogrubienie (Ctrl+B)", icon: Bold, command: "bold" },
    { label: "Kursywa (Ctrl+I)", icon: Italic, command: "italic" },
    { label: "Podkreślenie (Ctrl+U)", icon: Underline, command: "underline" },
  ],
  [
    { label: "Do lewej", icon: AlignLeft, command: "justifyLeft" },
    { label: "Wyśrodkuj", icon: AlignCenter, command: "justifyCenter" },
    { label: "Do prawej", icon: AlignRight, command: "justifyRight" },
  ],
];

interface RichTextToolbarProps {
  onCommand: (command: string) => void;
}

export function RichTextToolbar({ onCommand }: RichTextToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Formatowanie tekstu"
      className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5"
    >
      {TOOLBAR_GROUPS.map((group, groupIdx) => (
        <Fragment key={groupIdx}>
          {groupIdx > 0 && (
            <div className="mx-1.5 h-4 w-px bg-border" aria-hidden />
          )}
          {group.map(({ label, icon: Icon, command }) => (
            <button
              key={command}
              type="button"
              title={label}
              aria-label={label}
              // mouseDown + preventDefault, żeby nie zgubić zaznaczenia w edytorze
              onMouseDown={(e) => {
                e.preventDefault();
                onCommand(command);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCommand(command);
                }
              }}
              className="flex size-8 items-center justify-center rounded text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:size-7 [&_svg]:size-3.5"
            >
              <Icon />
            </button>
          ))}
        </Fragment>
      ))}
    </div>
  );
}
