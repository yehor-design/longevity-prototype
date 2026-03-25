import { useState } from "react";
import caretLeftSvg from "@/assets/auth/caret-left.svg";
import { AuthHeroPanel } from "./AuthHeroPanel";
import { AuthBottomBadges } from "./AuthBottomBadges";

const ASSETS = {
  fileText: "https://www.figma.com/api/mcp/asset/877f5d24-bfac-4ea1-a7d5-9cdddd2ac520",
  arrowSquareOut: "https://www.figma.com/api/mcp/asset/471d22e8-cdee-46b3-90cc-71287238c909",
};

interface ConsentItemDef {
  id: string;
  title: string;
  required: boolean;
  descriptionPre: string;
  link?: { text: string; href: string };
}

const CONSENT_ITEMS: ConsentItemDef[] = [
  {
    id: "data-processing",
    title: "Data Processing Agreement",
    required: true,
    descriptionPre: "I agree to the processing of my health data as described in the ",
    link: { text: "Privacy Policy", href: "/privacy" },
  },
  {
    id: "ai-analysis",
    title: "AI-Powered Analysis",
    required: true,
    descriptionPre: "I consent to AI analysis of my data as explained in the ",
    link: { text: "AI Explanation", href: "/ai-explanation" },
  },
  {
    id: "data-sharing",
    title: "Data Sharing for Healthcare",
    required: true,
    descriptionPre:
      "I consent to sharing anonymized data with healthcare providers for improved care",
  },
  {
    id: "marketing",
    title: "Marketing Communications",
    required: false,
    descriptionPre:
      "Receive updates about features, health tips, and offers. Unsubscribe anytime",
  },
];

// ── Checkbox visual ──────────────────────────────────────────────────────────

interface CheckboxIconProps {
  checked: boolean;
  indeterminate?: boolean;
}

function CheckboxIcon({ checked, indeterminate }: CheckboxIconProps) {
  const active = checked || indeterminate;
  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ width: 20, height: 20 }}>
      <div
        className="flex items-center justify-center"
        style={{
          width: 14,
          height: 14,
          borderRadius: 3,
          backgroundColor: active ? "#047857" : "#fafafa",
          boxShadow: active
            ? "0px 1px 2px 0px rgba(4,120,87,0.3), 0px 0px 0px 1px #065f46"
            : "0px 1px 2px 0px rgba(0,0,0,0.12), 0px 0px 0px 1px rgba(0,0,0,0.08)",
        }}
      >
        {checked && !indeterminate && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
            <path
              d="M1 3.5L3.2 5.5L8 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {indeterminate && (
          <svg width="7" height="2" viewBox="0 0 7 2" fill="none" aria-hidden="true">
            <path d="M0.5 1H6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

// ── Consent card ─────────────────────────────────────────────────────────────

interface ConsentCardProps {
  item: ConsentItemDef;
  checked: boolean;
  onToggle: () => void;
}

function ConsentCard({ item, checked, onToggle }: ConsentCardProps) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="flex w-full cursor-pointer gap-[8px] items-start overflow-hidden rounded-[8px] bg-white p-[8px] text-left transition-shadow duration-150"
      style={{
        boxShadow: checked
          ? "0px 1px 2px 0px rgba(4,120,87,0.12), 0px 0px 0px 1.5px #047857"
          : "0px 1px 2px 0px rgba(0,0,0,0.12), 0px 0px 0px 1px rgba(0,0,0,0.08)",
      }}
    >
      <CheckboxIcon checked={checked} />

      <div className="min-w-0 flex-1">
        {/* Label row */}
        <div className="flex flex-wrap items-center gap-[6px]">
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "13px",
              lineHeight: "20px",
              color: "#18181b",
              whiteSpace: "nowrap",
            }}
          >
            {item.title}
          </span>

          {item.required ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                padding: "1px 5px",
                borderRadius: 6,
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "20px",
                color: "#065f46",
                backgroundColor: "#d1fae5",
                border: "1px solid #a7f3d0",
                whiteSpace: "nowrap",
              }}
            >
              Required
            </span>
          ) : (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                padding: "1px 5px",
                borderRadius: 6,
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "20px",
                color: "#52525b",
                backgroundColor: "#f4f4f5",
                border: "1px solid #e4e4e7",
                whiteSpace: "nowrap",
              }}
            >
              Optional
            </span>
          )}
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            lineHeight: "1.6",
            color: "#52525b",
            margin: 0,
          }}
        >
          {item.descriptionPre}
          {item.link && (
            <a
              href={item.link.href}
              style={{ fontWeight: 500, color: "#047857" }}
              onClick={(e) => e.stopPropagation()}
            >
              {item.link.text}
            </a>
          )}
        </p>
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

