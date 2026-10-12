import { phrase, useVox } from "@/i18n";

export function AnyDemo() {
  const { vox } = useVox();

  return (
    <div className="space-y-3">
      <p className="text-xl font-medium">{vox(phrase.any`VOX!`)}</p>
      <p className="text-xs text-muted-foreground">
        {vox.en`A language-agnostic phrase: it renders the same text in every language, while interpolations still receive the helpers of the current one.`
          .ru`Фраза, не привязанная к языку: текст одинаков во всех языках, а интерполяции всё равно получают хелперы текущего.`
          .zh`与语言无关的短语：任何语言下文本都相同，插值仍会拿到当前语言的辅助函数。`}
      </p>
    </div>
  );
}
