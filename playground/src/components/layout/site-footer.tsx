import { REPOSITORY_URL } from "@/site-nav";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-border py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>ISC licensed · Built with vox — this page is one of its consumers.</p>
        <div className="flex gap-4">
          <a
            className="transition-colors hover:text-foreground"
            href={REPOSITORY_URL}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <a className="transition-colors hover:text-foreground" href="#top">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
