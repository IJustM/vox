import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  id: string;
  title: string;
}

export function Section({ children, className, description, id, title }: SectionProps) {
  return (
    <section className={cn("scroll-mt-24 py-14 sm:py-16", className)} id={id}>
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description !== undefined && (
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("max-w-2xl space-y-3 text-muted-foreground", className)}>{children}</div>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-code px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
      {children}
    </code>
  );
}
