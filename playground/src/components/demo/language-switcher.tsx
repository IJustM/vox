import { Languages } from "lucide-react";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

const LANGUAGES = ["en", "ru", "zh"] as const;

export function LanguageSwitcher() {
  const [language, setLanguage] = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Languages aria-hidden className="size-3.5" />
        Current language
      </span>
      <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
        {LANGUAGES.map((item) => (
          <button
            aria-pressed={item === language}
            className={cn(
              "rounded-md px-3 py-1 text-sm font-medium uppercase transition-colors",
              item === language
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            key={item}
            onClick={() => {
              setLanguage(item);
            }}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
