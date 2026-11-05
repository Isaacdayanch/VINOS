import sharp from "sharp";
import { CREAM_RGB, isCreamPhotoSource } from "../_lib/cream-photo";

const MAX_WIDTH = 1000;
const MAX_HEIGHT = 1400;
// Every bottle gets the same breathing room, so all of them render the same size in
// the cards no matter how much white the original photo had around it.
const MARGIN = 0.03;
// Anything this light counts as the studio white; it is lifted to pure white
// first so slightly grey backdrops (249, 252, 248…) also disappear.
const WHITE_POINT = 245;

// Every packshot is re-framed onto the same 4:5 canvas with the bottle at the
// same height, so bottles look the same size next to each other in the catalog
// whatever the source photo's margins were (Isaac, 5-nov-2026: Godin and Gva'ot
// looked small, Grand Rivallon looked big).
const CANVAS_W = 960;
const CANVAS_H = 1200;
const BOTTLE_H = 1128; // 94 % of the canvas, like the packshots made with the skill
const BOTTLE_MAX_W = 900;
// Pixels darker than this (on the lifted scale) are the bottle; soft shadows stay out.
const INK_POINT = 200;

type Box = { left: number; top: number; width: number; height: number };

/** Bounding box of the bottle, or null when the photo is not a packshot on white. */
function bottleBox(data: Buffer, width: number, height: number): Box | null {
  // A packshot has white in all four corners (sampled a little inside, past any border artefact).
  const dx = Math.max(1, Math.round(width * 0.02)), dy = Math.max(1, Math.round(height * 0.02));
  const corners = [[dx, dy], [width - 1 - dx, dy], [dx, height - 1 - dy], [width - 1 - dx, height - 1 - dy]].map(([x, y]) => (y * width + x) * 3);
  if (!corners.every(i => (data[i] + data[i + 1] + data[i + 2]) / 3 >= 235)) return null;
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      if ((data[i] + data[i + 1] + data[i + 2]) / 3 < INK_POINT) {
        if (x < left) left = x; if (x > right) right = x;
        if (y < top) top = y; if (y > bottom) bottom = y;
      }
    }
  }
  if (right < 0 || bottom - top < height * 0.4) return null;
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("src") ?? "";
  if (!isCreamPhotoSource(src)) return new Response("Foto no permitida", { status: 400 });

  const original = await fetch(new URL(src, request.url));
  if (!original.ok) return new Response("Foto no encontrada", { status: 404 });

  const flat = await sharp(Buffer.from(await original.arrayBuffer()))
    .rotate()
    .flatten({ background: "#ffffff" })
    .removeAlpha()
    .png()
    .toBuffer();
  // Crop the studio white around the bottle (sharp trims before resizing). Only
  // near-white goes, which the white-point lift below turns into cream anyway.
  const fitted = await sharp(flat)
    .trim({ background: "#ffffff", threshold: 10 })
    .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true })
    .catch(() => sharp(flat).resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside", withoutEnlargement: true }).png().toBuffer({ resolveWithObject: true }));
  const margin = Math.round(fitted.info.height * MARGIN);
  const { data, info } = await sharp(fitted.data)
    .extend({ top: margin, bottom: margin, left: margin, right: margin, background: "#ffffff" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Measure the bottle on the white original, before the cream tint.
  const box = bottleBox(data, info.width, info.height);

  // Multiply by the cream: white becomes exactly the page's cream, dark glass stays dark.
  for (let i = 0; i < data.length; i += 3) {
    for (let c = 0; c < 3; c++) {
      const lifted = Math.min(255, (data[i + c] * 255) / WHITE_POINT);
      data[i + c] = Math.round((lifted * CREAM_RGB[c]) / 255);
    }
  }

  let image = sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } });
  if (box) {
    // Scale so the bottle is BOTTLE_H tall (narrower if a box makes it very wide), then centre it on the cream canvas.
    const scale = Math.min(BOTTLE_H / box.height, BOTTLE_MAX_W / box.width);
    const margin = 24; // keep a little of the soft shadow around the glass
    const crop = {
      left: Math.max(0, box.left - margin), top: Math.max(0, box.top - margin),
      width: Math.min(info.width, box.left + box.width + margin) - Math.max(0, box.left - margin),
      height: Math.min(info.height, box.top + box.height + margin) - Math.max(0, box.top - margin),
    };
    let sw = Math.round(crop.width * scale), sh = Math.round(crop.height * scale);
    let scaled = sharp(await image.extract(crop).resize({ width: sw, height: sh, fit: "fill" }).png().toBuffer());
    const bottleH = Math.round(box.height * scale);
    let top = Math.round((CANVAS_H - bottleH) / 2) - Math.round((box.top - crop.top) * scale);
    let left = Math.round((CANVAS_W - sw) / 2);
    // The bottle always fits; trim whatever margin would fall outside the canvas.
    const trim = { left: Math.max(0, -left), top: Math.max(0, -top), width: 0, height: 0 };
    trim.width = Math.min(sw - trim.left, CANVAS_W - Math.max(0, left));
    trim.height = Math.min(sh - trim.top, CANVAS_H - Math.max(0, top));
    if (trim.left || trim.top || trim.width !== sw || trim.height !== sh) {
      scaled = sharp(await scaled.extract(trim).png().toBuffer());
      left = Math.max(0, left); top = Math.max(0, top); sw = trim.width; sh = trim.height;
    }
    image = sharp({ create: { width: CANVAS_W, height: CANVAS_H, channels: 3, background: { r: CREAM_RGB[0], g: CREAM_RGB[1], b: CREAM_RGB[2] } } })
      .composite([{ input: await scaled.png().toBuffer(), left, top }]);
  }

  const body = await image.webp({ quality: 88, smartSubsample: true }).toBuffer();
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
    },
  });
}
