
-- AgriLink New Features Migration
-- 1. Reviews System
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(order_id) -- One review per order
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT TO public USING (true);
CREATE POLICY "Buyers can insert their own reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

-- 2. Payment Simulation (M-Pesa)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    transaction_id TEXT UNIQUE,
    amount DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, completed, failed
    phone_number TEXT NOT NULL,
    provider TEXT DEFAULT 'mpesa',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_id AND (orders.buyer_id = auth.uid() OR orders.farmer_id = auth.uid())
    )
);

-- 3. AI Crop Disease Detection
CREATE TABLE IF NOT EXISTS public.crop_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    crop_type TEXT,
    diagnosis TEXT,
    confidence FLOAT,
    treatment_advice TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.crop_diagnoses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can view their own diagnoses" ON public.crop_diagnoses FOR SELECT TO authenticated USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers can insert their own diagnoses" ON public.crop_diagnoses FOR INSERT TO authenticated WITH CHECK (auth.uid() = farmer_id);

-- 4. Enhanced Farmer Tools (Inventory)
ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 10;

-- 5. Storage for Disease Images
INSERT INTO storage.buckets (id, name, public) VALUES ('crop-diagnoses', 'crop-diagnoses', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Farmers can upload diagnosis images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'crop-diagnoses');
CREATE POLICY "Anyone can view diagnosis images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'crop-diagnoses');
