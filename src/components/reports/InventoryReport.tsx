import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface InventoryData {
  name: string;
  value: number;
}

interface InventoryReportProps {
  data: InventoryData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const chartConfig = {
  series1: {
    theme: {
      light: "#0088FE",
      dark: "#0088FE"
    }
  },
  series2: {
    theme: {
      light: "#00C49F",
      dark: "#00C49F"
    }
  }
};

export const InventoryReport = ({ data }: InventoryReportProps) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Inventory Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};