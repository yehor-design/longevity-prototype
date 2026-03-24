import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/authStore";
import { useMockDelay } from "@/hooks/useMockDelay";
import { ROLE_HOME, ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types";
import { ArrowRight, Zap } from "lucide-react";

/**
 * Entry-point welcome page with auth CTAs and quick-login prototype bypass.
 */
export function WelcomePage() {
  const navigate = useNavigate();
  const { quickLogin } = useAuthStore();
  const { loading: googleLoading, withDelay } = useMockDelay(600, 900);
  const { loading: emailLoading, withDelay: withEmailDelay } = useMockDelay(300, 500);

  const handleQuickLogin = (role: UserRole) => {
    quickLogin(role);
    navigate(ROLE_HOME[role]);
  };

  const handleGoogleSignIn = () => {
    withDelay(() => {
      quickLogin("patient");
      navigate(ROUTES.REGISTER_PROFILE);
    });
  };

  const handleEmailRegister = () => {
    withEmailDelay(() => navigate(ROUTES.REGISTER_EMAIL));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to DT Health</h1>
        <p className="text-muted-foreground text-sm">
          Your personal digital twin health platform
        </p>
      </div>

      <div className="space-y-3">
        {/* Google OAuth (fake) */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Connecting…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </span>
          )}
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        {/* Email register */}
        <Button
          className="w-full"
          onClick={handleEmailRegister}
          disabled={emailLoading}
        >
          {emailLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Loading…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Register with Email
              <ArrowRight size={14} />
            </span>
          )}
        </Button>

        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => navigate(ROUTES.LOGIN_EMAIL)}
        >
          Already have an account? Sign in
        </Button>
      </div>

      {/* Quick Login — prototype bypass */}
      <div className="border rounded-xl p-4 bg-amber-500/5 border-amber-500/20 space-y-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-amber-500" />
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Prototype Quick Login
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Skip the full auth flow. Instantly log in as any role:
        </p>
        <div className="flex gap-2 flex-wrap">
          {(["patient", "doctor", "admin"] as UserRole[]).map((role) => (
            <Button
              key={role}
              size="sm"
              variant="outline"
              className="capitalize text-xs h-7 border-amber-500/30 hover:bg-amber-500/10"
              onClick={() => handleQuickLogin(role)}
            >
              {role}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
