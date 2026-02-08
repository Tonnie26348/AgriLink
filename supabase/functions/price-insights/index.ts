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
    const { produceType, currentPrice, unit, quantity, location, month } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompt aligned with project plan - AI as decision support
    const systemPrompt = `You are an agricultural market analyst AI assistant for AgriLink. Your role is to provide price guidance to help farmers make informed decisions.

You analyze:
- Produce type and current market conditions
- Seasonal patterns (month/season)
- Location-based market dynamics
- Supply indicators (quantity available)

You provide simple, actionable guidance - NOT complex forecasts. Farmers retain full control over their final pricing decisions.`;

    const currentMonth = month || new Date().toLocaleString('default', { month: 'long' });

    const userPrompt = `Analyze pricing for this produce listing:

Produce Type: ${produceType}
Current Listed Price: ${currentPrice} per ${unit}
Quantity Available: ${quantity} ${unit}
Location: ${location || 'Kenya'}
Current Month: ${currentMonth}

Based on typical market patterns, provide:
1. A suggested price range (minimum and maximum) in the same currency
2. A demand level classification (High, Medium, or Low)
3. Brief reasoning (1-2 sentences) for the farmer`;

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
              name: "provide_price_guidance",
              description: "Provide price range and demand level guidance for farm produce",
              parameters: {
                type: "object",
                properties: {
                  suggestedPriceMin: {
                    type: "number",
                    description: "Minimum suggested price per unit",
                  },
                  suggestedPriceMax: {
                    type: "number",
                    description: "Maximum suggested price per unit",
                  },
                  demandLevel: {
                    type: "string",
                    enum: ["High", "Medium", "Low"],
                    description: "Current demand classification",
                  },
                  reasoning: {
                    type: "string",
                    description: "Brief explanation for the farmer (1-2 sentences)",
                  },
                  pricePosition: {
                    type: "string",
                    enum: ["below", "within", "above"],
                    description: "Whether current price is below, within, or above suggested range",
                  },
                },
                required: ["suggestedPriceMin", "suggestedPriceMax", "demandLevel", "reasoning", "pricePosition"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_price_guidance" } },
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

    const guidance = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, guidance }), {
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
