import { useNavigate } from "react-router";
import { PrivacyConsentScreen } from "@/features/auth/components/PrivacyConsentScreen";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/constants";

/**
 * Register — Privacy & Consent step.
 */
export function RegisterConsentPage() {
  const navigate = useNavigate();
  const { quickLogin } = useAuthStore();

  const handleAccept = () => {
    quickLogin("patient");
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <PrivacyConsentScreen
      onBack={() => navigate(ROUTES.REGISTER_PROFILE)}
      onAccept={handleAccept}
    />
  );
}
