
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus, ArrowRight } from "lucide-react";

const trends = [
  { name: "Tomatoes", change: -12, current: 85, unit: "kg", trend: "down" },
  { name: "White Maize", change: 5, current: 4200, unit: "90kg bag", trend: "up" },
  { name: "Onions", change: 0, current: 110, unit: "kg", trend: "stable" },
  { name: "Cabbage", change: -8, current: 40, unit: "head", trend: "down" },
];

export const MarketTrends = () => {
  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader className="pb-3 border-b border-border/10">
        <CardTitle className="text-lg flex items-center justify-between">
          Market Trends
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">This Week</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-0">
        <div className="space-y-1">
          {trends.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  item.trend === "down" ? "bg-green-100 text-green-600" : 
                  item.trend === "up" ? "bg-red-100 text-red-600" : 
                  "bg-gray-100 text-gray-600"
                }`}>
                  {item.trend === "down" ? <TrendingDown className="w-4 h-4" /> : 
                   item.trend === "up" ? <TrendingUp className="w-4 h-4" /> : 
                   <Minus className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">Ksh {item.current} per {item.unit}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${
                  item.trend === "down" ? "text-green-600" : 
                  item.trend === "up" ? "text-red-600" : 
                  "text-muted-foreground"
                }`}>
                  {item.change > 0 ? "+" : ""}{item.change}%
                </p>
                <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
