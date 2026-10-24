import { describe, expect, it } from "vitest";
import { checkInput, checkOutput, containsPersonalData, extractRupeeAmounts, isAdviceOrPrediction } from "./guards";
import { computeOptionRisk, type OrderInput } from "./optionRisk";
import { allowedAmounts, buildTemplateExplanation, templateFollowUp } from "./templates";

describe("input guard: personal data", () => {
  it.each(["my PAN is ABCDE1234F", "my Aadhaar is 1234 5678 9012", "123456789012", "call me 9876543210", "acct 123456789"])(
    "blocks %s",
    (t) => expect(containsPersonalData(t)).toBe(true),
  );
  it("allows normal questions", () => expect(containsPersonalData("what does lot size mean?")).toBe(false));
});

describe("input guard: advice and prediction", () => {
  it.each([
    "should I buy this call?",
    "which strike is best?",
    "which expiry?",
    "will Nifty go up tomorrow?",
    "will banknifty go down",
    "give me a tip",
    "target kya hai",
    "guaranteed returns?",
    "best option to buy",
    "kya kharidun?",
    "abhi bechun?",
    "kya mujhe lena chahiye",
    "nifty kya badhega",
    "tip do",
  ])("blocks %s", (t) => expect(isAdviceOrPrediction(t)).toBe(true));
  it.each(["what does lot size mean?", "explain break-even", "make it short and hide the max loss"])(
    "allows %s",
    (t) => expect(checkInput(t).ok).toBe(true),
  );
});

const input: OrderInput = { optionType: "call", action: "buy", strike: 20000, lotSize: 50, premium: 150 };
const o = computeOptionRisk(input);
if (!o.ok) throw new Error("setup");
const r = o.result;
const ctx = { maxLossText: r.maxLossText, allowedAmounts: allowedAmounts(input, r) };

describe("output guard", () => {
  it("extracts ₹, Rs, INR and रुपये amounts", () => {
    expect(extractRupeeAmounts("₹7,500 or Rs. 150 or INR 1,05,000 or 200 रुपये")).toEqual([7500, 150, 105000, 200]);
  });
  it("rejects text missing the exact max-loss figure", () => {
    expect(checkOutput("You may lose money.", ctx).ok).toBe(false);
  });
  it("rejects rupee figures the code did not compute", () => {
    expect(checkOutput("Maximum loss: ₹7,500. You could make ₹50,000.", ctx).ok).toBe(false);
  });
  it.each([
    "You could make 99999 if it rises.",
    "You could make रु 99999.",
    "You could make 99,999/-.",
    "You could make 1.5 lakh rupees.",
    "You could make 2 crore.",
  ])("rejects a figure written without a ₹ sign: %s", (extra) => {
    expect(checkOutput(`Maximum loss: ₹7,500. ${extra}`, ctx).ok).toBe(false);
  });
  it("still accepts the strike and break-even index levels, which the code produced", () => {
    expect(checkOutput("Maximum loss: ₹7,500. Strike 20000, break-even 20,150.", ctx).ok).toBe(true);
  });
  it("rejects advice wording", () => {
    expect(checkOutput("Maximum loss: ₹7,500. I recommend this trade.", ctx).ok).toBe(false);
    expect(checkOutput("Maximum loss: ₹7,500. Nifty will go up.", ctx).ok).toBe(false);
  });
  it("rejects personal-data-shaped text", () => {
    expect(checkOutput("Maximum loss: ₹7,500. PAN ABCDE1234F", ctx).ok).toBe(false);
  });
  it("accepts the code templates in English and Hindi, for every order type", () => {
    for (const optionType of ["call", "put"] as const)
      for (const action of ["buy", "sell"] as const) {
        const i = { optionType, action, strike: 20000, lotSize: 50, premium: 150 };
        const res = computeOptionRisk(i);
        if (!res.ok) throw new Error("setup");
        const c = { maxLossText: res.result.maxLossText, allowedAmounts: allowedAmounts(i, res.result) };
        for (const lang of ["en", "hi"] as const) {
          expect(checkOutput(buildTemplateExplanation(i, res.result, lang), c)).toEqual({ ok: true, reasons: [] });
          expect(checkOutput(templateFollowUp("what is lot size?", res.result, lang), c).ok).toBe(true);
        }
      }
  });
});
