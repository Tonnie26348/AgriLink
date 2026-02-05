 import { useState } from "react";
 import { Link } from "react-router-dom";
 import { useAuth } from "@/contexts/AuthContext";
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
   LogOut
 } from "lucide-react";
 
 const BuyerDashboard = () => {
   const { user, signOut } = useAuth();
   const [searchQuery, setSearchQuery] = useState("");
 
   const featuredProduce = [
     { id: 1, name: "Organic Tomatoes", farmer: "Ram Singh", price: "₹40/kg", rating: 4.8, location: "Punjab", image: "🍅" },
     { id: 2, name: "Fresh Potatoes", farmer: "Lakshmi Devi", price: "₹25/kg", rating: 4.6, location: "UP", image: "🥔" },
     { id: 3, name: "Green Peppers", farmer: "Suresh Kumar", price: "₹60/kg", rating: 4.9, location: "Maharashtra", image: "🫑" },
     { id: 4, name: "Sweet Corn", farmer: "Priya Patel", price: "₹35/kg", rating: 4.7, location: "Gujarat", image: "🌽" },
   ];
 
   const recentOrders = [
     { id: "#ORD-2341", items: "Tomatoes, Onions", status: "Delivered", date: "Feb 3, 2026" },
     { id: "#ORD-2340", items: "Potatoes", status: "In Transit", date: "Feb 2, 2026" },
     { id: "#ORD-2339", items: "Green Peppers, Carrots", status: "Processing", date: "Feb 1, 2026" },
   ];
 
   const stats = [
     { label: "Total Orders", value: "23", icon: Package },
     { label: "Cart Items", value: "4", icon: ShoppingCart },
     { label: "Saved Farms", value: "8", icon: Heart },
     { label: "Pending Delivery", value: "2", icon: Clock },
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
 
           {/* Search Bar */}
           <div className="hidden md:flex flex-1 max-w-md mx-8">
             <div className="relative w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input
                 placeholder="Search for produce, farmers..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10"
               />
             </div>
           </div>
           
           <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="relative">
               <ShoppingCart className="w-5 h-5" />
               <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                 4
               </span>
             </Button>
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
               <CardHeader>
                 <CardTitle>Featured Produce</CardTitle>
                 <CardDescription>Fresh picks from trusted farmers</CardDescription>
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
                 <CardTitle>Recent Orders</CardTitle>
                 <CardDescription>Track your purchases</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {recentOrders.map((order) => (
                     <div
                       key={order.id}
                       className="p-3 rounded-lg bg-muted/50 border border-border/50"
                     >
                       <div className="flex items-center justify-between mb-1">
                         <span className="font-medium text-sm">{order.id}</span>
                         <span
                           className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                             order.status === "Delivered"
                               ? "bg-primary/10 text-primary"
                               : order.status === "In Transit"
                               ? "bg-secondary/10 text-secondary"
                               : "bg-muted text-muted-foreground"
                           }`}
                         >
                           {order.status}
                         </span>
                       </div>
                       <p className="text-sm text-muted-foreground">{order.items}</p>
                       <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                     </div>
                   ))}
                 </div>
                 <Button variant="outline" className="w-full mt-4">
                   View All Orders
                 </Button>
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
     </div>
   );
 };
 
 export default BuyerDashboard;