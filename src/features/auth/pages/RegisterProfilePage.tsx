import { useNavigate } from "react-router";
import { ProfileSetupScreen } from "@/features/auth/components/ProfileSetupScreen";
import { ROUTES } from "@/lib/constants";

/**
 * Register — Profile Setup step.
 */
export function RegisterProfilePage() {
  const navigate = useNavigate();

  return (
    <ProfileSetupScreen
      onBack={() => navigate(ROUTES.REGISTER_2FA)}
      onContinue={() => navigate(ROUTES.CONSENT)}
      onSkip={() => navigate(ROUTES.CONSENT)}
    />
  );
}
