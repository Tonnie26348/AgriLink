import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth-context-definition";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, ShoppingBag, MessageSquare, Info, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: 'order' | 'message' | 'system';
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
  link?: string;
}

const NotificationsCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      // Mock notifications for now as we don't have a notifications table yet
      // In a real app, you'd fetch from a 'notifications' table
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'order',
          title: 'New Order Received',
          content: 'You have a new order for Organic Tomatoes.',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          is_read: false,
          link: '/farmer/dashboard'
        },
        {
          id: '2',
          type: 'message',
          title: 'New Message',
          content: 'Sarah sent you a message about the Maize listing.',
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          is_read: false,
          link: '/inbox'
        }
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
    };

    fetchNotifications();
  }, [user]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4 text-primary" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-secondary" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 bg-destructive border-2 border-background animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-elevated border-border/40" align="end">
        <div className="p-4 border-b border-border/40 flex items-center justify-between bg-muted/20">
          <h4 className="font-bold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-[10px] text-primary hover:text-primary hover:bg-primary/10" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-8 h-8 mx-auto text-muted-foreground/20 mb-2" />
              <p className="text-xs text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer relative group ${!n.is_read ? 'bg-primary/5' : ''}`}>
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(n.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className={`text-xs font-bold ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{n.content}</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 pt-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t border-border/40 text-center">
          <Button variant="ghost" size="sm" className="w-full text-[10px] h-8 text-muted-foreground">
            View all activity
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsCenter;
