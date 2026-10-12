import { ArrowRight } from "lucide-react";
import { GithubMark } from "@/components/icons/github-mark";
import { InstallCommand } from "@/components/docs/install-command";
import { Button } from "@/components/ui/button";
import { REPOSITORY_URL } from "@/site-nav";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-20" id="top">
      <div aria-hidden className="vox-glow pointer-events-none absolute inset-x-0 -top-32 h-96" />
      <div className="relative mx-auto max-w-3xl text-center">
        <h1 className="vox-reveal text-4xl font-semibold tracking-tight text-balance [animation-delay:60ms] sm:text-5xl">
          Localization that{" "}
          <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            compiles
          </span>
        </h1>

        <p className="vox-reveal mx-auto mt-4 max-w-2xl text-lg text-pretty text-muted-foreground [animation-delay:120ms]">
          vox turns translations into template chains: cover every language, or close the chain with
          an explicit fallback. Missing translations become compile errors instead of runtime
          surprises.
        </p>

        <div className="vox-reveal mt-8 flex flex-col items-center gap-5 [animation-delay:180ms]">
          <InstallCommand />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="lg">
              <a href="#playground">
                Try the playground
                <ArrowRight />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={REPOSITORY_URL} rel="noreferrer" target="_blank">
                <GithubMark />
                Source on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
