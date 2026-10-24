// Client-side orchestration: guards first, model second, template always ready.
import type { OrderInput, RiskResult } from "./optionRisk";
import { checkInput, checkOutput } from "./guards";
import { allowedAmounts, buildTemplateExplanation, templateFollowUp, type Lang } from "./templates";
import type { AiReply } from "./explain.functions";

export type AskModel = (req: {
  kind: "explain" | "followup";
  lang: Lang;
  input: OrderInput;
  question?: string;
}) => Promise<AiReply>;

export interface Explanation {
  text: string;
  source: "ai" | "template";
}

export async function getExplanation(
  ask: AskModel,
  input: OrderInput,
  r: RiskResult,
  lang: Lang,
): Promise<Explanation> {
  try {
    const reply = await ask({ kind: "explain", lang, input });
    if (reply.text) {
      const g = checkOutput(reply.text, { maxLossText: r.maxLossText, allowedAmounts: allowedAmounts(input, r) });
      if (g.ok) return { text: reply.text, source: "ai" };
      console.warn("AI explanation discarded by output guard:", g.reasons.join("; "));
    } else if (reply.reason !== "no-key") {
      console.warn("AI explanation unavailable:", reply.reason);
    }
  } catch (e) {
    console.warn("AI explanation call failed", e instanceof Error ? e.message : e);
  }
  return { text: buildTemplateExplanation(input, r, lang), source: "template" };
}

export interface FollowUpOutcome {
  kind: "refused-personal" | "refused-advice" | "answered";
  text: string;
  source: "guard" | "ai" | "template";
}

export async function answerFollowUp(
  ask: AskModel,
  question: string,
  input: OrderInput,
  r: RiskResult,
  lang: Lang,
): Promise<FollowUpOutcome> {
  const gate = checkInput(question);
  if (!gate.ok) {
    // The blocked text is never sent, stored or logged.
    return {
      kind: gate.kind === "personal" ? "refused-personal" : "refused-advice",
      text: gate.message,
      source: "guard",
    };
  }
  try {
    const reply = await ask({ kind: "followup", lang, input, question });
    if (reply.text) {
      const g = checkOutput(reply.text, { maxLossText: r.maxLossText, allowedAmounts: allowedAmounts(input, r) });
      if (g.ok) return { kind: "answered", text: reply.text, source: "ai" };
      console.warn("AI follow-up discarded by output guard:", g.reasons.join("; "));
    }
  } catch (e) {
    console.warn("AI follow-up call failed", e instanceof Error ? e.message : e);
  }
  return { kind: "answered", text: templateFollowUp(question, r, lang), source: "template" };
}
