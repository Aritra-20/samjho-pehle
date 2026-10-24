import { formatINR, formatLevel, type OrderInput, type RiskResult } from "./optionRisk";

export type Lang = "en" | "hi";

export const FOLLOWUP_FALLBACK = "I can explain the risk of the order you entered.";

/** Every rupee figure the code produced or the user entered. */
export function allowedAmounts(input: OrderInput, r: RiskResult): number[] {
  return [r.maxLoss, r.maxProfit, r.breakEven, r.premiumTotal, input.strike, input.premium, input.lotSize].filter(
    (n): n is number => typeof n === "number",
  );
}

function maxLossLine(r: RiskResult, lang: Lang) {
  if (lang === "hi") {
    return r.maxLoss === null
      ? `अधिकतम नुकसान: ${r.maxLossText} (कोई ऊपरी सीमा नहीं)।`
      : `अधिकतम नुकसान: ${r.maxLossText}।`;
  }
  return `Maximum loss: ${r.maxLossText}.`;
}

export function buildTemplateExplanation(input: OrderInput, r: RiskResult, lang: Lang): string {
  const S = formatLevel(input.strike);
  const P = formatINR(input.premium);
  const T = formatINR(r.premiumTotal);
  const L = formatLevel(input.lotSize);
  const BE = r.breakEvenText;
  const call = input.optionType === "call";

  if (lang === "hi") {
    const kind = call ? "कॉल" : "पुट";
    if (input.action === "buy") {
      return [
        `आप स्ट्राइक ${S} पर एक ${kind} ऑप्शन खरीद रहे हैं, ${L} यूनिट के लिए प्रति यूनिट ${P}, यानी कुल ${T} चुका रहे हैं।`,
        `एक्सपायरी पर ब्रेक-ईवन इंडेक्स लेवल ${BE} है।`,
        `अगर एक्सपायरी पर इंडेक्स स्ट्राइक पर या उससे ${call ? "नीचे" : "ऊपर"} रहा, तो पूरा प्रीमियम डूब सकता है।`,
        maxLossLine(r, lang),
      ].join(" ");
    }
    return [
      `आप स्ट्राइक ${S} पर एक ${kind} ऑप्शन बेच रहे हैं और ${L} यूनिट के लिए प्रति यूनिट ${P}, यानी कुल ${T} पा रहे हैं। यही आपकी अधिकतम कमाई है।`,
      `एक्सपायरी पर ब्रेक-ईवन इंडेक्स लेवल ${BE} है।`,
      call
        ? `अगर इंडेक्स ब्रेक-ईवन से ऊपर गया, तो हर पॉइंट पर नुकसान बढ़ता है और इसकी कोई ऊपरी सीमा नहीं है।`
        : `अगर इंडेक्स ब्रेक-ईवन से नीचे गया, तो हर पॉइंट पर नुकसान बढ़ता है, नीचे दी गई सीमा तक।`,
      maxLossLine(r, lang),
    ].join(" ");
  }

  const kind = call ? "call" : "put";
  if (input.action === "buy") {
    return [
      `You are buying a ${kind} option at strike ${S}, paying ${P} per unit for ${L} units, which is ${T} in total.`,
      `Break-even at expiry is an index level of ${BE}.`,
      `If the index is at or ${call ? "below" : "above"} the strike at expiry, the whole premium you paid can be lost.`,
      maxLossLine(r, lang),
    ].join(" ");
  }
  return [
    `You are selling a ${kind} option at strike ${S} and receiving ${P} per unit for ${L} units, which is ${T} in total. That is the most this order can earn.`,
    `Break-even at expiry is an index level of ${BE}.`,
    call
      ? `If the index rises above the break-even, the loss grows with every point and has no upper limit.`
      : `If the index falls below the break-even, the loss grows with every point, up to the maximum below.`,
    maxLossLine(r, lang),
  ].join(" ");
}

const GLOSSARY: { match: RegExp; en: string; hi: string }[] = [
  {
    match: /\blots?\b|लॉट/i,
    en: "Lot size is the fixed number of units in one options contract. Your rupee figures are the per-unit premium multiplied by the lot size.",
    hi: "लॉट साइज़ एक ऑप्शन कॉन्ट्रैक्ट में यूनिट की तय संख्या है। रुपये के आंकड़े प्रति यूनिट प्रीमियम को लॉट साइज़ से गुणा करके बनते हैं।",
  },
  {
    match: /break[\s-]?even|ब्रेक/i,
    en: "Break-even is the index level at expiry where this order neither makes nor loses money. It is the strike plus the premium for a call, and the strike minus the premium for a put.",
    hi: "ब्रेक-ईवन वह इंडेक्स लेवल है जहाँ एक्सपायरी पर इस ऑर्डर में न फ़ायदा होता है न नुकसान। कॉल के लिए यह स्ट्राइक जमा प्रीमियम है, और पुट के लिए स्ट्राइक घटा प्रीमियम।",
  },
  {
    match: /premium|प्रीमियम/i,
    en: "The premium is the price of the option per unit. A buyer pays it upfront and a seller receives it.",
    hi: "प्रीमियम ऑप्शन की प्रति यूनिट कीमत है। खरीदार इसे पहले चुकाता है और बेचने वाला इसे पाता है।",
  },
  {
    match: /strike|स्ट्राइक/i,
    en: "The strike is the index level written into the option contract. Profit and loss at expiry are measured from it.",
    hi: "स्ट्राइक वह इंडेक्स लेवल है जो ऑप्शन कॉन्ट्रैक्ट में तय होता है। एक्सपायरी पर फ़ायदा और नुकसान इसी से मापा जाता है।",
  },
  {
    match: /\bcalls?\b|कॉल/i,
    en: "A call option gains value when the index rises above the strike.",
    hi: "कॉल ऑप्शन की कीमत तब बढ़ती है जब इंडेक्स स्ट्राइक से ऊपर जाता है।",
  },
  {
    match: /\bputs?\b|पुट/i,
    en: "A put option gains value when the index falls below the strike.",
    hi: "पुट ऑप्शन की कीमत तब बढ़ती है जब इंडेक्स स्ट्राइक से नीचे जाता है।",
  },
  {
    match: /\bbuy(ing|er)?\b|खरीद/i,
    en: "Buying an option means paying the premium upfront. A buyer can lose at most the premium paid.",
    hi: "ऑप्शन खरीदने का मतलब है प्रीमियम पहले चुकाना। खरीदार का नुकसान चुकाए गए प्रीमियम तक सीमित रहता है।",
  },
  {
    match: /\bsell(ing|er)?\b|बेच/i,
    en: "Selling an option means receiving the premium upfront and taking on the risk if the index moves against the order.",
    hi: "ऑप्शन बेचने का मतलब है प्रीमियम पहले पाना और इंडेक्स उल्टी दिशा में जाने पर जोखिम उठाना।",
  },
];

export function templateFollowUp(question: string, r: RiskResult, lang: Lang): string {
  const hit = GLOSSARY.find((g) => g.match.test(question));
  const body = hit ? hit[lang] : FOLLOWUP_FALLBACK;
  return `${body} ${maxLossLine(r, lang)}`;
}
