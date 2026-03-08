import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { image_path } = await req.json();
    
    // 1. Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 2. Get API Key
    const apiKey = Deno.env.get("GEMINI_API_KEY_CROP") || Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return new Response(JSON.stringify({ success: false, error: "GEMINI_API_KEY is missing in Supabase Settings." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // 3. Download Image
    const { data: imageBlob, error: downloadError } = await supabase.storage
      .from('crop-diagnoses')
      .download(image_path);

    if (downloadError) return new Response(JSON.stringify({ success: false, error: `Storage Error: ${downloadError.message}` }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // 4. Convert to Base64
    const buffer = await imageBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

    // 5. Call Gemini
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Analyze this agricultural plant image. Identify the crop and any diseases. Return JSON ONLY: { \"crop_type\": \"...\", \"diagnosis\": \"...\", \"confidence\": 0.9, \"treatment_advice\": \"...\" }" },
            { inline_data: { mime_type: imageBlob.type || "image/jpeg", data: base64 } }
          ]
        }]
      })
    });

    const result = await resp.json();
    if (!resp.ok) return new Response(JSON.stringify({ success: false, error: `Gemini Error: ${result.error?.message || "Unknown"}` }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return new Response(JSON.stringify({ success: false, error: "AI failed to return a valid diagnosis format." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ success: true, diagnosis: JSON.parse(jsonMatch[0]) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
