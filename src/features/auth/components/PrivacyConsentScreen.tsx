import { useState } from "react";
import caretLeftSvg from "@/assets/auth/caret-left.svg";
import { AuthHeroPanel } from "./AuthHeroPanel";
import { AuthBottomBadges } from "./AuthBottomBadges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
      className="flex w-full cursor-pointer gap-2 items-start overflow-hidden rounded-lg bg-white p-2 text-left transition-shadow duration-150"
      style={{
        boxShadow: checked
          ? "0px 1px 2px 0px rgba(4,120,87,0.12), 0px 0px 0px 1.5px var(--primary)"
          : "0px 1px 2px 0px rgba(0,0,0,0.12), 0px 0px 0px 1px rgba(0,0,0,0.08)",
      }}
    >
      <Checkbox
        checked={checked}
        tabIndex={-1}
        className="pointer-events-none mt-0.5 shrink-0"
      />

      <div className="min-w-0 flex-1">
        {/* Label row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="whitespace-nowrap text-[13px] font-medium leading-5 text-[#18181b]">
            {item.title}
          </span>

          {item.required ? (
            <Badge variant="success" className="">Required</Badge>
          ) : (
            <Badge variant="neutral" className="">Optional</Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-[13px] font-normal leading-relaxed text-[#52525b]">
          {item.descriptionPre}
          {item.link && (
            <a
              href={item.link.href}
              className="font-medium text-primary"
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
        <div className="flex w-full max-w-[420px] flex-col items-center gap-6 px-4">

          {/* Header block */}
          <div className="flex w-full max-w-[350px] flex-col items-center gap-6">
            {/* File-text icon */}
            <div
              className="flex size-16 shrink-0 items-start rounded-2xl p-4"
              style={{ backgroundColor: "rgba(234,170,8,0.12)" }}
            >
              <img alt="" src={ASSETS.fileText} aria-hidden="true" className="size-8" />
            </div>

            {/* Title + subtitle */}
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <p className="text-[18px] font-medium leading-[26px] text-[#0a0a0a]">
                Privacy &amp; Consent
              </p>
              <p className="text-sm leading-5 text-[#6f6f77]">
                Review and accept our data policies to continue.
              </p>
            </div>
          </div>

          {/* Checkbox list */}
          <div className="flex w-full flex-col items-start">
            {/* Select All row */}
            <div
              role="checkbox"
              aria-checked={allChecked}
              tabIndex={0}
              onClick={toggleAll}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleAll();
                }
              }}
              className="inline-flex cursor-pointer items-center gap-2 px-2 py-4"
            >
              <Checkbox
                checked={allChecked}
                tabIndex={-1}
                className="pointer-events-none shrink-0"
              />
              <span className="text-[13px] font-medium leading-5 text-[#18181b]">
                Select All
              </span>
            </div>

            {/* Cards */}
            <div className="flex w-full flex-col gap-2">
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
          <Button
            type="button"
            onClick={requiredAllChecked ? onAccept : undefined}
            disabled={!requiredAllChecked}
            className="h-10 w-full rounded-lg text-sm font-medium"
          >
            Accept and Continue
          </Button>

          {/* Footer links */}
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
            >
              <span className="text-sm font-medium text-primary">Privacy Policy</span>
              <img alt="" src={ASSETS.arrowSquareOut} aria-hidden="true" className="size-[18px]" />
            </a>

            <a
              href="/terms"
              className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
            >
              <span className="text-sm font-medium text-primary">Terms of Service</span>
              <img alt="" src={ASSETS.arrowSquareOut} aria-hidden="true" className="size-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
