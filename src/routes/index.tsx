import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CRISP_THREAD_URL, SITE_NAME, TAGLINE } from "@/content/site";

const TITLE = "Samjho Pehle: a pre-order risk explainer for first-time options traders";
const DESC =
  "One AI feature taken end to end by Aritra Pal: a risk explainer that tells first-time options traders what they can lose in rupees, in English or Hindi, without giving advice.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

const cards = [
  { to: "/problem-memo", title: "Problem memo", desc: "The real problem, the false problems, and the unknowns that need resolving." },
  { to: "/behaviour-spec", title: "Behaviour spec", desc: "The never list, why AI is worth using here at all, and how each rule is enforced." },
  { to: "/prototype", title: "Prototype (v0)", desc: "A working risk explainer with synthetic data and a self-test against its never list." },
] as const;

function Home() {
  return (
    <div className="mx-auto max-w-3xl px-5">
      <section className="py-16 sm:py-24">
        <h1 className="text-5xl font-semibold sm:text-6xl">{SITE_NAME}</h1>
        <p className="mt-4 font-serif text-xl text-primary sm:text-2xl">{TAGLINE}</p>
        <p className="mt-6 max-w-2xl text-lg">
          A pre-order risk explainer for first-time options traders on Indian broking apps. Before an order is placed,
          it tells the user in plain English or Hindi what they can lose in rupees. It never tells them what to do.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/prototype">Try the prototype</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/problem-memo">Read the problem memo</Link>
          </Button>
        </div>
      </section>

      <section id="positioning" className="border-t border-border py-12">
        <h2 className="text-2xl font-semibold">Where I'm aiming</h2>
        <dl className="mt-4 grid gap-3 rounded-lg border border-border bg-card p-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-semibold">What the machine does</dt>
            <dd className="mt-1">
              A language model turns numbers it is given into plain sentences, in English or Hindi.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">What it cannot promise</dt>
            <dd className="mt-1">
              The same answer twice, or correct arithmetic. Ask the same question twice and the wording changes.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">What it means for the product</dt>
            <dd className="mt-1">
              Code decides every rupee figure; the model only explains, and every reply is checked before it is shown.
            </dd>
          </div>
        </dl>
        <p className="mt-4">
          I'm a product manager in training (PGPM, Great Lakes Institute of Management) and the AI PM role I'm
          targeting is <strong>AI features at an established company</strong>, specifically Indian consumer fintech
          (UPI, broking, lending). I spent 30+ months as a Systems Engineer at TCS building backend systems, so I know
          what is cheap to calculate and what isn't. My rule: if arithmetic can answer it, use code; use AI only for the
          part code cannot do; and write the never list before the feature list.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          The other two roles, an AI-first company and consulting advisory, are things I'm deliberately not targeting
          right now.
        </p>
      </section>

      <section className="border-t border-border py-12">
        <h2 className="text-2xl font-semibold">What is on this site</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="build" className="scroll-mt-6 border-t border-border py-12">
        <h2 className="text-2xl font-semibold">How this site was built</h2>
        <p className="mt-4">
          This site was built and edited with AI tools only: the first draft in Lovable, then fixed, tested and deployed
          with Claude. The full build conversation is linked here.
        </p>
        <div className="mt-6">
          {CRISP_THREAD_URL ? (
            <Button asChild variant="outline">
              <a href={CRISP_THREAD_URL} target="_blank" rel="noopener noreferrer">
                Read the build thread (CRISP)
              </a>
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" disabled>
                Read the build thread (CRISP)
              </Button>
              <span className="text-sm text-muted-foreground">Link being added</span>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border py-12">
        <h2 className="text-2xl font-semibold">Data and honesty</h2>
        <p className="mt-4">
          No real customer data is on this site. Every number in the prototype is synthetic and labelled. Figures from
          outside sources are linked to their source. Anything I could not verify is marked as an assumption.
        </p>
      </section>
    </div>
  );
}
