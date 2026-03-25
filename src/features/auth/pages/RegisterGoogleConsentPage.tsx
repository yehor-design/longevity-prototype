import { useNavigate } from "react-router";
import { PrivacyConsentScreen } from "@/features/auth/components/PrivacyConsentScreen";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/constants";

/**
 * Google Register — Privacy & Consent step.
 * Skips Verify Email and Profile Setup (data comes from Google OAuth).
 */
export function RegisterGoogleConsentPage() {
  const navigate = useNavigate();
  const { quickLogin } = useAuthStore();

  const handleAccept = () => {
    quickLogin("patient");
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <PrivacyConsentScreen
      onBack={() => navigate(ROUTES.REGISTER_GOOGLE_2FA)}
      onAccept={handleAccept}
    />
  );
}
