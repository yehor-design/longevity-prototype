import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base: Catalyst foundation — relative isolate required for primary pseudo-element depth effect
  "relative isolate inline-flex shrink-0 items-center justify-center gap-x-2 rounded-lg border text-sm/6 font-semibold whitespace-nowrap transition-all focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // PRIMARY — Catalyst emerald solid
        // Uses before: (emerald surface + shadow) and after: (inset white highlight + hover overlay)
        // Button bg shows as subtle darker frame at edges (1px radius difference from before:)
        default: [
          "border-transparent text-white",
          "bg-emerald-700/90",
          "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-emerald-600 before:shadow-sm",
          "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[inset_0_1px_rgba(255,255,255,0.15)]",
          "hover:after:bg-white/10 active:after:bg-white/[0.15]",
          "dark:bg-emerald-600 dark:border-white/5 dark:before:hidden",
        ].join(" "),

        // DESTRUCTIVE — danger action
        destructive:
          "border-transparent bg-destructive text-white shadow-sm hover:bg-destructive/90 active:bg-destructive dark:bg-destructive/70",

        // OUTLINE — Catalyst outline (secondary action)
        outline: [
          "border-zinc-950/10 bg-transparent text-zinc-950",
          "hover:bg-zinc-950/[2.5%] active:bg-zinc-950/5",
          "dark:border-white/15 dark:text-white dark:hover:bg-white/5 dark:active:bg-white/10",
        ].join(" "),

        // SECONDARY — subtle filled
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",

        // GHOST / PLAIN — Catalyst plain (tertiary action)
        ghost: [
          "border-transparent bg-transparent text-zinc-700",
          "hover:bg-zinc-950/5 active:bg-zinc-950/[7.5%]",
          "dark:text-zinc-400 dark:hover:bg-white/10 dark:active:bg-white/10",
        ].join(" "),

        // LINK
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-lg px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-lg px-6 text-base has-[>svg]:px-4",
        icon: "size-10",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
