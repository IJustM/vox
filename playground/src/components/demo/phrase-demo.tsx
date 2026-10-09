import { useVox, vox } from "@/i18n";

export function PhraseDemo() {
  const { language, t } = useVox();
  const phrase = vox.en`Good morning`.ru`Доброе утро`.zh`早上好`;

  return (
    <div className="space-y-3">
      <p className="text-xl font-medium">{t(phrase)}</p>
      <p className="text-xs text-muted-foreground">
        Every language is covered, so the chain collapsed into a <code>VoxPhrase</code>. The{" "}
        <span className="font-mono">{language}</span> variant is rendered and the component
        re-renders on every language change.
      </p>
    </div>
  );
}
