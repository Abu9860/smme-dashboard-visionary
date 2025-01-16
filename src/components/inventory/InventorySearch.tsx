import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

interface InventorySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const InventorySearch = ({ searchTerm, onSearchChange }: InventorySearchProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>
      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
    </div>
  );
};