import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Checkbox } from "@/components/ui/checkbox";

interface OrderTableProps {
  orders: Array<{
    id: number;
    customerName: string;
    orderDate: string;
    amount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus: "paid" | "unpaid" | "pending";
  }>;
  selectedOrders: number[];
  onSelectOrder: (orderId: number) => void;
  onSelectAll: (checked: boolean) => void;
  onViewOrder: (order: any) => void;
  onEditOrder: (order: any) => void;
}

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
            <TableCell>{order.customerName}</TableCell>
            <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
            <TableCell>₹{order.amount}</TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell>
              <OrderStatusBadge status={order.paymentStatus} />
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