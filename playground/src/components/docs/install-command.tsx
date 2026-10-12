import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MANAGER_IDS = ["pnpm", "npm", "yarn"] as const;

type ManagerId = (typeof MANAGER_IDS)[number];

const COMMANDS: Record<ManagerId, string> = {
  npm: "npm install vox",
  pnpm: "pnpm add vox",
  yarn: "yarn add vox",
};

export function InstallCommand({ className }: { className?: string }) {
  const [manager, setManager] = useState<ManagerId>("pnpm");
  const [copied, setCopied] = useState(false);
  const command = COMMANDS[manager];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm sm:rounded-full",
        className,
      )}
    >
      <Terminal aria-hidden className="ml-2 size-4 shrink-0 text-muted-foreground" />
      <div className="inline-flex rounded-full bg-muted p-0.5">
        {MANAGER_IDS.map((id) => (
          <button
            aria-pressed={id === manager}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              id === manager
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            key={id}
            onClick={() => {
              setManager(id);
            }}
            type="button"
          >
            {id}
          </button>
        ))}
      </div>
      <code className="px-1 font-mono text-sm text-foreground">{command}</code>
      <button
        aria-label="Copy install command"
        className="mr-1 grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        onClick={handleCopy}
        type="button"
      >
        {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}
