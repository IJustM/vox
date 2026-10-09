import { useVox, vox } from "@/i18n";

const COUNT = 3;

export function Inbox() {
  const { t } = useVox();

  return (
    <p>
      {t(
        vox.en`You have ${COUNT} ${(h) => h.plural(COUNT, "like", "likes")}`
          .ru`У вас ${COUNT} ${(h) => h.plural(COUNT, "лайк", "лайка", "лайков")}`
          .zh`你有 ${COUNT} 个赞`,
      )}
    </p>
  );
}