interface PrivacyConsentScreenProps {
  onBack: () => void;
  onAccept: () => void;
}

export function PrivacyConsentScreen({ onBack, onAccept }: PrivacyConsentScreenProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const allChecked = checked.size === CONSENT_ITEMS.length;
  const someChecked = checked.size > 0 && !allChecked;
  const requiredAllChecked = CONSENT_ITEMS.filter((i) => i.required).every((i) =>
    checked.has(i.id),
  );

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allChecked) {
      setChecked(new Set());
    } else {
      setChecked(new Set(CONSENT_ITEMS.map((i) => i.id)));
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
        className="absolute left-4 top-4 z-30 inline-flex items-center justify-center gap-[6px] rounded-[6px] px-[10px] py-[6px] text-[#18181b] transition-opacity hover:opacity-80"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          lineHeight: "20px",
          fontWeight: 500,
        }}
      >
        <img alt="" src={caretLeftSvg} aria-hidden="true" className="size-[15px]" />
        <span>Back</span>
      </button>

      {/* Left content panel */}
      <div className="relative z-10 flex h-full items-center justify-center lg:w-[calc(50vw-16px)]">
        <div className="flex w-full max-w-[420px] flex-col items-center gap-[24px] px-4">

          {/* Header block */}
          <div className="flex w-full max-w-[350px] flex-col items-center gap-[24px]">
            {/* File-text icon */}
            <div
              className="flex shrink-0 items-start rounded-[16px] p-[16px]"
              style={{ width: 64, height: 64, backgroundColor: "rgba(234,170,8,0.12)" }}
            >
              <img alt="" src={ASSETS.fileText} aria-hidden="true" className="size-[32px]" />
            </div>

            {/* Title + subtitle */}
            <div
              className="flex w-full flex-col items-center gap-[8px] text-center"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              <p style={{ fontSize: "18px", lineHeight: "26px", color: "#0a0a0a" }}>
                Privacy &amp; Consent
              </p>
              <p style={{ fontSize: "14px", lineHeight: "20px", color: "#6f6f77" }}>
                Review and accept our data policies to continue.
              </p>
            </div>
          </div>

          {/* Checkbox list */}
          <div className="flex w-full flex-col items-start">
            {/* Select All row */}
            <button
              type="button"
              onClick={toggleAll}
              className="flex w-full items-center gap-[8px] px-[8px] py-[16px]"
            >
              <CheckboxIcon checked={allChecked} indeterminate={someChecked} />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                  lineHeight: "20px",
                  color: "#18181b",
                }}
              >
                Select All
              </span>
            </button>

            {/* Cards */}
            <div className="flex w-full flex-col gap-[8px]">
              {CONSENT_ITEMS.map((item) => (
                <ConsentCard
                  key={item.id}
                  item={item}
                  checked={checked.has(item.id)}
                  onToggle={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Accept and Continue button */}
          <button
            type="button"
            onClick={requiredAllChecked ? onAccept : undefined}
            disabled={!requiredAllChecked}
            className="relative flex h-[40px] w-full items-center justify-center overflow-hidden rounded-[6px] px-[16px] py-[10px] transition-opacity"
            style={{
              backgroundColor: "#047857",
              boxShadow: "0px 1px 2px 0px rgba(4,120,87,0.4), 0px 0px 0px 1px #065f46",
              opacity: requiredAllChecked ? 1 : 0.5,
              cursor: requiredAllChecked ? "pointer" : "not-allowed",
            }}
          >
            <span
              className="relative whitespace-nowrap"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Accept and Continue
            </span>
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0.75px_0px_0px_rgba(255,255,255,0.2)]" />
          </button>

          {/* Footer links */}
          <div className="flex items-center gap-[24px]">
            <a
              href="/privacy"
              className="flex items-center gap-[6px] transition-opacity hover:opacity-80"
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#047857",
                }}
              >
                Privacy Policy
              </span>
              <img
                alt=""
                src={ASSETS.arrowSquareOut}
                aria-hidden="true"
                className="size-[18px]"
              />
            </a>

            <a
              href="/terms"
              className="flex items-center gap-[6px] transition-opacity hover:opacity-80"
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#047857",
                }}
              >
                Terms of Service
              </span>
              <img
                alt=""
                src={ASSETS.arrowSquareOut}
                aria-hidden="true"
                className="size-[18px]"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
