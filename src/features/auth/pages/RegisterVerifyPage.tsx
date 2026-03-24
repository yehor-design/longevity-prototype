import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuthStore } from "@/stores/authStore";
import { useMockDelay } from "@/hooks/useMockDelay";
import { ROUTES } from "@/lib/constants";
import { ArrowLeft, ShieldCheck } from "lucide-react";

/**
 * Register — OTP verification step.
 * Accepts any 6-digit code and proceeds to profile setup.
 */
export function RegisterVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quickLogin } = useAuthStore();
  const [otp, setOtp] = useState("");
  const { loading, withDelay } = useMockDelay(500, 800);
  const [countdown, setCountdown] = useState(60);

  const email = (location.state as { email?: string })?.email || "user@example.com";

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    withDelay(() => {
      quickLogin("patient");
      navigate(ROUTES.REGISTER_PROFILE);
    });
  };

  const handleResend = () => {
    setCountdown(60);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
        <p className="text-muted-foreground text-sm">
          We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Verifying…
            </span>
          ) : (
            "Verify & continue"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        {countdown > 0 ? (
          <span>Resend code in {countdown}s</span>
        ) : (
          <button
            onClick={handleResend}
            className="text-primary hover:underline font-medium"
          >
            Resend code
          </button>
        )}
      </div>

      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => navigate(ROUTES.REGISTER_EMAIL)}
        >
          <ArrowLeft size={14} className="mr-1" />
          Back
        </Button>
      </div>
    </div>
  );
}
