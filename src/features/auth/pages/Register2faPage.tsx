import { useNavigate } from "react-router";
import { TwoFactorSetupScreen } from "@/features/auth/components/TwoFactorSetupScreen";
import { ROUTES } from "@/lib/constants";

/**
 * Register — 2FA setup step.
 */
export function Register2faPage() {
  const navigate = useNavigate();

  return (
    <TwoFactorSetupScreen
      onBack={() => navigate(ROUTES.REGISTER_VERIFY)}
      onVerified={() => navigate(ROUTES.REGISTER_PROFILE)}
      onCancel={() => navigate(ROUTES.WELCOME)}
    />
  );
}
