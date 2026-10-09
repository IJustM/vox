import { CodeBlock } from "@/components/docs/code-block";
import { InlineCode, Prose } from "@/components/docs/section";
import developmentSource from "../snippets/development.sh?highlight";

export function Development() {
  return (
    <div className="space-y-5">
      <Prose>
        <p>
          Browser tests run in Chromium through Playwright and cover the library and this site: the
          demos are asserted the same way a user would click them. Documentation snippets are real
          files — <InlineCode>typecheck:site</InlineCode> fails if an example stops compiling, and{" "}
          <InlineCode>site:build</InlineCode> fails if the page cannot be built.
        </p>
      </Prose>
      <CodeBlock source={developmentSource} />
    </div>
  );
}
