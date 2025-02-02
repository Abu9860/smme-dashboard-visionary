import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Printer, Truck } from "lucide-react";
import { toast } from "sonner";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderTable } from "@/components/orders/OrderTable";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

type Order = Database['public']['Tables']['orders']['Row'];

const Orders = () => {
  const queryClient = useQueryClient();
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer_name: "",
    amount: 0,
    shipping_address: "",
    shipping_method: "Standard Shipping",
  });

  // Fetch orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to fetch orders');
        throw error;
      }

      return data as Order[];
    },
  });

  // Add order mutation
  const addOrderMutation = useMutation({
    mutationFn: async (orderData: typeof newOrder) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.customer_name,
          amount: orderData.amount,
          shipping_address: orderData.shipping_address,
          shipping_method: orderData.shipping_method,
          status: 'pending',
          payment_status: 'pending',
          user_id: userData.user.id
        })
        .select()
        .single();

      if (error) {
        toast.error('Failed to create order');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsAddOrderDialogOpen(false);
      toast.success('Order created successfully');
      setNewOrder({
        customer_name: "",
        amount: 0,
        shipping_address: "",
        shipping_method: "Standard Shipping",
      });
    },
  });

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    addOrderMutation.mutate(newOrder);
  };

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: "all",
  });

  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedOrders(checked ? orders.map(order => order.id) : []);
  };

  const handleBulkAction = async (action: 'ship' | 'print') => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }

    if (action === 'ship') {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'shipped' })
        .in('id', selectedOrders);
      
      if (error) {
        toast.error('Failed to update orders');
        return;
      }
      
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(`${selectedOrders.length} orders marked as shipped`);
    } else if (action === 'print') {
      toast.success(`Printing ${selectedOrders.length} invoices`);
    }

    setSelectedOrders([]);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.id.toString().includes(filters.search);
    const matchesStatus = filters.status === "all" || order.status === filters.status;
    
    let matchesDate = true;
    const orderDate = new Date(order.order_date || '');
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

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <div className="flex gap-2">
          <Button onClick={() => handleBulkAction('ship')} variant="outline">
            <Truck className="mr-2 h-4 w-4" />
            Mark as Shipped
          </Button>
          <Button onClick={() => handleBulkAction('print')} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Invoices
          </Button>
          <Button onClick={() => setIsAddOrderDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Order
          </Button>
        </div>
      </div>

      <Dialog open={isAddOrderDialogOpen} onOpenChange={setIsAddOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddOrder} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name</label>
              <Input
                value={newOrder.customer_name}
                onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                value={newOrder.amount}
                onChange={(e) => setNewOrder({ ...newOrder, amount: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Shipping Address</label>
              <Input
                value={newOrder.shipping_address}
                onChange={(e) => setNewOrder({ ...newOrder, shipping_address: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOrderDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Order</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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

      <OrderFilters filters={filters} onFilterChange={handleFilterChange} />

      <Card>
        <CardContent className="p-0">
          <OrderTable
            orders={filteredOrders}
            selectedOrders={selectedOrders}
            onSelectOrder={handleSelectOrder}
            onSelectAll={handleSelectAll}
            onViewOrder={(order) => {
              setSelectedOrder(order);
              setIsViewDialogOpen(true);
            }}
            onEditOrder={(order) => {
              setSelectedOrder(order);
              setIsEditDialogOpen(true);
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Customer Name:</strong> {selectedOrder.customer_name}</p>
                    <p><strong>Shipping Address:</strong> {selectedOrder.shipping_address}</p>
                    <p><strong>Shipping Method:</strong> {selectedOrder.shipping_method}</p>
                    <p><strong>Amount:</strong> ₹{selectedOrder.amount}</p>
                    <p><strong>Status:</strong> {selectedOrder.status}</p>
                    <p><strong>Payment Status:</strong> {selectedOrder.payment_status}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Order #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer Name</label>
                  <Input
                    value={selectedOrder.customer_name}
                    onChange={(e) => setSelectedOrder({
                      ...selectedOrder,
                      customer_name: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shipping Address</label>
                  <Input
                    value={selectedOrder.shipping_address || ''}
                    onChange={(e) => setSelectedOrder({
                      ...selectedOrder,
                      shipping_address: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Handle save changes logic here
                  setIsEditDialogOpen(false);
                }}>
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
