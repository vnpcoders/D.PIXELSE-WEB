"use client"

import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") || "light"
    setTheme(current)
  }, [])

  const choose = (next) => {
    if (next === "light") {
      document.documentElement.removeAttribute("data-theme")
    } else {
      document.documentElement.setAttribute("data-theme", "dark")
    }
    localStorage.setItem("theme", next)
    setTheme(next)
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Toggle light/dark theme">
      <button
        className={`dot ${theme === "light" ? "active" : ""}`}
        onClick={() => choose("light")}
        aria-label="Light mode"
        title="Light mode"
      >
        ☀
      </button>
      <button
        className={`dot ${theme === "dark" ? "active" : ""}`}
        onClick={() => choose("dark")}
        aria-label="Dark mode"
        title="Dark mode"
      >
        ☾
      </button>
    </div>
  )
}
