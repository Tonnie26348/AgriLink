import { useState, useEffect, useCallback } from "react";
// import { supabase } from "@/integrations/supabase/client"; // Supabase removed
import { useAuth } from "@/contexts/auth-context-definition";
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
  // const [listings, setListings] = useState<MarketplaceListing[]>([]); // Supabase removed
  // const [loading, setLoading] = useState(true); // Supabase removed
  // const [categories, setCategories] = useState<string[]>([]); // Supabase removed

  // Mock states as Supabase is removed
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchListings = useCallback(async () => { // Supabase removed
    // console.warn("Marketplace listings fetching is disabled as Supabase is removed.");
    setLoading(false);
    setListings([]); // Return empty data
  }, [options.category, options.search, toast]); // Supabase removed

  const fetchCategories = async () => { // Supabase removed
    // console.warn("Category fetching is disabled as Supabase is removed.");
    setCategories([]); // Return empty categories
  }; // Supabase removed

  useEffect(() => { // Supabase removed
    // Mock useEffect for removed Supabase
    setLoading(false);
    setListings([]);
    setCategories([]);
  }, [fetchListings]); // Supabase removed

  useEffect(() => { // Supabase removed
    // Mock useEffect for removed Supabase
  }, []); // Supabase removed

  return {
    listings,
    loading,
    categories,
    refetch: fetchListings, // Keep refetch available but it does nothing
  };
};
