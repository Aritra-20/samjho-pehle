import { describe, expect, it } from "vitest";
import { CALC_ERROR, computeOptionRisk, formatINR, UNLIMITED_TEXT } from "./optionRisk";

const ok = (o: ReturnType<typeof computeOptionRisk>) => {
  if (!o.ok) throw new Error("expected ok");
  return o.result;
};

describe("computeOptionRisk", () => {
  it("buy call: max loss = premium x lot, unlimited profit, BE = strike + premium", () => {
    const r = ok(computeOptionRisk({ optionType: "call", action: "buy", strike: 20000, lotSize: 50, premium: 150 }));
    expect(r.maxLoss).toBe(7500);
    expect(r.maxProfit).toBeNull();
    expect(r.maxProfitText).toBe(UNLIMITED_TEXT);
    expect(r.breakEven).toBe(20150);
  });
  it("buy put: max profit = (strike - premium) x lot, BE = strike - premium", () => {
    const r = ok(computeOptionRisk({ optionType: "put", action: "buy", strike: 1000, lotSize: 10, premium: 50 }));
    expect(r.maxLoss).toBe(500);
    expect(r.maxProfit).toBe(9500);
    expect(r.breakEven).toBe(950);
  });
  it("sell call: max profit = premium x lot, unlimited loss", () => {
    const r = ok(computeOptionRisk({ optionType: "call", action: "sell", strike: 20000, lotSize: 50, premium: 150 }));
    expect(r.maxProfit).toBe(7500);
    expect(r.maxLoss).toBeNull();
    expect(r.maxLossText).toBe(UNLIMITED_TEXT);
    expect(r.breakEven).toBe(20150);
  });
  it("sell put: max loss = (strike - premium) x lot", () => {
    const r = ok(computeOptionRisk({ optionType: "put", action: "sell", strike: 1000, lotSize: 10, premium: 50 }));
    expect(r.maxProfit).toBe(500);
    expect(r.maxLoss).toBe(9500);
    expect(r.breakEven).toBe(950);
  });
  it("rejects zero, negative, non-finite inputs and put premium >= strike", () => {
    const base = { optionType: "call" as const, action: "buy" as const, strike: 100, lotSize: 10, premium: 5 };
    for (const bad of [{ strike: 0 }, { lotSize: -1 }, { premium: Number.NaN }, { strike: Infinity }]) {
      expect(computeOptionRisk({ ...base, ...bad })).toEqual({ ok: false, error: CALC_ERROR });
    }
    expect(computeOptionRisk({ ...base, optionType: "put", premium: 100 }).ok).toBe(false);
  });
  it("formats rupees Indian style", () => {
    expect(formatINR(105000)).toBe("₹1,05,000");
  });
});
