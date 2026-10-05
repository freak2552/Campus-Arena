"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "student-theme";

// Same idea as AdminShell: a "dark" class on a wrapper div, saved in localStorage.
export function useStudentTheme() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(THEME_KEY) === "dark") {
        setDarkMode(true);
      }
    } catch {
      // localStorage not available, stay on light theme
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);

    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      // ignore
    }
  };

  return { darkMode, toggleDarkMode };
}
