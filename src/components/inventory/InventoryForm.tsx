import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus } from "lucide-react";
import { InventoryItem } from "@/types/inventory";

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (item: Omit<InventoryItem, "id">) => void;
}

export const InventoryForm = ({ item, onSubmit }: InventoryFormProps) => {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    category: item?.category || "",
    quantity: item?.quantity || 0,
    price: item?.price || 0,
    status: item?.status || "in-stock",
    minQuantity: item?.minQuantity || 5,
    description: item?.description || "",
    sku: item?.sku || "",
    imageUrl: item?.imageUrl || "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(item?.imageUrl || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <div className="flex items-center gap-4">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
          ) : (
            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="max-w-[200px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Raw Materials">Raw Materials</SelectItem>
            <SelectItem value="Finished Goods">Finished Goods</SelectItem>
            <SelectItem value="Packaging">Packaging</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="minQuantity">Min Quantity</Label>
          <Input
            id="minQuantity"
            type="number"
            value={formData.minQuantity}
            onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full">
        {item ? "Update Item" : "Add Item"}
      </Button>
    </form>
  );
};