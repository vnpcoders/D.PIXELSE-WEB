"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className="navbar">
      <div className="brand">
        D<span>.</span>PIXELSS <em style={{ fontStyle: "italic", fontSize: 14, marginLeft: 6, opacity: 0.7 }}>Photography</em>
      </div>

      <nav className={`nav-links ${open ? "open" : ""}`}>
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
        <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" style={{ marginLeft: 10 }}>
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  )
}
