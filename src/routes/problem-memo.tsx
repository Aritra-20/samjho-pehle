import { createFileRoute, Link } from "@tanstack/react-router";
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

      <h2>1. Real problem</h2>
      <p>
        First-time options traders see what an order costs, but not what it means. On Zerodha Kite, buying one lot of
        an ONGC put showed "Margin ₹7,447.50 + ₹26.73": the amount paid (2,250 units × ₹3.31), under a trading label.
        It did not say that all of it can be lost, or where break-even is.{" "}
        <span className="tag">[My own check, 24 Oct 2026, one screen, no order placed.]</span> For a seller, margin is
        not the worst case at all: the loss on a sold call has no upper limit.{" "}
        <span className="tag">[Assumption: I did not check the sell screen.]</span> <strong>Evidence hook:</strong>{" "}
        SEBI's FY26 study found 87.7% of individual traders in equity derivatives made net losses, down from 90.9% in
        FY25.
      </p>
      <p className="text-sm">
        Sources:{" "}
        <a href={SEBI_PAPER_URL} target="_blank" rel="noopener noreferrer">
          SEBI, Profitability of Individual Traders in the Equity Derivatives Segment (FY25–FY26), Aug 2026
        </a>
        {" · "}
        <a href={SEBI_SOURCE_URL} target="_blank" rel="noopener noreferrer">
          press-release summary (PR 50/2026, taxguru.in)
        </a>
      </p>

      <h2>2. False problems</h2>
      <ol>
        <li>"Users need a chatbot." They need one clear rupee number before they click, not a conversation.</li>
        <li>
          "Users need tips." An app that is not a SEBI-registered adviser cannot give them, and should not.{" "}
          <span className="tag">[Assumption: my reading of SEBI's adviser rules, not legal advice.]</span>
        </li>
        <li>
          "A risk pop-up already exists, so we're done." A pop-up people tap past is not understanding.{" "}
          <span className="tag">[Assumption: I have not measured this.]</span>
        </li>
      </ol>

      <h2>3. Unknowns that remain</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>What would change my mind</th>
              <th>Cheapest test that could disprove me</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Most users already read the existing risk screen.</td>
              <td>Click-through and time-on-screen from the broker's analytics.</td>
            </tr>
            <tr>
              <td>Seeing the rupee loss only scares users off.</td>
              <td>A/B test order size and 30-day activity.</td>
            </tr>
            <tr>
              <td>A fixed template explains as well as AI.</td>
              <td>Show both, in English and Hindi, to the same 15 to 20 users.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Override log</h2>
      <ol>
        <li>
          The draft said broking apps never show the worst case in rupees. I opened a real order screen: it does show
          the amount paid, as "Margin". The problem is the label and the missing warning, so I rewrote it.
        </li>
        <li>
          The AI-built draft carried "nearly 97% bought options" from a press summary. I checked SEBI's own paper; the
          figure is not there, so I dropped it.
        </li>
        <li>The AI-built memo was meant to be one printed page; it printed on two. I cut it to one.</li>
      </ol>
      <p className="text-sm">
        Full log: <Link to="/build-thread">build thread</Link>.
      </p>

      <h2>What I would measure</h2>
      <p>
        <strong>Primary:</strong> share of new options traders still active at day 30. <strong>Secondary:</strong>{" "}
        support tickets about unexpected losses.{" "}
        <span className="tag">[Assumption: my choice of metrics; I have no data on either.]</span> This memo claims no
        impact; every impact statement is a hypothesis to test.
      </p>
    </article>
  );
}
