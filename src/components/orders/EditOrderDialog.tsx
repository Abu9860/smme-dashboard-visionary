import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database } from "@/integrations/supabase/types";
import { useState } from "react";

type Order = Database['public']['Tables']['orders']['Row'];

interface EditOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (order: Order) => void;
}

export const EditOrderDialog = ({ isOpen, onClose, order, onSave }: EditOrderDialogProps) => {
  const [editedOrder, setEditedOrder] = useState<Order | null>(order);

  if (!editedOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Order #{editedOrder.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name</label>
              <Input
                value={editedOrder.customer_name}
                onChange={(e) => setEditedOrder({
                  ...editedOrder,
                  customer_name: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Shipping Address</label>
              <Input
                value={editedOrder.shipping_address || ''}
                onChange={(e) => setEditedOrder({
                  ...editedOrder,
                  shipping_address: e.target.value
                })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => {
              onSave(editedOrder);
              onClose();
            }}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};