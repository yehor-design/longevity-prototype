import { Outlet, Link } from "react-router";
import { Logo } from "@/components/common/Logo";
import { ROUTES } from "@/lib/constants";

/**
 * Layout for unauthenticated public pages (auth flows, consent, etc.)
 * Centers content in a card with the platform logo above.
 */
export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4 py-10">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Logo */}
      <div className="mb-8 z-10">
        <Link to={ROUTES.WELCOME} aria-label="Go to homepage">
          <Logo size="lg" />
        </Link>
      </div>

      {/* Content card */}
      <div className="relative z-10 w-full max-w-[480px] bg-card border rounded-2xl shadow-lg p-8">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="mt-8 flex gap-4 text-xs text-muted-foreground z-10">
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
  );
}
