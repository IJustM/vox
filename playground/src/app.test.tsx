import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { App } from "./app";

test("renders the landing page with the live playground", async () => {
  const screen = await render(<App />);

  await expect.element(screen.getByRole("heading", { level: 1 })).toBeVisible();
  await expect.element(screen.getByText("Good morning")).toBeVisible();
  await expect.element(screen.getByText("You have 3 likes")).toBeVisible();
});

test("switches the language of every demo through the store", async () => {
  const screen = await render(<App />);

  await screen.getByRole("button", { name: /^ru$/iu }).click();
  await expect.element(screen.getByText("Доброе утро")).toBeVisible();

  await screen.getByRole("button", { name: /^zh$/iu }).click();
  await expect.element(screen.getByText("早上好")).toBeVisible();
  await expect.element(screen.getByText("你有 3 个赞")).toBeVisible();
});

test("renders the highlighted source behind every demo", async () => {
  const screen = await render(<App />);

  await screen.getByRole("tab", { name: /code/iu }).first().click();

  const highlighted = screen.container.querySelector(".shiki");

  expect(highlighted).not.toBeNull();
  expect(highlighted?.getAttribute("style")).toContain("--shiki-dark");
  expect(highlighted?.textContent).toContain("vox.en");
});
