import { createVoxBuilder } from "../../src";

export const { phrase, useVox, useLanguage, setLanguage, getLanguage, subscribe } =
  createVoxBuilder()
    .add("en", {
      helpers: {
        plural: (count: number, one: string, several: string) => (count === 1 ? one : several),
      },
    })
    .add("ru", {
      helpers: {
        plural: (count: number, [one, few, many]: [string, string, string]) => {
          const absCount = Math.abs(count);

          if (absCount > 10 && absCount < 20) {
            return many;
          }

          switch (absCount % 10) {
            case 1: {
              return one;
            }
            case 2:
            case 3:
            case 4: {
              return few;
            }
            default: {
              return many;
            }
          }
        },
      },
    })
    .add("zh")
    .init({
      defaultFallbackLanguage: "en",
    });
