import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ReportMetrics } from "@/components/reports/ReportMetrics";
import { SalesChart } from "@/components/reports/SalesChart";
import { InventoryReport } from "@/components/reports/InventoryReport";

// Sample data - replace with real data from your backend
const salesData = [
  { date: "Jan", sales: 4000, revenue: 240000 },
  { date: "Feb", sales: 3000, revenue: 139800 },
  { date: "Mar", sales: 2000, revenue: 980000 },
  { date: "Apr", sales: 2780, revenue: 390800 },
  { date: "May", sales: 1890, revenue: 480000 },
  { date: "Jun", sales: 2390, revenue: 380000 },
];

const inventoryData = [
  { name: "Raw Materials", value: 400 },
  { name: "Work in Progress", value: 300 },
  { name: "Finished Goods", value: 300 },
  { name: "Packaging", value: 200 },
];

const Reports = () => {
  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting report...");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <ReportMetrics
        totalSales={15060}
        totalRevenue={2610600}
        inventoryValue={1200000}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SalesChart data={salesData} />
        <InventoryReport data={inventoryData} />
      </div>
    </div>
  );
};

export default Reports;
