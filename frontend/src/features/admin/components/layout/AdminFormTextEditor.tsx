import { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface AdminFormTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function AdminFormTextEditor({ value, onChange }: AdminFormTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const internalValueRef = useRef(value);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
      internalValueRef.current = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== internalValueRef.current) {
      editorRef.current.innerHTML = value;
      internalValueRef.current = value;
    }
  }, [value]);

  const applyFormat = (command: string, val?: string) => {
    document.execCommand('styleWithCSS', false, 'false');
    document.execCommand(command, false, val);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      internalValueRef.current = html;
      onChange(html);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      internalValueRef.current = html;
      onChange(html);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br>');
    }
  };

  const toolbarBtn = (label: string, icon: React.ReactNode, command: string, val?: string) => (
    <button
      type="button"
      title={label}
      onMouseDown={(e) => {
        e.preventDefault();
        applyFormat(command, val);
      }}
      className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&_svg]:size-3.5"
    >
      {icon}
    </button>
  );

  return (
    <div className="rounded-md border border-input bg-background">
      <div className="flex items-center gap-0.5 border-b px-2 py-1.5">
        {toolbarBtn('Pogrubienie (Ctrl+B)', <Bold />, 'bold')}
        {toolbarBtn('Kursywa (Ctrl+I)', <Italic />, 'italic')}
        {toolbarBtn('Podkreślenie (Ctrl+U)', <Underline />, 'underline')}
        <div className="mx-1.5 h-4 w-px bg-border" />
        {toolbarBtn('Do lewej', <AlignLeft />, 'justifyLeft')}
        {toolbarBtn('Wyśrodkuj', <AlignCenter />, 'justifyCenter')}
        {toolbarBtn('Do prawej', <AlignRight />, 'justifyRight')}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="min-h-[180px] px-3 py-2 text-sm outline-none"
      />
    </div>
  );
}
