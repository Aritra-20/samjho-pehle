// Verbatim: the master brief for the review-and-improve pass (24 Oct 2026), written in CRISP order.
export const REVIEW_BRIEF = [
  {
    letter: "C",
    label: "Context",
    text: `I'm Aritra Pal, a PGPM student at Great Lakes Institute of Management, submitting
Milestone 1 of "AI for Product Managers" (30% weight, individual, due Sat 24 Oct 2026,
23:59 IST). The deliverable is one live site link. The rubric (100 marks):
- Live, navigable site, visibly built with AI, build thread linked (15)
- Positioning statement naming one of three AI PM roles (15)
- Problem-framing memo: real problem, false problems, unknowns; one page, no charts (25)
- AI-worthiness argument and behaviour spec: intended, refusal and failure behaviour,
  "never list" written first (25)
- Prototype v0 that runs and respects its own never list (20)
Rules: no real customer data; invented data presented as real is misconduct.

The site is "Samjho Pehle", a pre-order options-risk explainer for first-time Indian
options traders. Code computes max loss, break-even and max profit; AI only explains
them in English or Hindi. Live: https://samjho-pehle.vercel.app
Repo: https://github.com/Aritra-20/samjho-pehle (TanStack Start, deployed on Vercel).
HOW IT WAS BUILT (be accurate about this): first draft in Lovable, then fixed, tested
and deployed with Claude. This chat is a review and improvement pass, not the original build.`,
  },
  {
    letter: "R",
    label: "Role",
    text: `Act as a strict course grader first, then as a senior PM coach for Indian consumer
fintech. Plain English, no PM jargon, ₹ and lakh/crore, mark every assumption as
[ASSUMPTION], never invent metrics.`,
  },
  {
    letter: "I",
    label: "Intent",
    text: `1. Audit the live site and repo against each rubric line. Score each out of its marks
   and quote the evidence you used.
2. List the top 5 gaps, ranked by marks at risk.
3. For each gap, propose the smallest fix and make it (edit files, run the tests with
   npm test, confirm the build passes).
4. Check the problem memo fits one printed page with no charts.
5. Check every claim and number on the site has a source or is marked [ASSUMPTION],
   and that every prototype number is labelled synthetic.`,
  },
  {
    letter: "S",
    label: "Specifics",
    text: `Read the repo and the live pages: /, /problem-memo, /behaviour-spec, /prototype.
Never ask me for, or paste, API keys, passwords or personal data.`,
  },
  {
    letter: "P",
    label: "Parameters",
    text: `- Do not change the product idea or the never list unless you find a contradiction.
- Don't add features. Fix gaps only.
- Show a before/after for every change, and finish with a rubric table of the
  final scores and what is still open.
- Be honest about anything you could not verify.`,
  },
] as const;
