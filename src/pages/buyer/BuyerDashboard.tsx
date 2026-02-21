import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context-definition";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";
import { useMarketplace } from "@/hooks/useMarketplace";
import OrderCard from "@/components/orders/OrderCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Leaf, 
  Search, 
  ShoppingCart, 
  Package, 
  Heart, 
  Clock,
  MapPin,
  Star,
  LogOut,
  Loader2,
  ShoppingBag,
  TrendingUp,
  UserCircle,
} from "lucide-react";
 
const BuyerDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { orders, loading: ordersLoading } = useOrders();
  const { listings, loading: listingsLoading } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState("");

  const pendingOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  const stats = [
    { label: "Total Orders", value: orders.length.toString(), icon: Package, color: "text-primary" },
    { label: "In Progress", value: pendingOrders.length.toString(), icon: Clock, color: "text-secondary" },
    { label: "Delivered", value: deliveredOrders.length.toString(), icon: ShoppingCart, color: "text-accent" },
    { label: "Available Items", value: listings.length.toString(), icon: TrendingUp, color: "text-primary" },
  ];

  const handleLogout = async () => {
    console.log("Buyer logout initiated");
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      // Use window.location for a clean break from the dashboard state
      window.location.href = "/AgriLink/";
    } catch (error: unknown) {
      console.error("Logout error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during logout.";
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: errorMessage,
      });
    }
  };
 
   return (
     <div className="min-h-screen bg-muted/30 flex flex-col">
       {/* Dedicated Buyer Header */}
       <header className="bg-background border-b border-border/50 h-16 sticky top-0 z-40 shadow-sm">
         <div className="container mx-auto px-4 h-full flex items-center justify-between">
           <Link to="/" className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
               <ShoppingBag className="w-5 h-5 text-secondary-foreground" />
             </div>
             <span className="text-lg font-display font-bold text-foreground hidden sm:inline-block">
               Agri<span className="text-secondary">Link</span> Buyer
             </span>
           </Link>
 
           <div className="flex items-center gap-4">
             <Link to="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">
               Marketplace
             </Link>
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => window.location.href = "/AgriLink/profile"}
               className="text-muted-foreground hover:text-secondary"
             >
               <UserCircle className="w-4 h-4 mr-2" />
               Profile
             </Button>
             <div className="w-px h-6 bg-border mx-1" />
             <button 
               type="button"
               onClick={handleLogout} 
               className="flex items-center text-sm font-medium text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-md hover:bg-destructive/5"
             >
               <LogOut className="w-4 h-4 mr-2" />
               Log Out
             </button>
           </div>
         </div>
       </header>
 
       <main className="container mx-auto px-4 py-8 flex-1">
         {/* Welcome Section */}
         <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <h1 className="text-3xl font-display font-bold text-foreground mb-1">
               Welcome Back! 🥬
             </h1>
             <p className="text-muted-foreground">
               Fresh produce from your favorite local farms is waiting for you
             </p>
           </div>
           <Link to="/marketplace">
             <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-soft">
               <Search className="w-5 h-5 mr-2" />
               Browse Marketplace
             </Button>
           </Link>
         </div>
 
         {/* Stats Grid */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {stats.map((stat) => (
             <Card key={stat.label} className="border-border/50 shadow-soft">
               <CardContent className="pt-6">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                     <stat.icon className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                     <p className="text-xs text-muted-foreground">{stat.label}</p>
                   </div>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
 
         {/* Main Content Grid */}
         <div className="grid lg:grid-cols-3 gap-6">
            {/* Featured Produce */}
            <div className="lg:col-span-2">
              <Card className="shadow-soft border-border/50">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/10 pb-4">
                  <div>
                    <CardTitle className="text-xl">Featured Produce</CardTitle>
                    <CardDescription>Fresh picks from trusted farmers</CardDescription>
                  </div>
                  <Link to="/marketplace">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardHeader>
               <CardContent className="pt-6">
                 {listingsLoading ? (
                   <div className="flex items-center justify-center py-12">
                     <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                   </div>
                 ) : listings.length === 0 ? (
                   <div className="text-center py-12">
                     <Package className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                     <p className="text-muted-foreground">No produce available right now</p>
                   </div>
                 ) : (
                   <div className="grid xs:grid-cols-1 sm:grid-cols-2 gap-4">
                     {listings.slice(0, 4).map((item) => (
                       <div
                         key={item.id}
                         className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-secondary/30 transition-all cursor-pointer group flex flex-col h-full"
                         onClick={() => navigate("/marketplace")}
                       >
                         <div className="flex items-start justify-between mb-3">
                           {item.image_url ? (
                             <img src={item.image_url} alt={item.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover" />
                           ) : (
                             <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-secondary/10 flex items-center justify-center text-2xl">
                               📦
                             </div>
                           )}
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-8 w-8 rounded-full"
                             aria-label="Save to favorites"
                             onClick={(e) => {
                               e.stopPropagation();
                               toast({ title: "Coming Soon", description: "Favorites feature is under development." });
                             }}
                           >
                             <Heart className="w-4 h-4" />
                           </Button>
                         </div>
                         <div className="flex-1">
                           <h3 className="font-bold text-foreground group-hover:text-secondary transition-colors line-clamp-1">{item.name}</h3>
                           <p className="text-sm text-muted-foreground mb-3 truncate">{item.farmer_name}</p>
                           <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mb-4">
                             <span className="flex items-center gap-1 shrink-0">
                               <MapPin className="w-3 h-3" />
                               {item.farmer_location}
                             </span>
                             <span className="hidden xs:inline text-muted-foreground/30">•</span>
                             <span className="font-medium text-secondary truncate">{item.category}</span>
                           </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-border/5">
                           <span className="font-bold text-secondary text-sm sm:text-base whitespace-nowrap">Ksh{item.price_per_unit}/{item.unit}</span>
                           <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shrink-0">Shop</Button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </CardContent>
             </Card>
           </div>
 
            {/* Recent Orders */}
            <div className="space-y-6">
              <Card className="shadow-soft border-border/50 overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/10 bg-muted/20">
                  <CardTitle className="text-xl">Your Orders</CardTitle>
                  <CardDescription>Track your active purchases</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 px-6">
                      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-muted-foreground opacity-40" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">You haven't placed any orders yet</p>
                      <Link to="/marketplace">
                        <Button variant="outline" size="sm">Start Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="p-4 hover:bg-muted/30 transition-colors">
                          <OrderCard order={order} viewAs="buyer" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                {orders.length > 0 && (
                  <div className="p-3 bg-muted/10 border-t border-border/50 text-center">
                    <p className="text-xs text-muted-foreground font-medium">Showing {Math.min(5, orders.length)} of {orders.length} orders</p>
                  </div>
                )}
              </Card>
 
             <Card className="shadow-soft border-border/50">
               <CardHeader className="pb-3 border-b border-border/10">
                 <div className="flex items-center justify-between">
                   <CardTitle className="text-lg flex items-center gap-2">
                     <Heart className="w-5 h-5 text-secondary" />
                     Saved Farms
                   </CardTitle>
                   <span className="px-2 py-0.5 rounded text-[10px] bg-secondary/10 text-secondary font-bold">
                     SOON
                   </span>
                 </div>
               </CardHeader>
               <CardContent className="pt-6">
                 <div className="text-center py-4">
                   <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                     <Heart className="w-6 h-6 text-muted-foreground opacity-20" />
                   </div>
                   <p className="text-sm font-medium text-foreground mb-1">Stay Connected</p>
                   <p className="text-xs text-muted-foreground">Follow your favorite farmers to get updates on their latest harvest.</p>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       </main>
 
       {/* Simple Dashboard Footer */}
       <footer className="py-6 border-t border-border/50 mt-auto bg-background">
         <div className="container mx-auto px-4 text-center">
           <p className="text-xs text-muted-foreground">
             © 2024 AgriLink Buyer Portal. All purchases are protected by AgriLink FairTrade.
           </p>
         </div>
       </footer>
     </div>
   );
 };
 
 export default BuyerDashboard;
