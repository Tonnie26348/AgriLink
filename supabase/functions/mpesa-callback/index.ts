import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");
    
    if (!orderId) {
      throw new Error("Missing orderId in callback URL");
    }

    const { Body } = await req.json();
    const { stkCallback } = Body;

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;
    const merchantRequestId = stkCallback.MerchantRequestID;
    const checkoutRequestId = stkCallback.CheckoutRequestID;

    let status = "failed";
    let transactionId = "";
    let amount = 0;
    let phoneNumber = "";

    if (resultCode === 0) {
      status = "completed";
      // Extract metadata
      const items = stkCallback.CallbackMetadata.Item;
      transactionId = items.find((i: { Name: string; Value: unknown }) => i.Name === "MpesaReceiptNumber")?.Value as string;
      amount = items.find((i: { Name: string; Value: unknown }) => i.Name === "Amount")?.Value as number;
      phoneNumber = items.find((i: { Name: string; Value: unknown }) => i.Name === "PhoneNumber")?.Value as string;

      // Update Order Status
      await supabaseClient
        .from("orders")
        .update({ status: "confirmed" })
        .eq("id", orderId);
    }

    // Record Payment
    await supabaseClient.from("payments").insert({
      order_id: orderId,
      transaction_id: transactionId || merchantRequestId,
      amount: amount,
      status: status,
      phone_number: String(phoneNumber),
      provider: "mpesa",
      provider_response: stkCallback
    });

    console.log(`Payment processed for Order ${orderId}: ${status} (${resultDesc})`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Callback Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
