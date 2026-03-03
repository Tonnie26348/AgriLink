import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth-context-definition";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  order_id?: string | null;
  listing_id?: string | null;
  is_read: boolean;
  created_at: string;
  // Enriched fields
  sender_name?: string;
  receiver_name?: string;
}

export const useMessages = (otherUserId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!user || !otherUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (full_name),
          receiver:profiles!messages_receiver_id_fkey (full_name)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formattedMessages = (data || []).map((msg: any) => ({
        ...msg,
        sender_name: msg.sender?.full_name || "User",
        receiver_name: msg.receiver?.full_name || "User",
      }));

      setMessages(formattedMessages);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, otherUserId, toast]);

  const sendMessage = async (content: string, listingId?: string, orderId?: string) => {
    if (!user || !otherUserId) return false;

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: otherUserId,
        content,
        listing_id: listingId || null,
        order_id: orderId || null,
        is_read: false,
      });

      if (error) throw error;

      fetchMessages();
      return true;
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const markAsRead = async (messageIds: string[]) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .in("id", messageIds)
        .eq("receiver_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    if (user && otherUserId) {
      const channel = supabase
        .channel(`messages:${user.id}:${otherUserId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${user.id}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            if (newMessage.sender_id === otherUserId) {
              setMessages((prev) => [...prev, newMessage]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, otherUserId, fetchMessages]);

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    refetch: fetchMessages,
  };
};
