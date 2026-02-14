import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface MarketplaceListing {
  id: string;
  farmer_id: string;
  name: string;
  description: string | null;
  category: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  image_url: string | null;
  harvest_date: string | null;
  created_at: string;
  farmer_name?: string;
  farmer_location?: string;
}

interface UseMarketplaceOptions {
  category?: string;
  search?: string;
}

export const useMarketplace = (options: UseMarketplaceOptions = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("produce_listings")
        .select(`
          id,
          farmer_id,
          name,
          description,
          category,
          price_per_unit,
          unit,
          quantity_available,
          image_url,
          harvest_date,
          created_at
        `)
        .eq("is_available", true)
        .gt("quantity_available", 0)
        .order("created_at", { ascending: false });

      if (options.category && options.category !== "All") {
        query = query.eq("category", options.category);
      }

      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      const { data: listingsData, error } = await query;

      if (error) throw error;

      // Fetch farmer profiles for the listings
      if (listingsData && listingsData.length > 0) {
        const farmerIds = [...new Set(listingsData.map(l => l.farmer_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, location")
          .in("user_id", farmerIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
        
        const enrichedListings = listingsData.map(listing => ({
          ...listing,
          farmer_name: profileMap.get(listing.farmer_id)?.full_name || "Local Farmer",
          farmer_location: profileMap.get(listing.farmer_id)?.location || "India",
        }));

        setListings(enrichedListings);
      } else {
        setListings([]);
      }
    } catch (error: unknown) {
      toast({
        title: "Error loading marketplace",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [options.category, options.search, toast]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("produce_listings")
        .select("category")
        .eq("is_available", true);

      if (error) throw error;

      const uniqueCategories = [...new Set(data?.map(d => d.category) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    listings,
    loading,
    categories,
    refetch: fetchListings,
  };
};
