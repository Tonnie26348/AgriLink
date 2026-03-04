import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SystemStats {
  farmerCount: number;
  buyerCount: number;
  totalValue: number;
}

export const useSystemStats = () => {
  const [stats, setStats] = useState<SystemStats>({
    farmerCount: 0,
    buyerCount: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.rpc('get_system_stats');
        
        if (error) {
          console.error("Error fetching system stats:", error);
          return;
        }

        if (data) {
          setStats(data as SystemStats);
        }
      } catch (err) {
        console.error("Exception in useSystemStats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 5 minutes if the page stays open
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading };
};
