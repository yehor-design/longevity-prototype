import { useEffect, useRef, useState } from "react";
import { useMockDelay } from "@/hooks/useMockDelay";
import verifyLogoPng from "@/assets/auth/verify-logo.png";
import { AuthBottomBadges } from "./AuthBottomBadges";
import { VerifyHeroPanel } from "./VerifyHeroPanel";
import { cn } from "@/lib/utils";

const CLOCK_ICON = "https://www.figma.com/api/mcp/asset/678781a6-95f1-405a-820d-5c1494085d88";
const OTP_DIGITS = 6;
const OTP_EXPIRATION_SECONDS = 15 * 60;

interface VerifyEmailScreenProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

interface OtpSlotsProps {
  code: string;
  onClick: () => void;
  compact?: boolean;
}

function OtpSlots({ code, onClick, compact = false }: OtpSlotsProps) {
  const size = compact ? 48 : 64;
  const textSize = compact ? "34px" : "48px";
  const lineHeight = compact ? "42px" : "60px";
  const tracking = compact ? "-0.68px" : "-0.96px";
  const slotRadius = compact ? "8px" : "10px";
  const dashWidth = compact ? "20px" : "28px";

  const digits = Array.from({ length: OTP_DIGITS }, (_, index) => code[index] ?? "0");

  return (
    <div className="flex items-center gap-2">
      {digits.slice(0, 3).map((digit, index) => (
        <button
          key={`left-${index}`}
          type="button"
          onClick={onClick}
          className="cursor-text border border-[#d5d7da] bg-white px-2 py-[2px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
          style={{
            width: `${size}px`,
            minHeight: `${size}px`,
            borderRadius: slotRadius,
          }}
        >
          <span
            className={cn(
              "block w-full text-center font-medium",
              code[index] ? "text-[#181d27]" : "text-[#d5d7da]",
            )}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: textSize,
              lineHeight,
              letterSpacing: tracking,
            }}
          >
            {digit}
          </span>
        </button>
      ))}

      <div
        className="flex items-center justify-center text-[#d5d7da] font-medium"
        style={{
          width: dashWidth,
          height: `${size}px`,
          fontFamily: "Inter, sans-serif",
          fontSize: compact ? "44px" : "60px",
          lineHeight: compact ? "52px" : "72px",
          letterSpacing: compact ? "-0.88px" : "-1.2px",
        }}
      >
        -
      </div>

      {digits.slice(3).map((digit, index) => {
        const absoluteIndex = index + 3;
        return (
          <button
            key={`right-${index}`}
            type="button"
            onClick={onClick}
            className="cursor-text border border-[#d5d7da] bg-white px-2 py-[2px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
            style={{
              width: `${size}px`,
              minHeight: `${size}px`,
              borderRadius: slotRadius,
            }}
          >
            <span
              className={cn(
                "block w-full text-center font-medium",
                code[absoluteIndex] ? "text-[#181d27]" : "text-[#d5d7da]",
              )}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: textSize,
                lineHeight,
                letterSpacing: tracking,
              }}
            >
              {digit}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Shared 6-digit email verification screen (desktop 1:1 from Figma, mobile fallback).
 */
export function VerifyEmailScreen({ email, onVerified, onBack }: VerifyEmailScreenProps) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(OTP_EXPIRATION_SECONDS);
  const { loading, withDelay } = useMockDelay(500, 800);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((value) => Math.max(value - 1, 0));
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

  const focusHiddenInput = () => {
    hiddenInputRef.current?.focus();
  };

  const handleOtpChange = (rawValue: string) => {
    const nextValue = rawValue.replace(/\D/g, "").slice(0, OTP_DIGITS);
    setOtp(nextValue);
  };

  const handleResend = () => {
    setOtp("");
    setCountdown(OTP_EXPIRATION_SECONDS);
    hasTriggeredRef.current = false;
    hiddenInputRef.current?.focus();
  };

  const minutes = String(Math.floor(countdown / 60)).padStart(2, "0");
  const seconds = String(countdown % 60).padStart(2, "0");

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#f7f7f8]">
      <VerifyHeroPanel />

      <input
        ref={hiddenInputRef}
        autoFocus
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        value={otp}
        onChange={(event) => handleOtpChange(event.target.value)}
        className="pointer-events-none absolute h-px w-px opacity-0"
        aria-label="Verification code"
      />

      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-4 z-30 inline-flex items-center justify-center gap-[6px] rounded-[6px] px-[10px] py-[6px] text-[#18181b] hover:opacity-80"
        style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: "20px", fontWeight: 500 }}
      >
        <span aria-hidden="true" className="text-[15px] leading-[15px]">{"\u2190"}</span>
        <span>Back</span>
      </button>

      <AuthBottomBadges />

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
          Verify your email
        </h1>
        <p
          className="mt-2 text-[#535862]"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
        >
          We&apos;ve sent a 6-digit code to
        </p>

        <div
          className="mt-4 inline-flex items-center justify-center rounded-[999px] border border-[rgba(0,0,0,0.06)] bg-[#efefef] px-3 py-1.5"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", fontWeight: 500, color: "#232323" }}
        >
          {email}
        </div>

        <div className="mt-7" onClick={focusHiddenInput}>
          <OtpSlots code={otp} onClick={focusHiddenInput} compact />
        </div>

        <p
          className="mt-3 text-[#535862]"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
        >
          Didn&apos;t get a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="underline decoration-solid underline-offset-1"
          >
            Click to resend
          </button>
          .
        </p>

        <div
          className="mt-2 flex items-center gap-2 text-[#535862]"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", fontWeight: 500 }}
        >
          <img alt="" src={CLOCK_ICON} className="size-3" />
          <span>
            Expires in {minutes}:{seconds}
          </span>
        </div>
      </div>

      <div className="relative z-10 hidden h-full lg:flex">
        <div className="flex h-full w-[calc(50vw-16px)] items-center justify-center px-6">
          <div className="flex w-full max-w-[460px] flex-col items-center gap-6">
            <div className="flex w-[360px] flex-col items-center gap-4 text-center">
              <div
                className="size-12"
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
                className="w-full font-semibold text-[#181d27]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "30px", lineHeight: "38px" }}
              >
                Verify your email
              </h1>
              <p
                className="w-full font-normal text-[#535862]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", lineHeight: "24px" }}
              >
                We&apos;ve sent a 6-digit code to
              </p>

              <div
                className="inline-flex items-center justify-center rounded-[999px] border border-[rgba(0,0,0,0.06)] bg-[#efefef] px-3 py-1.5"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: "#232323",
                }}
              >
                {email}
              </div>
            </div>

            <div className="w-full" onClick={focusHiddenInput}>
              <OtpSlots code={otp} onClick={focusHiddenInput} />
            </div>

            <div className="flex w-full items-center justify-between">
              <p
                className="font-normal text-[#535862]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px" }}
              >
                Didn&apos;t get a code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="underline decoration-solid underline-offset-1"
                >
                  Click to resend
                </button>
                .
              </p>

              <div
                className="flex items-center gap-2 text-[#535862]"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", fontWeight: 500 }}
              >
                <img alt="" src={CLOCK_ICON} className="size-3" />
                <span>
                  Expires in {minutes}:{seconds}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
