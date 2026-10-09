import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "border-transparent bg-accent text-accent-foreground",
        outline: "border-border text-muted-foreground",
        primary: "border-transparent bg-primary/12 text-primary",
      },
    },
  },
);

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ className, variant }))} {...props} />;
}
