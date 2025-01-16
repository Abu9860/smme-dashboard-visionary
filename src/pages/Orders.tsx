import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Search, Plus, Pencil, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  items: string[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      customerName: "John Doe",
      orderDate: "2024-02-20",
      amount: 2500,
      status: "pending",
      items: ["Product A", "Product B"],
    },
    {
      id: 2,
      customerName: "Jane Smith",
      orderDate: "2024-02-19",
      amount: 1800,
      status: "completed",
      items: ["Product C"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddOrder = (order: Omit<Order, "id">) => {
    const newOrder = {
      ...order,
      id: orders.length + 1,
    };
    setOrders([...orders, newOrder]);
    setIsAddDialogOpen(false);
    toast.success("Order added successfully");
  };

  const handleEditOrder = (updatedOrder: Order) => {
    setOrders(orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
    setIsEditDialogOpen(false);
    toast.success("Order updated successfully");
  };

  const handleDeleteOrder = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
    toast.success("Order deleted successfully");
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Order</DialogTitle>
            </DialogHeader>
            <OrderForm onSubmit={handleAddOrder} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              {orders.filter((order) => order.status === "pending").length} pending orders
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>₹{order.amount}</TableCell>
                    <TableCell>{order.items.join(", ")}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderForm
              order={selectedOrder}
              onSubmit={handleEditOrder}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface OrderFormProps {
  order?: Order;
  onSubmit: (order: any) => void;
}

const OrderForm = ({ order, onSubmit }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    customerName: order?.customerName || "",
    orderDate: order?.orderDate || new Date().toISOString().split("T")[0],
    amount: order?.amount || 0,
    items: order?.items?.join(", ") || "",
    status: order?.status || "pending",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: order?.id,
      items: formData.items.split(",").map((item) => item.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="customerName" className="text-sm font-medium">
          Customer Name
        </label>
        <Input
          id="customerName"
          value={formData.customerName}
          onChange={(e) =>
            setFormData({ ...formData, customerName: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="orderDate" className="text-sm font-medium">
          Order Date
        </label>
        <Input
          id="orderDate"
          type="date"
          value={formData.orderDate}
          onChange={(e) =>
            setFormData({ ...formData, orderDate: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount
        </label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: Number(e.target.value) })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="items" className="text-sm font-medium">
          Items (comma-separated)
        </label>
        <Input
          id="items"
          value={formData.items}
          onChange={(e) =>
            setFormData({ ...formData, items: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as Order["status"] })
          }
          required
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <Button type="submit" className="w-full">
        {order ? "Update Order" : "Add Order"}
      </Button>
    </form>
  );
};

export default Orders;