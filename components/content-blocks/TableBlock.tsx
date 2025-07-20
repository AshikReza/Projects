import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownRenderer } from "./MarkdownRenderer";

export const TableBlock = ({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) => (
  <Card className="my-4 overflow-hidden">
    <CardHeader>
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-border/60 bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800/80 dark:hover:bg-slate-800 transition-colors">
              {headers.map((header, index) => (
                <TableHead
                  key={index}
                  // REMOVED: whitespace-nowrap
                  className="px-4 font-extrabold text-slate-700 dark:text-slate-200"
                >
                  <MarkdownRenderer content={header} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="dark:border-slate-800">
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    // REMOVED: min-w-[180px] and whitespace-nowrap
                    // ADDED: whitespace-normal to ensure text wraps
                    className="whitespace-normal px-4 align-top"
                  >
                    <MarkdownRenderer content={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);
