import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  Settings,
  Bell,
  LogOut,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

const FarmerDashboard = () => {
  const { signOut } = useAuth();
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
                <Button onClick={handleAddNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Listing
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No listings yet</p>
                    <Button onClick={handleAddNew}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Listing
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-center gap-4">
                          {listing.image_url ? (
                            <img
                              src={listing.image_url}
                              alt={listing.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-foreground">{listing.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {listing.quantity_available} {listing.unit} • ₹{listing.price_per_unit}/{listing.unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              listing.is_available
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {listing.is_available ? "Active" : "Hidden"}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(listing)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleAvailability(listing.id, !listing.is_available)}
                              >
                                {listing.is_available ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Hide Listing
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Show Listing
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(listing.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
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
            {listings.length > 0 && (
              <PriceInsights
                produceType={listings[0].name}
                currentPrice={listings[0].price_per_unit}
                unit={listings[0].unit}
                quantity={listings[0].quantity_available}
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Manage incoming orders</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {orders.slice(0, 5).map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        viewAs="farmer"
                        onUpdateStatus={updateOrderStatus}
                      />
                    ))}
                    {orders.length > 5 && (
                      <p className="text-xs text-center text-muted-foreground">
                        +{orders.length - 5} more orders
                      </p>
                    )}
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
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FarmerDashboard;
