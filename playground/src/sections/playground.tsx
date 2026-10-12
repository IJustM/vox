import { AnyDemo } from "@/components/demo/any-demo";
import { FallbackDemo } from "@/components/demo/fallback-demo";
import { InlineDemo } from "@/components/demo/inline-demo";
import { LanguageSwitcher } from "@/components/demo/language-switcher";
import { PhraseDemo } from "@/components/demo/phrase-demo";
import { PluralDemo } from "@/components/demo/plural-demo";
import { Demo } from "@/components/docs/demo";
import anyDemoSource from "@/components/demo/any-demo.tsx?highlight";
import fallbackDemoSource from "@/components/demo/fallback-demo.tsx?highlight";
import inlineDemoSource from "@/components/demo/inline-demo.tsx?highlight";
import phraseDemoSource from "@/components/demo/phrase-demo.tsx?highlight";
import pluralDemoSource from "@/components/demo/plural-demo.tsx?highlight";

export function Playground() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card/60 px-4 py-3">
        <div>
          <p className="text-sm font-medium">This page is the playground</p>
          <p className="text-xs text-muted-foreground">
            One builder instance, three languages, the same components that live in the repository.
          </p>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="space-y-5">
        <Demo note="all languages covered" source={phraseDemoSource}>
          <PhraseDemo />
        </Demo>
        <Demo note="helpers run at render time" source={pluralDemoSource}>
          <PluralDemo />
        </Demo>
        <Demo note="localized on the spot, no phrase" source={inlineDemoSource}>
          <InlineDemo />
        </Demo>
        <div className="grid gap-5 lg:grid-cols-2">
          <Demo note="for missing translations" source={fallbackDemoSource}>
            <FallbackDemo />
          </Demo>
          <Demo note="never translated" source={anyDemoSource}>
            <AnyDemo />
          </Demo>
        </div>
      </div>
    </>
  );
}
