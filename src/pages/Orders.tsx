import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Printer, Truck } from "lucide-react";
import { toast } from "sonner";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderTable } from "@/components/orders/OrderTable";
import { AddOrderDialog } from "@/components/orders/AddOrderDialog";
import { ViewOrderDialog } from "@/components/orders/ViewOrderDialog";
import { EditOrderDialog } from "@/components/orders/EditOrderDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

type Order = Database['public']['Tables']['orders']['Row'];

const Orders = () => {
  const queryClient = useQueryClient();
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: "all",
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

      <AddOrderDialog
        isOpen={isAddOrderDialogOpen}
        onClose={() => setIsAddOrderDialogOpen(false)}
      />

      <ViewOrderDialog
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      <EditOrderDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onSave={async (updatedOrder) => {
          const { error } = await supabase
            .from('orders')
            .update({
              customer_name: updatedOrder.customer_name,
              shipping_address: updatedOrder.shipping_address,
            })
            .eq('id', updatedOrder.id);

          if (error) {
            toast.error('Failed to update order');
            return;
          }

          queryClient.invalidateQueries({ queryKey: ['orders'] });
          toast.success('Order updated successfully');
        }}
      />
    </div>
  );
};

export default Orders;