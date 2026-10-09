import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import { SECTION_IDS, SITE_SECTIONS } from "@/site-nav";

export function SiteSidebar() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <nav aria-label="Table of contents" className="lg:sticky lg:top-20 lg:self-start">
      <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
        {SITE_SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              className={cn(
                "block rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                active === section.id
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
              href={`#${section.id}`}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
