-- Fix relationships for orders table
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_buyer_id_fkey,
DROP CONSTRAINT IF EXISTS orders_farmer_id_fkey;

ALTER TABLE public.orders
ADD CONSTRAINT orders_buyer_id_fkey 
FOREIGN KEY (buyer_id) 
REFERENCES public.profiles(user_id);

ALTER TABLE public.orders
ADD CONSTRAINT orders_farmer_id_fkey 
FOREIGN KEY (farmer_id) 
REFERENCES public.profiles(user_id);

-- Update profiles RLS to allow viewing other people's basic info
-- This is necessary for buyers to see farmer names and vice-versa
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);
