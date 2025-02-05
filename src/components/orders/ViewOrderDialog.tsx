import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";

type Order = Database['public']['Tables']['orders']['Row'];

interface ViewOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const ViewOrderDialog = ({ isOpen, onClose, order }: ViewOrderDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Order Details #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Customer Name:</strong> {order.customer_name}</p>
                <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
                <p><strong>Shipping Method:</strong> {order.shipping_method}</p>
                <p><strong>Amount:</strong> ₹{order.amount}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Payment Status:</strong> {order.payment_status}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};