import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Plus, Pencil, Trash2, FileText, Printer } from "lucide-react";
import { toast } from "sonner";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "pending";
  items: OrderItem[];
  shippingAddress: string;
  shippingMethod: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      customerName: "John Doe",
      orderDate: "2024-02-20",
      amount: 2500,
      status: "pending",
      paymentStatus: "pending",
      items: [
        { productName: "Product A", quantity: 2, price: 1000 },
        { productName: "Product B", quantity: 1, price: 500 }
      ],
      shippingAddress: "123 Main St, City, Country",
      shippingMethod: "Standard Shipping"
    },
  ]);

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: "all",
    paymentStatus: "all"
  });

  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    const colors = {
      paid: "bg-green-100 text-green-800",
      unpaid: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status];
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder({ ...order });
    setIsEditDialogOpen(true);
  };

  const handleUpdateOrder = () => {
    if (!editingOrder) return;
    
    setOrders(orders.map(order => 
      order.id === editingOrder.id ? editingOrder : order
    ));
    
    setIsEditDialogOpen(false);
    setEditingOrder(null);
    toast.success("Order updated successfully");
  };

  const handleBulkAction = (action: 'ship' | 'print') => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }

    if (action === 'ship') {
      setOrders(orders.map(order => 
        selectedOrders.includes(order.id) 
          ? { ...order, status: "shipped" as const } 
          : order
      ));
      toast.success(`${selectedOrders.length} orders marked as shipped`);
    } else if (action === 'print') {
      toast.success(`Printing ${selectedOrders.length} invoices`);
    }

    setSelectedOrders([]);
  };

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.id.toString().includes(filters.search);
    const matchesStatus = filters.status === "all" || order.status === filters.status;
    const matchesPayment = filters.paymentStatus === "all" || order.paymentStatus === filters.paymentStatus;
    
    let matchesDate = true;
    const orderDate = new Date(order.orderDate);
    const today = new Date();
    
    if (filters.dateRange === "today") {
      matchesDate = orderDate.toDateString() === today.toDateString();
    } else if (filters.dateRange === "week") {
      const weekAgo = new Date(today.setDate(today.getDate() - 7));
      matchesDate = orderDate >= weekAgo;
    } else if (filters.dateRange === "month") {
      const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
      matchesDate = orderDate >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <div className="flex gap-2">
          <Button onClick={() => handleBulkAction('ship')} variant="outline">
            Mark as Shipped
          </Button>
          <Button onClick={() => handleBulkAction('print')} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Invoices
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Order
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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

      <OrderFilters filters={filters} onFilterChange={handleFilterChange} />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedOrders.length === filteredOrders.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedOrders(filteredOrders.map(order => order.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={() => toggleOrderSelection(order.id)}
                    />
                  </TableCell>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>₹{order.amount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditOrder(order)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Order #{editingOrder?.id}</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer Name</label>
                  <Input
                    value={editingOrder.customerName}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customerName: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shipping Address</label>
                  <Input
                    value={editingOrder.shippingAddress}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      shippingAddress: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Items</label>
                {editingOrder.items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item.productName}
                      onChange={(e) => {
                        const newItems = [...editingOrder.items];
                        newItems[index] = { ...item, productName: e.target.value };
                        setEditingOrder({ ...editingOrder, items: newItems });
                      }}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...editingOrder.items];
                        newItems[index] = { ...item, quantity: Number(e.target.value) };
                        setEditingOrder({ ...editingOrder, items: newItems });
                      }}
                      className="w-24"
                    />
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...editingOrder.items];
                        newItems[index] = { ...item, price: Number(e.target.value) };
                        setEditingOrder({ ...editingOrder, items: newItems });
                      }}
                      className="w-32"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateOrder}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;