import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { RichTextToolbar } from "./RichTextToolbar";
import { insertLineBreak } from "./insertLineBreak";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  id?: string;
  placeholder?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function RichTextEditor({
  value,
  onChange,
  id,
  placeholder,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  // ostatni HTML wysłany w górę - dzięki temu nie nadpisujemy DOM (i kursora) przy każdym wpisanym znaku
  const internalValueRef = useRef<string | null>(null);

  useEffect(() => {
    if (editorRef.current && value !== internalValueRef.current) {
      editorRef.current.innerHTML = value;
      internalValueRef.current = value;
    }
  }, [value]);

  const emitChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    internalValueRef.current = html;
    onChange(html);
  };

  const applyFormat = (command: string) => {
    document.execCommand("styleWithCSS", false, "false");
    document.execCommand(command, false);
    emitChange();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || !editorRef.current) return;
    e.preventDefault();
    insertLineBreak(editorRef.current);
    emitChange();
  };

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        ariaInvalid && "border-destructive focus-within:ring-destructive/20",
      )}
    >
      <RichTextToolbar onCommand={applyFormat} />
      <div
        ref={editorRef}
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        data-placeholder={placeholder}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onKeyDown={handleKeyDown}
        className="min-h-[180px] px-3 py-2 text-sm outline-none empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
