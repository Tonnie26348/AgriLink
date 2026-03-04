import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth-context-definition";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (isMounted = true) => {
    if (!user) {
      if (isMounted) setLoading(false);
      return;
    }

    try {
      if (isMounted) setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (isMounted) {
        setProfile(data);
      }
    } catch (error: unknown) {
      console.error("Error fetching profile:", error);
      if (isMounted) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast({
          title: "Error fetching profile",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  }, [user, toast]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return false;

    try {
      setLoading(true);
      
      // Filter out fields that shouldn't be updated or cause issues
      const cleanUpdates: Record<string, string | null> = {};
      
      if (updates.full_name !== undefined) cleanUpdates.full_name = updates.full_name;
      if (updates.phone !== undefined) cleanUpdates.phone = updates.phone;
      if (updates.location !== undefined) cleanUpdates.location = updates.location;
      if (updates.avatar_url !== undefined) cleanUpdates.avatar_url = updates.avatar_url;
      
      cleanUpdates.updated_at = new Date().toISOString();

      // We use a "Perform and Refresh" strategy here.
      // We don't use .select() because RLS visibility can cause PGRST204 errors
      // if the row isn't immediately visible to the current policy.

      // 1. Try to update existing profile first
      const { error: updateError, count } = await supabase
        .from("profiles")
        .update(cleanUpdates)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // If no rows were updated (count is null or 0), the profile might not exist. Try to insert.
      // Note: count requires 'count: exact' option, but we can just check if we have a profile in state
      if (!profile) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            ...cleanUpdates,
            user_id: user.id
          });

        if (insertError && insertError.code !== '23505') {
          throw insertError;
        }
      }

      // Final step: manually fetch the latest profile data to update local state
      await fetchProfile();

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
      return true;
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      const errorCode = (error && typeof error === 'object' && 'code' in error) ? String((error as Record<string, unknown>).code) : "No code";
      toast({
        title: "Update failed",
        description: `${errorMessage} (Code: ${errorCode})`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error: unknown) {
      console.error("Error uploading avatar:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error uploading image",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchProfile(isMounted);
    return () => { isMounted = false; };
  }, [fetchProfile]);

  return {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    refreshProfile: () => fetchProfile(true),
  };
};
