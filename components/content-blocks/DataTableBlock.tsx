import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { MarkdownRenderer } from "./MarkdownRenderer"; // <-- Import our new renderer

interface DataTableBlockProps {
  headers: string[];
  rows: string[][];
}

export const DataTableBlock = ({ headers, rows }: DataTableBlockProps) => (
  <Card className="my-4 overflow-hidden border">
    {/* This div is crucial. It allows the table to scroll horizontally on small screens. */}
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} className="font-semibold">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="min-w-[150px]">
                  {/* Use the new renderer. It will automatically handle text and math. */}
                  <MarkdownRenderer content={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </Card>
);
