import type { ReactNode } from "react";
import { expect, test } from "vitest";
import { render, renderHook } from "vitest-browser-react";
import { createVoxBuilder } from "../index";

const COUNT = 3;
const NAME = "Ada";

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
  const { phrase, useVox, setLanguage } = createVox();
  const { act, result } = await renderHook(() => useVox());
  const title = phrase.ru`Заголовок`.en`Title`.zh`标题`;

  expect(result.current.language).toBe("ru");
  expect(result.current.vox(title)).toBe("Заголовок");

  await act(() => {
    setLanguage("en");
  });
  expect(result.current.language).toBe("en");
  expect(result.current.vox(title)).toBe("Title");

  await act(() => {
    setLanguage("zh");
  });
  expect(result.current.vox(title)).toBe("标题");
});

test("вызывает хелперы языка, которому принадлежит перевод", async () => {
  const { phrase, useVox, setLanguage } = createVox();
  const { act, result } = await renderHook(() => useVox());
  const likes = phrase.ru`У вас ${COUNT} ${(h) => h.plural(COUNT, "лайк", "лайка", "лайков")}`
    .en`You have ${COUNT} ${(h) => h.plural(COUNT, "like", "likes")}`.zh`你有 ${COUNT} 个赞`;

  expect(result.current.vox(likes)).toBe("У вас 3 лайка");

  await act(() => {
    setLanguage("en");
  });
  expect(result.current.vox(likes)).toBe("You have 3 likes");

  await act(() => {
    setLanguage("zh");
  });
  expect(result.current.vox(likes)).toBe("你有 3 个赞");
});

test("использует defaultFallbackLanguage и явный fallback", async () => {
  const { phrase, useVox, setLanguage } = createVox();
  const { act, result } = await renderHook(() => useVox());
  const defaultFallback = phrase.ru`Текст`.en`Text`.fallback();
  const explicitFallback = phrase.ru`Текст`.en`Text`.fallback("en");

  await act(() => {
    setLanguage("zh");
  });

  expect(result.current.vox(defaultFallback)).toBe("Текст");
  expect(result.current.vox(explicitFallback)).toBe("Text");
});

test("рендерит phrase.any одинаково во всех языках", async () => {
  const { phrase, useVox, setLanguage } = createVox();
  const { act, result } = await renderHook(() => useVox());
  const agnostic = phrase.any`VOX!`;

  expect(result.current.vox(agnostic)).toBe("VOX!");

  await act(() => {
    setLanguage("en");
  });
  expect(result.current.vox(agnostic)).toBe("VOX!");

  await act(() => {
    setLanguage("zh");
  });
  expect(result.current.vox(agnostic)).toBe("VOX!");
});

test("рендерит цепочку сразу, без промежуточной фразы", async () => {
  const { useVox, setLanguage } = createVox();
  const { act, result } = await renderHook(() => useVox());

  function hello(): ReactNode {
    return result.current.vox.en`Hello, ${NAME}!`.ru`Привет, ${NAME}!`.zh`你好，${NAME}！`;
  }

  expect(hello()).toBe("Привет, Ada!");

  await act(() => {
    setLanguage("en");
  });
  expect(hello()).toBe("Hello, Ada!");

  await act(() => {
    setLanguage("zh");
  });
  expect(hello()).toBe("你好，Ada！");
});

test("закрывает цепочку fallback и рендерит её сразу", async () => {
  const { useVox, setLanguage } = createVox();
  const { act, result } = await renderHook(() => useVox());

  await act(() => {
    setLanguage("zh");
  });

  expect(result.current.vox.en`Text`.ru`Текст`.fallback()).toBe("Текст");
  expect(result.current.vox.en`Text`.ru`Текст`.fallback("en")).toBe("Text");
});

test("рендерит vox.any одинаково во всех языках", async () => {
  const { useVox, setLanguage } = createVox();
  const { act, result } = await renderHook(() => useVox());

  function agnostic(): ReactNode {
    return result.current.vox.any`VOX!`;
  }

  expect(agnostic()).toBe("VOX!");

  await act(() => {
    setLanguage("en");
  });
  expect(agnostic()).toBe("VOX!");

  await act(() => {
    setLanguage("zh");
  });
  expect(agnostic()).toBe("VOX!");
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

test("бросает ошибку, если в vox() передали не фразу", async () => {
  const { useVox } = createVox();
  const { result } = await renderHook(() => useVox());
  const vox = result.current.vox as (input: unknown) => unknown;

  expect(() => vox("Текст")).toThrowError(/expects a phrase/u);

  // Вызов тегом без языка не поддерживается: цепочка строится через vox.en и т.д.
  const taggedTemplate = Object.assign(["Текст"], { raw: ["Текст"] });

  expect(() => vox(taggedTemplate)).toThrowError(/expects a phrase/u);
});

test("перерисовывает компонент при смене языка", async () => {
  const { phrase, useVox, useLanguage } = createVox();

  function Demo() {
    const { vox } = useVox();
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
        <p>{vox(phrase.ru`Заголовок`.en`Title`.zh`标题`)}</p>
        <p>{vox.ru`Текст`.en`Text`.zh`文本`}</p>
        <span>{language}</span>
      </div>
    );
  }

  const screen = await render(<Demo />);

  await expect.element(screen.getByText("Заголовок")).toBeVisible();
  await expect.element(screen.getByText("Текст")).toBeVisible();
  await expect.element(screen.getByText("ru")).toBeVisible();

  await screen.getByRole("button", { name: "switch" }).click();

  await expect.element(screen.getByText("Title")).toBeVisible();
  await expect.element(screen.getByText("Text")).toBeVisible();
  await expect.element(screen.getByText("en")).toBeVisible();
});
