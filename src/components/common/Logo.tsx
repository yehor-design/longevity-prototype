import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "admin";
  className?: string;
}

const sizeMap = {
  sm: { container: "h-7 gap-1.5", icon: 24, text: "text-sm" },
  md: { container: "h-9 gap-2", icon: 32, text: "text-base" },
  lg: { container: "h-12 gap-3", icon: 40, text: "text-xl" },
};

/**
 * Platform logo with SVG icon and wordmark.
 * Supports size and variant (default vs admin) props.
 */
export function Logo({ size = "md", variant = "default", className }: LogoProps) {
  const s = sizeMap[size];
  const iconColor = variant === "admin" ? "#a78bfa" : "#3b82f6";
  const textColor = variant === "admin" ? "text-violet-400" : "text-primary";

  return (
    <div className={cn("flex items-center", s.container, className)}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer ring */}
        <circle cx="16" cy="16" r="15" stroke={iconColor} strokeWidth="2" opacity="0.3" />
        {/* DNA helix dots */}
        <circle cx="16" cy="7" r="3" fill={iconColor} />
        <circle cx="10" cy="12" r="2.5" fill={iconColor} opacity="0.7" />
        <circle cx="22" cy="12" r="2.5" fill={iconColor} opacity="0.7" />
        <circle cx="16" cy="16" r="3.5" fill={iconColor} />
        <circle cx="10" cy="20" r="2.5" fill={iconColor} opacity="0.7" />
        <circle cx="22" cy="20" r="2.5" fill={iconColor} opacity="0.7" />
        <circle cx="16" cy="25" r="3" fill={iconColor} />
        {/* Connecting lines */}
        <line x1="16" y1="7" x2="10" y2="12" stroke={iconColor} strokeWidth="1.5" opacity="0.4" />
        <line x1="16" y1="7" x2="22" y2="12" stroke={iconColor} strokeWidth="1.5" opacity="0.4" />
        <line x1="10" y1="12" x2="16" y2="16" stroke={iconColor} strokeWidth="1.5" opacity="0.4" />
        <line x1="22" y1="12" x2="16" y2="16" stroke={iconColor} strokeWidth="1.5" opacity="0.4" />
        <line x1="16" y1="16" x2="10" y2="20" stroke={iconColor} strokeWidth="1.5" opacity="0.4" />
        <line x1="16" y1="16" x2="22" y2="20" stroke={iconColor} strokeWidth="1.5" opacity="0.4" />
        <line x1="10" y1="20" x2="16" y2="25" stroke={iconColor} strokeWidth="1.5" opacity="0.4" />
        <line x1="22" y1="20" x2="16" y2="25" stroke={iconColor} strokeWidth="1.5" opacity="0.4" />
      </svg>
      <span className={cn("font-semibold tracking-tight", s.text, textColor)}>
        DT Health{variant === "admin" && <span className="text-muted-foreground font-normal ml-1 text-[0.7em]">Admin</span>}
      </span>
    </div>
  );
}
