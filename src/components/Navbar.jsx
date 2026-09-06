"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import ThemeToggle from "./ThemeToggle.jsx"

const links = [
  { to: "/", label: "Home" },
  { to: "/video", label: "Video" },
  { to: "/photo", label: "Photo" },
  { to: "/reels", label: "Reels" },
  { to: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const linksRef = useRef(null)
  const [pill, setPill] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const active = linksRef.current?.querySelector("a.active")
    if (active) {
      setPill({ left: active.offsetLeft, width: active.offsetWidth })
    }
    setOpen(false)
  }, [pathname])

  return (
    <header className="navbar glass">
      <div className="brand">
        D.PIXELS
      </div>

      <nav className={`nav-links ${open ? "open" : ""}`} ref={linksRef}>
        {pill.width > 0 && (
          <motion.span
            className="nav-pill"
            animate={{ left: pill.left, width: pill.width }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
        {links.map((l) => {
          const isActive = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to)
          return (
            <Link key={l.to} href={l.to} className={isActive ? "active" : ""}>
              {l.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ display: "flex", alignItems: "center" }}>
        <ThemeToggle />
        <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  )
}
