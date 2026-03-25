import { useState } from "react";
import { Copy, Check } from "lucide-react";
import caretLeftSvg from "@/assets/auth/caret-left.svg";
import fingerprintSimpleSvg from "@/assets/auth/fingerprint-simple.svg";
import qrCodeSvg from "@/assets/auth/qr-code.svg";
import { AuthHeroPanel } from "./AuthHeroPanel";
import { AuthBottomBadges } from "./AuthBottomBadges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MOCK_SETUP_KEY = "X92M-FU3P-J7ZL-T8WV-FU3P-J7ZL-T8WV";

interface TwoFactorSetupScreenProps {
  onBack: () => void;
  onVerified: () => void;
  onCancel: () => void;
}

export function TwoFactorSetupScreen({ onBack, onVerified, onCancel }: TwoFactorSetupScreenProps) {
  const [showManual, setShowManual] = useState(false);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_SETUP_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silent fail
    }
  };

  const handleVerify = () => {
    if (code.trim().length === 6) {
      onVerified();
    }
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#f7f7f8]">
      <AuthHeroPanel />
      <AuthBottomBadges />

      {/* Back button */}
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="absolute left-4 top-4 z-30 h-8 gap-1.5 rounded-md px-3 text-[13px] font-medium text-[#18181b]"
      >
        <img alt="" src={caretLeftSvg} aria-hidden="true" className="size-[15px]" />
        Back
      </Button>

      {/* Left content panel */}
      <div className="relative z-10 flex h-full items-center justify-center lg:w-[calc(50vw-16px)]">
        <div className="flex w-full max-w-[420px] flex-col items-center gap-6">

          {/* Header block */}
          <div className="flex w-[350px] flex-col items-center gap-6">
            {/* Fingerprint icon */}
            <div
              className="flex size-16 shrink-0 items-start rounded-2xl p-4"
              style={{ backgroundColor: "rgba(5,150,105,0.12)" }}
            >
              <img alt="" src={fingerprintSimpleSvg} aria-hidden="true" className="size-8" />
            </div>

            {/* Title + subtitle */}
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <p className="text-[18px] font-medium leading-[26px] text-[#0a0a0a]">
                Set up two-factor authentication
              </p>
              <p className="text-sm leading-5 text-[#6f6f77]">
                Add an extra layer of security. Scan the QR code or enter the setup key in your
                authenticator app, then enter the 6-digit code from the app.
              </p>
            </div>
          </div>

          {/* QR / manual block + form */}
          <div className="flex w-[420px] flex-col items-center gap-10">

            {/* Toggleable block */}
            {!showManual ? (
              /* ── QR code view ── */
              <div className="flex flex-col items-center gap-4" style={{ width: 264 }}>
                {/* QR code container */}
                <div
                  className="relative shrink-0 bg-white"
                  style={{
                    width: 264,
                    height: 264,
                    borderRadius: "16.046px",
                    border: "1px solid #e3eae4",
                  }}
                >
                  <img
                    alt="QR code for authenticator app"
                    src={qrCodeSvg}
                    className="absolute"
                    style={{ left: "20.69px", top: "20.69px", width: "220.623px", height: "220.623px" }}
                  />
                  {/* Corner markers */}
                  <div className="absolute" style={{ left: "12.66px", top: "12.66px", width: "20.056px", height: "20.056px", borderTop: "2.721px solid #39743f", borderLeft: "2.721px solid #39743f", borderRadius: "8.023px 0 0 0" }} />
                  <div className="absolute" style={{ left: "229.28px", top: "12.66px", width: "20.056px", height: "20.056px", borderTop: "2.721px solid #39743f", borderRight: "2.721px solid #39743f", borderRadius: "0 8.023px 0 0" }} />
                  <div className="absolute" style={{ left: "12.66px", top: "229.28px", width: "20.056px", height: "20.056px", borderBottom: "2.721px solid #39743f", borderLeft: "2.721px solid #39743f", borderRadius: "0 0 0 8.023px" }} />
                  <div className="absolute" style={{ left: "229.28px", top: "229.28px", width: "20.056px", height: "20.056px", borderBottom: "2.721px solid #39743f", borderRight: "2.721px solid #39743f", borderRadius: "0 0 8.023px 0" }} />
                </div>

                <Button
                  type="button"
                  variant="link"
                  onClick={() => setShowManual(true)}
                  className="h-auto p-0 text-sm font-medium text-primary"
                >
                  Trouble scanning?
                </Button>
              </div>
            ) : (
              /* ── Manual code view ── */
              <div className="flex w-full flex-col items-center gap-4">
                {/* Setup key — read-only input + copy button */}
                <div className="flex w-full items-center gap-2">
                  <Input
                    readOnly
                    value={MOCK_SETUP_KEY}
                    aria-label="Two-factor authentication setup key"
                    className="h-10 flex-1 cursor-default border-[#d5d7da] bg-muted font-mono text-sm tracking-widest select-all focus-visible:ring-0 focus-visible:border-[#d5d7da]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    className="h-10 w-10 shrink-0 border-[#d5d7da] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-colors"
                    aria-label={copied ? "Copied!" : "Copy setup key"}
                    title={copied ? "Copied!" : "Copy setup key"}
                  >
                    {copied
                      ? <Check className="size-4 text-primary" />
                      : <Copy className="size-4" />
                    }
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="link"
                  onClick={() => setShowManual(false)}
                  className="h-auto p-0 text-sm font-medium text-primary"
                >
                  Show QR code instead
                </Button>
              </div>
            )}

            {/* Form */}
            <div className="flex w-full flex-col gap-4">
              {/* Verification code input */}
              <div className="flex w-full flex-col gap-1.5">
                <Label htmlFor="totp-code" className="text-sm font-medium text-[#414651]">
                  Verification code
                </Label>
                <Input
                  id="totp-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code from your app"
                  className="h-11 border-[#d5d7da] bg-white px-4 text-base shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] placeholder:text-[#717680]"
                />
              </div>

              {/* Buttons */}
              <div className="flex w-full flex-col gap-2">
                <Button
                  type="button"
                  onClick={handleVerify}
                  disabled={code.trim().length !== 6}
                  className="h-10 w-full rounded-lg text-sm font-medium"
                >
                  Verify &amp; Enable 2FA
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  className="h-10 w-full rounded-lg text-sm font-medium"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
