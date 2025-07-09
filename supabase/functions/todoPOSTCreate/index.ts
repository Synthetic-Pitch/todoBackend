import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { v2 as cloudinary } from "npm:cloudinary";
import { Buffer } from "node:buffer";
import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

// Manually configure your credentials
cloudinary.config({
  cloud_name: Deno.env.get("CLOUDINARY_CLOUD_NAME")!,
  api_key:  Deno.env.get("CLOUDINARY_API_KEY")!,
  api_secret: Deno.env.get("CLOUDINARY_API_SECRET")!,
  secure: true,
});

function uploadToCloudinary(buffer: Buffer): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image",folder:"profiles" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

serve(async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    
    if (!file || typeof file === "string") {
      return new Response("Missing 'image' file field", { status: 400 });
    }
    //convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    //upload to cloudinary by wrapping in a promise
    const result = await uploadToCloudinary(buffer);
    const itemID = result.public_id;
    const url = result.secure_url;

    return new Response(JSON.stringify({
      public_ID:itemID,
      url:url,
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("❌ Upload error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message || e }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
