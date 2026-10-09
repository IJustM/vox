import { useLanguage, useVox, vox } from "./vox";

const VOX = "VOX";
const COUNT = 1;

const LANGUAGES = ["ru", "en", "zh"] as const;

export function App() {
  const { t } = useVox();
  const [language, setLanguage] = useLanguage();

  return (
    <div>
      <nav>
        {LANGUAGES.map((item) => (
          <button
            key={item}
            aria-pressed={item === language}
            onClick={() => {
              setLanguage(item);
            }}
            type="button"
          >
            {item}
          </button>
        ))}
      </nav>
      <h1>{t(vox.any`${VOX}!`)}</h1>
      <section>
        <p>{t(vox.ru`Заголовок`.en`Title`.zh`标题`)}</p>
        <p>{t(vox.ru`Текст`.en`Text`.fallback())}</p>
        <p>{t(vox.ru`Текст`.en`Text`.fallback("en"))}</p>
        <p>
          {t(
            vox.ru`У вас ${COUNT} ${(h) => h.plural(COUNT, "лайк", "лайка", "лайков")}`
              .en`You have ${COUNT} ${(h) => h.plural(COUNT, "like", "likes")}`
              .zh`你有 ${COUNT} 个赞`,
          )}
        </p>
      </section>
    </div>
  );
}
