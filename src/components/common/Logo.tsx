import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "admin";
  className?: string;
}

const sizeMap = {
  sm: { height: "h-5", text: "text-xs" },
  md: { height: "h-7", text: "text-sm" },
  lg: { height: "h-9", text: "text-base" },
};

/**
 * Platform logo — uses /Logo.png (icon + wordmark).
 * Admin variant appends an "Admin" label after the image.
 */
export function Logo({ size = "md", variant = "default", className }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/Logo.png"
        alt="Longevity"
        className={cn(s.height, "w-auto")}
      />
      {variant === "admin" && (
        <span className={cn("text-muted-foreground font-normal", s.text)}>
          Admin
        </span>
      )}
    </div>
  );
}
