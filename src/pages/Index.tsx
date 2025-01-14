import { MetricCard } from "@/components/dashboard/MetricCard";
import { IndianRupee, ShoppingCart, Users, TrendingUp, Package, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Revenue"
          value="₹50,000"
          icon={IndianRupee}
          trend={{ value: 12, isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <MetricCard
          title="Orders"
          value="125"
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
          className="bg-gradient-to-br from-green-50 to-green-100"
        />
        <MetricCard
          title="Customers"
          value="1,240"
          icon={Users}
          trend={{ value: 2.1, isPositive: false }}
          className="bg-gradient-to-br from-purple-50 to-purple-100"
        />
        <MetricCard
          title="Growth"
          value="23%"
          icon={TrendingUp}
          trend={{ value: 4.5, isPositive: true }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100"
        />
        <MetricCard
          title="Products"
          value="456"
          icon={Package}
          trend={{ value: 3.2, isPositive: true }}
          className="bg-gradient-to-br from-pink-50 to-pink-100"
        />
        <MetricCard
          title="Invoices"
          value="89"
          icon={Receipt}
          trend={{ value: 1.8, isPositive: true }}
          className="bg-gradient-to-br from-orange-50 to-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-white shadow-sm">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">New order received</p>
                    <p className="text-sm text-gray-500">Order #1234 from John Doe</p>
                  </div>
                  <span className="text-sm text-gray-500">2 min ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShoppingCart, label: "New Order" },
                { icon: Users, label: "Add Customer" },
                { icon: Package, label: "Add Product" },
                { icon: Receipt, label: "Create Invoice" },
              ].map((action, i) => (
                <button
                  key={i}
                  className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center gap-2"
                >
                  <action.icon className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;