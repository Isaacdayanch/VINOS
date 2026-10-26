import sharp from "sharp";
import { CREAM_RGB, isCreamPhotoSource } from "../_lib/cream-photo";

const MAX_WIDTH = 1000;
// Anything this light counts as the studio white; it is lifted to pure white
// first so slightly grey backdrops (249, 252, 248…) also disappear.
const WHITE_POINT = 245;

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("src") ?? "";
  if (!isCreamPhotoSource(src)) return new Response("Foto no permitida", { status: 400 });

  const original = await fetch(new URL(src, request.url));
  if (!original.ok) return new Response("Foto no encontrada", { status: 404 });

  const { data, info } = await sharp(Buffer.from(await original.arrayBuffer()))
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Multiply by the cream: white becomes exactly the page's cream, dark glass stays dark.
  for (let i = 0; i < data.length; i += 3) {
    for (let c = 0; c < 3; c++) {
      const lifted = Math.min(255, (data[i + c] * 255) / WHITE_POINT);
      data[i + c] = Math.round((lifted * CREAM_RGB[c]) / 255);
    }
  }

  const body = await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } }).webp({ quality: 88, smartSubsample: true }).toBuffer();
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
    },
  });
}
