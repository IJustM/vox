import { phrase, useVox } from "@/i18n";

export function PhraseDemo() {
  const { language, vox } = useVox();
  const greeting = phrase.en`Good morning`.ru`Доброе утро`.zh`早上好`;

  return (
    <div className="space-y-3">
      <p className="text-xl font-medium">{vox(greeting)}</p>
      <p className="text-xs text-muted-foreground">
        {vox.en`The phrase covers every language and the ${language} variant is rendered — that is why the text above changes.`
          .ru`Фраза покрывает все языки, и рендерится вариант ${language} — поэтому текст выше меняется.`
          .zh`这个 phrase 覆盖了所有语言，当前渲染 ${language} 版本——所以上面的文字会变化。`}
      </p>
    </div>
  );
}
