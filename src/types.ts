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

/**
 * Тэг-функция одного языка. `Result` — то, во что превращается завершённая
 * цепочка: `VoxPhrase` у `phrase` и `ReactNode` у локализатора `vox`.
 */
export type TranslateFunction<
  AllLanguages extends string,
  LanguagesOptions extends Record<string, LanguageOptions>,
  Languages extends string,
  Language extends string,
  Result = VoxPhrase,
> = (
  template: TemplateStringsArray,
  ...values: (string | number | TranslateTemplateFunction<LanguagesOptions[Language]>)[]
) => Exclude<Languages, Language> extends never
  ? Result
  : Translate<AllLanguages, LanguagesOptions, Exclude<Languages, Language>, Result>;

export type Translate<
  AllLanguages extends string,
  LanguagesOptions extends Record<string, LanguageOptions>,
  Languages extends string,
  Result = VoxPhrase,
> = {
  [Language in Languages]: TranslateFunction<
    AllLanguages,
    LanguagesOptions,
    Languages,
    Language,
    Result
  >;
} & {
  fallback: (fallbackLanguage?: Exclude<AllLanguages, Languages>) => Result;
};

export interface VoxInitOptions<Language extends string> {
  defaultFallbackLanguage?: Language;
}

/**
 * Локализатор из `useVox()`: почти как `phrase`, но завершённая цепочка сразу
 * рендерится — `vox(phrase)` или ``vox.en`Hello`.ru`Привет` ``. Ошибка в
 * переводе остаётся ошибкой типов, а рендер идёт в текущем языке.
 */
export type VoxTranslate<
  Languages extends string,
  LanguagesOptions extends Record<string, LanguageOptions>,
> = ((phrase: VoxPhrase) => ReactNode) &
  Translate<Languages, LanguagesOptions, Languages, ReactNode> & {
    any: TranslateFunction<never, never, never, never, ReactNode>;
  };

/**
 * Внешний стор языка: хранится вне React и создаётся на каждый экземпляр
 * `VoxBuilder`. Совместим с `useSyncExternalStore` — `getLanguage` стабильная,
 * `subscribe` возвращает функцию отписки.
 */
export interface VoxLanguageStore<Language extends string> {
  getLanguage: () => Language;
  setLanguage: (language: Language) => void;
  subscribe: (listener: () => void) => () => void;
}

export interface VoxInstance<
  Languages extends string,
  LanguagesOptions extends Record<string, LanguageOptions>,
> extends VoxLanguageStore<Languages> {
  phrase: Translate<Languages, LanguagesOptions, Languages> & {
    any: TranslateFunction<never, never, never, never>;
  };

  useVox: () => {
    vox: VoxTranslate<Languages, LanguagesOptions>;
    language: Languages;
  };

  useLanguage: () => [Languages, (language: Languages) => void];
}

export interface VoxBuilder<
  LanguagesOptions extends Record<string, LanguageOptions> = Record<string, never>,
  Languages extends string = never,
> {
  add: {
    <Language extends string>(
      language: Language,
    ): VoxBuilder<LanguagesOptions & Record<Language, never>, Languages | Language>;

    <Language extends string, Options extends LanguageOptions>(
      language: Language,
      options: Options,
    ): VoxBuilder<LanguagesOptions & Record<Language, Options>, Languages | Language>;
  };

  init: (options?: VoxInitOptions<Languages>) => VoxInstance<Languages, LanguagesOptions>;
}
