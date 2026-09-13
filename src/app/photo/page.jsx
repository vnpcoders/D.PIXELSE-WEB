"use client"

import { useEffect, useState } from "react"
import Footer from "../../components/Footer.jsx"
import Lightbox from "../../components/Lightbox.jsx"
import Reveal from "../../components/Reveal.jsx"
import { supabase } from "../../lib/supabaseClient.js"

export default function Photo() {
  const [active, setActive] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("media").select("*").eq("type", "photo").order("created_at", { ascending: false })
      setPhotos(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <section style={{ paddingBottom: 0 }}>
        <Reveal as="div" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label">Portfolio</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>Photography</h1>
          <p style={{ maxWidth: 480, margin: "16px auto 0" }}>
            A selection of portraits, weddings, street and studio work — shot on
            location and in-studio.
          </p>
        </Reveal>

        {!loading && photos.length === 0 && <p className="empty-note">Abhi tak koi photo add nahi hui — admin panel se add karein.</p>}

        <div className="grid grid-mosaic">
          {photos.map((p, i) => (
            <Reveal key={p.id} delay={(i % 6) * 80}>
              <div className="card" onClick={() => setActive({ src: p.url, caption: p.caption, type: "photo" })}>
                <img src={p.url} alt={p.caption} loading="lazy" />
                <div className="card-caption">{p.caption}</div>
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
