import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useMockDelay } from "@/hooks/useMockDelay";
import { ROUTES } from "@/lib/constants";
import { AuthBottomBadges } from "@/features/auth/components/AuthBottomBadges";
import { AuthHeroPanel } from "@/features/auth/components/AuthHeroPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GOOGLE_ICON_ASSETS = {
  blue: "https://www.figma.com/api/mcp/asset/d8e111e4-16b8-49c0-ac3e-d09c324b3064",
  green: "https://www.figma.com/api/mcp/asset/2c2927a9-302b-4749-a94b-8b1da60ec3bb",
  red: "https://www.figma.com/api/mcp/asset/29d554b2-65ad-4760-b0f4-92f37a319cb6",
  yellow: "https://www.figma.com/api/mcp/asset/3a3da08a-44b3-47df-a26b-ee84c9f0c68c",
};

function GoogleIcon() {
  return (
    <div className="relative h-6 w-6 shrink-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-[40.99%_0.97%_12.07%_51%]">
        <img alt="" className="size-full" src={GOOGLE_ICON_ASSETS.blue} />
      </div>
      <div className="absolute inset-[59.58%_15.86%_0_6.32%]">
        <img alt="" className="size-full" src={GOOGLE_ICON_ASSETS.green} />
      </div>
      <div className="absolute inset-[27.56%_77.07%_27.54%_1%]">
        <img alt="" className="size-full" src={GOOGLE_ICON_ASSETS.red} />
      </div>
      <div className="absolute inset-[0_15.54%_59.56%_6.32%]">
        <img alt="" className="size-full" src={GOOGLE_ICON_ASSETS.yellow} />
      </div>
    </div>
  );
}

/**
 * Sign-in — Email entry step.
 * Mirrors the WelcomePage layout: email input + Google sign-in option.
 *
 * Email flow:  /login/email → /login/verify → /login/2fa → dashboard
 * Google flow: /login/email → /login/2fa → dashboard
 */
export function LoginEmailPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { loading: emailLoading, withDelay: withEmailDelay } = useMockDelay(400, 700);
  const { loading: googleLoading, withDelay: withGoogleDelay } = useMockDelay(600, 900);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    withEmailDelay(() => {
      const normalizedEmail = email.trim() || "johndoe@gmail.com";
      navigate(ROUTES.LOGIN_VERIFY, { state: { email: normalizedEmail, method: "email" } });
    });
  };

  const handleGoogleSignIn = () => {
    withGoogleDelay(() => {
      navigate(ROUTES.LOGIN_2FA, { state: { method: "google", email: "johndoe@gmail.com" } });
    });
  };

  const formContent = (
    <div className="flex w-full flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 border-[#d5d7da] bg-white px-4 text-base shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] placeholder:text-[#717680]"
          autoComplete="email"
        />
        <Button
          type="submit"
          disabled={emailLoading}
          className="h-11 w-full rounded-lg text-base font-semibold"
        >
          {emailLoading ? "Loading..." : "Continue"}
        </Button>
      </form>

      <div className="flex w-full items-center gap-2">
        <div className="h-px flex-1 bg-[#e9eaeb]" />
        <span className="shrink-0 text-sm font-medium text-[#535862]">OR</span>
        <div className="h-px flex-1 bg-[#e9eaeb]" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="h-11 w-full rounded-lg border-[#d5d7da] bg-white text-base font-semibold text-[#414651] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] hover:bg-gray-50"
      >
        <GoogleIcon />
        {googleLoading ? "Connecting..." : "Sign in with Google"}
      </Button>
    </div>
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
          <div className="flex w-full max-w-[360px] flex-col items-center gap-8">
            <div className="flex w-full flex-col items-center gap-3 text-center">
              <h1 className="text-[30px] font-semibold leading-[38px] text-[#181d27]">
                Welcome back
              </h1>
              <p className="text-base leading-6 text-[#535862]">
                Sign in to your account.
              </p>
            </div>

            {formContent}

            <div className="flex w-full items-center justify-center gap-1">
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
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <h1 className="text-[30px] font-semibold leading-[38px] text-[#181d27]">
              Welcome back
            </h1>
            <p className="text-base leading-6 text-[#535862]">
              Sign in to your account.
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
