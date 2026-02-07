import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMarketplace, MarketplaceListing } from "@/hooks/useMarketplace";
import OrderDialog from "@/components/marketplace/OrderDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Leaf,
  Search,
  MapPin,
  Package,
  Filter,
  Loader2,
  ShoppingCart,
  ArrowLeft,
  Calendar,
} from "lucide-react";

const EMOJI_MAP: Record<string, string> = {
  Vegetables: "🥬",
  Fruits: "🍎",
  Grains: "🌾",
  Pulses: "🫘",
  Dairy: "🥛",
  Spices: "🌶️",
  Herbs: "🌿",
  Other: "📦",
};

const Marketplace = () => {
  const { user, userRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  const { listings, loading, categories, refetch } = useMarketplace({
    category: selectedCategory,
    search: debouncedSearch,
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Simple debounce
    setTimeout(() => setDebouncedSearch(value), 300);
  };

  const handleOrderClick = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setOrderDialogOpen(true);
  };

  const allCategories = ["All", ...categories];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">
              Agri<span className="text-primary">Link</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user && userRole === "buyer" && (
              <Link to="/buyer/dashboard">
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            )}
            {!user && (
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-3">
            Fresh Farm Marketplace 🌽
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse fresh produce directly from local farmers. Quality guaranteed, fair prices.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for produce..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-11 h-12 text-base"
            />
          </div>
          <div className="flex gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] h-12">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat !== "All" && EMOJI_MAP[cat]} {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat !== "All" && <span className="mr-1">{EMOJI_MAP[cat]}</span>}
              {cat}
            </Badge>
          ))}
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No produce found</h3>
            <p className="text-muted-foreground mb-4">
              {debouncedSearch
                ? `No results for "${debouncedSearch}"`
                : "Check back soon for fresh listings from farmers"}
            </p>
            {debouncedSearch && (
              <Button variant="outline" onClick={() => { setSearchQuery(""); setDebouncedSearch(""); }}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {listings.length} {listings.length === 1 ? "item" : "items"} available
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ProduceCard key={listing.id} listing={listing} onOrder={handleOrderClick} />
              ))}
            </div>
          </>
        )}
      </main>

      <OrderDialog
        listing={selectedListing}
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
};

interface ProduceCardProps {
  listing: MarketplaceListing;
  onOrder: (listing: MarketplaceListing) => void;
}

const ProduceCard = ({ listing, onOrder }: ProduceCardProps) => {
  const categoryEmoji = EMOJI_MAP[listing.category] || "📦";

  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 bg-muted">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {categoryEmoji}
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
          {listing.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
          {listing.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {listing.description || `Fresh ${listing.name.toLowerCase()} from local farm`}
        </p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            {listing.farmer_name}
          </span>
          {listing.farmer_location && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {listing.farmer_location}
              </span>
            </>
          )}
        </div>

        {listing.harvest_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <Calendar className="w-3 h-3" />
            Harvested: {new Date(listing.harvest_date).toLocaleDateString()}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary">
              ₹{listing.price_per_unit}
            </span>
            <span className="text-sm text-muted-foreground">/{listing.unit}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {listing.quantity_available} {listing.unit} left
          </div>
        </div>

        <Button className="w-full mt-4" size="sm" onClick={() => onOrder(listing)}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Order Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default Marketplace;
