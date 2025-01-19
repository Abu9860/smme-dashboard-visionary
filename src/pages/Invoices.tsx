import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Receipt, Search, Plus, Eye } from "lucide-react";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { InvoiceDetails } from "@/components/invoices/InvoiceDetails";

interface Invoice {
  id: number;
  customer: string;
  date: string;
  dueDate: string;
  total: number;
  status: "paid" | "pending" | "overdue";
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      customer: "John ok Doe",
      date: "2024-02-20",
      dueDate: "2024-03-20",
      total: 2500,
      status: "pending",
      items: [
        { description: "Product A", quantity: 2, price: 1000 },
        { description: "Product B", quantity: 1, price: 500 },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const mockCustomers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];

  const handleAddInvoice = (invoiceData: any) => {
    const newInvoice = {
      id: invoices.length + 1,
      customer: mockCustomers.find((c) => c.id === Number(invoiceData.customerId))?.name || "",
      date: new Date().toISOString().split("T")[0],
      dueDate: invoiceData.dueDate,
      total: invoiceData.items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.price,
        0
      ),
      status: "pending" as const,
      items: invoiceData.items,
    };
    setInvoices([...invoices, newInvoice]);
    setIsAddDialogOpen(false);
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toString().includes(searchTerm)
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <InvoiceForm onSubmit={handleAddInvoice} customers={mockCustomers} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter((i) => i.status === "pending").length} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>#{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>₹{invoice.total}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && <InvoiceDetails invoice={selectedInvoice} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
