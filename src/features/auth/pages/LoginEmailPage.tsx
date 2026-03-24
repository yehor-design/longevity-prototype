import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMockDelay } from "@/hooks/useMockDelay";
import { ROUTES } from "@/lib/constants";
import { ArrowLeft, ArrowRight, LogIn } from "lucide-react";

/**
 * Login — Email entry step.
 * Accepts any email value and proceeds to OTP verification.
 */
export function LoginEmailPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { loading, withDelay } = useMockDelay(400, 700);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    withDelay(() => {
      navigate(ROUTES.LOGIN_VERIFY, { state: { email: email || "user@example.com", flow: "login" } });
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <LogIn className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email to sign in
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email address</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Sending code…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue
              <ArrowRight size={14} />
            </span>
          )}
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => navigate(ROUTES.WELCOME)}
        >
          <ArrowLeft size={14} className="mr-1" />
          Back
        </Button>
      </div>
    </div>
  );
}
