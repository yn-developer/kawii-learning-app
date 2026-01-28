/**
 * Google Cloud Translate helper (v2 REST).
 *
 * Requires env `GOOGLE_TRANSLATE_API_KEY`.
 * Intended for server-side use only.
 */

const TRANSLATE_ENDPOINT = "https://translation.googleapis.com/language/translate/v2";

type TranslateOptions = {
  text: string;
  target: string;
  source?: string;
  format?: "text" | "html";
};

type GoogleTranslateResponse = {
  data?: {
    translations?: Array<{ translatedText: string; detectedSourceLanguage?: string }>;
  };
  error?: { message?: string };
};

export async function translateText({
  text,
  target,
  source,
  format = "text",
}: TranslateOptions): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_TRANSLATE_API_KEY is not set");
  }

  const url = `${TRANSLATE_ENDPOINT}?key=${encodeURIComponent(apiKey)}`;

  const body = {
    q: text,
    target,
    format,
    ...(source ? { source } : {}),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    // This is intended for server-side use only.
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Translate request failed (${res.status}): ${errorText}`);
  }

  const json = (await res.json()) as GoogleTranslateResponse;
  const translated = json.data?.translations?.[0]?.translatedText;
  if (!translated) {
    throw new Error(json.error?.message || "Translate response missing text");
  }

  return translated;
}
