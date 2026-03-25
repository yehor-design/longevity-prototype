import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useMockDelay } from "@/hooks/useMockDelay";
import { ROUTES } from "@/lib/constants";
import { AuthBottomBadges } from "@/features/auth/components/AuthBottomBadges";
import { AuthHeroPanel } from "@/features/auth/components/AuthHeroPanel";

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

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#f7f7f8]">
      <AuthHeroPanel />
      <AuthBottomBadges />

      <div className="relative z-10 hidden h-full lg:flex">
        <div className="flex h-full w-[calc(50vw-16px)] items-center justify-center px-6">
          <div className="flex w-full max-w-[360px] flex-col items-center" style={{ gap: "32px" }}>
            <div className="flex w-full flex-col items-center" style={{ gap: "12px" }}>
              <p
                className="w-full text-center font-semibold text-[#181d27]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "30px", lineHeight: "38px" }}
              >
                Create an account
              </p>
              <p
                className="w-full text-center font-normal text-[#535862]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
              >
                Start your 30-day free trial.
              </p>
            </div>

            <div className="flex w-full flex-col items-center" style={{ gap: "24px" }}>
              <form onSubmit={handleGetStarted} className="flex w-full flex-col" style={{ gap: "16px" }}>
                <div
                  className="flex w-full items-center border border-[#d5d7da] bg-white"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 14px",
                    gap: "8px",
                    boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
                  }}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full flex-1 bg-transparent font-normal text-[#717680] outline-none"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={emailLoading}
                  className="relative flex w-full items-center justify-center overflow-hidden"
                  style={{
                    borderRadius: "8px",
                    padding: "10px 16px",
                    border: "2px solid rgba(255,255,255,0.12)",
                    boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
                  }}
                >
                  <span className="absolute inset-0 bg-[#047857]" style={{ borderRadius: "8px" }} />
                  <span
                    className="pointer-events-none absolute inset-0"
                    style={{
                      borderRadius: "inherit",
                      boxShadow:
                        "inset 0px 0px 0px 1px rgba(10,13,18,0.18), inset 0px -2px 0px 0px rgba(10,13,18,0.05)",
                    }}
                  />
                  <span
                    className="relative whitespace-nowrap font-semibold text-white"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
                  >
                    {emailLoading ? "Loading..." : "Get started"}
                  </span>
                </button>
              </form>

              <div className="flex w-full items-center" style={{ gap: "8px" }}>
                <div className="h-px flex-1 bg-[#e9eaeb]" />
                <span
                  className="shrink-0 text-center font-medium text-[#535862]"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
                >
                  OR
                </span>
                <div className="h-px flex-1 bg-[#e9eaeb]" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="relative flex w-full items-center justify-center gap-3 overflow-hidden border border-[#d5d7da]"
                style={{
                  borderRadius: "8px",
                  padding: "10px 16px",
                  boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
                }}
              >
                <span className="absolute inset-0 bg-white" style={{ borderRadius: "8px" }} />
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{
                    borderRadius: "inherit",
                    boxShadow:
                      "inset 0px 0px 0px 1px rgba(10,13,18,0.18), inset 0px -2px 0px 0px rgba(10,13,18,0.05)",
                  }}
                />
                <div className="relative flex items-center justify-center gap-3">
                  <GoogleIcon />
                  <span
                    className="whitespace-nowrap font-semibold text-[#414651]"
                    style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
                  >
                    {googleLoading ? "Connecting..." : "Sign up with Google"}
                  </span>
                </div>
              </button>
            </div>

            <div className="flex w-full items-center justify-center gap-1">
              <span
                className="font-normal text-[#535862]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
              >
                Already have an account?
              </span>
              <button
                type="button"
                onClick={() => navigate(ROUTES.LOGIN_EMAIL)}
                className="font-semibold text-[#047857]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-5 pb-24 pt-16 lg:hidden">
        <div className="w-full max-w-[360px]">
          <div className="flex w-full flex-col items-center text-center" style={{ gap: "12px" }}>
            <p
              className="w-full font-semibold text-[#181d27]"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "30px", lineHeight: "38px" }}
            >
              Create an account
            </p>
            <p
              className="w-full font-normal text-[#535862]"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
            >
              Start your 30-day free trial.
            </p>
          </div>

          <form onSubmit={handleGetStarted} className="mt-8 flex w-full flex-col" style={{ gap: "16px" }}>
            <div
              className="flex w-full items-center border border-[#d5d7da] bg-white"
              style={{
                borderRadius: "8px",
                padding: "10px 14px",
                gap: "8px",
                boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full flex-1 bg-transparent font-normal text-[#717680] outline-none"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
              />
            </div>

            <button
              type="submit"
              disabled={emailLoading}
              className="relative flex w-full items-center justify-center overflow-hidden"
              style={{
                borderRadius: "8px",
                padding: "10px 16px",
                border: "2px solid rgba(255,255,255,0.12)",
                boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
              }}
            >
              <span className="absolute inset-0 bg-[#047857]" style={{ borderRadius: "8px" }} />
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: "inherit",
                  boxShadow:
                    "inset 0px 0px 0px 1px rgba(10,13,18,0.18), inset 0px -2px 0px 0px rgba(10,13,18,0.05)",
                }}
              />
              <span
                className="relative whitespace-nowrap font-semibold text-white"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
              >
                {emailLoading ? "Loading..." : "Get started"}
              </span>
            </button>

            <div className="flex w-full items-center" style={{ gap: "8px" }}>
              <div className="h-px flex-1 bg-[#e9eaeb]" />
              <span
                className="shrink-0 text-center font-medium text-[#535862]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
              >
                OR
              </span>
              <div className="h-px flex-1 bg-[#e9eaeb]" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="relative flex w-full items-center justify-center gap-3 overflow-hidden border border-[#d5d7da]"
              style={{
                borderRadius: "8px",
                padding: "10px 16px",
                boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
              }}
            >
              <span className="absolute inset-0 bg-white" style={{ borderRadius: "8px" }} />
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: "inherit",
                  boxShadow:
                    "inset 0px 0px 0px 1px rgba(10,13,18,0.18), inset 0px -2px 0px 0px rgba(10,13,18,0.05)",
                }}
              />
              <div className="relative flex items-center justify-center gap-3">
                <GoogleIcon />
                <span
                  className="whitespace-nowrap font-semibold text-[#414651]"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
                >
                  {googleLoading ? "Connecting..." : "Sign up with Google"}
                </span>
              </div>
            </button>
          </form>

          <div className="mt-6 flex w-full items-center justify-center gap-1">
            <span
              className="font-normal text-[#535862]"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
            >
              Already have an account?
            </span>
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN_EMAIL)}
              className="font-semibold text-[#047857]"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
