"use client";

import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface QuestionnaireWidgetProps {
  progressPercentage: number;
  lastSavedDate?: Date | string | null;
  statusLabel: string;
  userAvatarUrl?: string;
  onNavigate: () => void;
  onMenuClose?: () => void;
}

// ─── CircularProgressRing ─────────────────────────────────────────────────────

interface CircularRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  className?: string;
}

export function CircularProgressRing({ progress, size, strokeWidth, className }: CircularRingProps) {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, progress));
  const offset = circumference * (1 - clamped / 100);

  return (
    <svg
      width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      className={cn("shrink-0", className)} aria-hidden
    >
      <circle
        cx={center} cy={center} r={radius}
        fill="none" strokeWidth={strokeWidth}
        stroke="currentColor" className="text-border" strokeOpacity={0.6}
      />
      <circle
        cx={center} cy={center} r={radius}
        fill="none" strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        stroke="currentColor"
        className="text-primary transition-[stroke-dashoffset] duration-700 ease-out"
        transform={`rotate(-90 ${center} ${center})`}
      />
    </svg>
  );
}

// ─── AvatarProgressCard ───────────────────────────────────────────────────────
//
//   variant="trigger" → pill, text LEFT · circular avatar+ring RIGHT  (navbar)
//   variant="menu"    → flat card, text + linear progress bar          (dropdown)

export interface AvatarProgressCardProps {
  variant?: "trigger" | "menu";
  initials: string;
  progressPercentage: number;
  statusLabel: string;
  userName: string;
  userAvatarUrl?: string;
  lastSavedDate?: Date | string | null;
  className?: string;
}

export function AvatarProgressCard({
  initials,
  progressPercentage,
  statusLabel,
  userName,
  userAvatarUrl,
  lastSavedDate,
  variant = "trigger",
  className,
}: AvatarProgressCardProps) {
  const SIZE = 40;
  const STROKE = 3;
  const isComplete = progressPercentage === 100;

  const lastSaved = (() => {
    if (!lastSavedDate) return null;
    const d = typeof lastSavedDate === "string" ? new Date(lastSavedDate) : lastSavedDate;
    return isNaN(d.getTime()) ? null : formatDistanceToNow(d, { addSuffix: true });
  })();

  // ── menu variant: text block + linear progress bar (no circular avatar) ──
  if (variant === "menu") {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 cursor-pointer select-none w-full rounded-md px-2 py-2",
          "hover:bg-accent transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          className
        )}
        aria-label={`Health questionnaire: ${statusLabel}, ${progressPercentage}% complete`}
      >
        {/* Text row + chevron */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-xs font-semibold text-foreground leading-none">
              Health Quiz
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              {statusLabel}&nbsp;·&nbsp;{progressPercentage}%
            </span>
            {lastSaved && (
              <span className="text-[10px] text-muted-foreground/60 leading-none pt-0.5">
                Saved {lastSaved}
              </span>
            )}
          </div>
          <ChevronRight
            size={14}
            className="shrink-0 text-muted-foreground/40 mt-0.5 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>

        {/* Linear progress bar */}
        <Progress
          value={progressPercentage}
          className="h-1.5 rounded-full"
          aria-label={`${progressPercentage}% complete`}
        />
      </div>
    );
  }

  // ── trigger variant: only avatar + circular ring + percentage badge ──
  return (
    <div
      className={cn(
        "relative cursor-pointer select-none shrink-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        className
      )}
      style={{ width: SIZE, height: SIZE }}
      aria-label={`Health questionnaire: ${statusLabel}, ${progressPercentage}% complete`}
    >
      <CircularProgressRing
        progress={progressPercentage} size={SIZE} strokeWidth={STROKE}
        className="absolute inset-0"
      />
      <Avatar className="size-[26px] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ring-2 ring-background">
        {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt="Profile" />}
        <AvatarFallback className="rounded-full text-[9px] font-bold bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span
        aria-hidden
        className={cn(
          "absolute -top-2 left-1/2 -translate-x-1/2 z-10",
          "rounded-full px-1.5 py-[3px] text-[8px] font-bold leading-none shadow-sm whitespace-nowrap",
          isComplete ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
        )}
      >
        {progressPercentage}%
      </span>
    </div>
  );
}
