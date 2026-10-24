// Pure guard functions. Nothing here stores, sends or logs user text.

export const PERSONAL_REFUSAL = "Please don't share personal details here. I can't accept them.";
export const ADVICE_REFUSAL =
  "I can't give advice or predict prices. I can explain the risk of the order you entered.";

const PERSONAL_PATTERNS: RegExp[] = [
  /\b[A-Z]{5}[0-9]{4}[A-Z]\b/i, // PAN
  /\b\d{4}\s?\d{4}\s?\d{4}\b/, // Aadhaar-like
  /(?:\+91[\s-]?|\b0)?\b[6-9]\d{9}\b/, // Indian mobile
  /\d{9,}/, // account-number-like digit runs
];

export function containsPersonalData(text: string): boolean {
  return PERSONAL_PATTERNS.some((p) => p.test(text));
}

const ADVICE_PATTERNS: RegExp[] = [
  /\bshould\s+i\s+(buy|sell|hold|exit|enter)\b/i,
  /\bwhich\s+(strike|expiry)\b/i,
  /\bwill\s+(the\s+)?(nifty|bank\s?nifty|sensex|market|index|it|price)\s+(go|move)?\s*(up|down|rise|fall)\b/i,
  /\btarget\b/i,
  /\btips?\b/i,
  /\bguarantee(d)?\b/i,
  /\bbest\s+(option|strike|call|put)\s+to\s+buy\b/i,
  /\bwhat\s+is\s+the\s+best\s+(option|strike)\b/i,
  /\bwhich\s+.*\bis\s+best\b/i,
  /\bkharid(u|un|oon|na)\b/i,
  /\bbech(u|un|oon|na)\b/i,
  /\ble(na|ni)\s+chahiye\b/i,
  /\bkya\s+badhega\b/i,
  /\btip\s+do\b/i,
  /खरीदूं|बेचूं|लेना चाहिए|बढ़ेगा|टिप/,
];

const OUTPUT_EXTRA_PATTERNS: RegExp[] = [
  /\bi\s+recommend\b/i,
  /\byou\s+should\s+(buy|sell|hold)\b/i,
  /\bwill\s+go\s+(up|down)\b/i,
];

export function isAdviceOrPrediction(text: string): boolean {
  return ADVICE_PATTERNS.some((p) => p.test(text));
}

export type InputGuardResult =
  | { ok: true }
  | { ok: false; kind: "personal" | "advice"; message: string };

export function checkInput(text: string): InputGuardResult {
  if (containsPersonalData(text)) return { ok: false, kind: "personal", message: PERSONAL_REFUSAL };
  if (isAdviceOrPrediction(text)) return { ok: false, kind: "advice", message: ADVICE_REFUSAL };
  return { ok: true };
}

const AMOUNT_RE =
  /(?:₹|रु\.?|\bRs\.?|\bINR)\s*([\d,]+(?:\.\d+)?)|([\d,]+(?:\.\d+)?)\s*(?:रुपये|rupees|INR|\/-)/gi;

export function extractRupeeAmounts(text: string): number[] {
  const out: number[] = [];
  for (const m of text.matchAll(AMOUNT_RE)) {
    const raw = (m[1] ?? m[2] ?? "").replace(/,/g, "");
    const n = Number(raw);
    if (raw && Number.isFinite(n)) out.push(n);
  }
  return out;
}

// Catches amounts written without a currency sign: any bare number of 1,000 or more,
// and any number followed by lakh / crore / thousand (so "1.5 lakh" cannot slip through).
const NUMBER_RE = /(\d[\d,]*(?:\.\d+)?)(\s*(?:lakhs?|crores?|thousand|लाख|करोड़|हज़ार|हजार))?/gi;

export function extractLargeNumbers(text: string): number[] {
  const out: number[] = [];
  for (const m of text.matchAll(NUMBER_RE)) {
    const raw = m[1];
    if (!raw) continue;
    const n = Number(raw.replace(/,/g, ""));
    if (Number.isFinite(n) && (n >= 1000 || m[2])) out.push(n);
  }
  return out;
}

export interface OutputGuardContext {
  maxLossText: string;
  allowedAmounts: number[];
}

export interface OutputGuardResult {
  ok: boolean;
  reasons: string[];
}

export function checkOutput(text: string, ctx: OutputGuardContext): OutputGuardResult {
  const reasons: string[] = [];
  if (!text || !text.includes(ctx.maxLossText)) reasons.push("missing exact max-loss text");
  const bad = [...extractRupeeAmounts(text), ...extractLargeNumbers(text)].filter(
    (a) => !ctx.allowedAmounts.some((v) => Math.abs(v - a) < 0.01),
  );
  if (bad.length) reasons.push(`rupee figure not from code: ${bad.join(", ")}`);
  if (isAdviceOrPrediction(text) || OUTPUT_EXTRA_PATTERNS.some((p) => p.test(text)))
    reasons.push("advice or prediction wording");
  if (containsPersonalData(text)) reasons.push("personal-data-shaped text");
  return { ok: reasons.length === 0, reasons };
}
