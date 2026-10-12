import type { VoxPhrase } from "../../../src";
import { phrase } from "@/i18n";

// Every registered language is covered, so the chain collapses into a phrase…
export const covered: VoxPhrase = phrase.en`Hello`.ru`Привет`.zh`你好`;

// …or the remaining languages are closed with an explicit fallback.
export const withFallback: VoxPhrase = phrase.en`Hello`.ru`Привет`.fallback("ru");

// @ts-expect-error — "zh" is still missing, so this chain is not a phrase yet.
export const incomplete: VoxPhrase = phrase.en`Hello`.ru`Привет`;
