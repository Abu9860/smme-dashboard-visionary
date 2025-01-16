import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface InventoryHeaderProps {
  onAddItem: () => void;
}

export const InventoryHeader = ({ onAddItem }: InventoryHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
      <Button onClick={onAddItem}>
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
};