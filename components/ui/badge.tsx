import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        // Status variants
        planning: "border-transparent bg-status-planning/10 text-status-planning",
        "in-progress": "border-transparent bg-status-in-progress/10 text-status-in-progress",
        completed: "border-transparent bg-status-completed/10 text-status-completed",
        archived: "border-transparent bg-status-archived/10 text-status-archived",
        // Priority variants
        low: "border-transparent bg-priority-low/10 text-priority-low",
        medium: "border-transparent bg-priority-medium/10 text-priority-medium",
        high: "border-transparent bg-priority-high/10 text-priority-high",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
