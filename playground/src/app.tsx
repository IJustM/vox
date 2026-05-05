import { useVox, vox } from "./vox";

export function App() {
  const { t } = useVox();

  const VOX = "VOX";
  const count = 1;

  return (
    <section>
      <h1>{t(vox.any`${VOX}!`)}</h1>
      <p>{t(vox.ru`Заголовок`.en`Title`.jp`タイトル`)}</p>
      <p>{t(vox.ru`Текст`.en`Text`.fallback("en"))}</p>
      <p>
        {t(
          vox.ru`У вас ${(h) => h.plural(count, "лайк", "лайка", "лайков")}`
            .en`You have ${(h) => h.plural(count, "like", "likes")}`
            .jp`${(_) => count}件の「いいね」があります`,
        )}
      </p>
    </section>
  );
}
