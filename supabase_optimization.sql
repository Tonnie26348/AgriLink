
-- AGRI-LINK PERFORMANCE OPTIMIZATION SCRIPT
-- Run this in your Supabase SQL Editor

-- 1. ADD INDEXES FOR FASTER SEARCH AND FILTERING
-- Produce Listings Indexes
CREATE INDEX IF NOT EXISTS idx_produce_listings_category ON public.produce_listings(category);
CREATE INDEX IF NOT EXISTS idx_produce_listings_farmer_id ON public.produce_listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_produce_listings_is_available ON public.produce_listings(is_available);
CREATE INDEX IF NOT EXISTS idx_produce_listings_created_at ON public.produce_listings(created_at DESC);
-- GIN index for search (requires pg_trgm extension)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_produce_listings_name_trgm ON public.produce_listings USING gin (name gin_trgm_ops);

-- Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- User Roles Indexes (Roles are stored here, not in profiles)
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Reviews Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON public.reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_farmer_id ON public.reviews(farmer_id);

-- 2. CREATE A VIEW FOR ENHANCED MARKETPLACE PERFORMANCE
-- This view pre-aggregates ratings and joins farmer info, 
-- reducing the number of queries the frontend needs to make.
DROP VIEW IF EXISTS public.marketplace_view;
CREATE OR REPLACE VIEW public.marketplace_view AS
SELECT 
    l.*,
    p.full_name as farmer_name,
    p.location as farmer_location,
    COALESCE(r.avg_rating, 0) as rating,
    COALESCE(r.review_count, 0) as review_count
FROM 
    public.produce_listings l
LEFT JOIN 
    public.profiles p ON l.farmer_id = p.user_id
LEFT JOIN (
    SELECT 
        listing_id, 
        AVG(rating)::numeric(2,1) as avg_rating, 
        COUNT(*) as review_count
    FROM 
        public.reviews
    GROUP BY 
        listing_id
) r ON l.id = r.listing_id;

-- 3. RLS FOR THE VIEW
-- Views in Supabase inherit RLS from underlying tables, 
-- but we ensure public access for convenience if needed.
GRANT SELECT ON public.marketplace_view TO anon, authenticated;

-- 4. ANALYZE TABLES TO UPDATE STATISTICS
ANALYZE public.produce_listings;
ANALYZE public.profiles;
ANALYZE public.reviews;
