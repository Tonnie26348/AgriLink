import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context-definition";
import { useToast } from "@/hooks/use-toast";
import { useProduceListings, ProduceListing, CreateListingInput } from "@/hooks/useProduceListings";
import { useOrders } from "@/hooks/useOrders";
import OrderCard from "@/components/orders/OrderCard";
import ProduceListingDialog from "@/components/farmer/ProduceListingDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PriceInsights } from "@/components/insights/PriceInsights";
import { 
  Leaf, 
  Plus, 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  LogOut,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  LayoutDashboard,
} from "lucide-react";

const FarmerDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    listings, 
    loading, 
    createListing, 
    updateListing, 
    deleteListing, 
    toggleAvailability,
    uploadImage 
  } = useProduceListings();
  
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<ProduceListing | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const pendingOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));

  const stats = [
    { label: "Total Listings", value: listings.length.toString(), icon: Package, color: "text-primary" },
    { label: "Active Listings", value: listings.filter(l => l.is_available).length.toString(), icon: ShoppingCart, color: "text-secondary" },
    { label: "Total Orders", value: orders.length.toString(), icon: DollarSign, color: "text-accent" },
    { label: "Pending Orders", value: pendingOrders.length.toString(), icon: TrendingUp, color: "text-primary" },
  ];

  const handleAddNew = () => {
    setEditingListing(null);
    setDialogOpen(true);
  };

  const handleEdit = (listing: ProduceListing) => {
    setEditingListing(listing);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteListing(deletingId);
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleSubmit = async (data: CreateListingInput) => {
    if (editingListing) {
      return updateListing(editingListing.id, data);
    }
    return createListing(data);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "An unexpected error occurred during logout.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Dedicated Dashboard Header */}
      <header className="bg-background border-b border-border/50 h-16 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold text-foreground hidden sm:inline-block">
              Agri<span className="text-primary">Link</span> Farmer
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-1">
              Farmer Dashboard 🌾
            </h1>
            <p className="text-muted-foreground">
              Manage your farm and track your sales performance
            </p>
          </div>
          <Button onClick={handleAddNew} size="lg" className="shadow-soft">
            <Plus className="w-5 h-5 mr-2" />
            Add New Listing
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 shadow-soft">
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
            <Card className="shadow-soft border-border/50">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/10 pb-4">
                <div>
                  <CardTitle className="text-xl">Active Inventory</CardTitle>
                  <CardDescription>Your produce currently available for sale</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium mb-4">You haven't listed any produce yet</p>
                    <Button onClick={handleAddNew} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Listing
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          {listing.image_url ? (
                            <img
                              src={listing.image_url}
                              alt={listing.name}
                              className="w-14 h-14 rounded-lg object-cover shadow-sm"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Package className="w-7 h-7 text-primary opacity-60" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-foreground group-hover:text-primary transition-colors">{listing.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm font-semibold text-primary">Ksh{listing.price_per_unit}/{listing.unit}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{listing.quantity_available} {listing.unit} in stock</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                              listing.is_available
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {listing.is_available ? "Public" : "Hidden"}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(listing)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleAvailability(listing.id, !listing.is_available)}
                              >
                                {listing.is_available ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Hide from Market
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Make Public
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(listing.id)}
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Permanently
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Price Insights & Orders */}
          <div className="space-y-6">
            <Card className="shadow-soft border-border/50">
              <CardHeader className="pb-3 border-b border-border/10">
                <CardTitle className="text-xl">Market Status</CardTitle>
                <CardDescription>How your prices compare</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {listings.length > 0 ? (
                  <PriceInsights
                    listings={listings.map((l) => ({
                      id: l.id,
                      name: l.name,
                      price_per_unit: l.price_per_unit,
                      unit: l.unit,
                      quantity_available: l.quantity_available,
                    }))}
                  />
                ) : (
                  <div className="text-center py-6">
                    <TrendingUp className="w-8 h-8 mx-auto text-muted-foreground opacity-30 mb-2" />
                    <p className="text-xs text-muted-foreground">Add listings to see insights</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50 overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/10 bg-muted/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Recent Orders</CardTitle>
                  {orders.length > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-primary text-primary-foreground font-bold">
                      {pendingOrders.length} NEW
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-0">
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                      <ShoppingCart className="w-6 h-6 text-muted-foreground opacity-50" />
                    </div>
                    <p className="text-sm text-muted-foreground">No orders received yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50 max-h-[500px] overflow-y-auto">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 hover:bg-muted/30 transition-colors">
                        <OrderCard
                          order={order}
                          viewAs="farmer"
                          onUpdateStatus={updateOrderStatus}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <ProduceListingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        listing={editingListing}
        onSubmit={handleSubmit}
        onUploadImage={uploadImage}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone and will remove it from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Listing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Simple Dashboard Footer */}
      <footer className="py-6 border-t border-border/50 mt-auto bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 AgriLink Farmer Portal. All produce data is secured.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FarmerDashboard;
