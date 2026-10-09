import { createVoxBuilder } from "../../src";

export const { vox, useVox, useLanguage, setLanguage, getLanguage, subscribe } = createVoxBuilder()
  .add("en", {
    helpers: {
      plural: (count: number, one: string, several: string) => (count === 1 ? one : several),
    },
  })
  .add("ru", {
    helpers: {
      // oxlint-disable-next-line max-params
      plural: (count: number, one: string, two: string, five: string) => {
        const absCount = Math.abs(count);

        if (absCount > 10 && absCount < 20) {
          return five;
        }

        const remainder = absCount % 10;
        switch (remainder) {
          case 0: {
            return five;
          }
          case 1: {
            return one;
          }
          case 2:
          case 3:
          case 4: {
            return two;
          }
          default: {
            return five;
          }
        }
      },
    },
  })
  .add("zh")
  .init({
    defaultFallbackLanguage: "en",
  });
