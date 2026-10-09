import { Section } from "@/components/docs/section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApiReference } from "@/sections/api-reference";
import { Concepts } from "@/sections/concepts";
import { Development } from "@/sections/development";
import { Features } from "@/sections/features";
import { Hero } from "@/sections/hero";
import { Playground } from "@/sections/playground";
import { QuickStart } from "@/sections/quick-start";

export function App() {
  return (
    <TooltipProvider>
      <div className="min-h-dvh">
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:shadow-md"
          href="#playground"
        >
          Skip to the playground
        </a>
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Hero />
          <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
            <SiteSidebar />
            <div className="min-w-0">
              <Section
                description="Switch the language and every phrase, fallback and helper follows the store."
                id="playground"
                title="Playground"
              >
                <Playground />
              </Section>
              <Section
                className="border-t border-border/70"
                description="What you get out of the box, and what the type system enforces for you."
                id="features"
                title="Features"
              >
                <Features />
              </Section>
              <Section
                className="border-t border-border/70"
                description="Two files and a handful of lines: register the languages, then translate."
                id="quick-start"
                title="Quick start"
              >
                <QuickStart />
              </Section>
              <Section
                className="border-t border-border/70"
                description="Chains, fallback resolution and the store — the mental model behind the API."
                id="concepts"
                title="Concepts"
              >
                <Concepts />
              </Section>
              <Section
                className="border-t border-border/70"
                description="The complete surface: the builder, the instance and the exported types."
                id="api"
                title="API reference"
              >
                <ApiReference />
              </Section>
              <Section
                className="border-t border-border/70"
                description="Commands, tests, and how this page is built and deployed."
                id="development"
                title="Development"
              >
                <Development />
              </Section>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </TooltipProvider>
  );
}
