import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function InstallCommand({ className, command }: { className?: string; command: string }) {
  const [copied, setCopied] = useState(false);

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
        "inline-flex items-center gap-3 rounded-full border border-border bg-card py-1.5 pr-1.5 pl-4 shadow-sm",
        className,
      )}
    >
      <Terminal aria-hidden className="size-4 text-muted-foreground" />
      <code className="font-mono text-sm text-foreground">{command}</code>
      <button
        aria-label="Copy install command"
        className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        onClick={handleCopy}
        type="button"
      >
        {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}
