import { ApiTable, type ApiRow } from "@/components/docs/api-table";

const BUILDER_ROWS: readonly ApiRow[] = [
  {
    description: "Registers a language without helpers.",
    name: "add(language)",
    type: "=> VoxBuilder",
  },
  {
    description: "Registers a language with helpers available inside its own templates.",
    name: "add(language, options)",
    type: "=> VoxBuilder",
  },
  {
    description:
      "Creates the vox object and the hooks. defaultFallbackLanguage must be one of the registered languages.",
    name: "init(options?)",
    type: "=> VoxInstance",
  },
];

const INSTANCE_ROWS: readonly ApiRow[] = [
  {
    description: "Tagged templates for every registered language, plus vox.any.",
    name: "vox",
    type: "Translate & { any }",
  },
  {
    description: "Adds a translation and returns the chain of the remaining languages.",
    name: "vox[language]",
    type: "(template, ...values) => VoxPhrase | Translate",
  },
  {
    description: "Closes the chain: the languages that are still missing render this translation.",
    name: "vox.fallback(language?)",
    type: "(language?) => VoxPhrase",
  },
  {
    description: "A phrase that renders the same text in every language.",
    name: "vox.any",
    type: "(template, ...values) => VoxPhrase",
  },
  {
    description:
      "t(phrase) renders a phrase in the current language; the component re-renders on change.",
    name: "useVox()",
    type: "() => { t, language }",
  },
  {
    description: "Current language and its setter, straight from the store.",
    name: "useLanguage()",
    type: "() => [language, setLanguage]",
  },
  {
    description: "Reads the current language. No React required.",
    name: "getLanguage()",
    type: "() => Language",
  },
  {
    description:
      "Switches the language and notifies subscribers. Throws for a language that was never registered.",
    name: "setLanguage(language)",
    type: "(language) => void",
  },
  {
    description: "Subscribes to language changes and returns an unsubscribe function.",
    name: "subscribe(listener)",
    type: "=> () => void",
  },
];

const TYPE_ROWS: readonly ApiRow[] = [
  {
    description: "A fully resolved phrase — the only argument t() accepts.",
    name: "VoxPhrase",
    type: '{ __brand: "VoxPhrase" }',
  },
  {
    description:
      "Tagged templates, per-language helpers and the default fallback language of the instance.",
    name: "VoxBuilder",
    type: "add / init",
  },
  {
    description: "The object returned by init(): vox, the hooks and the store.",
    name: "VoxInstance",
    type: "vox / hooks / store",
  },
  {
    description: "Options of a single language.",
    name: "LanguageOptions",
    type: "{ helpers: Record<string, unknown> }",
  },
  {
    description: "Options of init().",
    name: "VoxInitOptions",
    type: "{ defaultFallbackLanguage?: Language }",
  },
  {
    description: "Interface of the language store.",
    name: "VoxLanguageStore",
    type: "getLanguage / setLanguage / subscribe",
  },
  {
    description: "Building blocks behind the chain typing, if you need to type your own helpers.",
    name: "Translate, TranslateFunction, TranslateTemplateFunction",
    type: "generic types",
  },
];

export function ApiReference() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">createVoxBuilder()</h3>
        <ApiTable rows={BUILDER_ROWS} withType={false} />
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-medium">The instance returned by init()</h3>
        <ApiTable rows={INSTANCE_ROWS} />
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Exported types</h3>
        <ApiTable rows={TYPE_ROWS} />
      </div>
    </div>
  );
}
