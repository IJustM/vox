import { useCallback, useEffect, useState } from "react";

const THEME_KEY = "vox-theme";

function readIsDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

/**
 * Тема хранится в localStorage; при её отсутствии следим за системной.
 */
export function useTheme(): [boolean, () => void] {
  const [isDark, setIsDark] = useState(readIsDark);

  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");

    function handleChange(event: MediaQueryListEvent) {
      if (localStorage.getItem(THEME_KEY) === null) {
        document.documentElement.classList.toggle("dark", event.matches);
        setIsDark(event.matches);
      }
    }

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = !readIsDark();

    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    setIsDark(next);
  }, []);

  return [isDark, toggle];
}
