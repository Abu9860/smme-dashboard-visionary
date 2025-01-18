import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, Bell } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InventoryMetricsProps {
  totalItems: number;
  lowStockItems: number;
  criticalStockItems: number;
}

export const InventoryMetrics = ({
  totalItems,
  lowStockItems,
  criticalStockItems,
}: InventoryMetricsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground">
            {lowStockItems} items need attention
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-500">{lowStockItems}</div>
          <p className="text-xs text-muted-foreground">
            Items below minimum threshold
          </p>
        </CardContent>
      </Card>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className={criticalStockItems > 0 ? "border-red-500" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
                <Bell className={`h-4 w-4 ${criticalStockItems > 0 ? "text-red-500 animate-bounce" : "text-muted-foreground"}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${criticalStockItems > 0 ? "text-red-500" : ""}`}>
                  {criticalStockItems}
                </div>
                <p className="text-xs text-muted-foreground">
                  Items at critical levels
                </p>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Items with stock below 20% of minimum threshold</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};