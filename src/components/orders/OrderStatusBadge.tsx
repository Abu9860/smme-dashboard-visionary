import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <Badge className={statusStyles[status]} variant="outline">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};