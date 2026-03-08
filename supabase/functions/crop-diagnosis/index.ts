import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { image_path } = await req.json();
    if (!image_path) throw new Error("No image path provided in request");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY_CROP") || Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing in Supabase project secrets");

    console.log(`Downloading image: ${image_path}`);
    const { data: imageData, error: downloadError } = await supabaseClient.storage
      .from('crop-diagnoses')
      .download(image_path);

    if (downloadError) {
      console.error("Storage Error:", downloadError);
      throw new Error(`Storage Error: ${downloadError.message}. Ensure 'crop-diagnoses' bucket exists and is public.`);
    }

    const arrayBuffer = await imageData.arrayBuffer();
    const contentType = imageData.type || "image/jpeg";
    
    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    const base64Image = btoa(binaryString);

    console.log("Calling Gemini API...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Analyze this agricultural plant image. Identify the crop and any diseases. Return JSON ONLY: { \"crop_type\": \"...\", \"diagnosis\": \"...\", \"confidence\": 0.9, \"treatment_advice\": \"...\" }" },
            { inline_data: { mime_type: contentType, data: base64Image } }
          ]
        }]
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Gemini API Error Response:", result);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Gemini AI Error: ${result.error?.message || "Unknown API Error"}` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "AI failed to format the diagnosis correctly. Please try again." 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const diagnosis = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ success: true, diagnosis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Diagnosis Function Crash:", msg);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Service Crash: ${msg}` 
    }), {
      status: 200, // Return 200 so the frontend can read the JSON error
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
