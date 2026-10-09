import { useEffect, useState } from "react";

/**
 * Возвращает id секции, которая сейчас в фокусе, для подсветки в навигации.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const elements = ids
      .map((id) => document.querySelector(`#${id}`))
      .filter((element): element is Element => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .toSorted((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const [first] = visible;

        if (first !== undefined) {
          setActive(first.target.id);
        }
      },
      { rootMargin: "-88px 0px -62% 0px" },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [ids]);

  return active;
}
