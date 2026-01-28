/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Translate English MDX lessons into a target locale (default: "my" for Burmese)
 * using Google Cloud Translate v2.
 *
 * Usage:
 *   GOOGLE_TRANSLATE_API_KEY=... node scripts/translate-lessons.cjs my
 *
 * Notes:
 * - This script is intended to run on the server/CLI (not in the browser).
 * - It will skip files that already have a locale suffix (e.g., *.my.mdx).
 * - It generates sibling files with ".<locale>.mdx".
 */

const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const TARGET_LOCALE = (process.argv[2] || "my").toLowerCase();
const lessonsDir = path.join(__dirname, "..", "src", "content", "lessons");

if (!API_KEY) {
  console.error("GOOGLE_TRANSLATE_API_KEY is not set. Set it in env and re-run.");
  process.exit(1);
}

async function translateText(text, target, source) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(API_KEY)}`;
  const body = {
    q: text,
    target,
    format: "text",
  };
  if (source) body.source = source;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Translate failed (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  const translated = json?.data?.translations?.[0]?.translatedText;
  if (!translated) throw new Error("Translate response missing text");
  return translated;
}

function collectMdxFiles(dir = lessonsDir) {
  const entries = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      entries.push(...collectMdxFiles(full));
    } else if (item.isFile() && item.name.endsWith(".mdx") && !item.name.match(`\\.${TARGET_LOCALE}\\.mdx$`)) {
      entries.push(full);
    }
  }
  return entries;
}

function parseMeta(source, fallbackSlug) {
  const match = source.match(/export\s+const\s+meta\s*=\s*({[\s\S]*?})\s*;/);
  if (!match) return null;
  try {
    const meta = new Function(`return (${match[1]});`)();
    return {
      ...meta,
      slug: meta?.slug || fallbackSlug,
    };
  } catch (err) {
    console.warn(`Could not parse meta for ${fallbackSlug}:`, err);
    return null;
  }
}

function splitContent(source) {
  const metaMatch = source.match(/export\s+const\s+meta\s*=\s*{[\s\S]*?};\s*/);
  if (!metaMatch) return { metaBlock: "", body: source.trimStart() };
  const metaBlock = metaMatch[0];
  const body = source.slice(metaMatch.index + metaBlock.length).trimStart();
  return { metaBlock, body };
}

async function processFile(filePath) {
  const baseName = path.basename(filePath);
  const match = baseName.match(/^(?<slug>.+?)(?:\.(?<locale>[a-z]{2}))?\.mdx$/i);
  const slug = match?.groups?.slug ?? baseName.replace(/\.mdx$/, "");
  const sourceLocale = match?.groups?.locale?.toLowerCase() || "en";
  if (sourceLocale !== "en") return; // only translate from English base

  const targetPath = filePath.replace(/\.mdx$/, `.${TARGET_LOCALE}.mdx`);
  if (fs.existsSync(targetPath)) {
    console.log(`Skipping ${baseName} → ${path.basename(targetPath)} (exists)`);
    return;
  }

  const source = fs.readFileSync(filePath, "utf8");
  const meta = parseMeta(source, slug);
  const { body } = splitContent(source);

  if (!meta) {
    console.warn(`No meta for ${filePath}, skipping`);
    return;
  }

  console.log(`Translating ${baseName} → ${path.basename(targetPath)} ...`);

  const [title, description, translatedBody] = await Promise.all([
    translateText(meta.title || slug, TARGET_LOCALE, sourceLocale),
    translateText(meta.description || "", TARGET_LOCALE, sourceLocale),
    translateText(body, TARGET_LOCALE, sourceLocale),
  ]);

  const translatedMeta = {
    ...meta,
    title,
    description,
  };

  const output = `export const meta = ${JSON.stringify(translatedMeta, null, 2)};\n\n${translatedBody}\n`;
  fs.writeFileSync(targetPath, output, "utf8");
}

(async function main() {
  const files = collectMdxFiles();
  for (const file of files) {
    try {
      await processFile(file);
    } catch (err) {
      console.error(`Failed to translate ${file}:`, err);
    }
  }
})();
