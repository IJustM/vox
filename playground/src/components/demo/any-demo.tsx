import { phrase, useVox } from "@/i18n";

export function AnyDemo() {
  const { vox } = useVox();

  return (
    <div className="space-y-3">
      <p className="text-xl font-medium">{vox(phrase.any`VOX!`)}</p>
      <p className="text-xs text-muted-foreground">
        A language-agnostic phrase: it renders the same text in every language, while interpolations
        still receive the helpers of the current one.
      </p>
    </div>
  );
}
