import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, history } = await req.json();
    if (!prompt) throw new Error("No prompt provided");

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY_ASSISTANT") || Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY or GEMINI_API_KEY_ASSISTANT is missing");

    const systemPrompt = "You are the AgriLink Assistant. Help Kenyan users with produce, prices, and farming tips. Be concise and friendly. Use Ksh.";

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Understood. I am ready." }] },
          ...(history || []),
          { role: "user", parts: [{ text: prompt }] }
        ]
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || "Gemini API Error");

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("AI did not generate a response.");

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("AI Assistant Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
