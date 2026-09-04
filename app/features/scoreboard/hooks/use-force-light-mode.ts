import { useEffect } from "react";

export function useForceLightMode() {
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    const hadLight = root.classList.contains("light");
    const colorScheme = root.style.colorScheme;
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
    return () => {
      root.classList.toggle("dark", hadDark);
      root.classList.toggle("light", hadLight);
      root.style.colorScheme = colorScheme;
    };
  }, []);
}
