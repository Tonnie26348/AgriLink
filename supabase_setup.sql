-- SUPABASE SETUP SCRIPT (Updated)
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Update profiles table schema
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('produce-images', 'produce-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up RLS Policies for produce-images
-- (Dropping first to avoid conflicts if re-running)
DROP POLICY IF EXISTS "Anyone can view produce images" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can upload produce images" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can update their produce images" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can delete their produce images" ON storage.objects;

CREATE POLICY "Anyone can view produce images"
ON storage.objects FOR SELECT
USING (bucket_id = 'produce-images');

CREATE POLICY "Farmers can upload produce images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'produce-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Farmers can update their produce images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'produce-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Farmers can delete their produce images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'produce-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Set up RLS Policies for profile-images
DROP POLICY IF EXISTS "Anyone can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile image" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile image" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile image" ON storage.objects;

CREATE POLICY "Anyone can view profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile image"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile image"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile image"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. Ensure Profiles are viewable (for names in orders)
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);
