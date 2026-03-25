import { useLocation, useNavigate } from "react-router";
import { TwoFactorLoginScreen } from "@/features/auth/components/TwoFactorLoginScreen";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES, ROLE_HOME } from "@/lib/constants";

/**
 * Sign-in — 2FA verification step.
 *
 * Reached from:
 *  - /login/verify  (email + OTP flow)
 *  - /login/email   (Google sign-in, which bypasses OTP)
 *
 * State shape: { method: 'email' | 'google', email?: string }
 */
export function Login2faPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quickLogin } = useAuthStore();

  const state = location.state as { method?: "email" | "google"; email?: string } | null;
  const method = state?.method ?? "email";

  const handleBack = () => {
    if (method === "google") {
      navigate(ROUTES.LOGIN_EMAIL);
    } else {
      navigate(ROUTES.LOGIN_VERIFY, { state: { email: state?.email, method } });
    }
  };

  const handleVerified = () => {
    quickLogin("patient");
    navigate(ROLE_HOME.patient);
  };

  return (
    <TwoFactorLoginScreen
      onBack={handleBack}
      onVerified={handleVerified}
    />
  );
}
