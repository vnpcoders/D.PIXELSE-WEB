"use client"

import { useEffect, useState } from "react"
import Footer from "../../components/Footer.jsx"
import Lightbox from "../../components/Lightbox.jsx"
import { supabase } from "../../lib/supabaseClient.js"

export default function Reels() {
  const [active, setActive] = useState(null)
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("media").select("*").eq("type", "reel").order("created_at", { ascending: false })
      setReels(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <span className="section-label">Portfolio</span>
      <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Reels</h1>
      <p style={{ maxWidth: 560, marginTop: 12 }}>
        Short vertical stories from recent shoots — made for Instagram and YouTube Shorts.
      </p>

      {!loading && reels.length === 0 && <p style={{ marginTop: 30 }}>Abhi tak koi reel add nahi hui — admin panel se add karein.</p>}

      <div className="reel-strip" style={{ marginTop: 40 }}>
        {reels.map((r) => (
          <div className="card reel-card" key={r.id} onClick={() => setActive({ src: r.url, caption: r.caption, type: "reel" })}>
            <video src={r.url} muted preload="metadata" />
            <span className="play-badge glass">▶</span>
            <div className="card-caption">{r.caption}</div>
          </div>
        ))}
      </div>

      <Footer />
      <Lightbox item={active} onClose={() => setActive(null)} />
    </>
  )
}
