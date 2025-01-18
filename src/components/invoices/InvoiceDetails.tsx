import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Send } from "lucide-react";

interface InvoiceDetailsProps {
  invoice: {
    id: number;
    customer: string;
    date: string;
    dueDate: string;
    items: Array<{
      description: string;
      quantity: number;
      price: number;
    }>;
    status: "paid" | "pending" | "overdue";
    total: number;
  };
}

export const InvoiceDetails = ({ invoice }: InvoiceDetailsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoice #{invoice.id}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button size="sm">
            <Send className="mr-2 h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div>
            <h3 className="font-medium mb-2">Customer</h3>
            <p>{invoice.customer}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Dates</h3>
            <p>Issue Date: {new Date(invoice.date).toLocaleDateString()}</p>
            <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">₹{item.price}</TableCell>
                <TableCell className="text-right">
                  ₹{item.quantity * item.price}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">
                Total
              </TableCell>
              <TableCell className="text-right font-bold">₹{invoice.total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-6">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              invoice.status === "paid"
                ? "bg-green-100 text-green-800"
                : invoice.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};