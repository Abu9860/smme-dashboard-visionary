import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Truck, Package, XCircle } from "lucide-react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type PaymentStatus = "paid" | "unpaid" | "pending";

interface OrderStatusBadgeProps {
  status: OrderStatus | PaymentStatus;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig = {
    // Order statuses
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    processing: { color: "bg-blue-100 text-blue-800", icon: Package },
    shipped: { color: "bg-purple-100 text-purple-800", icon: Truck },
    delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    // Payment statuses
    paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    unpaid: { color: "bg-red-100 text-red-800", icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} gap-1`} variant="outline">
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};