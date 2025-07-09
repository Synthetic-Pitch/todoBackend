import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (_req) => {
  const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME")!;
  const apiKey = Deno.env.get("CLOUDINARY_API_KEY")!;
  const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET")!;
  const folder = "profiles/"; // example: "profile_pics/"

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${folder}&max_results=30`;
  
  const encodedCreds = btoa(`${apiKey}:${apiSecret}`);
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${encodedCreds}`,
    },
  });

  const data = await res.json();

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  );
});