import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Plus, Printer, Truck, Minus } from "lucide-react";
import { toast } from "sonner";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderTable } from "@/components/orders/OrderTable";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

const Orders = () => {
  const queryClient = useQueryClient();
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { name: "", quantity: 1, price: 0 }
  ]);
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

  // Fetch unique customer names
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('customer_name')
        .order('customer_name');

      if (error) {
        toast.error('Failed to fetch customers');
        throw error;
      }

      // Get unique customer names
      const uniqueCustomers = [...new Set(data.map(order => order.customer_name))];
      return uniqueCustomers;
    },
  });

  // Add order mutation
  const addOrderMutation = useMutation({
    mutationFn: async (orderData: typeof newOrder) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Calculate total amount from items
      const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.customer_name,
          amount: totalAmount,
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
      setOrderItems([{ name: "", quantity: 1, price: 0 }]);
      setIsNewCustomer(false);
    },
  });

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customer_name) {
      toast.error("Please select or enter a customer name");
      return;
    }
    if (orderItems.some(item => !item.name || item.quantity < 1 || item.price <= 0)) {
      toast.error("Please fill in all item details correctly");
      return;
    }
    addOrderMutation.mutate(newOrder);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { name: "", quantity: 1, price: 0 }]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setOrderItems(newItems);
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddOrder} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer</label>
              {!isNewCustomer ? (
                <div className="space-y-2">
                  <Select
                    value={newOrder.customer_name}
                    onValueChange={(value) => setNewOrder({ ...newOrder, customer_name: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer} value={customer}>
                          {customer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewCustomer(true)}
                  >
                    Add New Customer
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={newOrder.customer_name}
                    onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
                    placeholder="Enter customer name"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewCustomer(false)}
                  >
                    Select Existing Customer
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Order Items</label>
                <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              {orderItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => updateOrderItem(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOrderItem(index)}
                      disabled={orderItems.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
