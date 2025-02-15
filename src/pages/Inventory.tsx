import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryForm } from "@/components/inventory/InventoryForm";
import { InventorySearch } from "@/components/inventory/InventorySearch";
import { InventoryItem } from "@/types/inventory";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    minPrice: 0,
    maxPrice: 0,
    tags: [] as string[],
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        toast.error("Please sign in to access inventory");
        navigate("/"); // Redirect to home or login page
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');

      if (error) {
        toast.error('Failed to fetch inventory items');
        throw error;
      }

      return data as InventoryItem[];
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (formData: Omit<InventoryItem, "id" | "user_id">) => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Please sign in to add items');
      }

      const itemData = {
        ...formData,
        user_id: session.user.id,
      };

      const { data, error } = await supabase
        .from('inventory_items')
        .insert([itemData])
        .select()
        .single();

      if (error) {
        console.error('Error adding item:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setIsAddDialogOpen(false);
      toast.success("Item added successfully");
    },
    onError: (error) => {
      console.error('Error adding item:', error);
      toast.error(error instanceof Error ? error.message : "Failed to add item");
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (item: InventoryItem) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(item)
        .eq('id', item.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      toast.success("Item updated successfully");
    },
    onError: () => {
      toast.error("Failed to update item");
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success("Item deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete item");
    },
  });

  const handleAddItem = (formData: Omit<InventoryItem, "id" | "user_id">) => {
    const status: InventoryItem["status"] = 
      formData.quantity === 0 ? "out-of-stock" :
      formData.quantity <= (formData.min_quantity || 5) ? "low-stock" : 
      "in-stock";

    addItemMutation.mutate({ ...formData, status });
  };

  const handleEditItem = (formData: Omit<InventoryItem, "id" | "user_id">) => {
    if (!selectedItem) return;

    const status: InventoryItem["status"] = 
      formData.quantity === 0 ? "out-of-stock" :
      formData.quantity <= (formData.min_quantity || 5) ? "low-stock" : 
      "in-stock";

    updateItemMutation.mutate({
      ...formData,
      id: selectedItem.id,
      status,
      user_id: selectedItem.user_id,
    });
  };

  const handleDeleteItem = (id: number) => {
    deleteItemMutation.mutate(id);
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map(item => item.id) : []);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = filters.category === "all" || item.category === filters.category;
    const matchesStatus = filters.status === "all" || item.status === filters.status;
    const matchesPrice = (!filters.minPrice || item.price >= filters.minPrice) &&
                        (!filters.maxPrice || item.price <= filters.maxPrice);
    const matchesTags = filters.tags.length === 0 || 
                       (item.tags && filters.tags.every(tag => item.tags?.includes(tag)));

    return matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesTags;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <Button onClick={() => setSelectedItems([])}>
              Clear Selection ({selectedItems.length})
            </Button>
          )}
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Item</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">
              {items.filter((item) => item.status === "low-stock").length} low stock,{" "}
              {items.filter((item) => item.status === "out-of-stock").length} out of stock
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <InventorySearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <Card>
          <CardContent className="p-0">
            <InventoryTable
              items={filteredItems}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
              onSelectAll={handleSelectAll}
              onEdit={(item) => {
                setSelectedItem(item);
                setIsEditDialogOpen(true);
              }}
              onDelete={handleDeleteItem}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <InventoryForm onSubmit={handleAddItem} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <InventoryForm
              item={selectedItem}
              onSubmit={handleEditItem}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
