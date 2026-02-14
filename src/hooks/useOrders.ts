import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (ordersData && ordersData.length > 0) {
        // Fetch order items for each order
        const orderIds = ordersData.map((o) => o.id);
        const { data: itemsData } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds);

        // Fetch listing details for items
        const listingIds = [...new Set(itemsData?.map((i) => i.listing_id) || [])];
        const { data: listingsData } = await supabase
          .from("produce_listings")
          .select("id, name, unit, image_url")
          .in("id", listingIds);

        const listingMap = new Map(listingsData?.map((l) => [l.id, l]) || []);

        // Fetch buyer/farmer profiles
        const userIds = [
          ...new Set([
            ...ordersData.map((o) => o.buyer_id),
            ...ordersData.map((o) => o.farmer_id),
          ]),
        ];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", userIds);

        const profileMap = new Map(profilesData?.map((p) => [p.user_id, p.full_name]) || []);

        // Enrich orders with items and names
        const enrichedOrders = ordersData.map((order) => {
          const orderItems = (itemsData || [])
            .filter((item) => item.order_id === order.id)
            .map((item) => ({
              ...item,
              listing_name: listingMap.get(item.listing_id)?.name,
              listing_unit: listingMap.get(item.listing_id)?.unit,
              listing_image_url: listingMap.get(item.listing_id)?.image_url,
            }));

          return {
            ...order,
            status: order.status as OrderStatus,
            items: orderItems,
            buyer_name: profileMap.get(order.buyer_id) || "Unknown Buyer",
            farmer_name: profileMap.get(order.farmer_id) || "Unknown Farmer",
          };
        });

        setOrders(enrichedOrders);
      } else {
        setOrders([]);
      }
    } catch (error: unknown) {
      toast({
        title: "Error loading orders",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (input: CreateOrderInput): Promise<boolean> => {
    if (!user) return false;

    try {
      const totalAmount = input.items.reduce(
        (sum, item) => sum + item.quantity * item.price_per_unit,
        0
      );

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          buyer_id: user.id,
          farmer_id: input.farmer_id,
          total_amount: totalAmount,
          delivery_address: input.delivery_address,
          notes: input.notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = input.items.map((item) => ({
        order_id: orderData.id,
        listing_id: item.listing_id,
        quantity: item.quantity,
        price_per_unit: item.price_per_unit,
        total_price: item.quantity * item.price_per_unit,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update listing quantities
      for (const item of input.items) {
        const { data: listing } = await supabase
          .from("produce_listings")
          .select("quantity_available")
          .eq("id", item.listing_id)
          .single();

        if (listing) {
          await supabase
            .from("produce_listings")
            .update({
              quantity_available: Math.max(0, Number(listing.quantity_available) - item.quantity),
            })
            .eq("id", item.listing_id);
        }
      }

      toast({
        title: "Order placed!",
        description: "Your order has been submitted to the farmer.",
      });

      fetchOrders();
      return true;
    } catch (error: unknown) {
      toast({
        title: "Error placing order",
        description: (error as Error).message,
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

      toast({
        title: "Order updated",
        description: `Order status changed to ${status}`,
      });

      fetchOrders();
      return true;
    } catch (error: unknown) {
      toast({
        title: "Error updating order",
        description: (error as Error).message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    refetch: fetchOrders,
  };
};
