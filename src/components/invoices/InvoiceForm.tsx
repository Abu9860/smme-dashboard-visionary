import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface InvoiceFormProps {
  onSubmit: (invoice: any) => void;
  customers: { id: number; name: string }[];
}

export const InvoiceForm = ({ onSubmit, customers }: InvoiceFormProps) => {
  const [formData, setFormData] = useState({
    customerId: "",
    items: [{ description: "", quantity: 1, price: 0 }],
    dueDate: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    toast.success("Invoice created successfully");
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, price: 0 }],
    });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Customer</label>
        <Select
          value={formData.customerId}
          onValueChange={(value) => setFormData({ ...formData, customerId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={String(customer.id)}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Due Date</label>
        <Input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Items</label>
        {formData.items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(index, "description", e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", e.target.value)}
              className="w-24"
            />
            <Input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => updateItem(index, "price", e.target.value)}
              className="w-32"
            />
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addItem}>
          Add Item
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Input
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <Button type="submit">Create Invoice</Button>
    </form>
  );
};