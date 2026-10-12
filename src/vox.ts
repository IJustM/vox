import { useCallback, useSyncExternalStore, type ReactNode } from "react";
import { Phrase, renderPhrase, type VoxInterpolation, type VoxVariant } from "./phrase";
import { createLanguageStore } from "./store";
import type {
  LanguageOptions,
  VoxBuilder,
  VoxInitOptions,
  VoxLanguageStore,
  VoxPhrase,
} from "./types";

const ANY = "any";

/** Цепочка перевода: тэг-функции оставшихся языков и `fallback`. */
type TranslateChain = {
  fallback: (fallbackLanguage?: string) => VoxPhrase;
} & Record<string, unknown>;

/** Рантайм-описание инстанса до подстановки generic-типов. */
interface VoxRuntimeInstance extends VoxLanguageStore<string> {
  vox: TranslateChain;
  useLanguage: () => [string, (language: string) => void];
  useVox: () => { language: string; t: (phrase: VoxPhrase) => ReactNode };
}

interface VoxRuntimeBuilder {
  add: (language: string, options?: LanguageOptions) => VoxRuntimeBuilder;
  init: (options?: VoxInitOptions<string>) => VoxRuntimeInstance;
}

function createChain(
  variants: ReadonlyMap<string, VoxVariant>,
  remaining: readonly string[],
  defaultFallbackLanguage: string | undefined,
): TranslateChain {
  const chain: TranslateChain = {
    fallback(fallbackLanguage?: string): VoxPhrase {
      return new Phrase({
        defaultFallbackLanguage,
        fallbackLanguage,
        languageAgnosticVariant: undefined,
        variants,
      });
    },
  };

  for (const language of remaining) {
    chain[language] = function translateTemplate(
      template: TemplateStringsArray,
      ...values: VoxInterpolation[]
    ): Phrase | TranslateChain {
      const nextVariants = new Map<string, VoxVariant>([
        ...variants,
        [language, createVariant(template, values)],
      ]);
      const rest = remaining.filter((item) => item !== language);

      // Все языки переведены — цепочка закрывается готовой фразой.
      if (rest.length === 0) {
        return new Phrase({
          defaultFallbackLanguage,
          fallbackLanguage: undefined,
          languageAgnosticVariant: undefined,
          variants: nextVariants,
        });
      }

      return createChain(nextVariants, rest, defaultFallbackLanguage);
    };
  }

  return chain;
}

export function createVoxBuilder(): VoxBuilder {
  const languagesOptions = new Map<string, LanguageOptions | undefined>();
  let store: VoxLanguageStore<string> | undefined = undefined;

  function getHelpers(language: string): Record<string, unknown> {
    return languagesOptions.get(language)?.helpers ?? {};
  }

  function translate(phrase: VoxPhrase, language: string): string {
    if (!isVoxPhrase(phrase)) {
      throw new TypeError(
        "[vox] t() expects a phrase built with a vox template, for example t(vox.ru`Text`).",
      );
    }

    return renderPhrase(phrase, language, getHelpers);
  }

  function createInstance(options?: VoxInitOptions<string>): VoxRuntimeInstance {
    const languages = [...languagesOptions.keys()];
    const defaultFallbackLanguage = options?.defaultFallbackLanguage ?? languages.at(0);

    // Стор создаётся один раз на экземпляр билдера и переживает повторные init.
    const languageStore =
      store ??
      createLanguageStore<string>(defaultFallbackLanguage ?? "", (language) =>
        languagesOptions.has(language),
      );
    store = languageStore;

    const vox: TranslateChain = {
      ...createChain(new Map<string, VoxVariant>(), languages, defaultFallbackLanguage),
      [ANY]: function translateAny(
        template: TemplateStringsArray,
        ...values: VoxInterpolation[]
      ): VoxPhrase {
        return new Phrase({
          defaultFallbackLanguage,
          fallbackLanguage: undefined,
          languageAgnosticVariant: createVariant(template, values),
          variants: new Map<string, VoxVariant>(),
        });
      },
    };

    function useLanguage(): [string, (language: string) => void] {
      const language = useSyncExternalStore(
        languageStore.subscribe,
        languageStore.getLanguage,
        languageStore.getLanguage,
      );

      return [language, languageStore.setLanguage];
    }

    function useVox(): { language: string; t: (phrase: VoxPhrase) => ReactNode } {
      const [language] = useLanguage();

      const t = useCallback(
        (phrase: VoxPhrase): ReactNode => translate(phrase, language),
        [language],
      );

      return { language, t };
    }

    return {
      getLanguage: languageStore.getLanguage,
      setLanguage: languageStore.setLanguage,
      subscribe: languageStore.subscribe,
      useLanguage,
      useVox,
      vox,
    };
  }

  const builder: VoxRuntimeBuilder = {
    add(language, options) {
      languagesOptions.set(language, options);

      return builder;
    },

    init(options) {
      return createInstance(options);
    },
  };

  // Цепочка языков живёт только на уровне типов: рантайм-объект один и тот же.
  // Типовая склейка выполняется один раз на границе модуля.
  return builder as unknown as VoxBuilder;
}

function createVariant(
  template: TemplateStringsArray,
  values: readonly VoxInterpolation[],
): VoxVariant {
  return { strings: [...template], values };
}

function isVoxPhrase(value: unknown): value is Phrase {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as { __brand?: unknown; resolve?: unknown };

  return (
    // oxlint-disable-next-line no-underscore-dangle
    candidate.__brand === "VoxPhrase" && typeof candidate.resolve === "function"
  );
}
