import { AnyDemo } from "@/components/demo/any-demo";
import { FallbackDemo } from "@/components/demo/fallback-demo";
import { InlineDemo } from "@/components/demo/inline-demo";
import { LanguageSwitcher } from "@/components/demo/language-switcher";
import { PhraseDemo } from "@/components/demo/phrase-demo";
import { PluralDemo } from "@/components/demo/plural-demo";
import { Demo } from "@/components/docs/demo";
import { useVox } from "@/i18n";
import anyDemoSource from "@/components/demo/any-demo.tsx?highlight";
import fallbackDemoSource from "@/components/demo/fallback-demo.tsx?highlight";
import inlineDemoSource from "@/components/demo/inline-demo.tsx?highlight";
import phraseDemoSource from "@/components/demo/phrase-demo.tsx?highlight";
import pluralDemoSource from "@/components/demo/plural-demo.tsx?highlight";

export function Playground() {
  const { vox } = useVox();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card/60 px-4 py-3">
        <div>
          <p className="text-sm font-medium">
            {vox.en`This page is the playground`.ru`Эта страница и есть песочница`
              .zh`这一页就是演练场`}
          </p>
          <p className="text-xs text-muted-foreground">
            {vox.en`One builder instance, three languages — the same components that live in the repository.`
              .ru`Один экземпляр билдера, три языка — те же компоненты, что лежат в репозитории.`
              .zh`一个 builder 实例、三种语言，以及仓库里真实存在的组件。`}
          </p>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="space-y-5">
        <Demo
          note={vox.en`all languages covered`.ru`переведены все языки`.zh`已覆盖所有语言`}
          source={phraseDemoSource}
        >
          <PhraseDemo />
        </Demo>
        <Demo
          note={vox.en`helpers run at render time`.ru`хелперы работают при рендере`
            .zh`辅助函数在渲染时执行`}
          source={pluralDemoSource}
        >
          <PluralDemo />
        </Demo>
        <Demo
          note={vox.en`no phrase needed`.ru`фраза не нужна`.zh`不需要 Phrase`}
          source={inlineDemoSource}
        >
          <InlineDemo />
        </Demo>
        <div className="grid gap-5 lg:grid-cols-2">
          <Demo
            note={vox.en`for missing translations`.ru`для отсутствующих переводов`
              .zh`用于缺失的翻译`}
            source={fallbackDemoSource}
          >
            <FallbackDemo />
          </Demo>
          <Demo
            note={vox.en`never translated`.ru`не переводится никогда`.zh`永不翻译`}
            source={anyDemoSource}
          >
            <AnyDemo />
          </Demo>
        </div>
      </div>
    </>
  );
}
