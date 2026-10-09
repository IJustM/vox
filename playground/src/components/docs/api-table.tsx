import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ApiRow {
  description: ReactNode;
  name: string;
  type?: ReactNode;
}

export function ApiTable({
  className,
  rows,
  withType = true,
}: {
  className?: string;
  rows: readonly ApiRow[];
  withType?: boolean;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border bg-card", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-left text-xs tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-2.5 font-medium">{withType ? "Member" : "Name"}</th>
            {withType && <th className="px-4 py-2.5 font-medium">Type</th>}
            <th className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-t border-border align-top" key={row.name}>
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-foreground">
                {row.name}
              </td>
              {withType && (
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.type}</td>
              )}
              <td className="w-full px-4 py-3 text-muted-foreground">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
