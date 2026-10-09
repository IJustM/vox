import { getLanguage, setLanguage, subscribe } from "@/i18n";

// The store is plain JavaScript: call it from a router, a settings menu, an effect…
setLanguage(navigator.language.startsWith("ru") ? "ru" : "en");

// Reading needs no React either.
document.documentElement.lang = getLanguage();

// Subscribe for changes outside of components.
const unsubscribe = subscribe(() => {
  document.documentElement.lang = getLanguage();
});

unsubscribe();
