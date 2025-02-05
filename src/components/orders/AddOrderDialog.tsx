import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  inventory_id?: number;
}

interface AddOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddOrderDialog = ({ isOpen, onClose }: AddOrderDialogProps) => {
  const queryClient = useQueryClient();
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

  // Fetch customers
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

      return [...new Set(data.map(order => order.customer_name))];
    },
  });

  // Fetch inventory items
  const { data: inventoryItems = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');

      if (error) {
        toast.error('Failed to fetch inventory items');
        throw error;
      }

      return data;
    },
  });

  // Add order mutation
  const addOrderMutation = useMutation({
    mutationFn: async (orderData: typeof newOrder) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

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
      onClose();
      toast.success('Order created successfully');
      resetForm();
    },
  });

  const resetForm = () => {
    setNewOrder({
      customer_name: "",
      amount: 0,
      shipping_address: "",
      shipping_method: "Standard Shipping",
    });
    setOrderItems([{ name: "", quantity: 1, price: 0 }]);
    setIsNewCustomer(false);
  };

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

    // If selecting an inventory item, update price
    if (field === 'inventory_id') {
      const inventoryItem = inventoryItems.find(item => item.id === value);
      if (inventoryItem) {
        newItems[index].name = inventoryItem.name;
        newItems[index].price = Number(inventoryItem.price);
      }
    }

    setOrderItems(newItems);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                  <Select
                    value={item.inventory_id?.toString()}
                    onValueChange={(value) => updateOrderItem(index, 'inventory_id', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((invItem) => (
                        <SelectItem key={invItem.id} value={invItem.id.toString()}>
                          {invItem.name} (₹{invItem.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    readOnly
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};