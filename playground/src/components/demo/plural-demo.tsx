import { useState } from "react";
import { phrase, useVox } from "@/i18n";

export function PluralDemo() {
  const { vox } = useVox();
  const [count, setCount] = useState(3);
  const likes = phrase.en`You have ${count} ${(h) => h.plural(count, "like", "likes")}`
    .ru`У вас ${count} ${(h) => h.plural(count, ["лайк", "лайка", "лайков"])}`
    .zh`你有 ${count} 个赞`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <label
          className="text-xs text-muted-foreground"
          htmlFor="plural-count"
          id="plural-count-label"
        >
          {vox.en`Count`.ru`Количество`.zh`数量`}
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
          aria-labelledby="plural-count-label"
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
      <p className="text-xl font-medium">{vox(likes)}</p>
      <p className="text-xs text-muted-foreground">
        {vox.en`Interpolations can be functions: they run at render time with the helpers of the language whose variant was picked — three plural forms in Russian, two in English, none in Chinese.`
          .ru`Интерполяции могут быть функциями: они вычисляются при рендере с хелперами языка, чей вариант выбран, — три формы множественного числа в русском, две в английском, ни одной в китайском.`
          .zh`插值可以是函数：它们在渲染时用所选语言的辅助函数执行——俄语三种复数形式，英语两种，中文没有。`}
      </p>
    </div>
  );
}
