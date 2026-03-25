import { useState } from "react";
import caretLeftSvg from "@/assets/auth/caret-left.svg";
import fingerprintSimpleSvg from "@/assets/auth/fingerprint-simple.svg";
import qrCodeSvg from "@/assets/auth/qr-code.svg";
import copyIconSvg from "@/assets/auth/copy-icon.svg";
import { AuthHeroPanel } from "./AuthHeroPanel";
import { AuthBottomBadges } from "./AuthBottomBadges";

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
      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-4 z-30 inline-flex items-center justify-center gap-[6px] rounded-[6px] px-[10px] py-[6px] text-[#18181b] hover:opacity-80"
        style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: "20px", fontWeight: 500 }}
      >
        <img alt="" src={caretLeftSvg} aria-hidden="true" className="size-[15px]" />
        <span>Back</span>
      </button>

      {/* Left content panel */}
      <div className="relative z-10 flex h-full items-center justify-center lg:w-[calc(50vw-16px)]">
        <div className="flex w-full max-w-[420px] flex-col items-center gap-[24px]">

          {/* Header block — w-[350px] */}
          <div className="flex w-[350px] flex-col items-center gap-[24px]">
            {/* Fingerprint icon */}
            <div
              className="flex shrink-0 items-start rounded-[16px] p-[16px]"
              style={{
                width: 64,
                height: 64,
                backgroundColor: "rgba(5,150,105,0.12)",
              }}
            >
              <img alt="" src={fingerprintSimpleSvg} aria-hidden="true" className="size-[32px]" />
            </div>

            {/* Title + subtitle */}
            <div
              className="flex w-full flex-col items-center gap-[8px] text-center"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontStyle: "normal" }}
            >
              <p style={{ fontSize: "18px", lineHeight: "26px", color: "#0a0a0a" }}>
                Set up two-factor authentication
              </p>
              <p style={{ fontSize: "14px", lineHeight: "20px", color: "#6f6f77" }}>
                Add an extra layer of security. Scan the QR code or enter the setup key in your
                authenticator app, then enter the 6-digit code from the app.
              </p>
            </div>
          </div>

          {/* QR / manual block + form — w-[420px] */}
          <div className="flex w-[420px] flex-col items-center gap-[40px]">

            {/* Toggleable block */}
            {!showManual ? (
              /* ── QR code view ── */
              <div className="flex flex-col items-center gap-[16px]" style={{ width: 264 }}>
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
                  {/* QR code image */}
                  <img
                    alt="QR code for authenticator app"
                    src={qrCodeSvg}
                    className="absolute"
                    style={{ left: "20.69px", top: "20.69px", width: "220.623px", height: "220.623px" }}
                  />

                  {/* Corner markers */}
                  <div
                    className="absolute"
                    style={{
                      left: "12.66px",
                      top: "12.66px",
                      width: "20.056px",
                      height: "20.056px",
                      borderTop: "2.721px solid #39743f",
                      borderLeft: "2.721px solid #39743f",
                      borderRadius: "8.023px 0 0 0",
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      left: "229.28px",
                      top: "12.66px",
                      width: "20.056px",
                      height: "20.056px",
                      borderTop: "2.721px solid #39743f",
                      borderRight: "2.721px solid #39743f",
                      borderRadius: "0 8.023px 0 0",
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      left: "12.66px",
                      top: "229.28px",
                      width: "20.056px",
                      height: "20.056px",
                      borderBottom: "2.721px solid #39743f",
                      borderLeft: "2.721px solid #39743f",
                      borderRadius: "0 0 0 8.023px",
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      left: "229.28px",
                      top: "229.28px",
                      width: "20.056px",
                      height: "20.056px",
                      borderBottom: "2.721px solid #39743f",
                      borderRight: "2.721px solid #39743f",
                      borderRadius: "0 0 8.023px 0",
                    }}
                  />
                </div>

                {/* Trouble scanning link */}
                <button
                  type="button"
                  onClick={() => setShowManual(true)}
                  className="whitespace-nowrap hover:opacity-80"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#047857",
                  }}
                >
                  Trouble scanning?
                </button>
              </div>
            ) : (
              /* ── Manual code view ── */
              <div className="relative shrink-0" style={{ width: 420, height: 76 }}>
                {/* White input container */}
                <div
                  className="absolute"
                  style={{
                    left: 0,
                    top: 0,
                    width: 420,
                    height: 40,
                    backgroundColor: "white",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "12px",
                  }}
                />

                {/* Setup key text */}
                <p
                  className="absolute whitespace-nowrap"
                  style={{
                    left: 16,
                    top: 8,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#6f6f77",
                  }}
                >
                  {MOCK_SETUP_KEY}
                </p>

                {/* Vertical divider */}
                <div
                  className="absolute"
                  style={{
                    left: 381,
                    top: 0,
                    width: 1,
                    height: 40,
                    backgroundColor: "#e4e4e7",
                  }}
                />

                {/* Copy icon button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute hover:opacity-70 transition-opacity"
                  style={{ left: 392, top: 12, width: 16, height: 16 }}
                  aria-label={copied ? "Copied!" : "Copy setup key"}
                  title={copied ? "Copied!" : "Copy setup key"}
                >
                  <img alt="" src={copyIconSvg} className="size-full" />
                </button>

                {/* Show QR code instead link */}
                <button
                  type="button"
                  onClick={() => setShowManual(false)}
                  className="absolute whitespace-nowrap hover:opacity-80"
                  style={{
                    left: "50%",
                    top: 56,
                    transform: "translateX(-50%)",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#047857",
                  }}
                >
                  Show QR code instead
                </button>
              </div>
            )}

            {/* Form */}
            <div className="flex w-full flex-col items-center gap-[16px]">
              {/* Verification code input */}
              <div className="flex w-full flex-col gap-[6px]">
                <label
                  htmlFor="totp-code"
                  className="whitespace-nowrap"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#414651",
                  }}
                >
                  Verification code
                </label>
                <div
                  className="flex items-center gap-[8px] bg-white px-[14px] py-[10px] rounded-[8px]"
                  style={{
                    border: "1px solid #d5d7da",
                    boxShadow: "0px 1px 2px 0px rgba(10,13,18,0.05)",
                  }}
                >
                  <input
                    id="totp-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit code from your app"
                    className="flex-1 min-w-0 bg-transparent outline-none"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "#0a0a0a",
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex w-full flex-col gap-[8px]">
                {/* Verify & Enable 2FA */}
                <button
                  type="button"
                  onClick={handleVerify}
                  className="relative flex w-full items-center justify-center overflow-hidden rounded-[6px] px-[16px] py-[10px] hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: "#047857",
                    boxShadow: "0px 1px 2px 0px rgba(4,120,87,0.4), 0px 0px 0px 1px #065f46",
                  }}
                >
                  <span
                    className="relative whitespace-nowrap"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "rgba(255,255,255,0.88)",
                    }}
                  >
                    Verify &amp; Enable 2FA
                  </span>
                  {/* Inner top highlight */}
                  <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0.75px_0px_0px_rgba(255,255,255,0.2)]" />
                </button>

                {/* Cancel */}
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex w-full items-center justify-center rounded-[6px] px-[16px] py-[10px] hover:opacity-70 transition-opacity"
                >
                  <span
                    className="whitespace-nowrap"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#18181b",
                    }}
                  >
                    Cancel
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
