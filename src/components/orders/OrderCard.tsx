import { useState, useEffect, useCallback } from "react";
import { Order, OrderStatus } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import OrderReviewDialog from "./OrderReviewDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronDown,
  MapPin,
  Star,
  UserCircle,
} from "lucide-react";

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  processing: {
    label: "Processing",
    icon: Package,
    className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
};

interface OrderCardProps {
  order: Order;
  viewAs: "buyer" | "farmer";
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
}

const ORDER_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"] as OrderStatus[];

const OrderTimeline = ({ currentStatus }: { currentStatus: OrderStatus }) => {
  if (currentStatus === "cancelled") {
    return (
      <div className="flex items-center gap-2 py-4 px-2 bg-destructive/5 rounded-xl border border-destructive/10">
        <XCircle className="w-5 h-5 text-destructive" />
        <p className="text-sm font-bold text-destructive uppercase tracking-tight">This order has been cancelled</p>
      </div>
    );
  }

  const currentIndex = ORDER_STEPS.indexOf(currentStatus);

  return (
    <div className="relative flex items-center justify-between w-full py-6 px-2">
      {/* Connector Line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
      <div 
        className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
        style={{ width: `${(currentIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
      />

      {ORDER_STEPS.map((step, idx) => {
        const Config = STATUS_CONFIG[step];
        const Icon = Config.icon;
        const isCompleted = idx <= currentIndex;
        const isCurrent = idx === currentIndex;

        return (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              isCompleted 
                ? "bg-primary border-primary text-primary-foreground shadow-glow" 
                : "bg-background border-muted text-muted-foreground"
            } ${isCurrent ? "scale-125 ring-4 ring-primary/20" : ""}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={`absolute -bottom-6 text-[9px] font-bold uppercase tracking-tight whitespace-nowrap transition-colors ${
              isCompleted ? "text-primary" : "text-muted-foreground"
            }`}>
              {Config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const OrderCard = ({ order, viewAs, onUpdateStatus }: OrderCardProps) => {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;
  const availableStatuses = NEXT_STATUS[order.status] || [];

  const checkReviewStatus = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id")
      .eq("order_id", order.id)
      .maybeSingle();
    
    if (data) setHasReviewed(true);
  }, [order.id]);

  useEffect(() => {
    if (order.status === "delivered" && viewAs === "buyer") {
      checkReviewStatus();
    }
  }, [order.id, order.status, viewAs, checkReviewStatus]);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-elevated hover:border-primary/30 group rounded-2xl">
      <CardContent className="p-0">
        {/* Top Header Section */}
        <div className="p-5 flex items-center justify-between bg-muted/20 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${statusConfig.className} shadow-sm`}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
                <Badge variant="outline" className={`text-[10px] h-5 ${statusConfig.className}`}>
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                Placed {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {order.status === "delivered" && viewAs === "buyer" && !hasReviewed && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 rounded-full text-xs bg-yellow-400/10 text-yellow-600 hover:bg-yellow-400/20 border-yellow-400/20 shadow-sm"
                onClick={() => setReviewDialogOpen(true)}
              >
                <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Rate Produce
              </Button>
            )}
            {hasReviewed && (
              <Badge className="h-6 rounded-full bg-green-500/10 text-green-600 border-green-500/20 font-bold">
                <CheckCircle className="w-3 h-3 mr-1" /> Reviewed
              </Badge>
            )}
          </div>
        </div>

        {/* Visual Timeline Section */}
        <div className="px-10 pt-2 pb-10 border-b border-border/40 bg-background/50">
          <OrderTimeline currentStatus={order.status} />
        </div>

        <div className="p-5 space-y-6">
          {/* Parties Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {viewAs === "farmer" ? "Customer" : "Sold by"}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground">{viewAs === "farmer" ? order.buyer_name : order.farmer_name}</span>
              </div>
            </div>
            
            {order.delivery_address && (
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ship To</p>
                <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  <span className="line-clamp-1 truncate max-w-[150px]">{order.delivery_address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Order Items</p>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 border border-border/50 group/item hover:bg-muted/50 transition-colors"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0">
                    {item.listing_image_url ? (
                      <img
                        src={item.listing_image_url}
                        alt={item.listing_name}
                        className="w-full h-full object-cover transition-transform group-hover/item:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate group-hover/item:text-primary transition-colors">
                      {item.listing_name || "Premium Produce"}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {item.quantity} {item.listing_unit} × Ksh{item.price_per_unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">Ksh{item.total_price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions and Total */}
          <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Grand Total</span>
              <span className="text-2xl font-display font-black text-primary tracking-tight leading-none">Ksh{order.total_amount}</span>
            </div>

            {viewAs === "farmer" && availableStatuses.length > 0 && onUpdateStatus && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full sm:w-auto h-11 rounded-xl shadow-soft font-bold gap-2">
                    Update Progress
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-2 shadow-elevated border-border/40">
                  <div className="px-2 py-1.5 mb-1 border-b border-border/50">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Next Stage</p>
                  </div>
                  {availableStatuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => onUpdateStatus(order.id, status)}
                      className="cursor-pointer rounded-lg font-bold text-xs py-2.5"
                    >
                      {STATUS_CONFIG[status].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
      
      <OrderReviewDialog
        orderId={order.id}
        farmerId={order.farmer_id}
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        onSuccess={() => setHasReviewed(true)}
      />
    </Card>
  );
};

export default OrderCard;
