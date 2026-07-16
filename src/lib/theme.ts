export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "dark";

export function resolveStoredTheme(value: string | null): Theme {
  return value === "light" || value === "dark" ? value : DEFAULT_THEME;
}

export const THEME_INITIALIZATION_SCRIPT = `
(() => {
  try {
    const savedTheme = window.localStorage.getItem("theme");
    const theme = savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : "dark";

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;
