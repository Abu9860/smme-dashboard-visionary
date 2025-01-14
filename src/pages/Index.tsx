import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { IndianRupee, ShoppingCart, Users, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value="₹50,000"
              icon={IndianRupee}
              trend={{ value: 12, isPositive: true }}
            />
            <MetricCard
              title="Orders"
              value="125"
              icon={ShoppingCart}
              trend={{ value: 8, isPositive: true }}
            />
            <MetricCard
              title="Customers"
              value="1,240"
              icon={Users}
              trend={{ value: 2.1, isPositive: false }}
            />
            <MetricCard
              title="Growth"
              value="23%"
              icon={TrendingUp}
              trend={{ value: 4.5, isPositive: true }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;