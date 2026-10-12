import { useMemo, useSyncExternalStore } from "react";
import {
  Phrase,
  renderPhrase,
  renderVariant,
  type VoxInterpolation,
  type VoxVariant,
} from "./phrase";
import { createLanguageStore } from "./store";
import type {
  LanguageOptions,
  VoxBuilder,
  VoxInitOptions,
  VoxLanguageStore,
  VoxPhrase,
} from "./types";

const ANY = "any";

/** Чем закрывается цепочка: готовой фразой (`phrase`) или отрендеренным текстом (`vox`). */
type FinishChain = (
  variants: ReadonlyMap<string, VoxVariant>,
  fallbackLanguage?: string,
) => unknown;

/** Цепочка перевода: тэг-функции оставшихся языков и `fallback`. */
type TranslateChain = {
  fallback: (fallbackLanguage?: string) => unknown;
} & Record<string, unknown>;

/** Локализатор: вызывается фразой и несёт на себе такую же цепочку языков. */
type Localizer = ((phrase: VoxPhrase) => string) &
  TranslateChain & {
    any: (template: TemplateStringsArray, ...values: VoxInterpolation[]) => string;
  };

/** Рантайм-описание инстанса до подстановки generic-типов. */
interface VoxRuntimeInstance extends VoxLanguageStore<string> {
  phrase: TranslateChain;
  useLanguage: () => [string, (language: string) => void];
  useVox: () => { language: string; vox: Localizer };
}

interface VoxRuntimeBuilder {
  add: (language: string, options?: LanguageOptions) => VoxRuntimeBuilder;
  init: (options?: VoxInitOptions<string>) => VoxRuntimeInstance;
}

function createChain(
  variants: ReadonlyMap<string, VoxVariant>,
  remaining: readonly string[],
  finish: FinishChain,
): TranslateChain {
  const chain: TranslateChain = {
    fallback(fallbackLanguage?: string): unknown {
      return finish(variants, fallbackLanguage);
    },
  };

  for (const language of remaining) {
    chain[language] = function translateTemplate(
      template: TemplateStringsArray,
      ...values: VoxInterpolation[]
    ): unknown {
      const nextVariants = new Map<string, VoxVariant>([
        ...variants,
        [language, createVariant(template, values)],
      ]);
      const rest = remaining.filter((item) => item !== language);

      // Все языки переведены — цепочка закрывается результатом.
      if (rest.length === 0) {
        return finish(nextVariants);
      }

      return createChain(nextVariants, rest, finish);
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

  function localize(phrase: VoxPhrase, language: string): string {
    if (!isVoxPhrase(phrase)) {
      throw new TypeError(
        "[vox] vox() expects a phrase. Use vox(phrase.en`Text`) or translate in place: vox.en`Text`.ru`Текст`.",
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

    /** Закрывает цепочку готовой фразой. */
    function finishPhrase(
      variants: ReadonlyMap<string, VoxVariant>,
      fallbackLanguage: string | undefined,
    ): Phrase {
      return new Phrase({
        defaultFallbackLanguage,
        fallbackLanguage,
        languageAgnosticVariant: undefined,
        variants,
      });
    }

    const phrase: TranslateChain = {
      ...createChain(new Map<string, VoxVariant>(), languages, finishPhrase),
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

    /**
     * `vox` из `useVox()`: та же цепочка, что у `phrase`, но завершённая цепочка
     * сразу рендерится в языке этого рендера.
     */
    function createLocalizer(language: string): Localizer {
      function vox(input: VoxPhrase): string {
        return localize(input, language);
      }

      function render(
        variants: ReadonlyMap<string, VoxVariant>,
        fallbackLanguage?: string,
      ): string {
        return renderPhrase(finishPhrase(variants, fallbackLanguage), language, getHelpers);
      }

      return Object.assign(vox, createChain(new Map<string, VoxVariant>(), languages, render), {
        [ANY]: function translateAny(
          template: TemplateStringsArray,
          ...values: VoxInterpolation[]
        ): string {
          return renderVariant(createVariant(template, values), getHelpers(language));
        },
      });
    }

    function useLanguage(): [string, (language: string) => void] {
      const language = useSyncExternalStore(
        languageStore.subscribe,
        languageStore.getLanguage,
        languageStore.getLanguage,
      );

      return [language, languageStore.setLanguage];
    }

    function useVox(): { language: string; vox: Localizer } {
      const [language] = useLanguage();
      const vox = useMemo(() => createLocalizer(language), [language]);

      return { language, vox };
    }

    return {
      getLanguage: languageStore.getLanguage,
      phrase,
      setLanguage: languageStore.setLanguage,
      subscribe: languageStore.subscribe,
      useLanguage,
      useVox,
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
