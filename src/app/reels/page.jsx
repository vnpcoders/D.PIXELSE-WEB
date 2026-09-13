"use client"

import { useEffect, useState } from "react"
import Footer from "../../components/Footer.jsx"
import Lightbox from "../../components/Lightbox.jsx"
import Reveal from "../../components/Reveal.jsx"
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
      <section className="reels-section" style={{ paddingBottom: 0 }}>
        <Reveal as="div" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label">Portfolio</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>Reels</h1>
          <p style={{ maxWidth: 480, margin: "16px auto 0" }}>
            Short vertical stories from recent shoots — made for Instagram and
            YouTube Shorts.
          </p>
        </Reveal>

        {!loading && reels.length === 0 && <p className="empty-note">Abhi tak koi reel add nahi hui — admin panel se add karein.</p>}

        <div className="reel-strip">
          {reels.map((r, i) => (
            <Reveal key={r.id} delay={(i % 6) * 80}>
              <div className="card reel-card" onClick={() => setActive({ src: r.url, caption: r.caption, type: "reel" })}>
                <video src={r.url} muted preload="metadata" />
                <span className="play-badge">▶</span>
                <div className="card-caption">{r.caption}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
      <Lightbox item={active} onClose={() => setActive(null)} />
    </>
  )
}
