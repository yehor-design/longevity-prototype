import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useMockDelay } from "@/hooks/useMockDelay";
import { ROUTES } from "@/lib/constants";
import { AuthBottomBadges } from "@/features/auth/components/AuthBottomBadges";
import { AuthHeroPanel } from "@/features/auth/components/AuthHeroPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Login — Email entry step.
 * Uses the same split auth layout as registration/verification screens.
 */
export function LoginEmailPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { loading, withDelay } = useMockDelay(400, 700);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    withDelay(() => {
      const normalizedEmail = email.trim() || "johndoe@gmail.com";
      navigate(ROUTES.LOGIN_VERIFY, { state: { email: normalizedEmail, flow: "login" } });
    });
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="h-11 border-[#d5d7da] bg-white px-4 text-base shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] placeholder:text-[#717680]"
        autoComplete="email"
      />
      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-lg text-base font-semibold"
      >
        {loading ? "Loading..." : "Continue"}
      </Button>
    </form>
  );

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#f7f7f8]">
      <AuthHeroPanel />
      <AuthBottomBadges />

      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate(ROUTES.WELCOME)}
        className="absolute left-4 top-4 z-30 h-8 gap-1.5 rounded-md px-3 text-[13px] font-medium text-[#18181b]"
      >
        <span aria-hidden="true">←</span>
        Back
      </Button>

      {/* Desktop */}
      <div className="relative z-10 hidden h-full lg:flex">
        <div className="flex h-full w-[calc(50vw-16px)] items-center justify-center px-6">
          <div className="w-full max-w-[360px]">
            <div className="text-center">
              <h1 className="text-[30px] font-semibold leading-[38px] text-[#181d27]">
                Welcome back
              </h1>
              <p className="mt-3 text-base leading-6 text-[#535862]">
                Enter your email to sign in.
              </p>
            </div>

            <div className="mt-8">{formContent}</div>

            <div className="mt-6 flex w-full items-center justify-center gap-1">
              <span className="text-sm font-normal text-[#535862]">Don&apos;t have an account?</span>
              <Button
                variant="link"
                className="h-auto p-0 text-sm font-semibold text-primary"
                onClick={() => navigate(ROUTES.WELCOME)}
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="relative z-10 flex h-full items-center justify-center px-5 pb-24 pt-16 lg:hidden">
        <div className="w-full max-w-[360px]">
          <div className="text-center">
            <h1 className="text-[30px] font-semibold leading-[38px] text-[#181d27]">
              Welcome back
            </h1>
            <p className="mt-3 text-base leading-6 text-[#535862]">
              Enter your email to sign in.
            </p>
          </div>

          <div className="mt-8">{formContent}</div>

          <div className="mt-6 flex w-full items-center justify-center gap-1">
            <span className="text-sm font-normal text-[#535862]">Don&apos;t have an account?</span>
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-semibold text-primary"
              onClick={() => navigate(ROUTES.WELCOME)}
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
