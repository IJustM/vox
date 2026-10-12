import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useVox } from "@/i18n";
import { cn } from "@/lib/utils";

export interface CodeSource {
  code: string;
  html: string;
  lang: string;
}

export interface CodeBlockProps {
  className?: string;
  showHeader?: boolean;
  source: CodeSource;
}

export function CodeBlock({ className, showHeader = true, source }: CodeBlockProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-code", className)}>
      {showHeader && (
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
          <span className="font-mono text-xs text-muted-foreground">{source.lang}</span>
          <CopyButton value={source.code} />
        </div>
      )}
      <div
        className="max-h-[26rem] overflow-auto p-4"
        // Код — доверенный: это исходники из этого же репозитория, HTML построен Shiki.
        dangerouslySetInnerHTML={{ __html: source.html }}
      />
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const { vox } = useVox();
  const [copied, setCopied] = useState(false);
  const label = copied
    ? vox.en`Copied`.ru`Скопировано`.zh`已复制`
    : vox.en`Copy`.ru`Копировать`.zh`复制`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Tooltip label={label}>
      <Button
        aria-label="Copy code"
        className="size-7 text-muted-foreground"
        onClick={handleCopy}
        size="icon"
        type="button"
        variant="ghost"
      >
        {copied ? <Check className="text-primary" /> : <Copy />}
      </Button>
    </Tooltip>
  );
}
