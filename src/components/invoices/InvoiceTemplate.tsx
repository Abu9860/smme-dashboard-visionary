import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InvoiceTemplateProps {
  template: "standard" | "professional" | "minimal";
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
    total: number;
  };
}

export const InvoiceTemplate = ({ template, invoice }: InvoiceTemplateProps) => {
  const getTemplateStyles = () => {
    switch (template) {
      case "professional":
        return "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200";
      case "minimal":
        return "bg-white border-gray-100";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <Card className={cn("p-8", getTemplateStyles())}>
      <CardContent className="space-y-6">
        <div className="flex justify-between">
          <div>
            <h2 className={cn(
              "text-2xl font-bold",
              template === "professional" ? "text-blue-800" : "text-gray-800"
            )}>
              INVOICE
            </h2>
            <p className="text-sm text-gray-500">#{invoice.id}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Date: {new Date(invoice.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border-t border-b py-4">
          <h3 className="font-medium mb-2">Bill To:</h3>
          <p>{invoice.customer}</p>
        </div>

        <table className="w-full">
          <thead>
            <tr className={cn(
              "text-left",
              template === "professional" ? "bg-blue-50" : "bg-gray-50"
            )}>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4 text-right">Qty</th>
              <th className="py-2 px-4 text-right">Price</th>
              <th className="py-2 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{item.description}</td>
                <td className="py-2 px-4 text-right">{item.quantity}</td>
                <td className="py-2 px-4 text-right">₹{item.price}</td>
                <td className="py-2 px-4 text-right">₹{item.quantity * item.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="py-4 px-4 text-right font-medium">Total:</td>
              <td className="py-4 px-4 text-right font-bold">₹{invoice.total}</td>
            </tr>
          </tfoot>
        </table>
      </CardContent>
    </Card>
  );
};