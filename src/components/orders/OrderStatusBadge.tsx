import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "paid" | "unpaid" | "pending";

interface OrderStatusBadgeProps {
  status: OrderStatus | PaymentStatus;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusStyles = {
    // Order statuses
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    // Payment statuses
    paid: "bg-green-100 text-green-800",
    unpaid: "bg-red-100 text-red-800",
  };

  return (
    <Badge className={statusStyles[status]} variant="outline">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};