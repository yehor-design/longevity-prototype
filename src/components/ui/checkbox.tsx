"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Catalyst base — size, shape, layout
        "peer relative isolate flex size-[1.125rem] shrink-0 cursor-pointer items-center justify-center rounded-[0.3125rem] transition-all outline-none",
        // Unchecked: zinc border + white surface via before: (Catalyst depth technique)
        "border border-zinc-950/15 hover:border-zinc-950/30",
        "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(0.3125rem-1px)] before:bg-white before:shadow-sm",
        "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(0.3125rem-1px)] after:shadow-[inset_0_1px_rgba(255,255,255,0.15)]",
        // Checked — emerald (same depth technique as primary button)
        "data-[state=checked]:border-transparent data-[state=checked]:bg-emerald-700/90 data-[state=checked]:text-white",
        "data-[state=checked]:before:bg-emerald-600",
        "data-[state=checked]:hover:border-transparent",
        // Focus — emerald outline
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:border-zinc-950/25",
        // Invalid
        "aria-invalid:border-red-500",
        // Dark mode
        "dark:before:hidden dark:bg-white/5 dark:border-white/15 dark:hover:border-white/30",
        "dark:data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:border-white/5",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
