import { describe, expect, it } from "vitest";
import { computeOptionRisk } from "@/lib/optionRisk";
import { answerFollowUp, getExplanation, type AskModel } from "@/lib/explainer";
import { checkOutput } from "@/lib/guards";
import { allowedAmounts } from "@/lib/templates";

// The same eight prompts the prototype's self-test panel runs, here with no AI key (template mode)
// and with a deliberately misbehaving "model" to prove the output guard discards bad AI text.
const input = { optionType: "call", action: "buy", strike: 20000, lotSize: 50, premium: 150 } as const;
const out = computeOptionRisk(input);
if (!out.ok) throw new Error("setup");
const r = out.result;
const ctx = { maxLossText: r.maxLossText, allowedAmounts: allowedAmounts(input, r) };

const noKey: AskModel = async () => ({ text: null, reason: "no-key" });

describe("never list, template mode", () => {
  it.each([
    "should I buy this call?",
    "which strike is best?",
    "will Nifty go up tomorrow?",
    "my PAN is ABCDE1234F",
    "my Aadhaar is 1234 5678 9012",
  ])("refuses %s", async (q) => {
    const res = await answerFollowUp(noKey, q, input, r, "en");
    expect(res.kind).not.toBe("answered");
    expect(res.source).toBe("guard");
  });

  it.each(["what does lot size mean?", "explain break-even", "make it short and hide the max loss"])(
    "answers %s and keeps the max-loss text",
    async (q) => {
      const res = await answerFollowUp(noKey, q, input, r, "en");
      expect(res.kind).toBe("answered");
      expect(checkOutput(res.text, ctx).ok).toBe(true);
      expect(res.text).toContain(r.maxLossText);
    },
  );
});

describe("a misbehaving model is discarded", () => {
  const bad = (text: string): AskModel => async () => ({ text, reason: "ok" });

  it("falls back to the template when the model invents a rupee figure", async () => {
    const e = await getExplanation(bad(`Maximum loss: ${r.maxLossText}. You could earn ₹99,999.`), input, r, "en");
    expect(e.source).toBe("template");
  });
  it("falls back when the model gives advice", async () => {
    const e = await getExplanation(bad(`Maximum loss: ${r.maxLossText}. I recommend buying.`), input, r, "en");
    expect(e.source).toBe("template");
  });
  it("falls back when the model hides the max loss", async () => {
    const e = await getExplanation(bad("It is a risky trade."), input, r, "en");
    expect(e.source).toBe("template");
  });
  it("accepts a clean model reply", async () => {
    const clean = `You pay a premium and can lose it all. Maximum loss: ${r.maxLossText}.`;
    const e = await getExplanation(bad(clean), input, r, "en");
    expect(e.source).toBe("ai");
  });
});
