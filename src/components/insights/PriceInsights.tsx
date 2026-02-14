import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, AlertCircle, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PriceGuidance {
  suggestedPriceMin: number;
  suggestedPriceMax: number;
  demandLevel: "High" | "Medium" | "Low";
  reasoning: string;
  pricePosition: "below" | "within" | "above";
}

export interface ListingOption {
  id: string;
  name: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
}

interface PriceInsightsProps {
  listings: ListingOption[];
  location?: string;
}

export const PriceInsights = ({ 
  listings,
  location = "Kenya" 
}: PriceInsightsProps) => {
  const [selectedId, setSelectedId] = useState<string>(listings[0]?.id || "");
  const selected = listings.find((l) => l.id === selectedId) || listings[0];
  // const [guidance, setGuidance] = useState<PriceGuidance | null>(null); // Supabase removed
  // const [loading, setLoading] = useState(false); // Supabase removed
  // const [error, setError] = useState<string | null>(null); // Supabase removed

  // Mock states as Supabase/Edge Functions are removed
  const [guidance, setGuidance] = useState<PriceGuidance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchGuidance = async () => { // Supabase removed
    console.warn("AI Price Guidance fetching is disabled as Supabase Edge Functions are removed.");
    setLoading(true);
    setError(null);
    toast({
      title: "AI Guidance Unavailable",
      description: "This feature is currently disabled.",
      variant: "destructive",
    });
    // Original logic commented out below:
    /*
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
          body: JSON.stringify({ 
            produceType: selected.name, 
            currentPrice: selected.price_per_unit, 
            unit: selected.unit,
            quantity: selected.quantity_available,
            location 
          }),
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
        throw new Error(errorData.error || "Failed to fetch guidance");
      }

      const data = await response.json();
      setGuidance(data.guidance);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch guidance";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    */
    setLoading(false);
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPricePositionInfo = (position: string) => {
    switch (position) {
      case "below":
        return {
          icon: TrendingUp,
          text: "Your price is below the suggested range",
          color: "text-yellow-600",
          suggestion: "You could potentially increase your price",
        };
      case "above":
        return {
          icon: TrendingDown,
          text: "Your price is above the suggested range",
          color: "text-orange-600",
          suggestion: "Consider if this is competitive for your market",
        };
      default:
        return {
          icon: Minus,
          text: "Your price is within the suggested range",
          color: "text-green-600",
          suggestion: "Your pricing looks competitive",
        };
    }
  };

  const handleListingChange = (id: string) => {
    setSelectedId(id);
    setGuidance(null);
    setError(null);
  };

  if (!selected) return null;

  // Initial state - prompt to get insights
  if (!guidance && !loading) {
    return (
      <Card className="border-dashed border-primary/30 bg-primary/5">
        <CardContent className="pt-6 space-y-4">
          {listings.length > 1 && (
            <Select value={selectedId} onValueChange={handleListingChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a listing" />
              </SelectTrigger>
              <SelectContent>
                {listings.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="text-center">
            <Sparkles className="h-10 w-10 mx-auto text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">AI Price Guidance</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {/* Get suggested price range and demand level for <strong>{selected.name}</strong> // Supabase removed */}
              AI Price Guidance is currently unavailable.
            </p>
            <Button onClick={fetchGuidance} className="gap-2" disabled> {/* Button disabled */}
              <Sparkles className="h-4 w-4" />
              Get Price Guidance (Unavailable)
            </Button>
            {error && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 animate-pulse text-primary" />
            Analyzing Market...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Modified to show placeholder if no guidance
  if (!guidance) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Price Guidance
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchGuidance} className="h-8 text-xs" disabled>
            Refresh (Unavailable)
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">AI price guidance is currently unavailable.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const positionInfo = getPricePositionInfo(guidance.pricePosition);
  const PositionIcon = positionInfo.icon;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Price Guidance
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchGuidance} className="h-8 text-xs" disabled>
            Refresh (Unavailable)
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Suggested Price Range */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Suggested Price Range</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              KES {guidance.suggestedPriceMin.toFixed(0)} - {guidance.suggestedPriceMax.toFixed(0)}
            </span>
            <span className="text-muted-foreground">/{selected.unit}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <PositionIcon className={`h-4 w-4 ${positionInfo.color}`} />
            <span className={`text-sm ${positionInfo.color}`}>{positionInfo.text}</span>
          </div>
        </div>

        {/* Demand Level */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Demand</span>
          <Badge className={`${getDemandColor(guidance.demandLevel)} border`}>
            {guidance.demandLevel} Demand
          </Badge>
        </div>

        {/* AI Reasoning */}
        <div className="bg-accent/10 rounded-lg p-3 flex gap-3">
          <Info className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {guidance.reasoning}
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
          This is AI-generated guidance. You retain full control over your pricing decisions.
        </p>
      </CardContent>
    </Card>
  );
};
