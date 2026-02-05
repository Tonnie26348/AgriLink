 import { useState } from "react";
 import { Link } from "react-router-dom";
 import { useAuth } from "@/contexts/AuthContext";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { 
   Leaf, 
   Plus, 
   Package, 
   TrendingUp, 
   DollarSign, 
   ShoppingCart,
   BarChart3,
   Settings,
   Bell,
   LogOut
 } from "lucide-react";
 
 const FarmerDashboard = () => {
   const { user, signOut } = useAuth();
   const [listings] = useState([
     { id: 1, name: "Organic Tomatoes", quantity: "50 kg", price: "₹40/kg", status: "Active" },
     { id: 2, name: "Fresh Potatoes", quantity: "100 kg", price: "₹25/kg", status: "Active" },
     { id: 3, name: "Green Peppers", quantity: "30 kg", price: "₹60/kg", status: "Pending" },
   ]);
 
   const stats = [
     { label: "Total Listings", value: "12", icon: Package, color: "text-primary" },
     { label: "Active Orders", value: "5", icon: ShoppingCart, color: "text-secondary" },
     { label: "Revenue (Month)", value: "₹24,500", icon: DollarSign, color: "text-accent" },
     { label: "Profile Views", value: "142", icon: TrendingUp, color: "text-primary" },
   ];
 
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
             <Button variant="ghost" size="icon">
               <Bell className="w-5 h-5" />
             </Button>
             <Button variant="ghost" size="icon">
               <Settings className="w-5 h-5" />
             </Button>
             <Button variant="ghost" onClick={signOut}>
               <LogOut className="w-4 h-4 mr-2" />
               Logout
             </Button>
           </div>
         </div>
       </header>
 
       <main className="container mx-auto px-4 py-8">
         {/* Welcome Section */}
         <div className="mb-8">
           <h1 className="text-3xl font-display font-bold text-foreground mb-2">
             Welcome back, Farmer! 🌾
           </h1>
           <p className="text-muted-foreground">
             Manage your produce listings and track your sales
           </p>
         </div>
 
         {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {stats.map((stat) => (
             <Card key={stat.label} className="border-border/50">
               <CardContent className="pt-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-muted-foreground">{stat.label}</p>
                     <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                   </div>
                   <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                     <stat.icon className="w-6 h-6" />
                   </div>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
 
         {/* Main Content Grid */}
         <div className="grid lg:grid-cols-3 gap-6">
           {/* Listings Section */}
           <div className="lg:col-span-2">
             <Card>
               <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                   <CardTitle>Your Listings</CardTitle>
                   <CardDescription>Manage your produce for sale</CardDescription>
                 </div>
                 <Button>
                   <Plus className="w-4 h-4 mr-2" />
                   Add Listing
                 </Button>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {listings.map((listing) => (
                     <div
                       key={listing.id}
                       className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50"
                     >
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                           <Package className="w-6 h-6 text-primary" />
                         </div>
                         <div>
                           <p className="font-semibold text-foreground">{listing.name}</p>
                           <p className="text-sm text-muted-foreground">
                             {listing.quantity} • {listing.price}
                           </p>
                         </div>
                       </div>
                       <div className="flex items-center gap-3">
                         <span
                           className={`px-3 py-1 rounded-full text-xs font-medium ${
                             listing.status === "Active"
                               ? "bg-primary/10 text-primary"
                               : "bg-secondary/10 text-secondary"
                           }`}
                         >
                           {listing.status}
                         </span>
                         <Button variant="ghost" size="sm">
                           Edit
                         </Button>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
           </div>
 
           {/* Quick Actions & Insights */}
           <div className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <BarChart3 className="w-5 h-5 text-primary" />
                   AI Price Insights
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-3">
                   <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                     <p className="text-sm font-medium text-primary">Tomato prices trending up</p>
                     <p className="text-xs text-muted-foreground">+12% from last week</p>
                   </div>
                   <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                     <p className="text-sm font-medium text-secondary">Best time to sell onions</p>
                     <p className="text-xs text-muted-foreground">High demand in your area</p>
                   </div>
                 </div>
               </CardContent>
             </Card>
 
             <Card>
               <CardHeader>
                 <CardTitle>Recent Orders</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between py-2 border-b border-border/50">
                     <div>
                       <p className="text-sm font-medium">Order #1234</p>
                       <p className="text-xs text-muted-foreground">Tomatoes - 10kg</p>
                     </div>
                     <span className="text-sm text-primary font-medium">₹400</span>
                   </div>
                   <div className="flex items-center justify-between py-2 border-b border-border/50">
                     <div>
                       <p className="text-sm font-medium">Order #1233</p>
                       <p className="text-xs text-muted-foreground">Potatoes - 25kg</p>
                     </div>
                     <span className="text-sm text-primary font-medium">₹625</span>
                   </div>
                   <div className="flex items-center justify-between py-2">
                     <div>
                       <p className="text-sm font-medium">Order #1232</p>
                       <p className="text-xs text-muted-foreground">Peppers - 5kg</p>
                     </div>
                     <span className="text-sm text-primary font-medium">₹300</span>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       </main>
     </div>
   );
 };
 
 export default FarmerDashboard;