import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Loader2, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CartItem from "./CartItem";

const CartSheet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  const { items, getTotal, getItemsByFarmer, clearCart, getItemCount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [open, setOpen] = useState(false);

  const itemCount = getItemCount();
  const total = getTotal();
  const farmerGroups = getItemsByFarmer();

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to place an order",
        variant: "destructive",
      });
      setOpen(false);
      navigate("/login");
      return;
    }

    if (userRole !== "buyer") {
      toast({
        title: "Buyer account required",
        description: "Only buyers can place orders",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) return;

    setIsCheckingOut(true);

    try {
      // Create separate orders for each farmer
      for (const [farmerId, group] of farmerGroups) {
        const orderTotal = group.items.reduce(
          (sum, item) => sum + item.quantity * item.pricePerUnit,
          0
        );

        // Create order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            buyer_id: user.id,
            farmer_id: farmerId,
            total_amount: orderTotal,
            status: "pending",
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = group.items.map((item) => ({
          order_id: order.id,
          listing_id: item.listingId,
          quantity: item.quantity,
          price_per_unit: item.pricePerUnit,
          total_price: item.quantity * item.pricePerUnit,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Update listing quantities
        for (const item of group.items) {
          const { error: updateError } = await supabase
            .from("produce_listings")
            .update({
              quantity_available: item.maxQuantity - item.quantity,
            })
            .eq("id", item.listingId);

          if (updateError) throw updateError;
        }
      }

      clearCart();
      setOpen(false);

      toast({
        title: "Orders placed successfully! 🎉",
        description: `${farmerGroups.size} order(s) created from ${items.length} items`,
      });

      navigate("/buyer/dashboard");
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: (error as Error).message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart
            {itemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-foreground mb-1">Cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add fresh produce from the marketplace
            </p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-6 py-4">
                {Array.from(farmerGroups.entries()).map(([farmerId, group]) => (
                  <div key={farmerId}>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      From {group.farmerName}
                    </h4>
                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <CartItem key={item.listingId} item={item} />
                      ))}
                    </div>
                    <div className="flex justify-between text-sm mt-2 px-1">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        ₹
                        {group.items
                          .reduce((sum, i) => sum + i.quantity * i.pricePerUnit, 0)
                          .toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{total.toFixed(0)}
                </span>
              </div>

              {farmerGroups.size > 1 && (
                <p className="text-xs text-muted-foreground text-center">
                  This will create {farmerGroups.size} separate orders (one per farmer)
                </p>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Checkout • ₹{total.toFixed(0)}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
