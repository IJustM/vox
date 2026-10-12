import { Code2, Eye } from "lucide-react";
import type { ReactNode } from "react";
import { CodeBlock, type CodeSource } from "@/components/docs/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVox } from "@/i18n";
import { cn } from "@/lib/utils";

export interface DemoProps {
  children: ReactNode;
  className?: string;
  note?: ReactNode;
  source: CodeSource;
}

/**
 * Живой пример: сверху вкладка «Preview» с реальным компонентом, ниже — его исходник.
 * Исходник импортируется из того же файла через `?highlight`, поэтому не расходится с демо.
 */
export function Demo({ children, className, note, source }: DemoProps) {
  const { vox } = useVox();

  return (
    <Tabs
      className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}
      defaultValue="preview"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
        <TabsList>
          <TabsTrigger value="preview">
            <Eye />
            {vox.en`Preview`.ru`Превью`.zh`预览`}
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code2 />
            {vox.en`Code`.ru`Код`.zh`代码`}
          </TabsTrigger>
        </TabsList>
        {note !== undefined && <p className="text-xs text-muted-foreground">{note}</p>}
      </div>
      <TabsContent className="p-5" value="preview">
        {children}
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock className="rounded-none border-0" source={source} showHeader={false} />
      </TabsContent>
    </Tabs>
  );
}
