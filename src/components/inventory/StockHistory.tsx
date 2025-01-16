import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { StockHistory } from "@/types/inventory";

interface StockHistoryProps {
  history: StockHistory[];
}

export const StockHistory = ({ history }: StockHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {record.type === "in" ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500" />
                    )}
                    {record.type === "in" ? "Stock In" : "Stock Out"}
                  </div>
                </TableCell>
                <TableCell>{record.quantity}</TableCell>
                <TableCell>{record.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};