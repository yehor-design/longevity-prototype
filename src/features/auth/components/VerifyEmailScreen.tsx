import { useEffect, useRef, useState } from "react";
import { useMockDelay } from "@/hooks/useMockDelay";
import verifyLogoPng from "@/assets/auth/verify-logo.png";
import caretLeftSvg from "@/assets/auth/caret-left.svg";
import { AuthBottomBadges } from "./AuthBottomBadges";
import { VerifyHeroPanel } from "./VerifyHeroPanel";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

const CLOCK_ICON = "https://www.figma.com/api/mcp/asset/678781a6-95f1-405a-820d-5c1494085d88";
const OTP_DIGITS = 6;
const OTP_EXPIRATION_SECONDS = 15 * 60;

interface VerifyEmailScreenProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
  title?: string;
}

/**
 * Shared 6-digit email verification screen (desktop 1:1 from Figma, mobile fallback).
 */
export function VerifyEmailScreen({ email, onVerified, onBack, title = "{title}" }: VerifyEmailScreenProps) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(OTP_EXPIRATION_SECONDS);
  const { loading, withDelay } = useMockDelay(500, 800);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setInterval(() => {
      setCountdown((v) => Math.max(v - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (otp.length === OTP_DIGITS && !loading && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      withDelay(onVerified);
      return;
    }
    if (otp.length < OTP_DIGITS) {
      hasTriggeredRef.current = false;
    }
  }, [otp, loading, onVerified, withDelay]);

  const handleResend = () => {
    setOtp("");
    setCountdown(OTP_EXPIRATION_SECONDS);
    hasTriggeredRef.current = false;
  };

  const minutes = String(Math.floor(countdown / 60)).padStart(2, "0");
  const seconds = String(countdown % 60).padStart(2, "0");

  const otpInput = (slotClassName: string, shouldAutoFocus = false) => (
    <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus={shouldAutoFocus}>
      {[0, 1, 2].map((i) => (
        <InputOTPGroup key={i}>
          <InputOTPSlot index={i} className={slotClassName} />
        </InputOTPGroup>
      ))}
      <InputOTPSeparator />
      {[3, 4, 5].map((i) => (
        <InputOTPGroup key={i}>
          <InputOTPSlot index={i} className={slotClassName} />
        </InputOTPGroup>
      ))}
    </InputOTP>
  );

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#f7f7f8]">
      <VerifyHeroPanel />

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="absolute left-4 top-4 z-30 h-8 gap-1.5 rounded-md px-3 text-[13px] font-medium text-[#18181b]"
      >
        <img alt="" src={caretLeftSvg} aria-hidden="true" className="size-[15px]" />
        Back
      </Button>

      <AuthBottomBadges />

      {/* Mobile */}
      <div className="lg:hidden relative z-10 flex h-full flex-col items-center justify-center px-5 pb-24 pt-8 text-center">
        <div
          className="mb-6 size-12 shrink-0"
          style={{
            boxShadow:
              "0px 142.57px 25.532px 0px rgba(7,49,27,0), 0px 91.2px 25.532px 0px rgba(7,49,27,0.01), 0px 51.37px 25.532px 0px rgba(7,49,27,0.05), 0px 22.774px 22.774px 0px rgba(7,49,27,0.08), 0px 5.719px 12.562px 0px rgba(7,49,27,0.09)",
          }}
        >
          <img
            alt=""
            src={verifyLogoPng}
            className="size-full object-cover"
            style={{ backgroundColor: "transparent" }}
          />
        </div>

        <h1
          className="font-semibold text-[#181d27]"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "34px", lineHeight: "40px" }}
        >
          {title}
        </h1>
        <p className="mt-2 text-base leading-6 text-[#535862]">
          We&apos;ve sent a 6-digit code to
        </p>

        <div className="mt-4 inline-flex items-center justify-center rounded-full border border-black/[0.06] bg-[#efefef] px-3 py-1.5 text-sm font-medium text-[#232323]">
          {email}
        </div>

        <div className="mt-7">
          {otpInput("h-12 w-12 text-[34px] font-medium tracking-tighter rounded-lg bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]", false)}
        </div>

        <p className="mt-3 text-sm text-[#535862]">
          Didn&apos;t get a code?{" "}
          <Button
            variant="link"
            className="h-auto p-0 text-sm text-[#535862] underline underline-offset-1"
            onClick={handleResend}
          >
            Click to resend
          </Button>
          .
        </p>

        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#535862]">
          <img alt="" src={CLOCK_ICON} className="size-3" />
          <span>Expires in {minutes}:{seconds}</span>
        </div>
      </div>

      {/* Desktop */}
      <div className="relative z-10 hidden h-full lg:flex">
        <div className="flex h-full w-[calc(50vw-16px)] items-center justify-center px-6">
          <div className="flex w-full max-w-[460px] flex-col items-center gap-6">
            <div className="flex w-[360px] flex-col items-center gap-4">
              <div className="flex w-full flex-col gap-3 text-center">
                <h1
                  className="w-full font-semibold text-[#181d27]"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "30px", lineHeight: "38px" }}
                >
                  {title}
                </h1>
                <p className="w-full text-base leading-6 text-[#535862]">
                  We&apos;ve sent a 6-digit code to
                </p>
              </div>

              <div className="inline-flex items-center justify-center rounded-full border border-black/[0.06] bg-[#efefef] px-3 py-1.5 text-sm font-medium text-[#232323]">
                {email}
              </div>
            </div>

            <div className="flex w-[460px] flex-col items-start gap-1.5">
              {otpInput("h-16 w-16 text-[48px] font-medium tracking-tighter rounded-lg bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]", true)}

              <div className="flex w-full items-center justify-between">
                <p className="text-sm text-[#535862]">
                  Didn&apos;t get a code?{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm text-[#535862] underline underline-offset-1"
                    onClick={handleResend}
                  >
                    Click to resend
                  </Button>
                  .
                </p>

                <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-[#535862]">
                  <img alt="" src={CLOCK_ICON} className="size-3" />
                  <span>Expires in {minutes}:{seconds}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
