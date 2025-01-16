import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryMetrics } from "@/components/inventory/InventoryMetrics";
import { InventorySearch } from "@/components/inventory/InventorySearch";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryForm } from "@/components/inventory/InventoryForm";
import { StockHistory } from "@/components/inventory/StockHistory";
import { InventoryItem, StockHistory as StockHistoryType } from "@/types/inventory";

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Product A",
      category: "Electronics",
      quantity: 50,
      price: 1000,
      status: "in-stock",
      minQuantity: 10,
      sku: "PROD-A-001",
    },
    {
      id: 2,
      name: "Product B",
      category: "Accessories",
      quantity: 5,
      price: 500,
      status: "low-stock",
      minQuantity: 10,
      sku: "PROD-B-001",
    },
  ]);

  const [stockHistory] = useState<StockHistoryType[]>([
    {
      id: 1,
      itemId: 1,
      date: new Date().toISOString(),
      type: "in",
      quantity: 50,
      notes: "Initial stock",
    },
    {
      id: 2,
      itemId: 2,
      date: new Date().toISOString(),
      type: "in",
      quantity: 5,
      notes: "Initial stock",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddItem = (item: Omit<InventoryItem, "id" | "status">) => {
    const status: InventoryItem["status"] = 
      item.quantity === 0 ? "out-of-stock" :
      item.quantity <= (item.minQuantity || 5) ? "low-stock" : 
      "in-stock";

    const newItem: InventoryItem = {
      ...item,
      id: items.length + 1,
      status,
    };
    
    setItems([...items, newItem]);
    setIsAddDialogOpen(false);
    toast.success("Item added successfully");
  };

  const handleEditItem = (updatedItem: InventoryItem) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    setIsEditDialogOpen(false);
    toast.success("Item updated successfully");
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("Item deleted successfully");
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = items.filter((item) => item.status === "low-stock").length;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <InventoryHeader />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <InventoryForm onSubmit={handleAddItem} />
        </DialogContent>
      </Dialog>

      <InventoryMetrics totalItems={items.length} lowStockItems={lowStockItems} />

      <div className="space-y-4">
        <InventorySearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <Card>
          <CardContent className="p-0">
            <InventoryTable
              items={filteredItems}
              onEdit={(item) => {
                setSelectedItem(item);
                setIsEditDialogOpen(true);
              }}
              onDelete={handleDeleteItem}
            />
          </CardContent>
        </Card>

        <StockHistory history={stockHistory} />
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <InventoryForm
              item={selectedItem}
              onSubmit={(item) => handleEditItem({ ...item, id: selectedItem.id })}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;