-- SUPABASE SETUP SCRIPT (Final Fix for Orders)
-- Run this in your Supabase SQL Editor

-- 1. Ensure avatar_url exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('produce-images', 'produce-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. FIX RELATIONSHIPS FOR ORDERS
-- First, remove any existing potentially broken constraints
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_buyer_id_fkey;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_farmer_id_fkey;

-- Add correct constraints pointing to profiles(user_id)
-- This allows Supabase to join orders directly to profiles
ALTER TABLE public.orders
ADD CONSTRAINT orders_buyer_id_fkey 
FOREIGN KEY (buyer_id) 
REFERENCES public.profiles(user_id);

ALTER TABLE public.orders
ADD CONSTRAINT orders_farmer_id_fkey 
FOREIGN KEY (farmer_id) 
REFERENCES public.profiles(user_id);

-- 4. RLS POLICIES FOR STORAGE (produce-images)
DROP POLICY IF EXISTS "Anyone can view produce images" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can upload produce images" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can update their produce images" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can delete their produce images" ON storage.objects;

CREATE POLICY "Anyone can view produce images" ON storage.objects FOR SELECT USING (bucket_id = 'produce-images');
CREATE POLICY "Farmers can upload produce images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'produce-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Farmers can update their produce images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'produce-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Farmers can delete their produce images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'produce-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. RLS POLICIES FOR STORAGE (profile-images)
DROP POLICY IF EXISTS "Anyone can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile image" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile image" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile image" ON storage.objects;

CREATE POLICY "Anyone can view profile images" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Users can upload their own profile image" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own profile image" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own profile image" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 6. RLS POLICIES FOR PROFILES
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
