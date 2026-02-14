import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { CART_STORAGE_KEY } from "./cart-constants";
import { CartItem, CartContextType } from "./cart-types";

const CartContext = createContext<CartContextType | undefined>(undefined);



export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const quantity = newItem.quantity || 1;
    
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.listingId === newItem.listingId);
      
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const newQuantity = Math.min(existing.quantity + quantity, newItem.maxQuantity);
        
        if (newQuantity === existing.quantity) {
          toast({
            title: "Maximum quantity reached",
            description: `Only ${newItem.maxQuantity} ${newItem.unit} available`,
            variant: "destructive",
          });
          return prev;
        }
        
        const updated = [...prev];
        updated[existingIndex] = { ...existing, quantity: newQuantity };
        
        toast({
          title: "Cart updated",
          description: `${newItem.name} quantity increased to ${newQuantity} ${newItem.unit}`,
        });
        
        return updated;
      }
      
      toast({
        title: "Added to cart",
        description: `${quantity} ${newItem.unit} of ${newItem.name}`,
      });
      
      return [...prev, { ...newItem, quantity }];
    });
  };

  const removeItem = (listingId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.listingId === listingId);
      if (item) {
        toast({
          title: "Removed from cart",
          description: item.name,
        });
      }
      return prev.filter((i) => i.listingId !== listingId);
    });
  };

  const updateQuantity = (listingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(listingId);
      return;
    }
    
    setItems((prev) =>
      prev.map((item) => {
        if (item.listingId === listingId) {
          const newQuantity = Math.min(quantity, item.maxQuantity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
  };

  const getItemsByFarmer = () => {
    const grouped = new Map<string, { farmerName: string; items: CartItem[] }>();
    
    items.forEach((item) => {
      if (!grouped.has(item.farmerId)) {
        grouped.set(item.farmerId, { farmerName: item.farmerName, items: [] });
      }
      grouped.get(item.farmerId)!.items.push(item);
    });
    
    return grouped;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotal,
        getItemsByFarmer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
