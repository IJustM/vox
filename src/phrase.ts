import type { VoxPhrase } from "./types";

/**
 * Значение внутри шаблона: либо готовый фрагмент, либо функция, которая
 * вычисляется в момент рендера с хелперами выбранного языка.
 */
export type VoxInterpolation =
  | number
  | string
  | ((helpers: Record<string, unknown>) => number | string);

export interface VoxVariant {
  readonly strings: readonly string[];
  readonly values: readonly VoxInterpolation[];
}

export interface PhraseOptions {
  /** Переводы по языкам: `language -> вариант шаблона`. */
  readonly variants: ReadonlyMap<string, VoxVariant>;
  /** Язык, явно указанный в `.fallback(language)`. */
  readonly fallbackLanguage: string | undefined;
  /** Язык из `init({ defaultFallbackLanguage })`. */
  readonly defaultFallbackLanguage: string | undefined;
  /** Вариант для `phrase.any`, не привязанный к языку. */
  readonly languageAgnosticVariant: VoxVariant | undefined;
}

export interface ResolvedVariant {
  readonly language: string;
  readonly variant: VoxVariant;
}

/**
 * Неизменяемая фраза: собирается цепочкой `phrase.ru`...`.en`... и рендерится
 * функцией `vox` в текущем языке. Один экземпляр можно рендерить в разных языках.
 */
export class Phrase implements VoxPhrase {
  // oxlint-disable-next-line no-underscore-dangle
  readonly __brand = "VoxPhrase" as const;

  readonly #options: PhraseOptions;

  constructor(options: PhraseOptions) {
    this.#options = options;
  }

  /**
   * Выбирает вариант под текущий язык в порядке приоритета:
   * запрошенный язык → `.fallback(language)` → `defaultFallbackLanguage` →
   * `phrase.any` → единственный (первый) доступный вариант.
   */
  resolve(language: string): ResolvedVariant | undefined {
    const { variants, fallbackLanguage, defaultFallbackLanguage, languageAgnosticVariant } =
      this.#options;

    const candidates = [language, fallbackLanguage, defaultFallbackLanguage].filter(
      (candidate): candidate is string => candidate !== undefined,
    );

    const resolved = resolveByLanguage(variants, candidates);

    if (resolved !== undefined) {
      return resolved;
    }

    if (languageAgnosticVariant !== undefined) {
      return { language, variant: languageAgnosticVariant };
    }

    return resolveFirstVariant(variants);
  }
}

/**
 * Собирает строку перевода, вызывая функции-значения с хелперами языка, к
 * которому относится выбранный вариант.
 */
export function renderPhrase(
  phrase: Phrase,
  language: string,
  getHelpers: (language: string) => Record<string, unknown>,
): string {
  const resolved = phrase.resolve(language);

  if (resolved === undefined) {
    return "";
  }

  return renderVariant(resolved.variant, getHelpers(resolved.language));
}

function resolveByLanguage(
  variants: ReadonlyMap<string, VoxVariant>,
  languages: readonly string[],
): ResolvedVariant | undefined {
  for (const language of languages) {
    const variant = variants.get(language);

    if (variant !== undefined) {
      return { language, variant };
    }
  }

  return undefined;
}

function resolveFirstVariant(
  variants: ReadonlyMap<string, VoxVariant>,
): ResolvedVariant | undefined {
  for (const [language, variant] of variants) {
    return { language, variant };
  }

  return undefined;
}

export function renderVariant(variant: VoxVariant, helpers: Record<string, unknown>): string {
  let text = "";

  for (const [index, chunk] of variant.strings.entries()) {
    const value = variant.values[index];
    const interpolation = value === undefined ? "" : renderInterpolation(value, helpers);

    text += `${chunk}${interpolation}`;
  }

  return text;
}

function renderInterpolation(value: VoxInterpolation, helpers: Record<string, unknown>): string {
  return typeof value === "function" ? String(value(helpers)) : String(value);
}
