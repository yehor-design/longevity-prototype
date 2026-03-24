import { useLocation, useNavigate } from "react-router";
import { VerifyEmailScreen } from "@/features/auth/components/VerifyEmailScreen";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/constants";

/**
 * Register — OTP verification step.
 */
export function RegisterVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quickLogin } = useAuthStore();

  const email = (location.state as { email?: string } | null)?.email || "johndoe@gmail.com";

  return (
    <VerifyEmailScreen
      email={email}
      onBack={() => navigate(ROUTES.WELCOME)}
      onVerified={() => {
        quickLogin("patient");
        navigate(ROUTES.REGISTER_PROFILE);
      }}
    />
  );
}
