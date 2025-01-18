import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Send } from "lucide-react";
import { InvoiceTemplate } from "./InvoiceTemplate";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Invoice #{invoice.id}</h2>
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
      </div>

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

      <InvoiceTemplate template="standard" invoice={invoice} />
    </div>
  );
};