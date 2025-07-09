
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME")!;
const apiKey = Deno.env.get("CLOUDINARY_API_KEY")!;
const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET")!;
const encodedCreds = btoa(`${apiKey}:${apiSecret}`);

Deno.serve(async (req) => {
  const { public_ID } = await req.json()
  
  const url =`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${public_ID}`
  
  const res = await fetch(url,{
    headers:{
      Authorization:`Basic ${encodedCreds}`,
    }
  })
  const data = await res.json();

  if(res.status !== 200){
    return new Response(
      JSON.stringify("image not found"),{
        headers: { "Content-Type": "application/json" },
        status: 404
      }
    )
  }
  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

