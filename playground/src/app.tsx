import { useVox, vox } from "./vox";

const VOX = "VOX";
const COUNT = 1;

export function App() {
  const { t } = useVox();

  return (
    <div>
      <h1>{t(vox.any`${VOX}!`)}</h1>
      <section>
        <p>{t(vox.ru`Заголовок`.en`Title`.jp`タイトル`)}</p>
        <p>{t(vox.any`Текст`)}</p>
        <p>{t(vox.ru`Текст`.en`Text`.fallback())}</p>
        <p>{t(vox.ru`Текст`.en`Text`.fallback("en"))}</p>
        <p>
          {t(
            vox.ru`У вас ${(h) => h.plural(COUNT, "лайк", "лайка", "лайков")}`
              .en`You have ${(h) => h.plural(COUNT, "like", "likes")}`
              .jp`${(_) => COUNT}件の「いいね」があります`,
          )}
        </p>
      </section>
    </div>
  );
}
