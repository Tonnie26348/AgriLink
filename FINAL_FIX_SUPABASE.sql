
-- AGRI-LINK FINAL BULLETPROOF SETUP SCRIPT
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. FIX PROFILES TABLE
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. FIX PRODUCE LISTINGS TABLE
ALTER TABLE public.produce_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view available listings" ON public.produce_listings;
DROP POLICY IF EXISTS "Farmers can manage own listings" ON public.produce_listings;
DROP POLICY IF EXISTS "Farmers can view their own listings" ON public.produce_listings;
DROP POLICY IF EXISTS "Farmers can insert their own listings" ON public.produce_listings;
DROP POLICY IF EXISTS "Farmers can update their own listings" ON public.produce_listings;
DROP POLICY IF EXISTS "Farmers can delete their own listings" ON public.produce_listings;
DROP POLICY IF EXISTS "Buyers can view available listings" ON public.produce_listings;

CREATE POLICY "Anyone can view available listings" ON public.produce_listings 
FOR SELECT USING (true);

CREATE POLICY "Farmers can insert own listings" ON public.produce_listings 
FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update own listings" ON public.produce_listings 
FOR UPDATE USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete own listings" ON public.produce_listings 
FOR DELETE USING (auth.uid() = farmer_id);

-- 3. FIX STORAGE BUCKETS & POLICIES
-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('produce-images', 'produce-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Produce Images Policies
DROP POLICY IF EXISTS "Produce images are public" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can upload produce images" ON storage.objects;
DROP POLICY IF EXISTS "Farmers can delete own produce images" ON storage.objects;

CREATE POLICY "Produce images are public" ON storage.objects 
FOR SELECT USING (bucket_id = 'produce-images');

CREATE POLICY "Farmers can upload produce images" ON storage.objects 
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'produce-images');

CREATE POLICY "Farmers can update produce images" ON storage.objects 
FOR UPDATE TO authenticated USING (bucket_id = 'produce-images');

CREATE POLICY "Farmers can delete produce images" ON storage.objects 
FOR DELETE TO authenticated USING (bucket_id = 'produce-images');

-- Profile Images Policies
DROP POLICY IF EXISTS "Profile images are public" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile image" ON storage.objects;

CREATE POLICY "Profile images are public" ON storage.objects 
FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload own profile image" ON storage.objects 
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Users can update own profile image" ON storage.objects 
FOR UPDATE TO authenticated USING (bucket_id = 'profile-images');

CREATE POLICY "Users can delete own profile image" ON storage.objects 
FOR DELETE TO authenticated USING (bucket_id = 'profile-images');

-- 4. FIX AUTH TRIGGER (Automatically create profile on signup)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Assign default role if metadata exists
  IF new.raw_user_meta_data->>'role' IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, (new.raw_user_meta_data->>'role')::app_role);
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. PROFILE UPDATE FUNCTION (Reliable way to update profile)
CREATE OR REPLACE FUNCTION public.update_user_profile(
  p_full_name TEXT,
  p_phone TEXT,
  p_location TEXT,
  p_avatar_url TEXT,
  p_email_notifications BOOLEAN
) RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET 
    full_name = p_full_name,
    phone = p_phone,
    location = p_location,
    avatar_url = p_avatar_url,
    email_notifications = p_email_notifications,
    updated_at = now()
  WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
