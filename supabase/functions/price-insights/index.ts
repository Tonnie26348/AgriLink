import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const mode = body.mode || "item"; // 'item' or 'general'
    
    const apiKey = Deno.env.get("GEMINI_API_KEY_MARKET") || Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing.");

    const models = ["gemini-2.0-flash", "gemini-2.5-flash"];
    let lastError = "";

    let prompt = "";
    if (mode === "general") {
      prompt = `You are a Kenyan agricultural market expert. Provide a general overview of the current market. 
      Focus on items like Tomatoes, Sukuma Wiki, Maize, and Onions.
      Return JSON ONLY in this format: { "success": true, "guidance": { "marketOverview": "...", "topPerformers": [{"name": "...", "trend": "Rising/Stable/Falling", "priceRange": "Ksh 0 - 0"}], "seasonalAdvice": "...", "recommendations": [{"name": "...", "reason": "...", "timeToHarvest": "..."}] } }`;
    } else {
      const { produceType, currentPrice, unit, location } = body;
      prompt = `You are a Kenyan agricultural market expert. Analyze the price for ${produceType} in ${location || 'Kenya'}. 
      Current price: ${currentPrice} per ${unit}. 
      Return JSON ONLY: { "success": true, "guidance": { "suggestedPriceMin": 0, "suggestedPriceMax": 0, "demandLevel": "High/Medium/Low", "reasoning": "...", "pricePosition": "within/above/below" } }`;
    }

    for (const model of models) {
      try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const result = await resp.json();
        if (resp.ok && result.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = result.candidates[0].content.parts[0].text;
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return new Response(jsonMatch[0], { headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
        } else {
          lastError = result.error?.message || "Model failed";
        }
      } catch (e) { lastError = e.message; }
    }

    throw new Error(`Price Insights failed: ${lastError}`);

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
