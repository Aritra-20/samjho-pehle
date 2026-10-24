import { Link } from "@tanstack/react-router";
import { MAIN_PORTFOLIO_URL, OWNER, SITE_NAME } from "@/content/site";

const navCls = "rounded-sm px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-primary";
const activeCls = { className: `${navCls} text-primary font-medium` };

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-5 py-5 sm:flex-row sm:items-baseline sm:justify-between">
        <Link to="/" className="font-serif text-xl font-semibold text-foreground">
          {SITE_NAME} <span className="font-sans text-sm font-normal text-muted-foreground">by {OWNER}</span>
        </Link>
        <nav aria-label="Main" className="-mx-2 flex flex-wrap gap-x-1 gap-y-1">
          <Link to="/" className={navCls} activeOptions={{ exact: true, includeHash: false }}>
            Home
          </Link>
          <Link to="/problem-memo" className={navCls} activeProps={activeCls}>
            Problem memo
          </Link>
          <Link to="/behaviour-spec" className={navCls} activeProps={activeCls}>
            Behaviour spec
          </Link>
          <Link to="/prototype" className={navCls} activeProps={activeCls}>
            Prototype
          </Link>
          <Link to="/" hash="build" className={navCls}>
            Build thread
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>Built with AI (first draft in Lovable, then fixed and deployed with Claude)</p>
        <p className="flex flex-wrap gap-x-4">
          <span>© 2026 {OWNER}</span>
          <a href={MAIN_PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            My main portfolio
          </a>
        </p>
      </div>
    </footer>
  );
}
