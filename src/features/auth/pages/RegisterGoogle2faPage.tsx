import { useNavigate } from "react-router";
import { TwoFactorSetupScreen } from "@/features/auth/components/TwoFactorSetupScreen";
import { ROUTES } from "@/lib/constants";

/**
 * Google Register — 2FA setup step.
 * Skips Verify Email and Profile Setup (data comes from Google OAuth).
 */
export function RegisterGoogle2faPage() {
  const navigate = useNavigate();

  return (
    <TwoFactorSetupScreen
      onBack={() => navigate(ROUTES.WELCOME)}
      onVerified={() => navigate(ROUTES.REGISTER_GOOGLE_CONSENT)}
      onCancel={() => navigate(ROUTES.WELCOME)}
    />
  );
}
