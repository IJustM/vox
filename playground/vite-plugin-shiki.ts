import { readFile } from "node:fs/promises";
import { createHighlighter, type Highlighter } from "shiki";
import type { Plugin } from "vite";

const QUERY = "?highlight";

const THEMES = { dark: "github-dark", light: "github-light" } as const;

const LANGS = ["bash", "json", "sh", "ts", "tsx"] as const;

export interface HighlightedCode {
  code: string;
  html: string;
  lang: string;
}

function detectLanguage(file: string): string {
  const extension = file.slice(file.lastIndexOf(".") + 1);

  return (LANGS as readonly string[]).includes(extension) ? extension : "bash";
}

/**
 * Подсвечивает исходники на этапе сборки: `import source from "./demo.tsx?highlight"`
 * разворачивается в готовый HTML Shiki, поэтому сам Shiki в клиентский бандл не попадает.
 */
export function shikiHighlight(): Plugin {
  let highlighter: Promise<Highlighter> | undefined = undefined;
  const cache = new Map<string, string>();

  function getHighlighter(): Promise<Highlighter> {
    highlighter ??= createHighlighter({
      langs: [...LANGS],
      themes: [THEMES.light, THEMES.dark],
    });

    return highlighter;
  }

  async function highlight(file: string): Promise<HighlightedCode> {
    const code = await readFile(file, "utf8");
    const lang = detectLanguage(file);
    const cacheKey = `${file}:${lang}:${code}`;

    let html = cache.get(cacheKey);

    if (html === undefined) {
      const instance = await getHighlighter();

      html = instance.codeToHtml(code, { defaultColor: false, lang, themes: THEMES });
      cache.set(cacheKey, html);
    }

    return { code, html, lang };
  }

  return {
    enforce: "pre",

    async load(id) {
      const queryIndex = id.indexOf(QUERY);

      if (queryIndex === -1) {
        return;
      }

      const file = id.slice(0, queryIndex);

      this.addWatchFile(file);

      const highlighted = await highlight(file);

      return `export default ${JSON.stringify(highlighted)};`;
    },

    name: "vox:shiki-highlight",
  };
}
