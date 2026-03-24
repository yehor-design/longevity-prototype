import { cn } from "@/lib/utils";

const AUTH_BADGES_ASSETS = {
  secureIcon: "https://www.figma.com/api/mcp/asset/59cb434c-4401-4d37-861a-f3ce5fde6f29",
  aiIcon: "https://www.figma.com/api/mcp/asset/7b8a6c7d-9842-4f5d-800a-07783c920cb7",
};

interface AuthBottomBadgesProps {
  className?: string;
}

/**
 * Fixed bottom trust badges for auth screens.
 */
export function AuthBottomBadges({ className }: AuthBottomBadgesProps) {
  return (
    <div
      className={cn(
        "fixed bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-6 lg:bottom-10 lg:left-[calc(25vw+8px)]",
        className,
      )}
    >
      <div className="flex items-center gap-[3.99px]">
        <div className="shrink-0" style={{ width: "9.333px", height: "11.667px" }}>
          <img alt="" className="size-full" src={AUTH_BADGES_ASSETS.secureIcon} />
        </div>
        <span
          className="text-[#0f172a] font-normal"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: "16px" }}
        >
          Secure &amp; Private
        </span>
      </div>

      <div className="flex items-center gap-[3.99px]">
        <div className="shrink-0" style={{ width: "9.333px", height: "11.667px" }}>
          <img alt="" className="size-full" src={AUTH_BADGES_ASSETS.aiIcon} />
        </div>
        <span
          className="text-[#0f172a] font-normal"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: "16px" }}
        >
          AI Powered
        </span>
      </div>
    </div>
  );
}
