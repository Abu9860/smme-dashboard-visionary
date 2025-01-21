import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderHistoryProps {
  order: {
    id: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    history: Array<{
      date: string;
      status: string;
      description: string;
    }>;
  };
}

export const OrderHistory = ({ order }: OrderHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {order.history?.map((event, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="min-w-24 text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div>
                  <OrderStatusBadge status={event.status as any} />
                  <p className="mt-1 text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};