import { useLocation, useNavigate } from "react-router";
import { VerifyEmailScreen } from "@/features/auth/components/VerifyEmailScreen";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/constants";
import { ROLE_HOME } from "@/lib/constants";

/**
 * Login — OTP verification step.
 */
export function LoginVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quickLogin } = useAuthStore();

  const email = (location.state as { email?: string } | null)?.email || "johndoe@gmail.com";

  return (
    <VerifyEmailScreen
      email={email}
      onBack={() => navigate(ROUTES.LOGIN_EMAIL)}
      onVerified={() => {
        quickLogin("patient");
        navigate(ROLE_HOME.patient);
      }}
    />
  );
}
