import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PriceInsight {
  forecast: {
    month: string;
    price: number;
    trend: "up" | "down" | "stable";
  }[];
  factors: string[];
  recommendation: "sell" | "hold" | "wait";
  reasoning: string;
  confidence: "high" | "medium" | "low";
}

interface PriceInsightsProps {
  crop: string;
  currentPrice: number;
  unit: string;
}

export const PriceInsights = ({ crop, currentPrice, unit }: PriceInsightsProps) => {
  const [insights, setInsights] = useState<PriceInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/price-insights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ crop, currentPrice, unit }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a few minutes.");
        }
        if (response.status === 402) {
          throw new Error("AI credits exhausted. Please contact support.");
        }
        throw new Error(errorData.error || "Failed to fetch insights");
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch insights";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "sell":
        return "bg-green-100 text-green-800 border-green-200";
      case "wait":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  if (!insights && !loading) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">AI Price Insights</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get AI-powered market predictions for {crop}
          </p>
          <Button onClick={fetchInsights} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Insights
          </Button>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 animate-pulse" />
            Analyzing Market...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) return null;

  // Prepare chart data with current price as first point
  const chartData = [
    { month: "Current", price: currentPrice },
    ...insights.forecast,
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Price Insights for {crop}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={getConfidenceColor(insights.confidence)}>
              {insights.confidence} confidence
            </Badge>
            <Button variant="ghost" size="sm" onClick={fetchInsights}>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Forecast Chart */}
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis
                className="text-xs"
                tickFormatter={(v) => `$${v}`}
                domain={["auto", "auto"]}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}/${unit}`, "Price"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendation */}
        <div
          className={`p-4 rounded-lg border-2 ${getRecommendationColor(
            insights.recommendation
          )}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-lg capitalize">
              Recommendation: {insights.recommendation}
            </span>
            {getTrendIcon(
              insights.forecast[insights.forecast.length - 1]?.trend || "stable"
            )}
          </div>
          <p className="text-sm">{insights.reasoning}</p>
        </div>

        {/* Market Factors */}
        <div>
          <h4 className="font-medium mb-2">Key Market Factors</h4>
          <div className="flex flex-wrap gap-2">
            {insights.factors.map((factor, idx) => (
              <Badge key={idx} variant="secondary">
                {factor}
              </Badge>
            ))}
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div>
          <h4 className="font-medium mb-2">6-Month Forecast</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {insights.forecast.map((item, idx) => (
              <div
                key={idx}
                className="text-center p-2 rounded-lg bg-muted/50"
              >
                <div className="text-xs text-muted-foreground">{item.month}</div>
                <div className="font-semibold">${item.price.toFixed(2)}</div>
                <div className="flex justify-center">{getTrendIcon(item.trend)}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
