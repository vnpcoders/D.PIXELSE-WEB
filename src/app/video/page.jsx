"use client"

import { useEffect, useState } from "react"
import Footer from "../../components/Footer.jsx"
import Lightbox from "../../components/Lightbox.jsx"
import Reveal from "../../components/Reveal.jsx"
import { supabase } from "../../lib/supabaseClient.js"

export default function Video() {
  const [active, setActive] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("media").select("*").eq("type", "video").order("created_at", { ascending: false })
      setVideos(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <section className="films-section" style={{ paddingBottom: 0 }}>
        <Reveal as="div" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label">Portfolio</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", color: "#F1ECE3" }}>Films &amp; Videos</h1>
          <p style={{ maxWidth: 480, margin: "16px auto 0", color: "#cfc7ba" }}>
            Wedding highlight films, brand videos and behind-the-scenes stories.
          </p>
        </Reveal>

        {!loading && videos.length === 0 && <p className="empty-note" style={{ color: "#cfc7ba" }}>Abhi tak koi video add nahi hui — admin panel se add karein.</p>}

        <div className="grid grid-3">
          {videos.map((v, i) => (
            <Reveal key={v.id} delay={(i % 6) * 80}>
              <div className="card" onClick={() => setActive({ src: v.url, caption: v.caption, type: "video" })}>
                <video src={v.url} muted preload="metadata" />
                <span className="play-badge">▶</span>
                <div className="card-caption">{v.caption}</div>
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
