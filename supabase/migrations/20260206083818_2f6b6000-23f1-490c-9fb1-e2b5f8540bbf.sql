-- Create produce_listings table
CREATE TABLE public.produce_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_per_unit NUMERIC(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  quantity_available NUMERIC(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  harvest_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.produce_listings ENABLE ROW LEVEL SECURITY;

-- Farmers can manage their own listings
CREATE POLICY "Farmers can view their own listings"
ON public.produce_listings
FOR SELECT
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can insert their own listings"
ON public.produce_listings
FOR INSERT
WITH CHECK (auth.uid() = farmer_id AND public.has_role(auth.uid(), 'farmer'));

CREATE POLICY "Farmers can update their own listings"
ON public.produce_listings
FOR UPDATE
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own listings"
ON public.produce_listings
FOR DELETE
USING (auth.uid() = farmer_id);

-- Buyers can view all available listings
CREATE POLICY "Buyers can view available listings"
ON public.produce_listings
FOR SELECT
USING (is_available = true AND public.has_role(auth.uid(), 'buyer'));

-- Create trigger for updating updated_at
CREATE TRIGGER update_produce_listings_updated_at
BEFORE UPDATE ON public.produce_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for produce images
INSERT INTO storage.buckets (id, name, public) VALUES ('produce-images', 'produce-images', true);

-- Storage policies for produce images
CREATE POLICY "Anyone can view produce images"
ON storage.objects FOR SELECT
USING (bucket_id = 'produce-images');

CREATE POLICY "Farmers can upload produce images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'produce-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Farmers can update their produce images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'produce-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Farmers can delete their produce images"
ON storage.objects FOR DELETE
USING (bucket_id = 'produce-images' AND auth.uid()::text = (storage.foldername(name))[1]);