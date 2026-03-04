
-- RPC to fetch public system statistics for the landing page
CREATE OR REPLACE FUNCTION public.get_system_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to count across all users
SET search_path = public
AS $$
DECLARE
    farmer_count INTEGER;
    buyer_count INTEGER;
    total_value NUMERIC;
    result JSON;
BEGIN
    -- Count distinct farmers
    SELECT COUNT(DISTINCT user_id) INTO farmer_count 
    FROM public.user_roles 
    WHERE role = 'farmer';

    -- Count distinct buyers
    SELECT COUNT(DISTINCT user_id) INTO buyer_count 
    FROM public.user_roles 
    WHERE role = 'buyer';

    -- Sum of all transacted value (only for confirmed/delivered orders)
    SELECT COALESCE(SUM(total_amount), 0) INTO total_value 
    FROM public.orders 
    WHERE status NOT IN ('pending', 'cancelled');

    result := json_build_object(
        'farmerCount', farmer_count,
        'buyerCount', buyer_count,
        'totalValue', total_value
    );

    RETURN result;
END;
$$;

-- Grant access to authenticated and anonymous users so the home page can show stats
GRANT EXECUTE ON FUNCTION public.get_system_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_system_stats() TO anon;
