import {
  CornerDownRight,
  Database,
  Hash,
  Languages,
  Package,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Feature {
  description: string;
  icon: LucideIcon;
  title: string;
}

const FEATURES: readonly Feature[] = [
  {
    description:
      "A chain only collapses into a phrase once every registered language is covered — or you close it with fallback(). A forgotten translation is a type error.",
    icon: ShieldCheck,
    title: "Exhaustive by construction",
  },
  {
    description:
      "Plural rules, gender, number formatting: attach helpers to a language and use them inside its templates. They run at render time with that language's helpers.",
    icon: Languages,
    title: "Helpers per language",
  },
  {
    description:
      'fallback() uses the default language, fallback("en") pins one. What stands in for a missing translation is written down, not guessed at runtime.',
    icon: CornerDownRight,
    title: "Explicit fallbacks",
  },
  {
    description:
      "phrase.any renders the same text in every language — for brand names, product names and codes that should never be translated.",
    icon: Hash,
    title: "Language-agnostic phrases",
  },
  {
    description:
      "The localizer mirrors the phrase chain, so a translation can be built and rendered in place: vox.en`Hello`.ru`Привет`. No intermediate value to name.",
    icon: Zap,
    title: "Translate in place",
  },
  {
    description:
      "The current language lives in a small store per builder instance. Read it anywhere, subscribe outside React, and it stays SSR-safe.",
    icon: Database,
    title: "State outside React",
  },
  {
    description:
      "One peer dependency: React. The rest is plain TypeScript — no runtime dependencies, no code generation, no message catalogues to load.",
    icon: Package,
    title: "Nothing to ship",
  },
];

export function Features() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((feature) => (
        <Card className="h-full" key={feature.title}>
          <CardHeader>
            <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <feature.icon aria-hidden className="size-4.5" />
            </span>
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
