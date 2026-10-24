import { createFileRoute } from "@tanstack/react-router";
import { LOVABLE_BRIEF } from "@/content/lovable-brief";
import { REVIEW_BRIEF } from "@/content/review-brief";

const TITLE = "Build thread (CRISP) | Samjho Pehle";
const DESC =
  "How Samjho Pehle was built with AI: the master briefs mapped to CRISP, the iterations in order, the overrides, and a judgement note.";
const REPO = "https://github.com/Aritra-20/samjho-pehle";

export const Route = createFileRoute("/build-thread")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Thread,
});

const crisp = [
  {
    k: "C, Context",
    v: "Graded course assignment; owner is Aritra Pal; one focused piece of product thinking about one AI feature, judged on the argument, not the looks. The exact page text, the SEBI source and the six never-list rules were supplied by me, not invented by the AI.",
  },
  {
    k: "R, Role",
    v: "Not stated. The first-draft prompt never told the AI what expertise or standard to apply. That is a gap in my brief, and the review brief below fixes it (grader first, then PM coach).",
  },
  {
    k: "I, Intent",
    v: "Too many jobs in one prompt: four pages, a prototype, guards, tests and a self-test panel. It should have been split, and the later iterations below are one job each.",
  },
  {
    k: "S, Specifics",
    v: "Strong: routes, exact page content, design rules, the four maths formulas, validation, guard patterns, the eight self-test prompts, the model instruction text.",
  },
  {
    k: "P, Parameters",
    v: "Strong on what not to do: no invented statistics, no hard-coded lot sizes, no stored user input, no API key in the page, template mode when the AI fails. Missing: a request to show its plan before building.",
  },
];

const iterations = [
  {
    n: "1",
    job: "Build the first draft.",
    who: "Lovable",
    result:
      "Four pages, the maths in code, the guards and 36 passing tests. Lovable's own closing report said the preview still had build errors (mismatched AI packages, Prototype route errors) and that it had not opened any page in a browser.",
    ev: "The prompt is reproduced in full below. The quoted result is from Lovable's reply to it.",
  },
  {
    n: "2",
    job: "Fix the build, test it and ship it.",
    who: "Claude",
    result: "Commit c87118c, \"Samjho Pehle: AI PM Milestone 1 site (problem memo, behaviour spec, prototype v0)\". Deployed on Vercel.",
    ev: "Commit history.",
  },
  {
    n: "3",
    job: "Turn the AI explanations on with a Gemini key kept on the server.",
    who: "Claude",
    result: "Commit 38dbc9c, \"Add Gemini provider (GEMINI_API_KEY) for AI explanations\". The key lives in a server environment variable, never in the code or the chat.",
    ev: "Commit history.",
  },
  {
    n: "4",
    job: "Redeploy so the site picks up the key.",
    who: "Claude",
    result: "Commit b2b87c8, \"Redeploy to pick up GEMINI_API_KEY\".",
    ev: "Commit history.",
  },
  {
    n: "5",
    job: "Use current model IDs, with fallbacks.",
    who: "Claude",
    result: "Commit 095d4fa, \"Gemini: use current Flash model IDs with fallback\".",
    ev: "Commit history.",
  },
  {
    n: "6",
    job: "Stop the AI call timing out.",
    who: "Claude",
    result: "Commit b29e060, \"Gemini: prefer fast Flash-Lite models to avoid timeouts\".",
    ev: "Commit history.",
  },
  {
    n: "7",
    job: "Review the live site against the rubric and fix the gaps only.",
    who: "Claude",
    result:
      "Audited every page against the marking rubric, then fixed the gaps in one commit (ef24edc). Details under Overrides.",
    ev: "The review brief below, the commit and the live site.",
  },
  {
    n: "8",
    job: "Check every page against the course session templates (S1, S5, S6) and fix what does not match.",
    who: "Claude",
    result:
      "Positioning now opens with the S1 Machine Card. The memo follows the S5 skeleton and word limits, with an override log. The spec has the S6 fields (feature, user, tone, length, what it may cite, three examples, three named failure cases). The self-test grew from 8 to 13 checks to meet the S6 eval minimum.",
    ev: "Commit history and the live pages.",
  },
];

