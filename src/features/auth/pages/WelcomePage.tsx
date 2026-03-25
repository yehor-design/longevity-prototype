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
 * Registration entry point.
 * Email submit goes directly to Verify Email step.
 */
export function WelcomePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { loading: emailLoading, withDelay: withEmailDelay } = useMockDelay(300, 500);
  const { loading: googleLoading, withDelay: withGoogleDelay } = useMockDelay(600, 900);

  const handleGetStarted = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    withEmailDelay(() => {
      const normalizedEmail = email.trim() || "johndoe@gmail.com";
      navigate(ROUTES.REGISTER_VERIFY, {
        state: { email: normalizedEmail, flow: "register" },
      });
    });
  };

  const handleGoogleSignIn = () => {
    withGoogleDelay(() => {
      navigate(ROUTES.REGISTER_GOOGLE_2FA);
    });
  };

  const formContent = (
    <div className="flex w-full flex-col gap-6">
      <form onSubmit={handleGetStarted} className="flex w-full flex-col gap-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 border-[#d5d7da] bg-white px-4 text-base shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] placeholder:text-[#717680]"
        />
        <Button
          type="submit"
          disabled={emailLoading}
          className="h-11 w-full rounded-lg text-base font-semibold"
        >
          {emailLoading ? "Loading..." : "Get started"}
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
        {googleLoading ? "Connecting..." : "Sign up with Google"}
      </Button>
    </div>
  );

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#f7f7f8]">
      <AuthHeroPanel />
      <AuthBottomBadges />

      {/* Desktop */}
      <div className="relative z-10 hidden h-full lg:flex">
        <div className="flex h-full w-[calc(50vw-16px)] items-center justify-center px-6">
          <div className="flex w-full max-w-[360px] flex-col items-center gap-8">
            <div className="flex w-full flex-col items-center gap-3">
              <p className="w-full text-center text-[30px] font-semibold leading-[38px] text-[#181d27]">
                Create an account
              </p>
              <p className="w-full text-center text-base font-normal leading-6 text-[#535862]">
                Start your 30-day free trial.
              </p>
            </div>

            {formContent}

            <div className="flex w-full items-center justify-center gap-1">
              <span className="text-sm font-normal text-[#535862]">Already have an account?</span>
              <Button
                variant="link"
                className="h-auto p-0 text-sm font-semibold text-primary"
                onClick={() => navigate(ROUTES.LOGIN_EMAIL)}
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="relative z-10 flex h-full items-center justify-center px-5 pb-24 pt-16 lg:hidden">
        <div className="w-full max-w-[360px]">
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <p className="w-full text-[30px] font-semibold leading-[38px] text-[#181d27]">
              Create an account
            </p>
            <p className="w-full text-base font-normal leading-6 text-[#535862]">
              Start your 30-day free trial.
            </p>
          </div>

          <div className="mt-8">{formContent}</div>

          <div className="mt-6 flex w-full items-center justify-center gap-1">
            <span className="text-sm font-normal text-[#535862]">Already have an account?</span>
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-semibold text-primary"
              onClick={() => navigate(ROUTES.LOGIN_EMAIL)}
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
