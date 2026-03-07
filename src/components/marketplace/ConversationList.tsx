import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth-context-definition";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  other_user_id: string;
  other_user_name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface ConversationRow {
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender: { full_name: string | null } | null;
  receiver: { full_name: string | null } | null;
}

interface ConversationListProps {
  onSelectConversation: (userId: string, userName: string) => void;
}

const ConversationList = ({ onSelectConversation }: ConversationListProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("messages")
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey (full_name),
            receiver:profiles!messages_receiver_id_fkey (full_name)
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const rows = (data as unknown as ConversationRow[]) || [];
        const conversationMap = new Map<string, Conversation>();

        rows.forEach((msg) => {
          const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          const otherUserName = msg.sender_id === user.id 
            ? msg.receiver?.full_name 
            : msg.sender?.full_name;

          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              other_user_id: otherUserId,
              other_user_name: otherUserName || "Unknown User",
              last_message: msg.content,
              last_message_at: msg.created_at,
              unread_count: (!msg.is_read && msg.receiver_id === user.id) ? 1 : 0,
            });
          } else {
            if (!msg.is_read && msg.receiver_id === user.id) {
              const conv = conversationMap.get(otherUserId)!;
              conv.unread_count += 1;
            }
          }
        });

        setConversations(Array.from(conversationMap.values()));
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    const channel = supabase
      .channel("conversation_list")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/50">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-xs">Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
        <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-3">
          <MessageSquare className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-sm">No messages yet</p>
        <p className="text-xs text-muted-foreground mt-1">Start a chat from the marketplace</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv) => (
        <div
          key={conv.other_user_id}
          onClick={() => onSelectConversation(conv.other_user_id, conv.other_user_name)}
          className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/60 cursor-pointer transition-all border border-transparent hover:border-border/50 relative overflow-hidden"
        >
          <Avatar className="h-12 w-12 border-2 border-background shadow-sm group-hover:border-primary/20 transition-colors">
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-bold">
              {conv.other_user_name[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0 py-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold text-sm text-foreground truncate">{conv.other_user_name}</h4>
              <span className="text-[10px] font-medium text-muted-foreground/80 whitespace-nowrap">
                {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: false })}
              </span>
            </div>
            <p className={`text-xs truncate leading-relaxed ${conv.unread_count > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {conv.last_message}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {conv.unread_count > 0 && (
              <Badge className="h-5 w-5 flex items-center justify-center rounded-full p-0 bg-primary hover:bg-primary text-[10px] shadow-sm animate-pulse">
                {conv.unread_count}
              </Badge>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
