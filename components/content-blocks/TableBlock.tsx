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
    {/* Add overflow-hidden to respect Card's border-radius */}
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
                  // Header text is bold and uses a brighter color in dark mode for contrast.
                  className="whitespace-nowrap px-4 font-bold text-slate-700 dark:text-slate-200"
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
                    className="min-w-[180px] whitespace-nowrap px-4 align-top"
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
