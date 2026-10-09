/// <reference types="vite/client" />

interface HighlightedCode {
  code: string;
  html: string;
  lang: string;
}

declare module "*?highlight" {
  const highlighted: HighlightedCode;

  export default highlighted;
}
