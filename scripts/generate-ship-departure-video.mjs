// Generates the homepage hero video with Runway (image-to-video, model gemini_omni_flash_1.1) from the existing hero
// photo, and saves it as public/videos/mcl-ocean-hero.mp4. Local, one-off tool: not part of the site, never exposed to
// visitors.
//
//   Dry run (free; no key needed; prints the prompt, plan and estimated cost):
//     node scripts/generate-ship-departure-video.mjs
//   Real, billable generation (needs RUNWAYML_API_SECRET in .env.local, which is gitignored):
//     node --env-file=.env.local scripts/generate-ship-departure-video.mjs --confirm
//
// The key is only ever read from the environment, never printed.
// Request fields follow the official schema (docs.dev.runwayml.com/api.md and the SDK's image-to-video types); price
// from docs.dev.runwayml.com/guides/pricing (checked 2026-10-29) — confirm in the Developer Portal before running.

import RunwayML, { TaskFailedError, TaskTimedOutError } from "@runwayml/sdk";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const MODEL = "gemini_omni_flash_1.1";
const RATIO = "1920:1080";
const DURATION = 10; // seconds (model allows 3–10)
const ESTIMATED_CREDITS = 15 * DURATION + 1; // 1080p: 15 credits/s + 1 credit for the start frame; $0.01 per credit
const SOURCE = "public/images/hero-ship.png";
const OUTPUT = "public/videos/mcl-ocean-hero.mp4";

// Rain-free direction: dark drifting clouds and a live, heavy sea. The ship keeps the photo's side-on view and sails
// left to right (its wake trails off to the left in the photo), so the model need not turn it or move the camera.
const PROMPT = [
  "Photorealistic cinematic maritime footage, like real ocean footage from a premium shipping film, one continuous shot, no rain at all.",
  "The large container ship from the image, seen side-on exactly as in the image and in the same position, moves steadily forward from left to right with its bow on the right through a rough, deep-blue open ocean.",
  "The whole sea is alive: large, broad ocean waves in several layers roll across the scene at different speeds and directions; foreground waves visibly rise, roll, crest and break into white foam as they move past the camera.",
  "Waves approach and strike the ship's hull and bow, throwing up white spray and splashes; foam surges along the hull and flows away from the ship after each impact.",
  "Sunlit highlights, reflections and surface textures shift continuously across the moving water; level, stable horizon; natural deep-blue ocean colour.",
  "The ship responds gently to the swells with natural pitching and slight rolling as waves hit, sitting firmly in the water, and keeps its exact hull shape, proportions, stacked red, orange and light-blue containers and white bridge in every frame.",
  "Large dark-blue and deep-grey clouds drift slowly and visibly across the sky in layers at different depths, their density and shading changing gently; soft daylight breaks through occasional gaps; atmospheric haze near the horizon; dramatic but not overly dark.",
  "Stable wide camera with only very slight natural drift; same framing as the image.",
  "No rain, no rain streaks, no lightning, no cuts, no zoom, no camera rotation, no text, no logos, no watermark, no other ships.",
].join(" ");

const confirm = process.argv.includes("--confirm");
if (confirm && !process.env.RUNWAYML_API_SECRET) {
  console.error("RUNWAYML_API_SECRET is not set. Create an API key in the Runway Developer Portal and add it to .env.local:");
  console.error("  RUNWAYML_API_SECRET=…   (never commit it; .env* is gitignored)");
  process.exit(1);
}

// Start frame: the hero photo trimmed from 16:10 to 16:9 (a little sky off the top), 1920×1080 JPEG, sent as a data URI
// (the API accepts up to 5MB).
const frame = await sharp(SOURCE).extract({ left: 0, top: 70, width: 1586, height: 892 })
  .resize(1920, 1080, { kernel: "lanczos3" }).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
if (frame.length > 5 * 1024 * 1024) throw new Error(`Start frame is ${frame.length} bytes; the API limit is 5MB.`);
const promptImage = [{ uri: `data:image/jpeg;base64,${frame.toString("base64")}`, position: "first" }];

console.log(`Model ${MODEL} · ratio ${RATIO} · ${DURATION}s · start frame ${(frame.length / 1024).toFixed(0)} KB (from ${SOURCE})`);
console.log(`Output: ${OUTPUT}`);
console.log(`Prompt (${PROMPT.length} chars):\n  ${PROMPT}`);
console.log(`Estimated cost: ${ESTIMATED_CREDITS} credits (≈ $${(ESTIMATED_CREDITS / 100).toFixed(2)}).`);
if (!confirm) {
  console.log("Dry run only — nothing was submitted. Re-run with --confirm to start the paid generation.");
  process.exit(0);
}

const client = new RunwayML(); // reads RUNWAYML_API_SECRET from the environment
let task;
try {
  task = await client.imageToVideo
    .create({ model: MODEL, promptImage, promptText: PROMPT, ratio: RATIO, duration: DURATION })
    .waitForTaskOutput({ timeout: 15 * 60 * 1000 });
} catch (err) {
  if (err instanceof TaskFailedError) {
    console.error(`Generation failed (task ${err.taskDetails?.id ?? "unknown"}): ${err.taskDetails?.failure ?? err.message}`);
    console.error("Not resubmitting automatically. Inspect the task in the Developer Portal.");
  } else if (err instanceof TaskTimedOutError) {
    console.error(`Still running after 15 minutes (task ${err.taskDetails?.id ?? "unknown"}). Check it in the Developer Portal; not resubmitting.`);
  } else {
    console.error(err instanceof RunwayML.APIError ? `API error ${err.status}: ${err.message}` : err);
  }
  process.exit(1);
}

const url = task.output?.[0];
if (!url) throw new Error(`Task ${task.id} succeeded but returned no output URL.`);
const res = await fetch(url); // signed, temporary URL — download now
if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
const video = Buffer.from(await res.arrayBuffer());
// A real MP4 has an "ftyp" box at byte 4; refuse anything else rather than saving a broken file.
if (video.length < 50_000 || video.subarray(4, 8).toString("ascii") !== "ftyp") {
  throw new Error(`Task ${task.id}: output is not a valid MP4 (${video.length} bytes, content-type ${res.headers.get("content-type")}).`);
}
await mkdir("public/videos", { recursive: true });
await writeFile(OUTPUT, video);
console.log(`Saved ${OUTPUT} (${(video.length / 1024 / 1024).toFixed(1)} MB) from task ${task.id}.`);
