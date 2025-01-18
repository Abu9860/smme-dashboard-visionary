import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, CalendarIcon } from "lucide-react";
import { ReportMetrics } from "@/components/reports/ReportMetrics";
import { SalesChart } from "@/components/reports/SalesChart";
import { InventoryReport } from "@/components/reports/InventoryReport";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Sample data - replace with real data from your backend
const generateSalesData = (startDate: Date, endDate: Date) => {
  // This is a mock function - replace with real data fetching
  return [
    { date: "Jan", sales: 4000, revenue: 240000 },
    { date: "Feb", sales: 3000, revenue: 139800 },
    { date: "Mar", sales: 2000, revenue: 980000 },
    { date: "Apr", sales: 2780, revenue: 390800 },
    { date: "May", sales: 1890, revenue: 480000 },
    { date: "Jun", sales: 2390, revenue: 380000 },
  ].filter(item => {
    // In a real app, this filtering would happen on the backend
    return true; // Placeholder for actual date filtering
  });
};

const inventoryData = [
  { name: "Raw Materials", value: 400 },
  { name: "Work in Progress", value: 300 },
  { name: "Finished Goods", value: 300 },
  { name: "Packaging", value: 200 },
];

const Reports = () => {
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const salesData = generateSalesData(
    date.from || new Date(),
    date.to || new Date()
  );

  const handleExport = () => {
    console.log("Exporting report...");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={{ from: date?.from, to: date?.to }}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
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