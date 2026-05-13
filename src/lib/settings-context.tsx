import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "matrix" | "cyber" | "blood" | "void";
export type Cursor = "default" | "crosshair" | "none" | "dot";

interface TabCloaker {
  enabled: boolean;
  title: string;
  faviconUrl: string;
}

interface SettingsContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  cursor: Cursor;
  setCursor: (c: Cursor) => void;
  tabCloaker: TabCloaker;
  setTabCloaker: (tc: TabCloaker) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  theme: "matrix",
  setTheme: () => {},
  cursor: "default",
  setCursor: () => {},
  tabCloaker: { enabled: false, title: "", faviconUrl: "" },
  setTabCloaker: () => {},
});

const CURSOR_CSS: Record<Cursor, string> = {
  default: "auto",
  crosshair: "crosshair",
  none: "none",
  dot: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='4' fill='%23FF9900'/%3E%3C/svg%3E\") 8 8, auto",
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("gamehub-theme") as Theme) ?? "matrix";
  });

  const [cursor, setCursorState] = useState<Cursor>(() => {
    return (localStorage.getItem("gamehub-cursor") as Cursor) ?? "default";
  });

  const [tabCloaker, setTabCloakerState] = useState<TabCloaker>(() => {
    try {
      const saved = localStorage.getItem("gamehub-tab-cloaker");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { enabled: false, title: "Google", faviconUrl: "https://www.google.com/favicon.ico" };
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("gamehub-theme", t);
  };

  const setCursor = (c: Cursor) => {
    setCursorState(c);
    localStorage.setItem("gamehub-cursor", c);
  };

  const setTabCloaker = (tc: TabCloaker) => {
    setTabCloakerState(tc);
    localStorage.setItem("gamehub-tab-cloaker", JSON.stringify(tc));
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.cursor = CURSOR_CSS[cursor];
  }, [cursor]);

  useEffect(() => {
    if (tabCloaker.enabled) {
      document.title = tabCloaker.title || "Game Hub";
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      if (tabCloaker.faviconUrl) {
        link.href = tabCloaker.faviconUrl;
      }
    } else {
      document.title = "Game Hub";
    }
  }, [tabCloaker]);

  return (
    <SettingsContext.Provider value={{ theme, setTheme, cursor, setCursor, tabCloaker, setTabCloaker }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
