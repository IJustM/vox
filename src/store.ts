import type { VoxLanguageStore } from "./types";

/**
 * Создаёт внешний стор языка. Состояние живёт вне React, подписчики
 * уведомляются синхронно, поэтому `useSyncExternalStore` сразу видит
 * актуальное значение.
 */
export function createLanguageStore<Language extends string>(
  initialLanguage: Language,
  isRegistered: (language: string) => boolean,
): VoxLanguageStore<Language> {
  let language = initialLanguage;
  const listeners = new Set<() => void>();

  function getLanguage(): Language {
    return language;
  }

  function setLanguage(nextLanguage: Language): void {
    if (!isRegistered(nextLanguage)) {
      throw new Error(
        `[vox] Language "${nextLanguage}" is not registered. Add it first: builder.add("${nextLanguage}").`,
      );
    }

    if (nextLanguage === language) {
      return;
    }

    language = nextLanguage;

    for (const listener of listeners) {
      listener();
    }
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  return { getLanguage, setLanguage, subscribe };
}
