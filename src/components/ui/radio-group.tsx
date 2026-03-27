import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Medusa UI pattern — transparent wrapper handles focus/disabled, inner span handles visuals
        "group relative flex size-[1.125rem] shrink-0 cursor-pointer items-center justify-center outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:[&>span:first-child]:border-destructive",
        className
      )}
      {...props}
    >
      {/* Visual circle — unchecked: white + zinc border; checked: emerald fill */}
      <span
        aria-hidden
        className={cn(
          "flex size-full items-center justify-center rounded-full border transition-all",
          "border-zinc-950/15 bg-white",
          "group-hover:border-zinc-950/30",
          "group-data-[state=checked]:border-emerald-700 group-data-[state=checked]:bg-emerald-600",
          "dark:border-white/15 dark:bg-white/5",
          "dark:group-hover:border-white/25",
          "dark:group-data-[state=checked]:border-emerald-500 dark:group-data-[state=checked]:bg-emerald-500",
        )}
      />
      {/* White dot — only renders when checked (Radix Indicator) */}
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="size-1.5 rounded-full bg-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
