import type { ReactNode } from "react";

export interface LanguageOptions {
  helpers: Record<string, unknown>;
}

export interface VoxPhrase {
  __brand: "VoxPhrase";
}

export type TranslateTemplateFunction<Options extends LanguageOptions> = (
  options: Options["helpers"],
) => number | string;

export type TranslateFunction<
  AllLanguages extends string,
  LanguagesOptions extends Record<string, LanguageOptions>,
  Languages extends string,
  Language extends string,
> = (
  template: TemplateStringsArray,
  ...values: (string | number | TranslateTemplateFunction<LanguagesOptions[Language]>)[]
) => Exclude<Languages, Language> extends never
  ? VoxPhrase
  : Translate<AllLanguages, LanguagesOptions, Exclude<Languages, Language>>;

export type Translate<
  AllLanguages extends string,
  LanguagesOptions extends Record<string, LanguageOptions>,
  Languages extends string,
> = {
  [Language in Languages]: TranslateFunction<AllLanguages, LanguagesOptions, Languages, Language>;
} & {
  fallback: (fallbackLanguage?: Exclude<AllLanguages, Languages>) => VoxPhrase;
};

export interface VoxInitOptions<Language extends string> {
  defaultFallbackLanguage?: Language;
}

/**
 * Внешний стор языка: хранится вне React и создаётся на каждый экземпляр
 * `VoxBuilder`. Совместим с `useSyncExternalStore` — `getLanguage` стабильная,
 * `subscribe` возвращает функцию отписки.
 */
export interface VoxLanguageStore<Language extends string> {
  getLanguage(): Language;
  setLanguage(language: Language): void;
  subscribe(listener: () => void): () => void;
}

export interface VoxInstance<
  Languages extends string,
  LanguagesOptions extends Record<string, LanguageOptions>,
> extends VoxLanguageStore<Languages> {
  vox: Translate<Languages, LanguagesOptions, Languages> & {
    any: TranslateFunction<never, never, never, never>;
  };

  useVox(): {
    t(phrase: VoxPhrase): ReactNode;
    language: Languages;
  };

  useLanguage(): [Languages, (language: Languages) => void];
}

export interface VoxBuilder<
  LanguagesOptions extends Record<string, LanguageOptions> = Record<string, never>,
  Languages extends string = never,
> {
  add<Language extends string>(
    language: Language,
  ): VoxBuilder<LanguagesOptions & Record<Language, never>, Languages | Language>;

  add<Language extends string, Options extends LanguageOptions>(
    language: Language,
    options: Options,
  ): VoxBuilder<LanguagesOptions & Record<Language, Options>, Languages | Language>;

  init(options?: VoxInitOptions<Languages>): VoxInstance<Languages, LanguagesOptions>;
}
