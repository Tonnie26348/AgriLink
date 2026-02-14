export interface CartItem {
  listingId: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  farmerId: string;
  farmerName: string;
  imageUrl: string | null;
  maxQuantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
  getItemsByFarmer: () => Map<string, { farmerName: string; items: CartItem[] }>;
}