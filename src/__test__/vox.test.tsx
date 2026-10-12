import { expect, test } from "vitest";
import { render, renderHook } from "vitest-browser-react";
import { createVoxBuilder } from "../index";

const COUNT = 3;

function createVox() {
  return createVoxBuilder()
    .add("ru", {
      helpers: {
        // oxlint-disable-next-line max-params
        plural: (count: number, one: string, two: string, five: string) => {
          if (count === 1) {
            return one;
          }

          return count < 5 ? two : five;
        },
      },
    })
    .add("en", {
      helpers: {
        plural: (count: number, one: string, several: string) => (count === 1 ? one : several),
      },
    })
    .add("zh")
    .init({ defaultFallbackLanguage: "ru" });
}

test("рендерит перевод текущего языка и переключается через стор", async () => {
  const { vox, useVox, setLanguage } = createVox();

  const { result, act } = await renderHook(() => useVox());

  const phrase = vox.ru`Заголовок`.en`Title`.zh`标题`;

  expect(result.current.language).toBe("ru");
  expect(result.current.t(phrase)).toBe("Заголовок");

  await act(() => {
    setLanguage("en");
  });
  expect(result.current.language).toBe("en");
  expect(result.current.t(phrase)).toBe("Title");

  await act(() => {
    setLanguage("zh");
  });
  expect(result.current.t(phrase)).toBe("标题");
});

test("вызывает хелперы языка, которому принадлежит перевод", async () => {
  const { vox, useVox, setLanguage } = createVox();
  const { result, act } = await renderHook(() => useVox());

  const phrase = vox.ru`У вас ${COUNT} ${(h) => h.plural(COUNT, "лайк", "лайка", "лайков")}`
    .en`You have ${COUNT} ${(h) => h.plural(COUNT, "like", "likes")}`.zh`你有 ${COUNT} 个赞`;

  expect(result.current.t(phrase)).toBe("У вас 3 лайка");

  await act(() => {
    setLanguage("en");
  });
  expect(result.current.t(phrase)).toBe("You have 3 likes");

  await act(() => {
    setLanguage("zh");
  });
  expect(result.current.t(phrase)).toBe("你有 3 个赞");
});

test("использует defaultFallbackLanguage и явный fallback", async () => {
  const { vox, useVox, setLanguage } = createVox();
  const { result, act } = await renderHook(() => useVox());

  const defaultFallback = vox.ru`Текст`.en`Text`.fallback();
  const explicitFallback = vox.ru`Текст`.en`Text`.fallback("en");

  await act(() => {
    setLanguage("zh");
  });

  expect(result.current.t(defaultFallback)).toBe("Текст");
  expect(result.current.t(explicitFallback)).toBe("Text");
});

test("рендерит vox.any одинаково во всех языках", async () => {
  const { vox, useVox, setLanguage } = createVox();
  const { result, act } = await renderHook(() => useVox());

  const phrase = vox.any`VOX!`;

  expect(result.current.t(phrase)).toBe("VOX!");

  await act(() => {
    setLanguage("en");
  });
  expect(result.current.t(phrase)).toBe("VOX!");

  await act(() => {
    setLanguage("zh");
  });
  expect(result.current.t(phrase)).toBe("VOX!");
});

test("уведомляет подписчиков только при реальной смене языка", () => {
  const { getLanguage, setLanguage, subscribe } = createVox();

  let calls = 0;
  subscribe(() => {
    calls += 1;
  });

  expect(getLanguage()).toBe("ru");

  setLanguage("en");
  setLanguage("en");

  expect(calls).toBe(1);
  expect(getLanguage()).toBe("en");
});

test("перестаёт уведомлять после отписки", () => {
  const { getLanguage, setLanguage, subscribe } = createVox();

  let calls = 0;
  const unsubscribe = subscribe(() => {
    calls += 1;
  });

  unsubscribe();
  setLanguage("zh");

  expect(calls).toBe(0);
  expect(getLanguage()).toBe("zh");
});

test("бросает ошибку при переключении на незарегистрированный язык", () => {
  const { setLanguage } = createVox();
  const setUnknownLanguage = setLanguage as (language: string) => void;

  expect(() => {
    setUnknownLanguage("de");
  }).toThrowError(/not registered/u);
});

test("бросает ошибку, если в t() передали не фразу", async () => {
  const { useVox } = createVox();
  const { result } = await renderHook(() => useVox());
  const t = result.current.t as (phrase: unknown) => unknown;

  expect(() => t("Текст")).toThrowError(/expects a phrase/u);
});

test("перерисовывает компонент при смене языка", async () => {
  const { vox, useVox, useLanguage } = createVox();

  function Demo() {
    const { t } = useVox();
    const [language, setLanguage] = useLanguage();

    return (
      <div>
        <button
          onClick={() => {
            setLanguage("en");
          }}
          type="button"
        >
          switch
        </button>
        <p>{t(vox.ru`Заголовок`.en`Title`.zh`标题`)}</p>
        <span>{language}</span>
      </div>
    );
  }

  const screen = await render(<Demo />);

  await expect.element(screen.getByText("Заголовок")).toBeVisible();
  await expect.element(screen.getByText("ru")).toBeVisible();

  await screen.getByRole("button", { name: "switch" }).click();

  await expect.element(screen.getByText("Title")).toBeVisible();
  await expect.element(screen.getByText("en")).toBeVisible();
});
