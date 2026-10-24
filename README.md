# Samjho Pehle

A pre-order risk explainer for first-time options traders on Indian broking apps. One AI feature for one real problem, built for the AI for Product Managers course (Great Lakes PGPM, Milestone 1).

Code decides the numbers (max loss, break-even, max profit). AI only explains them, in English or Hindi. The never list is written first and enforced by input and output guards.

## Pages
- `/` positioning statement (AI PM role: AI features at an established company), build thread link
- `/problem-memo` real problem, false problems, unknowns
- `/behaviour-spec` never list, AI-worthiness argument, intended / refusal / failure behaviour
- `/prototype` working v0 with a runtime self-test against the never list

## Run
```
npm install --legacy-peer-deps
npm run dev
npm test
```

## AI configuration (optional)
With no key the app runs fully in template mode (a deterministic explanation written by code). To turn on AI explanations set one of these on the server:
- `ANTHROPIC_API_KEY` (optional `ANTHROPIC_MODEL`)
- `GEMINI_API_KEY` (optional `GEMINI_MODEL`)
- `LOVABLE_API_KEY` (optional `LOVABLE_AI_MODEL`)

Every AI reply passes the output guard (exact max-loss text, only code-made rupee figures, no advice or prediction wording, no personal-data-shaped text) or it is discarded.

## Data
No real customer data. All prototype figures are synthetic. Nothing the user types is stored.
