
-- Secure RPC to update user profile
-- Most compatible version: simple UPDATE with INSERT fallback
CREATE OR REPLACE FUNCTION public.update_user_profile(
    p_full_name TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_location TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    -- 1. Try to update existing row
    UPDATE public.profiles 
    SET 
        full_name = COALESCE(p_full_name, full_name),
        phone = COALESCE(p_phone, phone),
        location = COALESCE(p_location, location),
        avatar_url = COALESCE(p_avatar_url, avatar_url),
        updated_at = now()
    WHERE user_id = auth.uid();

    -- 2. If no row was updated, insert it
    IF NOT FOUND THEN
        INSERT INTO public.profiles (user_id, full_name, phone, location, avatar_url, updated_at)
        VALUES (auth.uid(), p_full_name, p_phone, p_location, p_avatar_url, now());
    END IF;
END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.update_user_profile(TEXT, TEXT, TEXT, TEXT) TO authenticated;
