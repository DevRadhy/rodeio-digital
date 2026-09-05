import { useEffect } from "react";

export function useForceLightMode() {
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    const hadLight = root.classList.contains("light");
    const colorScheme = root.style.colorScheme;
    const enforceLight = () => {
      if (!root.classList.contains("dark") && root.classList.contains("light"))
        return;
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
    };
    enforceLight();
    const observer = new MutationObserver(enforceLight);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => {
      observer.disconnect();
      root.classList.toggle("dark", hadDark);
      root.classList.toggle("light", hadLight);
      root.style.colorScheme = colorScheme;
    };
  }, []);
}
