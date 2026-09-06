"use client"

import { useEffect, useState } from "react"
import Footer from "../../components/Footer.jsx"
import Lightbox from "../../components/Lightbox.jsx"
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
      <span className="section-label">Portfolio</span>
      <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Photography</h1>
      <p style={{ maxWidth: 560, marginTop: 12 }}>
        A selection of portraits, weddings, street and studio work — shot on location and in-studio.
      </p>

      {!loading && photos.length === 0 && <p style={{ marginTop: 30 }}>Abhi tak koi photo add nahi hui — admin panel se add karein.</p>}

      <div className="grid grid-mosaic" style={{ marginTop: 40 }}>
        {photos.map((p) => (
          <div className="card" key={p.id} onClick={() => setActive({ src: p.url, caption: p.caption, type: "photo" })}>
            <img src={p.url} alt={p.caption} loading="lazy" />
            <div className="card-caption">{p.caption}</div>
          </div>
        ))}
      </div>

      <Footer />
      <Lightbox item={active} onClose={() => setActive(null)} />
    </>
  )
}
