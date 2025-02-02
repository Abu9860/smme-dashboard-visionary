import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Database } from "@/integrations/supabase/types";

type Order = Database['public']['Tables']['orders']['Row'];
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "pending" | "paid" | "unpaid";

interface OrderTableProps {
  orders: Order[];
  selectedOrders: number[];
  onSelectOrder: (orderId: number) => void;
  onSelectAll: (checked: boolean) => void;
  onViewOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
}

const validateOrderStatus = (status: string | null): OrderStatus => {
  const validStatuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];
  return validStatuses.includes(status as OrderStatus) ? (status as OrderStatus) : "pending";
};

const validatePaymentStatus = (status: string | null): PaymentStatus => {
  const validStatuses: PaymentStatus[] = ["pending", "paid", "unpaid"];
  return validStatuses.includes(status as PaymentStatus) ? (status as PaymentStatus) : "pending";
};

export const OrderTable = ({
  orders,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onViewOrder,
  onEditOrder,
}: OrderTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={selectedOrders.length === orders.length}
              onCheckedChange={(checked) => onSelectAll(!!checked)}
            />
          </TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Checkbox
                checked={selectedOrders.includes(order.id)}
                onCheckedChange={() => onSelectOrder(order.id)}
              />
            </TableCell>
            <TableCell>#{order.id}</TableCell>
            <TableCell>{order.customer_name}</TableCell>
            <TableCell>{new Date(order.order_date || '').toLocaleDateString()}</TableCell>
            <TableCell>₹{order.amount}</TableCell>
            <TableCell>
              <OrderStatusBadge status={validateOrderStatus(order.status)} />
            </TableCell>
            <TableCell>
              <OrderStatusBadge status={validatePaymentStatus(order.payment_status)} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewOrder(order)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditOrder(order)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};