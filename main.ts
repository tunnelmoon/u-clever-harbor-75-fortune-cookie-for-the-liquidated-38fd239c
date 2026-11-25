// Fortune Cookie for the Liquidated Trader
// Entry: a fortune cookie line for a crypto trader who just got liquidated.
// The cookie opens with the classic lucky-numbers formula, then breaks it
// with the one number that matters to the trader, and lands on a small,
// rueful note of hope instead of a lecture.
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Your lucky numbers are 3, 7, and 42. None of them is your liquidation price, which is a start.";

const MAX_CHARS = 160;
const MAX_WORDS = 20;

function fail(message: string): never {
  throw new Error(message);
}

if (LINE.length < 1 || LINE.length > MAX_CHARS) {
  fail(`line must be 1 to ${MAX_CHARS} characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("line must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be a single line");
}
if (LINE !== LINE.trim()) {
  fail("line must not start or end with whitespace");
}
const wordCount = LINE.trim().split(/\s+/).length;
if (wordCount > MAX_WORDS) {
  fail(`line must be at most ${MAX_WORDS} words, got ${wordCount}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LINE) {
  fail("round-trip read-back does not match the line");
}
if (statSync(outPath).size !== Buffer.byteLength(LINE, "utf8")) {
  fail("written file byte size does not match the line");
}
console.log(`wrote ${outPath} (${LINE.length} chars, ${wordCount} words)`);
