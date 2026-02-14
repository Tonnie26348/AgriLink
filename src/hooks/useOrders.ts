import { useState, useEffect, useCallback } from "react";
// import { supabase } from "@/integrations/supabase/client"; // Supabase removed
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
  // const [orders, setOrders] = useState<Order[]>([]); // Supabase removed
  // const [loading, setLoading] = useState(true); // Supabase removed

  // Mock states as Supabase is removed
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => { // Supabase removed
    // console.warn("Orders fetching is disabled as Supabase is removed.");
    setLoading(false);
    setOrders([]); // Return empty data
  }, [user, toast]); // Supabase removed

  const createOrder = async (input: CreateOrderInput): Promise<boolean> => { // Supabase removed
    console.warn("Order creation is disabled as Supabase is removed.");
    toast({
      title: "Action Disabled",
      description: "Creating orders is currently disabled.",
      variant: "destructive",
    });
    return false;
  }; // Supabase removed

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => { // Supabase removed
    console.warn("Order status update is disabled as Supabase is removed.");
    toast({
      title: "Action Disabled",
      description: "Updating order status is currently disabled.",
      variant: "destructive",
    });
    return false;
  }; // Supabase removed

  useEffect(() => { // Supabase removed
    // Mock useEffect for removed Supabase
    setLoading(false);
    setOrders([]);
  }, [fetchOrders]); // Supabase removed

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    refetch: fetchOrders, // Keep refetch available but it does nothing
  };
};
