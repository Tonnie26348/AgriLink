
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  MapPin, 
  ShoppingCart, 
  MessageCircle, 
  Heart, 
  Star, 
  ShieldCheck as ShieldIcon,
  Scale
} from "lucide-react";
import { MarketplaceListing } from "@/hooks/useMarketplace";

const EMOJI_MAP: Record<string, string> = {
  Vegetables: "🥬",
  Fruits: "🍎",
  Grains: "🌾",
  Pulses: "🫘",
  Dairy: "🥛",
  Tubers: "🥔",
  Spices: "🌶️",
  Herbs: "🌿",
  Other: "📦",
};

interface ProduceCardProps {
  listing: MarketplaceListing;
  onOrder: (listing: MarketplaceListing) => void;
  onAddToCart: (listing: MarketplaceListing) => void;
  onMessage: (listing: MarketplaceListing) => void;
  onCardClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProduceCard = memo(({ 
  listing, 
  onOrder, 
  onAddToCart, 
  onMessage, 
  onCardClick, 
  isFavorite, 
  onToggleFavorite 
}: ProduceCardProps) => {
  const categoryEmoji = EMOJI_MAP[listing.category] || "📦";
  
  const displayRating = listing.rating || "New";
  const displayReviewCount = listing.review_count || 0;

  return (
    <Card 
      className="overflow-hidden border-border/40 bg-background/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-elevated transition-all duration-300 group rounded-2xl flex flex-col h-full cursor-pointer"
      onClick={onCardClick}
    >
      <div className="relative h-52 bg-muted overflow-hidden">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-muted to-muted/50">
            {categoryEmoji}
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-background/90 text-foreground backdrop-blur-md border-none shadow-sm font-bold px-3">
            {listing.category}
          </Badge>
          {listing.quantity_available < 10 && (
            <Badge variant="destructive" className="font-bold shadow-sm animate-pulse">
              Low Stock
            </Badge>
          )}
          {listing.is_bulk_available && (
            <Badge className="bg-primary text-primary-foreground border-none shadow-sm font-bold flex items-center gap-1">
              <Scale className="w-3 h-3" />
              Bulk Available
            </Badge>
          )}
        </div>
        
        {/* Action Buttons Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-xl bg-background/90 backdrop-blur-md shadow-soft hover:bg-primary hover:text-white transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onMessage(listing);
            }}
            title="Chat with Farmer"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className={`h-10 w-10 rounded-xl bg-background/90 backdrop-blur-md shadow-soft transition-all hover:scale-110 ${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            title="Add to Favorites"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-display font-bold text-white tracking-tight">
              Ksh {listing.price_per_unit}
            </span>
            <span className="text-xs text-white/80 font-medium">/{listing.unit}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {listing.name}
          </h3>
          <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded-lg text-[10px] font-bold">
            <Star className="w-3 h-3 fill-current" />
            {displayRating}
            {displayReviewCount > 0 && <span className="text-muted-foreground ml-0.5">({displayReviewCount})</span>}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed min-h-[40px]">
          {listing.description || `Premium quality ${listing.name.toLowerCase()} harvested fresh from the fields of ${listing.farmer_location}.`}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5 py-3 border-y border-border/40 mt-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center relative">
              <Leaf className="w-3 h-3 text-primary" />
              <ShieldIcon className="absolute -bottom-1 -right-1 w-2.5 h-2.5 text-blue-500 bg-background rounded-full" />
            </div>
            <span className="truncate">{listing.farmer_name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
              <MapPin className="w-3 h-3 text-secondary" />
            </div>
            <span className="truncate">{listing.farmer_location || "Kenya"}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl h-11 border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-bold group/btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(listing);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            Cart
          </Button>
          <Button 
            className="flex-1 rounded-xl h-11 shadow-soft font-bold transition-all hover:scale-105 active:scale-95" 
            onClick={(e) => {
              e.stopPropagation();
              onOrder(listing);
            }}
          >
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
