import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { crop, currentPrice, unit } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an agricultural market analyst AI. Analyze crop prices and provide market insights.
Always respond with realistic market predictions based on typical seasonal patterns and market dynamics.
Be helpful and provide actionable insights for farmers.`;

    const userPrompt = `Analyze the market for ${crop} currently priced at ${currentPrice} per ${unit}.

Provide:
1. A 6-month price forecast with monthly predictions
2. Key market factors affecting this crop
3. A recommendation for the farmer (sell now, hold, or wait)

Format your response as JSON with this structure:
{
  "forecast": [
    {"month": "Month 1", "price": number, "trend": "up" | "down" | "stable"},
    {"month": "Month 2", "price": number, "trend": "up" | "down" | "stable"},
    ...6 months total
  ],
  "factors": ["factor1", "factor2", "factor3"],
  "recommendation": "sell" | "hold" | "wait",
  "reasoning": "Brief explanation of the recommendation",
  "confidence": "high" | "medium" | "low"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_price_insights",
              description: "Provide structured price insights for a crop",
              parameters: {
                type: "object",
                properties: {
                  forecast: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        month: { type: "string" },
                        price: { type: "number" },
                        trend: { type: "string", enum: ["up", "down", "stable"] },
                      },
                      required: ["month", "price", "trend"],
                    },
                  },
                  factors: {
                    type: "array",
                    items: { type: "string" },
                  },
                  recommendation: {
                    type: "string",
                    enum: ["sell", "hold", "wait"],
                  },
                  reasoning: { type: "string" },
                  confidence: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                  },
                },
                required: ["forecast", "factors", "recommendation", "reasoning", "confidence"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_price_insights" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No structured response from AI");
    }

    const insights = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, insights }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Price insights error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
