import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-4 text-sm",
        icon: "size-9",
        lg: "h-11 rounded-lg px-6 text-base",
        sm: "h-8 rounded-sm px-3 text-xs",
      },
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        ghost: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        outline: "border border-border bg-card hover:bg-accent hover:text-accent-foreground",
      },
    },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ asChild = false, className, size, variant, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ className, size, variant }));

  if (asChild) {
    return <Slot.Root className={classes} {...props} />;
  }

  return <button className={classes} {...props} />;
}
