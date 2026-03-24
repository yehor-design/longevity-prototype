import { Outlet, Link } from "react-router";
import { Logo } from "@/components/common/Logo";
import { ROUTES } from "@/lib/constants";

/**
 * Layout for unauthenticated public pages (auth flows, consent, etc.).
 * Keeps all auth/login/register screens within viewport height.
 */
export function PublicLayout() {
  return (
    <div className="relative h-[100dvh] max-h-[100dvh] overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background px-4">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center py-4">
        <div className="mb-6">
          <Link to={ROUTES.WELCOME} aria-label="Go to homepage">
            <Logo size="lg" />
          </Link>
        </div>

        <div className="relative w-full max-w-[480px] max-h-[calc(100dvh-220px)] overflow-auto rounded-2xl border bg-card p-8 shadow-lg">
          <Outlet />
        </div>

        <footer className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <Link to={ROUTES.PRIVACY} className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link to={ROUTES.TERMS} className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link to={ROUTES.AI_EXPLANATION} className="hover:text-foreground transition-colors">
            AI Explanation
          </Link>
        </footer>
      </div>
    </div>
  );
}
