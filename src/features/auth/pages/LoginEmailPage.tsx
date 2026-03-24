import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useMockDelay } from "@/hooks/useMockDelay";
import { ROUTES } from "@/lib/constants";
import { AuthBottomBadges } from "@/features/auth/components/AuthBottomBadges";
import { AuthHeroPanel } from "@/features/auth/components/AuthHeroPanel";

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

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#f7f7f8]">
      <AuthHeroPanel />
      <AuthBottomBadges />

      <button
        type="button"
        onClick={() => navigate(ROUTES.WELCOME)}
        className="absolute left-4 top-4 z-30 inline-flex items-center justify-center gap-[6px] rounded-[6px] px-[10px] py-[6px] text-[#18181b] hover:opacity-80"
        style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: "20px", fontWeight: 500 }}
      >
        <span aria-hidden="true" className="text-[15px] leading-[15px]">{"\u2190"}</span>
        <span>Back</span>
      </button>

      <div className="relative z-10 hidden h-full lg:flex">
        <div className="flex h-full w-[calc(50vw-16px)] items-center justify-center px-6">
          <div className="w-full max-w-[360px]">
            <div className="text-center">
              <h1
                className="font-semibold text-[#181d27]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "30px", lineHeight: "38px" }}
              >
                Welcome back
              </h1>
              <p
                className="mt-3 text-[#535862]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
              >
                Enter your email to sign in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col" style={{ gap: "16px" }}>
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
                disabled={loading}
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
                  {loading ? "Loading..." : "Continue"}
                </span>
              </button>
            </form>

            <div className="mt-6 flex w-full items-center justify-center gap-1">
              <span
                className="font-normal text-[#535862]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
              >
                Don&apos;t have an account?
              </span>
              <button
                type="button"
                onClick={() => navigate(ROUTES.WELCOME)}
                className="font-semibold text-[#047857]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-5 pb-24 pt-16 lg:hidden">
        <div className="w-full max-w-[360px]">
          <div className="text-center">
            <h1
              className="font-semibold text-[#181d27]"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "30px", lineHeight: "38px" }}
            >
              Welcome back
            </h1>
            <p
              className="mt-3 text-[#535862]"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
            >
              Enter your email to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col" style={{ gap: "16px" }}>
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
              disabled={loading}
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
                {loading ? "Loading..." : "Continue"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
