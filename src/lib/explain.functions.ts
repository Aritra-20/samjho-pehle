import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { computeOptionRisk } from "./optionRisk";
import { checkInput } from "./guards";
import { generateText, hasAiKey } from "./ai.server";

const schema = z.object({
  kind: z.enum(["explain", "followup"]),
  lang: z.enum(["en", "hi"]),
  input: z.object({
    optionType: z.enum(["call", "put"]),
    action: z.enum(["buy", "sell"]),
    strike: z.number(),
    lotSize: z.number(),
    premium: z.number(),
  }),
  question: z.string().max(500).optional(),
});

export type AiReply = { text: string | null; reason: "ok" | "no-key" | "blocked" | "bad-input" | "error" };

export const askRiskExplainer = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof schema>) => schema.parse(d))
  .handler(async ({ data }): Promise<AiReply> => {
    // Numbers are recomputed here so the model only ever sees code-made figures.
    const outcome = computeOptionRisk(data.input);
    if (!outcome.ok) return { text: null, reason: "bad-input" };
    if (data.question && !checkInput(data.question).ok) return { text: null, reason: "blocked" };
    if (!hasAiKey()) return { text: null, reason: "no-key" };

    const r = outcome.result;
    const language = data.lang === "hi" ? "Hindi" : "English";
    const instructions =
      `You explain the risk of one options order in simple ${language} to a first-time trader in India, in 3 to 4 short sentences. ` +
      "Use only the numbers you are given. Never give buy, sell or hold advice, never suggest a strike or expiry, never predict prices or returns, never ask for personal data, never invent any rupee figure. " +
      "Always state the maximum loss exactly as given. If asked for advice or a prediction, say you can only explain the risk of the order you entered. " +
      'If the question is not about this order (tax, another stock, the news), do not guess: reply "I can explain the risk of the order you entered." and then state the maximum loss. ' +
      `Copy the maximum-loss text character for character: "${r.maxLossText}". Write break-even and strike as index levels without a rupee sign.`;

    const facts = [
      `Order: ${data.input.action} ${data.input.optionType} option.`,
      `Strike (index level): ${data.input.strike}.`,
      `Premium per unit: ₹${data.input.premium}. Lot size: ${data.input.lotSize} units. Total premium: ₹${r.premiumTotal}.`,
      `Maximum loss: ${r.maxLossText}.`,
      `Maximum profit: ${r.maxProfitText}.`,
      `Break-even (index level at expiry): ${r.breakEvenText}.`,
    ].join("\n");

    const prompt =
      data.kind === "explain"
        ? `${facts}\n\nExplain the risk of this order.`
        : `${facts}\n\nThe user asks about this order: "${data.question}"\nAnswer in 2 to 3 sentences, and end with the maximum loss exactly as given.`;

    try {
      const text = await generateText(instructions, prompt);
      return text ? { text, reason: "ok" } : { text: null, reason: "error" };
    } catch (e) {
      console.warn("AI call failed", e instanceof Error ? e.message : e);
      return { text: null, reason: "error" };
    }
  });
