import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const TITLE = "AI-worthiness argument and behaviour spec | Samjho Pehle";
const DESC =
  "The never list written first, why code decides the numbers and AI only explains them, and how every rule of the Samjho Pehle risk explainer is enforced.";

export const Route = createFileRoute("/behaviour-spec")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Spec,
});

function Spec() {
  return (
    <article className="doc mx-auto max-w-3xl px-5 py-14">
      <h1 className="text-4xl font-semibold">AI-worthiness argument and behaviour spec</h1>
      <p className="mt-3 font-serif text-lg text-muted-foreground">Samjho Pehle. Never list FIRST.</p>

      <h2>1. The never list (written first)</h2>
      <ol>
        <li>Never say whether to buy, sell or hold, or which strike or expiry to pick.</li>
        <li>Never predict price direction or promise returns.</li>
        <li>Never state a rupee figure that was not computed by the code layer.</li>
        <li>Never ask for, accept or store personal data (PAN, Aadhaar, phone, bank details, name).</li>
        <li>Never place, modify or suggest an order.</li>
        <li>Never hide the maximum-loss line, even if the user asks for "short and simple".</li>
      </ol>

      <h2>2. Is this worth using AI for? (AI-worthiness argument)</h2>
      <p>
        Most of this feature should not be AI. Maximum loss and break-even are arithmetic, so they live in code and are
        exactly right every time.
      </p>
      <p>
        AI earns its place in one narrow job: turning the computed result into plain language at the user's level, in
        English or Hindi, and answering follow-ups such as 'what does lot size mean?' A fixed template cannot cover that
        spread of languages and questions without a huge amount of hand-written text.
      </p>
      <p>
        To be fair to the alternative: this prototype already has a fixed template that explains the core result in
        both languages and answers a short list of terms, and it is what users see whenever the AI is unavailable or
        fails a check. So the AI's extra value is only the open-ended wording and follow-up questions, and I have not
        shown that it beats the template. <span className="tag">[Assumption: users prefer the AI wording.]</span> The
        memo lists this as an unknown to test.
      </p>
      <p>
        If AI wrote the numbers it would sometimes be wrong, which is unacceptable when the product handles people's
        money. So the design is: <strong>code decides the numbers, AI only explains them.</strong>
      </p>
      <p>
        <strong>When I would say no to AI:</strong> If the explanation cannot be reliably checked against the code's
        numbers, or if the regulator's view on explainers near an order is unclear, the right answer is a fixed
        template, not AI.
      </p>

      <h2>3. Behaviour spec</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th className="w-32">Case</th>
              <th>What it does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium">Intended</td>
              <td>
                Takes structured input (index, option type, strike, lot size, premium, buy or sell). Code returns max
                loss, max profit and break-even. The AI explains the result in 3 to 4 plain sentences in the chosen
                language, and the explanation must contain the code's exact maximum-loss figure. The maximum-loss card
                is always shown by the interface, separately from the AI text.
              </td>
            </tr>
            <tr>
              <td className="font-medium">Refusal</td>
              <td>
                Asked "should I buy this?", "which strike?" or "will Nifty go up?", it says: "I can't give advice or
                predict prices. I can explain the risk of the order you entered." It then offers to explain the order.
                Personal details are refused and never sent to the AI.
              </td>
            </tr>
            <tr>
              <td className="font-medium">Failure, bad input</td>
              <td>
                If inputs are missing, zero, negative or inconsistent, the calculator does not run and shows the fixed
                message: "We couldn't calculate this. Please check your order details."
              </td>
            </tr>
            <tr>
              <td className="font-medium">Failure, AI problem</td>
              <td>
                If the AI call fails, is unavailable, or its text breaks a rule (a rupee figure the code did not
                produce, advice or prediction wording, or a missing max-loss figure), the AI text is discarded. The
                user instead sees a fixed template explanation written by code from the same numbers, labelled
                "Template explanation (AI unavailable)". Nothing the AI wrote is shown. A short error note (never the
                user's text) goes to the browser console and the server log; nothing the user typed is stored.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>4. How each never-rule is enforced</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th className="w-48">Rule</th>
              <th>Where it is enforced</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1, 2 Advice and prediction</td>
              <td>
                Input check before the AI is called, the AI's instructions, and an output check for advice and
                prediction wording.
              </td>
            </tr>
            <tr>
              <td>3 Only code-made rupee figures</td>
              <td>
                Output check: every rupee amount, and every number of 1,000 or more or written with lakh or crore, must
                match a code-computed value, otherwise the text is thrown away.
              </td>
            </tr>
            <tr>
              <td>4 Personal data</td>
              <td>
                Input check blocks PAN-, Aadhaar- and phone-shaped text before anything leaves the browser; nothing is
                stored.
              </td>
            </tr>
            <tr>
              <td>5 No orders</td>
              <td>The prototype has no order, broker or payment connection at all.</td>
            </tr>
            <tr>
              <td>6 Max-loss always visible</td>
              <td>The interface always renders the max-loss card, independent of the AI.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>5. Known gaps (honest list)</h2>
      <ul>
        <li>
          Rule 4 lists names and bank details, but the input check only recognises PAN-, Aadhaar-, phone- and long
          digit-shaped text. A plain name is not detected.
        </li>
        <li>
          The output check does not catch an amount spelled out in words (for example "ninety thousand"), or a small
          figure written with no ₹ sign.
        </li>
        <li>
          The input check uses pattern matching, so a cleverly reworded advice question can slip past it. The output
          check and the AI's instructions are the second and third layers.
        </li>
        <li>Hindi advice phrasing is only partly covered by the patterns.</li>
        <li>
          This is a v0 tested on a small set of prompts, not a full evaluation.{" "}
          <span className="tag">[Next step: a bigger test set.]</span>
        </li>
        <li>
          I am not a lawyer. Whether a risk explainer shown near an order counts as "advice" under SEBI rules needs a
          compliance review before any real launch.
        </li>
      </ul>

      <div className="mt-10">
        <Button asChild size="lg">
          <Link to="/prototype">Try the prototype</Link>
        </Button>
      </div>
    </article>
  );
}