const overrides = [
  {
    t: "The first draft was reported as broken and unchecked.",
    a: "Lovable said so itself. I did not accept \"36 tests pass\" as proof the site worked. The review brief therefore asks for tests, a build and a look at the live pages, and for honesty about anything not verified.",
  },
  {
    t: "My guard rule missed amounts written without a currency sign.",
    a: "My first-draft brief said \"every ₹ / Rs / INR / रुपये amount in it must equal a code-computed value\". A probe showed 99999, \"रु 99999\", \"99,999/-\" and \"1.5 lakh rupees\" all got through. I rewrote the rule in the brief: any number of 1,000 or more, or written with lakh or crore, must match a code-computed value. Then the code changed and six tests were added (57 pass). Amounts spelled out in words are still not caught and are listed as a known gap.",
  },
  {
    t: "The memo printed on two pages.",
    a: "My brief said one printable page. Rendered to A4 it ran to two. A print style brought it to one page with no text removed.",
  },
  {
    t: "The memo's SEBI figure was only half supported.",
    a: "My brief's text cited 87.7% and \"nearly 97%\" to a press-release summary. SEBI's own paper confirms 87.7% (90.9% the year before) but does not contain the 97% figure. The memo now cites the paper, tags the other claims [Assumption], and marks the 97% as unverified.",
  },
  {
    t: "The spec described logging inaccurately.",
    a: "My brief said failures are logged to the browser console only. The server also logs a short error note, never the user's text. The spec now says so.",
  },
];

const NOTE =
  "The AI got three things wrong, and I only caught them by checking. First, Lovable's draft ended with a broken preview and no page opened, so I did not trust \"all tests pass\". Second, my own brief's output guard covered only amounts with a currency sign. A probe showed 99999, \"रु 99999\" and \"1.5 lakh rupees\" slipped through, so I rewrote that rule in the brief, then fixed the code and added six tests. Third, the memo printed on two pages and cited a 97% figure that is not in SEBI's own paper. It now fits one page and flags that figure as unverified. Next time I will state the Role explicitly, give one job per prompt, and ask for the plan first.";

function Thread() {
  return (
    <article className="doc mx-auto max-w-3xl px-5 py-14">
      <h1 className="text-4xl font-semibold">Build thread (CRISP)</h1>
      <p className="mt-3 font-serif text-lg text-muted-foreground">
        How Samjho Pehle was built with AI, in order, with the overrides.
      </p>

      <p className="mt-6">
        This page is a record built from the actual artifacts: the prompt sent to Lovable, Lovable's reply to it, the
        commit history, and the brief for the review pass. It is not a word-for-word copy of every Claude session. The
        commits are public at{" "}
        <a href={`${REPO}/commits/main`} target="_blank" rel="noopener noreferrer">
          the repository history
        </a>
        .
      </p>

      <h2>1. Master brief, mapped to CRISP</h2>
      <p>
        The first-draft prompt was written as one long brief, not labelled by letter. Here is an honest map of it to
        CRISP. The full prompt is reproduced below.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th className="w-36">Letter</th>
              <th>What the brief did</th>
            </tr>
          </thead>
          <tbody>
            {crisp.map((c) => (
              <tr key={c.k}>
                <td className="font-medium">{c.k}</td>
                <td>{c.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details className="mb-6 rounded-lg border border-border bg-card p-4">
        <summary className="cursor-pointer font-serif text-lg font-semibold">
          The first-draft prompt, verbatim (sent to Lovable)
        </summary>
        <pre className="mt-4 overflow-x-auto text-xs leading-relaxed whitespace-pre-wrap">{LOVABLE_BRIEF}</pre>
      </details>

      <h2>2. Master brief for the review pass, in CRISP order</h2>
      <p>This second brief fixes the gaps I found in the first: a stated Role, a numbered Intent, and honest limits.</p>
      {REVIEW_BRIEF.map((b) => (
        <div key={b.letter} className="mb-4 rounded-lg border border-border bg-card p-4">
          <p className="font-serif text-lg font-semibold">
            {b.letter}, {b.label}
          </p>
          <pre className="mt-2 overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap font-sans">{b.text}</pre>
        </div>
      ))}

      <h2>3. Iterations, one job each</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th className="w-10">#</th>
              <th>Job</th>
              <th className="w-20">Tool</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {iterations.map((i) => (
              <tr key={i.n}>
                <td>{i.n}</td>
                <td>{i.job}</td>
                <td>{i.who}</td>
                <td>
                  {i.result} <span className="text-muted-foreground">Evidence: {i.ev}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>4. Overrides: what the AI got wrong, and what I changed</h2>
      <ol>
        {overrides.map((o) => (
          <li key={o.t}>
            <strong>{o.t}</strong> {o.a}
          </li>
        ))}
      </ol>

      <h2>5. Judgement note</h2>
      <p>{NOTE}</p>

      <p className="mt-10 text-sm text-muted-foreground">
        No real customer data appears here. The briefs contain only my own text and public links.
      </p>
    </article>
  );
}
