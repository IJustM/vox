import { useState } from "react";
import { useVox, vox } from "@/i18n";

export function PluralDemo() {
  const { t } = useVox();
  const [count, setCount] = useState(3);
  const phrase = vox.en`You have ${count} ${(h) => h.plural(count, "like", "likes")}`
    .ru`У вас ${count} ${(h) => h.plural(count, "лайк", "лайка", "лайков")}`.zh`你有 ${count} 个赞`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-xs text-muted-foreground" htmlFor="plural-count">
          Count
        </label>
        <input
          className="h-7 w-20 rounded-md border border-input bg-card px-2 font-mono text-sm"
          id="plural-count"
          max={100}
          min={0}
          onChange={(event) => {
            setCount(Number(event.target.value));
          }}
          type="number"
          value={count}
        />
        <input
          aria-label="Count"
          className="h-1.5 w-full max-w-56 accent-primary"
          max={100}
          min={0}
          onChange={(event) => {
            setCount(Number(event.target.value));
          }}
          type="range"
          value={count}
        />
      </div>
      <p className="text-xl font-medium">{t(phrase)}</p>
      <p className="text-xs text-muted-foreground">
        Interpolations can be functions: they are evaluated at render time with the helpers of the
        language whose variant is picked — Russian gets three plural forms, English two, Chinese
        none.
      </p>
    </div>
  );
}
