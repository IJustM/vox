import { phrase, useVox } from "@/i18n";

export function FallbackDemo() {
  const { vox } = useVox();
  const defaultFallback = phrase.en`Text`.ru`Текст`.fallback();
  const pinnedFallback = phrase.en`Text`.ru`Текст`.fallback("ru");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-code/50 p-3">
          <p className="font-mono text-xs text-muted-foreground">.fallback()</p>
          <p className="mt-1 text-lg">{vox(defaultFallback)}</p>
        </div>
        <div className="rounded-lg border border-border bg-code/50 p-3">
          <p className="font-mono text-xs text-muted-foreground">.fallback("ru")</p>
          <p className="mt-1 text-lg">{vox(pinnedFallback)}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {vox.en`Neither chain has a Chinese variant. Switch the language above: the first one falls back to defaultFallbackLanguage, the second keeps Russian.`
          .ru`Ни у одной цепочки нет китайского варианта. Переключите язык выше: первая откатится к defaultFallbackLanguage, вторая останется на русском.`
          .zh`这两条链都没有中文版本。切换上面的语言：第一条回退到 defaultFallbackLanguage，第二条保留俄语。`}
      </p>
    </div>
  );
}
