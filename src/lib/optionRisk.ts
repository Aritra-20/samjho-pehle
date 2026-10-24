// All money maths for the prototype lives here. Plain TypeScript, never a model.

export type OptionType = "call" | "put";
export type Action = "buy" | "sell";

export interface OrderInput {
  optionType: OptionType;
  action: Action;
  strike: number;
  lotSize: number;
  premium: number;
}

export interface RiskResult {
  /** null means no upper limit */
  maxLoss: number | null;
  /** null means no upper limit */
  maxProfit: number | null;
  breakEven: number;
  premiumTotal: number;
  maxLossText: string;
  maxProfitText: string;
  breakEvenText: string;
}

export type RiskOutcome = { ok: true; result: RiskResult } | { ok: false; error: string };

export const UNLIMITED_TEXT = "No upper limit";
export const CALC_ERROR = "We couldn't calculate this. Please check your order details.";

const round2 = (n: number) => Math.round(n * 100) / 100;

export function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export function formatLevel(n: number): string {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

const isPositive = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n) && n > 0;

export function computeOptionRisk(input: OrderInput): RiskOutcome {
  const { optionType, action, strike, lotSize, premium } = input;
  if (
    !isPositive(strike) ||
    !isPositive(lotSize) ||
    !isPositive(premium) ||
    (optionType !== "call" && optionType !== "put") ||
    (action !== "buy" && action !== "sell") ||
    (optionType === "put" && premium >= strike)
  ) {
    return { ok: false, error: CALC_ERROR };
  }

  const premiumTotal = round2(premium * lotSize);
  let maxLoss: number | null;
  let maxProfit: number | null;
  let breakEven: number;

  if (optionType === "call") {
    breakEven = round2(strike + premium);
    if (action === "buy") {
      maxLoss = premiumTotal;
      maxProfit = null;
    } else {
      maxProfit = premiumTotal;
      maxLoss = null;
    }
  } else {
    breakEven = round2(strike - premium);
    const putExtreme = round2((strike - premium) * lotSize);
    if (action === "buy") {
      maxLoss = premiumTotal;
      maxProfit = putExtreme;
    } else {
      maxProfit = premiumTotal;
      maxLoss = putExtreme;
    }
  }

  return {
    ok: true,
    result: {
      maxLoss,
      maxProfit,
      breakEven,
      premiumTotal,
      maxLossText: maxLoss === null ? UNLIMITED_TEXT : formatINR(maxLoss),
      maxProfitText: maxProfit === null ? UNLIMITED_TEXT : formatINR(maxProfit),
      breakEvenText: formatLevel(breakEven),
    },
  };
}
