
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME")!;
  const apiKey =Deno.env.get("CLOUDINARY_API_KEY")!;
  const apiSecret =Deno.env.get("CLOUDINARY_API_SECRET")!;
  const encodedCreds = btoa(`${apiKey}:${apiSecret}`);
  
  const url =`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/profiles/ofoh8jstv7cccnobxf5m`

  const res = await fetch (url,{
    headers :{
      Authorization: `Basic ${encodedCreds}`,
    }
  })

  const data = await res.json()

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

