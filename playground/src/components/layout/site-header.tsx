import { Moon, Sun } from "lucide-react";
import { GithubMark } from "@/components/icons/github-mark";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { REPOSITORY_URL, SITE_SECTIONS } from "@/site-nav";

export function SiteHeader() {
  const [isDark, toggleTheme] = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <a className="flex items-center gap-2 text-sm font-semibold" href="#top">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            v
          </span>
          vox
        </a>
        <nav aria-label="Sections" className="ml-1 hidden items-center gap-0.5 md:flex">
          {SITE_SECTIONS.map((section) => (
            <a
              className="rounded-md px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              href={`#${section.id}`}
              key={section.id}
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Button asChild size="sm" variant="ghost">
            <a href={REPOSITORY_URL} rel="noreferrer" target="_blank">
              <GithubMark />
              GitHub
            </a>
          </Button>
          <Button
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
            size="icon"
            type="button"
            variant="ghost"
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
    </header>
  );
}
