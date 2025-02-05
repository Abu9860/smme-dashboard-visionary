import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InventoryItem } from "@/types/inventory";

interface InventoryTableProps {
  items: InventoryItem[];
  selectedItems?: number[];
  onSelectItem?: (itemId: number) => void;
  onSelectAll?: (checked: boolean) => void;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: number) => void;
}

export const InventoryTable = ({
  items,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  onEdit,
  onDelete,
}: InventoryTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {onSelectItem && (
            <TableHead className="w-12">
              <Checkbox
                checked={items.length > 0 && selectedItems.length === items.length}
                onCheckedChange={(checked) => onSelectAll?.(!!checked)}
                aria-label="Select all items"
              />
            </TableHead>
          )}
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            {onSelectItem && (
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => onSelectItem(item.id)}
                  aria-label={`Select ${item.name}`}
                />
              </TableCell>
            )}
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>₹{item.price}</TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusColor(item.status)}>
                {item.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(item)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(item.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};