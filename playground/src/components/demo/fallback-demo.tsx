import { useVox, vox } from "@/i18n";

export function FallbackDemo() {
  const { t } = useVox();
  const defaultFallback = vox.en`Text`.ru`Текст`.fallback();
  const pinnedFallback = vox.en`Text`.ru`Текст`.fallback("ru");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-code/50 p-3">
          <p className="font-mono text-xs text-muted-foreground">.fallback()</p>
          <p className="mt-1 text-lg">{t(defaultFallback)}</p>
        </div>
        <div className="rounded-lg border border-border bg-code/50 p-3">
          <p className="font-mono text-xs text-muted-foreground">.fallback("ru")</p>
          <p className="mt-1 text-lg">{t(pinnedFallback)}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Neither chain is translated into Chinese. Switch the language above:{" "}
        <span className="font-mono">.fallback()</span> renders the{" "}
        <span className="font-mono">defaultFallbackLanguage</span> (English, “Text”), while{" "}
        <span className="font-mono">.fallback(&quot;ru&quot;)</span> keeps Russian — “Текст”.
      </p>
    </div>
  );
}
