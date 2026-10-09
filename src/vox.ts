import type { ReactNode } from "react";

interface LanguageOptions {
  helpers: Record<string, unknown>;
}

interface VoxPhrase {
  __brand: "VoxPhrase";
}

type TranslateTemplateFunction<Options extends LanguageOptions> = (
  options: Options["helpers"],
) => number | string;

type TranslateFunction<
  AllLanguages extends string,
  LanguagesOptions extends Record<string, LanguageOptions>,
  Languages extends string,
  Language extends string,
> = (
  template: TemplateStringsArray,
  ...values: (
    | string
    | number
    | TranslateTemplateFunction<LanguagesOptions[Language]>
  )[]
) => Exclude<Languages, Language> extends never
  ? VoxPhrase
  : Translate<AllLanguages, LanguagesOptions, Exclude<Languages, Language>>;

type Translate<
  AllLanguages extends string,
  LanguagesOptions extends Record<string, LanguageOptions>,
  Languages extends string,
> = {
  [Language in Languages]: TranslateFunction<
    AllLanguages,
    LanguagesOptions,
    Languages,
    Language
  >;
} & {
  fallback: (fallbackLanguage?: Exclude<AllLanguages, Languages>) => VoxPhrase;
};

interface VoxInitOptions<Language extends string> {
  defaultFallbackLanguage?: Language;
}

interface VoxBuilder<
  LanguagesOptions extends Record<string, LanguageOptions> = Record<
    string,
    never
  >,
  Languages extends string = never,
> {
  add<Language extends string>(
    language: Language,
  ): VoxBuilder<
    LanguagesOptions & Record<Language, never>,
    Languages | Language
  >;

  add<Language extends string, Options extends LanguageOptions>(
    language: Language,
    options: Options,
  ): VoxBuilder<
    LanguagesOptions & Record<Language, Options>,
    Languages | Language
  >;

  init(options?: VoxInitOptions<Languages>): {
    vox: Translate<Languages, LanguagesOptions, Languages> & {
      any: TranslateFunction<never, never, never, never>;
    };
    useVox(): {
      t(phrase: VoxPhrase): ReactNode;
    };
  };
}

export function createVoxBulder(): VoxBuilder {
  const languagesOptions = new Map<string, undefined | LanguageOptions>();

  const builder: VoxBuilder = {
    add(language: string, options?: LanguageOptions) {
      languagesOptions.set(language, options);
      return builder as any;
    },

    init() {
      const vox: any = {};

      return {
        useVox() {
          return {
            t() {
              return "vox";
            },
          };
        },
        vox,
      };
    },
  };

  return builder;
}
