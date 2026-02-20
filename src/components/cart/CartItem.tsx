import { Minus, Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType, useCart } from "@/contexts/cart-context-definition";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrease = () => {
    updateQuantity(item.listingId, item.quantity - 1);
  };

  const handleIncrease = () => {
    if (item.quantity < item.maxQuantity) {
      updateQuantity(item.listingId, item.quantity + 1);
    }
  };

  return (
    <div className="flex gap-3 p-3 bg-muted/50 rounded-xl">
      {/* Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground text-sm line-clamp-1">
          {item.name}
        </h4>
        <p className="text-xs text-muted-foreground mb-2">
          by {item.farmerName}
        </p>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleDecrease}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleIncrease}
              disabled={item.quantity >= item.maxQuantity}
            >
              <Plus className="w-3 h-3" />
            </Button>
            <span className="text-xs text-muted-foreground ml-1">
              {item.unit}
            </span>
          </div>

          {/* Price & Remove */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary text-sm">
              Ksh{(item.quantity * item.pricePerUnit).toFixed(0)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => removeItem(item.listingId)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
