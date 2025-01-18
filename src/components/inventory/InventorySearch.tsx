import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface InventorySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    category: string;
    status: string;
    minPrice: number;
    maxPrice: number;
  };
  onFiltersChange: (filters: {
    category: string;
    status: string;
    minPrice: number;
    maxPrice: number;
  }) => void;
}

export const InventorySearch = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
}: InventorySearchProps) => {
  const handleClearFilters = () => {
    onFiltersChange({
      category: "",
      status: "",
      minPrice: 0,
      maxPrice: 0,
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm pl-9"
        />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {(filters.category || filters.status || filters.minPrice || filters.maxPrice) && (
              <span className="ml-2 rounded-full bg-primary w-2 h-2" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Filter Inventory</h4>
            <Separator />
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                  <SelectItem value="Finished Goods">Finished Goods</SelectItem>
                  <SelectItem value="Packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Price</Label>
                <Input
                  type="number"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      minPrice: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Max Price</Label>
                <Input
                  type="number"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      maxPrice: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClearFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};