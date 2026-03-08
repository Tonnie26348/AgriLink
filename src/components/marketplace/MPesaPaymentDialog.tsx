import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Phone, CheckCircle2, AlertCircle, Timer, RefreshCw } from "lucide-react";

interface MPesaPaymentDialogProps {
  orderId: string;
  amount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const MPesaPaymentDialog = ({
  orderId,
  amount,
  open,
  onOpenChange,
  onSuccess,
}: MPesaPaymentDialogProps) => {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState<"input" | "processing" | "confirming" | "success">("input");
  const [merchantRequestId, setMerchantRequestId] = useState("");
  const [pollingCount, setPollingCount] = useState(0);

  // Subscribe to order status changes
  useEffect(() => {
    if (step !== "confirming" || !open) return;

    console.log(`Subscribing to order updates for ${orderId}...`);
    
    const channel = supabase
      .channel(`order-payment-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log("Order update received in dialog:", payload.new.status);
          if (payload.new.status === "confirmed") {
            setStep("success");
          }
        }
      )
      .subscribe();

    // Fallback Polling every 5 seconds
    const pollInterval = setInterval(async () => {
      setPollingCount(prev => prev + 1);
      const { data, error } = await supabase
        .from("orders")
        .select("status")
        .eq("id", orderId)
        .single();
      
      if (!error && data?.status === "confirmed") {
        setStep("success");
        clearInterval(pollInterval);
      }
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [step, open, orderId]);

  // Handle success transition
  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        // Reset for next time
        setStep("input");
        setPhoneNumber("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, onOpenChange, onSuccess]);

  const handleInitiatePayment = async () => {
    if (!phoneNumber.match(/^(?:254|\+254|0)?(7|1)\d{8}$/)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Kenyan phone number.",
        variant: "destructive",
      });
      return;
    }

    setStep("processing");
    
    try {
      const { data, error } = await supabase.functions.invoke("mpesa-stkpush", {
        body: {
          amount: amount,
          phoneNumber: phoneNumber,
          orderId: orderId,
        },
      });

      if (error) throw error;

      if (data.ResponseCode === "0") {
        setStep("confirming");
        setMerchantRequestId(data.MerchantRequestID);
        toast({
          title: "STK Push Sent",
          description: "Please check your phone for the M-Pesa prompt.",
        });
      } else {
        throw new Error(data.ResponseDescription || "Failed to initiate M-Pesa payment");
      }
    } catch (error: unknown) {
      console.error("M-Pesa error:", error);
      toast({
        title: "Payment initiation failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setStep("input");
    }
  };

  const checkStatusManually = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .single();
    
    if (error) {
      toast({ title: "Error checking status", description: error.message, variant: "destructive" });
      return;
    }

    if (data?.status === "confirmed") {
      setStep("success");
    } else {
      toast({
        title: "Payment not yet detected",
        description: "Please ensure you've completed the prompt on your phone.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/512px-M-PESA_LOGO-01.svg.png" alt="M-Pesa" className="h-6 object-contain" />
            M-Pesa Payment
          </DialogTitle>
          <DialogDescription>
            Secure checkout for Ksh{amount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {step === "input" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">M-Pesa Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="0712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  You will receive an STK push on your phone to authorize the payment.
                </p>
              </div>
              <Button className="w-full h-12 rounded-xl bg-[#39b54a] hover:bg-[#2e943c] text-white font-bold shadow-soft" onClick={handleInitiatePayment}>
                Pay Ksh{amount.toLocaleString()}
              </Button>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#39b54a]" />
              <p className="font-medium">Requesting M-Pesa prompt...</p>
              <p className="text-sm text-muted-foreground">Keep your phone nearby.</p>
            </div>
          )}

          {step === "confirming" && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[#39b54a]/20 animate-ping" />
                <div className="relative w-20 h-20 bg-[#39b54a]/10 rounded-full flex items-center justify-center">
                  <Timer className="h-10 w-10 text-[#39b54a] animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-xl">Waiting for PIN</h3>
                <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                  Please enter your M-Pesa PIN on your phone to complete the payment.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-2xl border border-dashed border-border/60">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Status</p>
                <div className="flex items-center justify-center gap-2 text-[#39b54a] font-bold">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Waiting for callback...
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground hover:text-primary gap-2"
                onClick={checkStatusManually}
              >
                <RefreshCw className="h-3 w-3" />
                I've already entered my PIN
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4 text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-glow border-4 border-white">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-2xl text-green-600">Payment Verified!</h3>
                <p className="text-sm text-muted-foreground">Your order is now confirmed and ready.</p>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-4">
                <div className="h-full bg-green-500 animate-progress-fast" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MPesaPaymentDialog;
