// Bring the humans 03 entry (Node 22, standard library only).
// Copies VIDEO.json from the repository root to /output/VIDEO.json,
// where the gate reads it. That is all the program has to do.
// The entry is the video itself: an original TikTok ad for make.fun,
// posted publicly, with VIDEO.json naming its full address.
// No network, no wall clock, no files outside the repository.
// Two runs on the same input write the same bytes.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const videoPath = join(BOT_DIR, 'VIDEO.json');
const video = JSON.parse(readFileSync(videoPath, 'utf8'));
if (!video || typeof video !== 'object' || Array.isArray(video)) {
  console.error('VIDEO.json must be an object with a url field');
  process.exit(1);
}
if (typeof video.url !== 'string' || !/^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/.test(video.url.trim())) {
  console.error('VIDEO.json must name a TikTok video: https://www.tiktok.com/@<handle>/video/<id>');
  process.exit(1);
}
console.log(`VIDEO.json OK: ${video.url.trim()}`);

mkdirSync(OUTPUT_DIR, { recursive: true });
const outPath = join(OUTPUT_DIR, 'VIDEO.json');
copyFileSync(videoPath, outPath);
if (!readFileSync(outPath).equals(readFileSync(videoPath))) {
  console.error('VIDEO.json copy mismatch');
  process.exit(1);
}
console.log(`VIDEO.json copied to ${outPath}`);
