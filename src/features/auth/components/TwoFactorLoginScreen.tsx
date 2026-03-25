import { useState } from "react";
import caretLeftSvg from "@/assets/auth/caret-left.svg";
import fingerprintSimpleSvg from "@/assets/auth/fingerprint-simple.svg";
import { AuthHeroPanel } from "./AuthHeroPanel";
import { AuthBottomBadges } from "./AuthBottomBadges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMockDelay } from "@/hooks/useMockDelay";

interface TwoFactorLoginScreenProps {
  onBack: () => void;
  onVerified: () => void;
}

/**
 * Sign-in — 2FA verification step.
 * User enters the 6-digit TOTP code from their authenticator app.
 */
export function TwoFactorLoginScreen({ onBack, onVerified }: TwoFactorLoginScreenProps) {
  const [code, setCode] = useState("");
  const { loading, withDelay } = useMockDelay(500, 800);

  const isValid = code.trim().length === 6;

  const handleVerify = () => {
    if (!isValid || loading) return;
    withDelay(onVerified);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  const formContent = (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-1.5">
        <Label htmlFor="totp-login-code" className="text-sm font-medium text-[#414651]">
          Verification code
        </Label>
        <Input
          id="totp-login-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
          value={code}
          onChange={handleCodeChange}
          placeholder="Enter 6-digit code"
          className="h-11 border-[#d5d7da] bg-white px-4 text-base tracking-widest shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] placeholder:text-[#717680] placeholder:tracking-normal"
        />
      </div>

      <Button
        type="button"
        onClick={handleVerify}
        disabled={!isValid || loading}
        className="h-11 w-full rounded-lg text-base font-semibold"
      >
        {loading ? "Verifying..." : "Continue"}
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
        onClick={onBack}
        className="absolute left-4 top-4 z-30 h-8 gap-1.5 rounded-md px-3 text-[13px] font-medium text-[#18181b]"
      >
        <img alt="" src={caretLeftSvg} aria-hidden="true" className="size-[15px]" />
        Back
      </Button>

      {/* Desktop */}
      <div className="relative z-10 hidden h-full lg:flex">
        <div className="flex h-full w-[calc(50vw-16px)] items-center justify-center px-6">
          <div className="flex w-full max-w-[360px] flex-col items-center gap-8">
            {/* Icon */}
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(5,150,105,0.12)" }}
            >
              <img alt="" src={fingerprintSimpleSvg} aria-hidden="true" className="size-8" />
            </div>

            {/* Header */}
            <div className="flex w-full flex-col items-center gap-3 text-center">
              <h1 className="text-[30px] font-semibold leading-[38px] text-[#181d27]">
                Two-factor authentication
              </h1>
              <p className="text-base leading-6 text-[#535862]">
                Enter the 6-digit code from your authenticator app.
              </p>
            </div>

            {formContent}

            <Button
              variant="link"
              className="h-auto p-0 text-sm font-normal text-[#535862] underline underline-offset-2"
              onClick={() => withDelay(onVerified)}
              disabled={loading}
            >
              Can&apos;t access your app? Use a recovery code
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-24 pt-16 text-center lg:hidden">
        <div className="w-full max-w-[360px]">
          {/* Icon */}
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(5,150,105,0.12)" }}
          >
            <img alt="" src={fingerprintSimpleSvg} aria-hidden="true" className="size-8" />
          </div>

          <h1 className="text-[30px] font-semibold leading-[38px] text-[#181d27]">
            Two-factor authentication
          </h1>
          <p className="mt-3 text-base leading-6 text-[#535862]">
            Enter the 6-digit code from your authenticator app.
          </p>

          <div className="mt-8">{formContent}</div>

          <div className="mt-4">
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-normal text-[#535862] underline underline-offset-2"
              onClick={() => withDelay(onVerified)}
              disabled={loading}
            >
              Can&apos;t access your app? Use a recovery code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
