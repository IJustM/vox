import { useLanguage } from "@/i18n";

const LANGUAGES = ["en", "ru", "zh"] as const;

export function LanguageMenu() {
  const [language, setLanguage] = useLanguage();

  return (
    <select
      onChange={(event) => {
        setLanguage(event.target.value as (typeof LANGUAGES)[number]);
      }}
      value={language}
    >
      <option value="en">English</option>
      <option value="ru">Русский</option>
      <option value="zh">中文</option>
    </select>
  );
}
