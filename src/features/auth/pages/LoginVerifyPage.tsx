import { useLocation, useNavigate } from "react-router";
import { VerifyEmailScreen } from "@/features/auth/components/VerifyEmailScreen";
import { ROUTES } from "@/lib/constants";

/**
 * Sign-in — OTP verification step.
 *
 * After the user confirms their email via OTP, they are forwarded to the
 * 2FA step (all mock users have has2FA: true). The email and method are
 * passed via router state so Login2faPage can back-navigate correctly.
 */
export function LoginVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { email?: string; method?: string } | null;
  const email = state?.email ?? "johndoe@gmail.com";

  return (
    <VerifyEmailScreen
      title="Enter your login code"
      email={email}
      onBack={() => navigate(ROUTES.LOGIN_EMAIL)}
      onVerified={() => {
        navigate(ROUTES.LOGIN_2FA, { state: { email, method: "email" } });
      }}
    />
  );
}
