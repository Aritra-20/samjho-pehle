import { createFileRoute } from "@tanstack/react-router";
import { SEBI_PAPER_URL, SEBI_SOURCE_URL } from "@/content/site";

const TITLE = "Problem-framing memo | Samjho Pehle";
const DESC =
  "Why first-time options traders in India place orders without seeing their worst case in rupees, the false problems, the unknowns, and what to measure.";

export const Route = createFileRoute("/problem-memo")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Memo,
});

const A = () => <span className="tag">[Assumption]</span>;

function Memo() {
  return (
    <article className="doc mx-auto max-w-3xl px-5 py-14">
      <h1 className="text-4xl font-semibold">Problem-framing memo</h1>
      <p className="mt-3 font-serif text-lg text-muted-foreground">
        Samjho Pehle: a risk explainer for first-time options traders
      </p>

      <h2>The real problem</h2>
      <p>
        First-time options traders place orders without a clear picture of their worst case in rupees. Broking apps
        show strike prices, premiums and lot sizes, but not, in plain words, "if this goes wrong, you can lose up to
        ₹X." <A /> The stakes are visible in SEBI's own data: in FY26, 87.7% of individual traders in equity
        derivatives incurred net losses, down from 90.9% in FY25 (source: SEBI paper, linked below). A press-release
        summary also reports that nearly 97% of traders predominantly bought options; I did not find that figure in
        the SEBI paper, so treat it as unverified. The people most exposed are new users, who do not yet know what a
        lot size does to a small premium. <A />
      </p>
      <p>
        Sources:{" "}
        <a href={SEBI_PAPER_URL} target="_blank" rel="noopener noreferrer">
          SEBI, Profitability of Individual Traders in the Equity Derivatives Segment (FY25–FY26), Aug 2026
        </a>
        {" · "}
        <a href={SEBI_SOURCE_URL} target="_blank" rel="noopener noreferrer">
          press-release summary (PR 50/2026, taxguru.in)
        </a>
      </p>

      <h2>The false problems</h2>
      <p className="text-muted-foreground">(things that look like the problem but are not)</p>
      <ol>
        <li>"Users need a chatbot." They need one clear number before they click, not a conversation.</li>
        <li>
          "Users need stock tips." An app that is not a SEBI-registered adviser cannot give them, and should not.{" "}
          <span className="tag">[Assumption: my reading of SEBI's adviser rules, not legal advice.]</span>
        </li>
        <li>
          "Users are simply reckless." Some are. But many cannot picture the risk, and that part is fixable. <A />
        </li>
        <li>
          "A risk pop-up already exists, so we're done." A pop-up that people tap past does not count as understanding.{" "}
          <span className="tag">[Assumption: this is true of existing broker screens. I have not measured it.]</span>
        </li>
        <li>
          "English-only is fine." Untested for Tier 2 and Tier 3 users. <A />
        </li>
      </ol>

      <h2>The unknowns, and what would resolve each</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Unknown</th>
              <th>How to resolve</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Do users read a risk screen or tap past it?</td>
              <td>Click-through and time-on-screen for the existing risk pop-up, from the broker's analytics.</td>
            </tr>
            <tr>
              <td>Does seeing the rupee loss change behaviour, or just scare people off?</td>
              <td>A/B test: compare order size and 30-day activity, with and without the explainer.</td>
            </tr>
            <tr>
              <td>Which language do first-time traders prefer?</td>
              <td>App-language settings data, or a 15 to 20 user survey.</td>
            </tr>
            <tr>
              <td>Is an AI explanation better than a fixed calculator screen?</td>
              <td>Test both versions with the same users.</td>
            </tr>
            <tr>
              <td>Does a clearer risk screen reduce "why did I lose more than I expected" support tickets?</td>
              <td>Compare ticket tags before and after, with the support team.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>What I would measure</h2>
      <p>
        <span className="tag">[Assumption: these are the metrics I would choose. I have no data on either.]</span>
      </p>
      <p>
        <strong>Primary:</strong> share of new options traders still active at day 30 (D30 retention), after their
        first big loss. <strong>Secondary:</strong> support tickets about unexpected losses.
      </p>

      <h2>What this memo does not claim</h2>
      <p>It claims no impact. Every impact statement above is a hypothesis to test, not a finding.</p>
    </article>
  );
}
