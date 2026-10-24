// Server-only: asks a language model to put the code-computed numbers into words.
// No SDK, just fetch. If no key is configured this returns null and the app uses its template mode.
//
// Keys are read from environment variables on the server only:
//   ANTHROPIC_API_KEY  -> Claude (Messages API)
//   LOVABLE_API_KEY    -> Lovable AI gateway (set automatically inside Lovable Cloud)

const TIMEOUT_MS = 20_000;

export function hasAiKey(): boolean {
  return Boolean(process.env["ANTHROPIC_API_KEY"] || process.env["LOVABLE_API_KEY"]);
}

async function withTimeout(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

/** Returns the model's text, or null when no key is configured. Throws on a failed call. */
export async function generateText(instructions: string, prompt: string): Promise<string | null> {
  const anthropicKey = process.env["ANTHROPIC_API_KEY"];
  if (anthropicKey) {
    const res = await withTimeout("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env["ANTHROPIC_MODEL"] ?? "claude-sonnet-5-5",
        max_tokens: 400,
        system: instructions,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
    const json = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = (json.content ?? []).map((b) => (b.type === "text" ? (b.text ?? "") : "")).join("").trim();
    return text || null;
  }

  const lovableKey = process.env["LOVABLE_API_KEY"];
  if (lovableKey) {
    const res = await withTimeout("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${lovableKey}` },
      body: JSON.stringify({
        model: process.env["LOVABLE_AI_MODEL"] ?? "google/gemini-2.5-flash",
        max_tokens: 400,
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Lovable AI gateway ${res.status}`);
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return json.choices?.[0]?.message?.content?.trim() || null;
  }

  return null;
}
