import { CodeBlock } from "@/components/docs/code-block";
import { InlineCode, Prose } from "@/components/docs/section";
import i18nSource from "../i18n.ts?highlight";
import appSource from "../snippets/quick-start-app.tsx?highlight";

export function QuickStart() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
            1
          </span>
          <h3 className="text-lg font-medium">Create the instance once</h3>
        </div>
        <Prose>
          <p>
            Register languages with <InlineCode>add()</InlineCode>, attach helpers where you need
            them, then call <InlineCode>init()</InlineCode>. The result is a tiny module the rest of
            the app imports. This is the exact file that powers the playground above.
          </p>
        </Prose>
        <CodeBlock source={i18nSource} />
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
            2
          </span>
          <h3 className="text-lg font-medium">Translate with template chains</h3>
        </div>
        <Prose>
          <p>
            <InlineCode>vox.en</InlineCode> is a tag function: it adds the English template to the
            chain and returns the languages that are still missing. Interpolations may be strings,
            numbers, or functions that receive the helpers of the language being rendered.
          </p>
        </Prose>
        <CodeBlock source={appSource} />
      </div>
    </div>
  );
}
