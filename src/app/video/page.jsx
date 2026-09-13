"use client"

import { useEffect, useState } from "react"
import Footer from "../../components/Footer.jsx"
import Lightbox from "../../components/Lightbox.jsx"
import Reveal from "../../components/Reveal.jsx"
import VideoCard from "../../components/VideoCard.jsx"
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
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", color: "#F1ECE3" }}>Films &amp; Videos</h1>
        </Reveal>

        {!loading && videos.length === 0 && <p className="empty-note" style={{ color: "#cfc7ba" }}>Abhi tak koi video add nahi hui — admin panel se add karein.</p>}

        <div className="grid grid-3">
          {videos.map((v, i) => (
            <Reveal key={v.id} delay={(i % 6) * 80}>
              <VideoCard video={v} onOpen={(item) => setActive({ src: item.url, caption: item.caption, type: "video" })} />
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
      <Lightbox item={active} onClose={() => setActive(null)} />
    </>
  )
}
