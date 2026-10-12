import { CodeBlock } from "@/components/docs/code-block";
import { InlineCode, Prose } from "@/components/docs/section";
import { Card, CardContent } from "@/components/ui/card";
import hooksSource from "../snippets/hooks-usage.tsx?highlight";
import storeSource from "../snippets/store-usage.ts?highlight";
import typingSource from "../snippets/typing.ts?highlight";

const RESOLUTION_STEPS = [
  <>
    the variant of the current language (<InlineCode>language</InlineCode> from{" "}
    <InlineCode>useVox()</InlineCode>)
  </>,
  <>
    the variant pinned by <InlineCode>.fallback("en")</InlineCode>
  </>,
  <>
    the variant of <InlineCode>defaultFallbackLanguage</InlineCode> passed to{" "}
    <InlineCode>init()</InlineCode>
  </>,
  <>
    the <InlineCode>phrase.any</InlineCode> variant
  </>,
  "the first variant present in the phrase",
];

export function Concepts() {
  return (
    <div className="space-y-10">
      <article className="space-y-4">
        <h3 className="text-lg font-medium">Phrases and translation chains</h3>
        <Prose>
          <p>
            A chain is finished when every registered language is covered — then it collapses into a{" "}
            <InlineCode>VoxPhrase</InlineCode>, the data <InlineCode>vox()</InlineCode> renders.
            Leave a language out and the value stays a chain, which the type system refuses to pass
            to <InlineCode>vox()</InlineCode>.
          </p>
          <p>
            The localizer from <InlineCode>useVox()</InlineCode> mirrors that chain, except the
            terminal is the render itself: <InlineCode>vox.en`Hello`.ru`Привет`</InlineCode> is a{" "}
            <InlineCode>ReactNode</InlineCode> in the current language. Use it for text that belongs
            to one component, and <InlineCode>phrase</InlineCode> for translations you want to name
            and reuse.
          </p>
          <p>
            Phrases are immutable data, so they can live at module scope and be rendered later in
            any language. The negative case below is checked by the compiler on every build.
          </p>
        </Prose>
        <CodeBlock source={typingSource} />
      </article>

      <article className="space-y-4">
        <h3 className="text-lg font-medium">How a language is picked</h3>
        <Prose>
          <p>
            For a given current language, <InlineCode>t()</InlineCode> renders the first available
            variant in this order:
          </p>
        </Prose>
        <Card>
          <CardContent className="pt-5">
            <ol className="space-y-2.5 text-sm">
              {RESOLUTION_STEPS.map((step, index) => (
                <li className="flex gap-3" key={index}>
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <Prose>
          <p>
            A phrase without a single variant renders an empty string. Helpers are always taken from
            the language whose variant won — see the plural demo in the{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="#playground">
              playground
            </a>
            .
          </p>
        </Prose>
      </article>

      <article className="space-y-4">
        <h3 className="text-lg font-medium">The language store</h3>
        <Prose>
          <p>
            The current language is kept outside React: one store per{" "}
            <InlineCode>createVoxBuilder()</InlineCode> instance, created once and shared by every
            component. That makes it safe to call from a router, a settings menu or a test, and it
            survives repeated <InlineCode>init()</InlineCode> calls.
          </p>
        </Prose>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock source={storeSource} />
          <CodeBlock source={hooksSource} />
        </div>
      </article>
    </div>
  );
}
