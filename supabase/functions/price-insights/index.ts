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
    const { produceType, currentPrice, unit, location } = await req.json();

    // 1. Initialize Supabase Client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 2. Fetch "Real" Market Data from your DB
    const { data: marketData } = await supabaseClient.rpc('get_market_averages', { 
      p_name: produceType 
    });

    const stats = marketData?.[0] || { avg_price: currentPrice, min_price: currentPrice, max_price: currentPrice, total_listings: 0 };

    // 3. Call Gemini API (Free Tier)
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

    const prompt = `You are an AgriLink Market Analyst.
Analyze this for a farmer in ${location || 'Kenya'}:
- Produce: ${produceType}
- Farmer's Price: ${currentPrice} per ${unit}
- Marketplace Stats (last 30 days): Avg ${stats.avg_price}, Min ${stats.min_price}, Max ${stats.max_price} from ${stats.total_listings} listings.
- Current Month: ${new Date().toLocaleString('default', { month: 'long' })}

Return a JSON object:
{
  "suggestedPriceMin": number,
  "suggestedPriceMax": number,
  "demandLevel": "High" | "Medium" | "Low",
  "reasoning": "1-2 short sentences",
  "pricePosition": "below" | "within" | "above"
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      }),
    });

    const result = await response.json();
    const text = result.candidates[0].content.parts[0].text;
    const guidance = JSON.parse(text);

    return new Response(JSON.stringify({ success: true, guidance }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
