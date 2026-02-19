import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth-context-definition";
import { useToast } from "@/hooks/use-toast";

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  listing_id: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  created_at: string;
  // Enriched fields
  listing_name?: string;
  listing_unit?: string;
  listing_image_url?: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  farmer_id: string;
  total_amount: number;
  status: OrderStatus;
  delivery_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Enriched fields
  items?: OrderItem[];
  buyer_name?: string;
  farmer_name?: string;
}

export interface CreateOrderInput {
  farmer_id: string;
  items: {
    listing_id: string;
    quantity: number;
    price_per_unit: number;
  }[];
  delivery_address?: string;
  notes?: string;
}

export const useOrders = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user || !userRole) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            produce_listings (
              name,
              unit,
              image_url
            )
          ),
          buyer:buyer_id (
            full_name
          ),
          farmer:farmer_id (
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (userRole === "buyer") {
        query = query.eq("buyer_id", user.id);
      } else {
        query = query.eq("farmer_id", user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedOrders = (data || []).map((order: any) => ({
        ...order,
        buyer_name: order.buyer?.full_name || "Unknown Buyer",
        farmer_name: order.farmer?.full_name || "Local Farmer",
        items: order.order_items.map((item: any) => ({
          ...item,
          listing_name: item.produce_listings?.name,
          listing_unit: item.produce_listings?.unit,
          listing_image_url: item.produce_listings?.image_url,
        })),
      }));

      setOrders(formattedOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error fetching orders",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, userRole, toast]);

  const createOrder = async (input: CreateOrderInput): Promise<boolean> => {
    if (!user) return false;

    try {
      const totalAmount = input.items.reduce(
        (acc, item) => acc + item.quantity * item.price_per_unit,
        0
      );

      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          buyer_id: user.id,
          farmer_id: input.farmer_id,
          total_amount: totalAmount,
          delivery_address: input.delivery_address || null,
          notes: input.notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create the order items
      const orderItems = input.items.map((item) => ({
        order_id: order.id,
        listing_id: item.listing_id,
        quantity: item.quantity,
        price_per_unit: item.price_per_unit,
        total_price: item.quantity * item.price_per_unit,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Update produce listing quantities (simplified for now)
      // Ideally, this should be done in a database transaction or a Postgres function
      for (const item of input.items) {
        const { data: currentListing } = await supabase
            .from("produce_listings")
            .select("quantity_available")
            .eq("id", item.listing_id)
            .single();

        if (currentListing) {
            const newQuantity = Math.max(0, currentListing.quantity_available - item.quantity);
            await supabase
                .from("produce_listings")
                .update({ quantity_available: newQuantity })
                .eq("id", item.listing_id);
        }
      }

      toast({
        title: "Order placed!",
        description: "Your order has been sent to the farmer.",
      });

      fetchOrders();
      return true;
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status } : order))
      );

      toast({
        title: "Order updated",
        description: `Order status changed to ${status}.`,
      });
      return true;
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    refetch: fetchOrders,
  };
};
