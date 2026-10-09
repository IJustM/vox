# vox

[![CI](https://github.com/IJustM/vox/actions/workflows/ci.yml/badge.svg)](https://github.com/IJustM/vox/actions/workflows/ci.yml)

Type-safe localization for React interfaces. A phrase is built with tagged templates — one per language — and rendered by a hook against an external language store.

**[Documentation and live playground →](https://ijustm.github.io/vox/)**

```tsx
const { vox, useVox } = createVoxBuilder().add("en").add("ru").init();

function App() {
  const { t } = useVox();

  return <h1>{t(vox.en`Hello`.ru`Привет`)}</h1>;
}
```

## Features

- **Exhaustive translations enforced by types.** A translation chain only collapses into a `VoxPhrase` once every registered language is covered, or once an explicit fallback is declared.
- **Per-language helpers.** Pluralization, formatting and any other logic are evaluated at render time with the helpers of the language being rendered.
- **Explicit fallbacks.** `.fallback()` uses `defaultFallbackLanguage`, `.fallback("en")` pins a specific language.
- **Language-agnostic phrases.** `vox.any` renders the same text in every language.
- **Language state lives outside React.** A small store per builder instance, compatible with `useSyncExternalStore`, SSR-safe, switchable from anywhere.
- **No runtime dependencies** other than a React peer.

## Installation

```sh
pnpm add vox
```

React 18 or 19 is required as a peer dependency.

## Quick start

Create the instance once, in its own module:

```ts
// src/i18n.ts
import { createVoxBuilder } from "vox";

export const { vox, useVox, useLanguage, setLanguage } = createVoxBuilder()
  .add("en", {
    helpers: {
      plural: (count: number, one: string, several: string) => (count === 1 ? one : several),
    },
  })
  .add("ru", {
    helpers: {
      plural: (count: number, one: string, few: string, many: string) => {
        const mod10 = count % 10;
        const mod100 = count % 100;

        if (mod10 === 1 && mod100 !== 11) {
          return one;
        }

        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
          return few;
        }

        return many;
      },
    },
  })
  .add("zh")
  .init({ defaultFallbackLanguage: "en" });
```

Translate in a component:

```tsx
// src/app.tsx
import { useVox, vox } from "./i18n";

const COUNT = 3;

export function App() {
  const { t } = useVox();

  return (
    <p>
      {t(
        vox.en`You have ${COUNT} ${(h) => h.plural(COUNT, "like", "likes")}`
          .ru`У вас ${COUNT} ${(h) => h.plural(COUNT, "лайк", "лайка", "лайков")}`
          .zh`你有 ${COUNT} 个赞`,
      )}
    </p>
  );
}
```

Switch the language:

```tsx
// src/language-switcher.tsx
import { useLanguage } from "./i18n";

const LANGUAGES = ["en", "ru", "zh"] as const;

export function LanguageSwitcher() {
  const [language, setLanguage] = useLanguage();

  return (
    <nav>
      {LANGUAGES.map((item) => (
        <button
          key={item}
          aria-pressed={item === language}
          onClick={() => {
            setLanguage(item);
          }}
          type="button"
        >
          {item}
        </button>
      ))}
    </nav>
  );
}
```

## Concepts

### Phrases and translation chains

`vox.en` is a tag function for the `en` language. Calling it adds the translated template to the phrase being built and returns a chain with the remaining languages, so the type of the result tells you exactly what is still missing. When the chain is complete, you get a `VoxPhrase` — the only thing `t` accepts.

```ts
const title = vox.en`Title`.ru`Заголовок`.zh`标题`; // VoxPhrase
```

Phrases are plain immutable data, so they can be defined at module scope, passed around and rendered in any language.

### Fallbacks

If a phrase is not translated into every language, close the chain with `fallback()` — the remaining languages will render the fallback translation:

```ts
t(vox.en`Text`.ru`Текст`.fallback()); // uses `defaultFallbackLanguage`
t(vox.en`Text`.ru`Текст`.fallback("ru")); // pins "ru"
```

### Language-agnostic phrases

`vox.any` builds a phrase that renders identically in every language. Values are interpolated with the helpers of the current language.

```ts
t(vox.any`VOX!`);
```

### Helpers

Helpers are declared per language in `add()` and are available to interpolation functions of that language only:

```ts
vox.en`You have ${COUNT} ${(h) => h.plural(COUNT, "like", "likes")}`;
```

An interpolation may be a `string`, a `number`, or a function `(helpers) => string | number`. Functions are evaluated during rendering, so they always use the helpers of the language whose translation was picked.

### Language resolution

For a given current language, `t` picks the first available variant in this order:

1. the variant of the current language;
2. the variant of the language passed to `.fallback(language)`;
3. the variant of `defaultFallbackLanguage` from `init()`;
4. the `vox.any` variant;
5. the first variant present in the phrase.

If a phrase has no variants at all, `t` renders an empty string.

### Language store

The current language lives in a store created per `createVoxBuilder()` instance, outside React:

| Member                  | Description                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `getLanguage()`         | Returns the current language.                                                                           |
| `setLanguage(language)` | Switches the language and notifies subscribers. Throws if the language was not registered with `add()`. |
| `subscribe(listener)`   | Subscribes to language changes, returns an unsubscribe function.                                        |
| `useVox()`              | Hook: `{ t, language }`, re-renders on language change.                                                 |
| `useLanguage()`         | Hook: `[language, setLanguage]`.                                                                        |

The initial language is `defaultFallbackLanguage`, or the first language passed to `add()` when the option is omitted. Nothing is auto-detected: call `setLanguage(navigator.language)` (after normalizing it to a registered language) if you want to follow the browser locale.

The store outlives repeated `init()` calls on the same builder instance, so a language switch is never lost by re-initializing. Different `createVoxBuilder()` instances are fully independent.

## API reference

### `createVoxBuilder()`

Returns a builder.

| Member                       | Description                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `add(language)`              | Registers a language without helpers.                                                                              |
| `add(language, { helpers })` | Registers a language with helpers.                                                                                 |
| `init(options?)`             | Creates the `vox` object and the hooks. `options.defaultFallbackLanguage` must be one of the registered languages. |

### Instance returned by `init()`

| Member                                            | Type                                              | Description                                                      |
| ------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------- |
| `vox`                                             | `Translate & { any }`                             | Tagged templates for every registered language, plus `vox.any`.  |
| `vox[language]`                                   | `(template, ...values) => VoxPhrase \| Translate` | Adds a translation and returns the chain of remaining languages. |
| `vox.fallback(language?)`                         | `(language?) => VoxPhrase`                        | Closes the chain with a fallback.                                |
| `vox.any`                                         | `(template, ...values) => VoxPhrase`              | Language-agnostic phrase.                                        |
| `useVox()`                                        | `() => { t, language }`                           | `t(phrase)` renders a phrase in the current language.            |
| `useLanguage()`                                   | `() => [language, setLanguage]`                   | Current language and a setter.                                   |
| `getLanguage()` / `setLanguage()` / `subscribe()` | see above                                         | Plain store access, usable outside React.                        |

### Exported types

| Type                                                          | Description                                                            |
| ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `VoxPhrase`                                                   | A fully resolved phrase accepted by `t`.                               |
| `VoxBuilder`                                                  | The builder returned by `createVoxBuilder()`.                          |
| `VoxInstance`                                                 | The object returned by `init()`.                                       |
| `LanguageOptions`                                             | `{ helpers: Record<string, unknown> }` — options of a single language. |
| `VoxInitOptions`                                              | `{ defaultFallbackLanguage?: Language }`.                              |
| `VoxLanguageStore`                                            | Interface of the language store.                                       |
| `Translate`, `TranslateFunction`, `TranslateTemplateFunction` | Building blocks of the chain typing.                                   |

## Development

The `playground/` app is both the live playground and the documentation site — every demo it
renders is a real component, and every snippet is imported straight from its source file.

```sh
pnpm install
pnpm play            # docs site + live playground (vite)
pnpm test            # browser tests of the library and the site (vitest + playwright)
pnpm typecheck       # types of the library
pnpm typecheck:site  # types of the docs site, its demos and snippets
pnpm lint            # oxlint
pnpm fmt             # oxfmt
pnpm build           # library bundle (tsdown -> dist)
pnpm site:build      # static site for GitHub Pages (playground/dist)
pnpm site:preview    # serve the built site locally
```

Browser tests run in Chromium through Playwright. Download the browser build pinned by the installed Playwright version once:

```sh
pnpm exec playwright install chromium
```

The site is deployed to [ijustm.github.io/vox](https://ijustm.github.io/vox/) by the
`Deploy site` workflow on every push to `main` (it needs **Settings → Pages → Source: GitHub
Actions** once). The build is served from a sub-path, so `pnpm site:build` uses a `/vox/` base —
override it with `SITE_BASE` when you deploy somewhere else.

## License

ISC
