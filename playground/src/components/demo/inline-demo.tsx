import { useState } from "react";
import { useVox } from "@/i18n";

export function InlineDemo() {
  const { vox } = useVox();
  const [name, setName] = useState("Ada");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs text-muted-foreground" htmlFor="inline-name">
          Name
        </label>
        <input
          className="h-7 w-32 rounded-md border border-input bg-card px-2 text-sm"
          id="inline-name"
          onChange={(event) => {
            setName(event.target.value);
          }}
          value={name}
        />
      </div>
      <p className="text-xl font-medium">
        {vox.en`Hello, ${name}!`.ru`Привет, ${name}!`.zh`你好，${name}！`}
      </p>
      <p className="text-xs text-muted-foreground">
        The localizer carries the same chain as <span className="font-mono">phrase</span>, but a
        finished chain renders right away in the current language — no{" "}
        <span className="font-mono">VoxPhrase</span> in between.
      </p>
    </div>
  );
}
