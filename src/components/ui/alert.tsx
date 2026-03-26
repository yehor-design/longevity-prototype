import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current has-[[data-slot=alert-action]]:pr-16",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current",
        info: "bg-alert-info text-alert-info-foreground border-current/8 *:data-[slot=alert-description]:text-alert-info-foreground/80 [&>svg]:text-alert-info-foreground",
        success:
          "bg-alert-success text-alert-success-foreground border-current/8 *:data-[slot=alert-description]:text-alert-success-foreground/80 [&>svg]:text-alert-success-foreground",
        warning:
          "bg-alert-warning text-alert-warning-foreground border-current/8 *:data-[slot=alert-description]:text-alert-warning-foreground/80 [&>svg]:text-alert-warning-foreground",
        error:
          "bg-alert-error text-alert-error-foreground border-current/8 *:data-[slot=alert-description]:text-alert-error-foreground/80 [&>svg]:text-alert-error-foreground",
        system:
          "bg-alert-system text-alert-system-foreground border-current/8 *:data-[slot=alert-description]:text-alert-system-foreground/80 [&>svg]:text-alert-system-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-3", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
