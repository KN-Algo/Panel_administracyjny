import type { ReactNode } from "react";
import { TableCell, TableRow } from "@/components/ui/table";

interface TableEmptyRowProps {
  colSpan: number;
  children: ReactNode;
}

export function TableEmptyRow({ colSpan, children }: TableEmptyRowProps) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="p-4 whitespace-normal">
        {children}
      </TableCell>
    </TableRow>
  );
}
