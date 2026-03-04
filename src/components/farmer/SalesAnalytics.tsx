import { useMemo } from "react";
import { Order } from "@/hooks/useOrders";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, isWithinInterval, startOfDay } from "date-fns";

interface SalesAnalyticsProps {
  orders: Order[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export const SalesAnalytics = ({ orders }: SalesAnalyticsProps) => {
  // 1. Process data for Revenue Trend (Last 7 Days)
  const revenueTrend = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, "MMM dd"),
        fullDate: startOfDay(date),
        revenue: 0,
      };
    }).reverse();

    orders.forEach((order) => {
      const orderDate = startOfDay(new Date(order.created_at));
      const dayData = last7Days.find(
        (d) => d.fullDate.getTime() === orderDate.getTime()
      );
      if (dayData && order.status !== "cancelled") {
        dayData.revenue += Number(order.total_amount);
      }
    });

    return last7Days;
  }, [orders]);

  // 2. Process data for Sales by Category
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    
    orders.forEach((order) => {
      if (order.status === "cancelled") return;
      
      order.items?.forEach((item) => {
        const cat = item.listing_name || "Other";
        categories[cat] = (categories[cat] || 0) + Number(item.total_price);
      });
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.total_amount), 0);
  }, [orders]);

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed rounded-xl opacity-60">
        <p className="text-sm">No sales data yet to analyze.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Trend Chart */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Revenue Trend</CardTitle>
              <CardDescription>Daily sales performance (Last 7 days)</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Sales</p>
              <p className="text-xl font-bold text-primary">Ksh {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#888" }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#888" }}
                  tickFormatter={(value) => `Ksh${value}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  formatter={(value) => [`Ksh ${value}`, "Revenue"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Products/Categories */}
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Top Produce by Revenue</CardTitle>
          <CardDescription>Which items are earning you the most</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "#666" }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
