export const SITE_SECTIONS = [
  { id: "playground", label: "Playground" },
  { id: "features", label: "Features" },
  { id: "quick-start", label: "Quick start" },
  { id: "concepts", label: "Concepts" },
] as const;

export const SECTION_IDS: readonly string[] = SITE_SECTIONS.map((section) => section.id);

export const REPOSITORY_URL = "https://github.com/IJustM/vox";
