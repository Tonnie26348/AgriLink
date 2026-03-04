
-- 1. FIX USER CREATION TRIGGER to also handle roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role public.app_role;
BEGIN
    -- Extract role from raw_user_meta_data
    user_role := (NEW.raw_user_meta_data->>'role')::public.app_role;

    -- Insert into profiles
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

    -- Insert into user_roles if role is provided
    IF user_role IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (NEW.id, user_role);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. FIX RLS POLICIES FOR produce_listings
-- Make sure farmers can insert their own listings
DROP POLICY IF EXISTS "Farmers can insert their own listings" ON public.produce_listings;
CREATE POLICY "Farmers can insert their own listings"
ON public.produce_listings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = farmer_id);

-- Make sure buyers can view listings (without requiring role check if role assignment is delayed)
DROP POLICY IF EXISTS "Buyers can view available listings" ON public.produce_listings;
CREATE POLICY "Anyone authenticated can view available listings"
ON public.produce_listings
FOR SELECT
TO authenticated
USING (is_available = true);

-- 3. FIX RLS POLICIES FOR orders
DROP POLICY IF EXISTS "Buyers can create orders" ON public.orders;
CREATE POLICY "Buyers can create orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = buyer_id);

-- 4. FIX RLS POLICIES FOR order_items
DROP POLICY IF EXISTS "Buyers can insert order items" ON public.order_items;
CREATE POLICY "Buyers can insert order items"
ON public.order_items FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.buyer_id = auth.uid()
    )
);

-- 5. ENSURE profiles can be viewed by all authenticated users (needed for joins)
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);
