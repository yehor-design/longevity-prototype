import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Catalyst base — appearance, typography, spacing
        "w-full min-w-0 appearance-none rounded-lg border bg-transparent px-3 py-2 text-sm/6 text-zinc-950 placeholder:text-zinc-500 outline-none transition-colors",
        // Catalyst border — light zinc, darkens on hover
        "border-zinc-950/10 hover:border-zinc-950/20",
        // Active / focus — emerald border + emerald ring glow
        "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
        // Dark mode
        "dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:border-white/20",
        "dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20",
        // Invalid
        "aria-invalid:border-red-500 aria-invalid:hover:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/20",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:border-zinc-950/20 dark:disabled:border-white/15",
        // No resize handle
        "resize-none",
        // Min height
        "min-h-20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
