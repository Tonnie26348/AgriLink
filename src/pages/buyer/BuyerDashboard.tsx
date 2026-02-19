import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context-definition";
import { useOrders } from "@/hooks/useOrders";
import OrderCard from "@/components/orders/OrderCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Leaf, 
  Search, 
  ShoppingCart, 
  Package, 
  Heart, 
  Clock,
  MapPin,
  Star,
  Settings,
  Bell,
  LogOut,
  Loader2,
} from "lucide-react";
 
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context-definition";
import { useOrders } from "@/hooks/useOrders";
import OrderCard from "@/components/orders/OrderCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Leaf, 
  Search, 
  ShoppingCart, 
  Package, 
  Heart, 
  Clock,
  MapPin,
  Star,
  Settings,
  Bell,
  LogOut,
  Loader2,
} from "lucide-react";
 
const BuyerDashboard = () => {
  const { user, signOut } = useAuth();
  const { orders, loading: ordersLoading } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");

  const featuredProduce = [
    { id: 1, name: "Organic Tomatoes", farmer: "Ram Singh", price: "₹40/kg", rating: 4.8, location: "Punjab", image: "🍅" },
    { id: 2, name: "Fresh Potatoes", farmer: "Lakshmi Devi", price: "₹25/kg", rating: 4.6, location: "UP", image: "🥔" },
    { id: 3, name: "Green Peppers", farmer: "Suresh Kumar", price: "₹60/kg", rating: 4.9, location: "Maharashtra", image: "🫑" },
    { id: 4, name: "Sweet Corn", farmer: "Priya Patel", price: "₹35/kg", rating: 4.7, location: "Gujarat", image: "🌽" },
  ];

  const pendingOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  const stats = [
    { label: "Total Orders", value: orders.length.toString(), icon: Package },
    { label: "In Progress", value: pendingOrders.length.toString(), icon: Clock },
    { label: "Delivered", value: deliveredOrders.length.toString(), icon: ShoppingCart },
    { label: "Saved Farms", value: "8", icon: Heart },
  ];
 
   return (
     <div className="min-h-screen bg-muted/30 pt-16">
       <Header />
 
       <main className="container mx-auto px-4 py-8">
         {/* Welcome Section */}
         <div className="mb-8">
           <h1 className="text-3xl font-display font-bold text-foreground mb-2">
             Fresh from the Farm 🥬
           </h1>
           <p className="text-muted-foreground">
             Browse fresh produce directly from local farmers
           </p>
         </div>
 
         {/* Stats Grid */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {stats.map((stat) => (
             <Card key={stat.label} className="border-border/50">
               <CardContent className="pt-6">
                 <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-primary/10">
                     <stat.icon className="w-5 h-5 text-primary" />
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Featured Produce</CardTitle>
                    <CardDescription>Fresh picks from trusted farmers</CardDescription>
                  </div>
                  <Link to="/marketplace">
                    <Button variant="outline">View All</Button>
                  </Link>
                </CardHeader>
               <CardContent>
                 <div className="grid sm:grid-cols-2 gap-4">
                   {featuredProduce.map((item) => (
                     <div
                       key={item.id}
                       className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                     >
                       <div className="flex items-start justify-between mb-3">
                         <span className="text-4xl">{item.image}</span>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                           <Heart className="w-4 h-4" />
                         </Button>
                       </div>
                       <h3 className="font-semibold text-foreground">{item.name}</h3>
                       <p className="text-sm text-muted-foreground mb-2">{item.farmer}</p>
                       <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                         <MapPin className="w-3 h-3" />
                         <span>{item.location}</span>
                         <span className="mx-1">•</span>
                         <Star className="w-3 h-3 text-secondary fill-secondary" />
                         <span>{item.rating}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="font-bold text-primary">{item.price}</span>
                         <Button size="sm">Add to Cart</Button>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
           </div>
 
            {/* Recent Orders */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription>Track your purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-4">No orders yet</p>
                      <Link to="/marketplace">
                        <Button size="sm">Browse Marketplace</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <OrderCard key={order.id} order={order} viewAs="buyer" />
                      ))}
                      {orders.length > 3 && (
                        <Button variant="outline" className="w-full">
                          View All {orders.length} Orders
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
 
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Heart className="w-5 h-5 text-secondary" />
                   Saved Farms
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-3">
                   <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                       🌾
                     </div>
                     <div>
                       <p className="text-sm font-medium">Green Valley Farms</p>
                       <p className="text-xs text-muted-foreground">Punjab • 4.9 ⭐</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                     <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-lg">
                       🥕
                     </div>
                     <div>
                       <p className="text-sm font-medium">Sunrise Organics</p>
                       <p className="text-xs text-muted-foreground">Maharashtra • 4.8 ⭐</p>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       </main>

       <Footer />
     </div>
   );
 };
 
 export default BuyerDashboard;
 
 export default BuyerDashboard;