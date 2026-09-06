"use client"

import { useEffect, useState } from "react"
import Footer from "../../components/Footer.jsx"
import Lightbox from "../../components/Lightbox.jsx"
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
      <span className="section-label">Portfolio</span>
      <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Films & Videos</h1>
      <p style={{ maxWidth: 560, marginTop: 12 }}>
        Wedding highlight films, brand videos and behind-the-scenes stories.
      </p>

      {!loading && videos.length === 0 && <p style={{ marginTop: 30 }}>Abhi tak koi video add nahi hui — admin panel se add karein.</p>}

      <div className="grid grid-3" style={{ marginTop: 40 }}>
        {videos.map((v) => (
          <div className="card" key={v.id} onClick={() => setActive({ src: v.url, caption: v.caption, type: "video" })}>
            <video src={v.url} muted preload="metadata" />
            <span className="play-badge glass">▶</span>
            <div className="card-caption">{v.caption}</div>
          </div>
        ))}
      </div>

      <Footer />
      <Lightbox item={active} onClose={() => setActive(null)} />
    </>
  )
}
