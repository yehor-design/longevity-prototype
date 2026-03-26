import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Badge design system — based on Catalyst (tailwindui.com/plus/templates/catalyst)
//
// Base:   rounded-md · px-1.5 py-0.5 · text-xs font-medium · gap-x-1.5
// Colors: soft tinted fill (bg-{color}/15–20) + matching text, NO border/ring
//
// All 18 Catalyst color variants + semantic aliases + glass variants
//
// Semantic aliases:
//   success  → emerald   (normal/ok/active)
//   warning  → amber     (suboptimal/caution)
//   danger   → red       (high-risk/error)
//   info     → blue      (informational)
//   neutral  → zinc      (category/label)
//   *-glass  → same hues, fixed dark-surface palette (no dark: prefix)

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap forced-colors:outline [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        // ── Shadcn compatibility variants ──────────────────────────────────
        default:
          "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90",
        outline:
          "border border-border text-foreground [a&]:hover:bg-accent",

        // ── Catalyst — 18 color variants ────────────────────────────────────
        red:
          "bg-red-500/15 text-red-700 dark:bg-red-500/10 dark:text-red-400",
        orange:
          "bg-orange-500/15 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
        amber:
          "bg-amber-400/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400",
        yellow:
          "bg-yellow-400/20 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-300",
        lime:
          "bg-lime-400/20 text-lime-700 dark:bg-lime-400/10 dark:text-lime-300",
        green:
          "bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400",
        emerald:
          "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        teal:
          "bg-teal-500/15 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
        cyan:
          "bg-cyan-400/20 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
        sky:
          "bg-sky-500/15 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
        blue:
          "bg-blue-500/15 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
        indigo:
          "bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
        violet:
          "bg-violet-500/15 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
        purple:
          "bg-purple-500/15 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
        fuchsia:
          "bg-fuchsia-400/15 text-fuchsia-700 dark:bg-fuchsia-400/10 dark:text-fuchsia-400",
        pink:
          "bg-pink-400/15 text-pink-700 dark:bg-pink-400/10 dark:text-pink-400",
        rose:
          "bg-rose-400/15 text-rose-700 dark:bg-rose-400/10 dark:text-rose-400",
        zinc:
          "bg-zinc-600/10 text-zinc-700 dark:bg-white/5 dark:text-zinc-400",

        // ── Semantic aliases ────────────────────────────────────────────────
        success:
          "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        warning:
          "bg-amber-400/20 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400",
        danger:
          "bg-red-500/15 text-red-700 dark:bg-red-500/10 dark:text-red-400",
        info:
          "bg-blue-500/15 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
        neutral:
          "bg-zinc-600/10 text-zinc-700 dark:bg-white/5 dark:text-zinc-400",

        // ── Glass variants — for dark card backgrounds ──────────────────────
        "success-glass": "bg-emerald-500/10 text-emerald-400",
        "warning-glass": "bg-amber-400/10  text-amber-400",
        "danger-glass":  "bg-red-500/10    text-red-400",
        "info-glass":    "bg-blue-500/10   text-blue-400",
        "neutral-glass": "bg-white/8       text-white/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
