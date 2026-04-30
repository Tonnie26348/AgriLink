
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Loader2, MoreVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProduceListing } from "@/hooks/useProduceListings";

interface FarmerInventoryTabProps {
  listings: ProduceListing[];
  loading: boolean;
  onAddNew: () => void;
  onEdit: (listing: ProduceListing) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
}

export const FarmerInventoryTab = ({
  listings,
  loading,
  onAddNew,
  onEdit,
  onDelete,
  onToggleAvailability
}: FarmerInventoryTabProps) => {
  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/10 pb-4">
        <div>
          <CardTitle className="text-2xl">Inventory Management</CardTitle>
          <CardDescription>Edit, hide, or delete your produce listings</CardDescription>
        </div>
        <Button onClick={onAddNew} size="sm">
          <Plus className="w-4 h-4 mr-2" /> New Listing
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground mb-4">You haven't listed any produce yet</p>
            <Button onClick={onAddNew} variant="outline">Add First Listing</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-all group gap-4"
              >
                <div className="flex items-center gap-4">
                  {listing.image_url ? (
                    <img
                      src={listing.image_url}
                      alt={listing.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shadow-sm shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 sm:w-7 sm:h-7 text-primary opacity-60" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors truncate">{listing.name}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                      <span className="text-sm font-semibold text-primary">Ksh{listing.price_per_unit}/{listing.unit}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">{listing.quantity_available} {listing.unit} in stock</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
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
                      <DropdownMenuItem onClick={() => onEdit(listing)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleAvailability(listing.id, !listing.is_available)}>
                        {listing.is_available ? <><EyeOff className="w-4 h-4 mr-2" /> Hide</> : <><Eye className="w-4 h-4 mr-2" /> Show</>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(listing.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
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
  );
};
