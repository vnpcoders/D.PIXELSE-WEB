"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Footer from "../components/Footer.jsx"
import Lightbox from "../components/Lightbox.jsx"
import Reveal from "../components/Reveal.jsx"
import { supabase } from "../lib/supabaseClient.js"

function HeroReels({ reels }) {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const videoRefs = useRef([])

  useEffect(() => {
    const v = videoRefs.current[current]
    if (v) {
      v.currentTime = 0
      v.play().catch(() => {})
    }
  }, [current])

  if (reels.length === 0) {
    return (
      <div className="hero" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#e7ded2" }}>Abhi tak koi reel add nahi hui — admin panel se add karein.</p>
      </div>
    )
  }

  return (
    <div className="hero">
      <div className="slide-dots">
        {reels.map((_, i) => (
          <button key={i} aria-label={`Reel ${i + 1}`}>
            <span
              className="fill"
              style={{
                transform: `scaleX(${i < current ? 1 : i === current ? progress : 0})`,
                transformOrigin: "left",
              }}
            />
          </button>
        ))}
      </div>

      {reels.map((r, i) => (
        <div className={`slide ${i === current ? "active" : ""}`} key={r.id}>
          <video
            ref={(el) => (videoRefs.current[i] = el)}
            muted
            playsInline
            src={r.url}
            onTimeUpdate={(e) => {
              if (i === current && e.target.duration) {
                setProgress(e.target.currentTime / e.target.duration)
              }
            }}
            onEnded={() => setCurrent((c) => (c + 1) % reels.length)}
          />
        </div>
      ))}

      <div className="hero-copy">
        <span className="slide-tag">D.PIXELSS Studio</span>
        <h1>{reels[current]?.caption || "D.PIXELSS Photography"}</h1>
        <hr className="divider" />
        <p className="hero-sub">
          We capture more than photographs — we capture emotions, stories, and
          unforgettable moments.
        </p>
        <div className="hero-cta">
          <Link href="/contact" className="btn btn-solid">Book a shoot</Link>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [active, setActive] = useState(null)
  const [reels, setReels] = useState([])
  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [reelsRes, photosRes, videosRes] = await Promise.all([
        supabase.from("media").select("*").eq("type", "reel").order("created_at", { ascending: false }).limit(5),
        supabase.from("media").select("*").eq("type", "photo").order("created_at", { ascending: false }).limit(6),
        supabase.from("media").select("*").eq("type", "video").order("created_at", { ascending: false }).limit(3),
      ])
      setReels(reelsRes.data || [])
      setPhotos(photosRes.data || [])
      setVideos(videosRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <HeroReels reels={reels} />

      <section>
        <Reveal as="div" className="section-head">
          <h2>Recent Photography</h2>
          <Link href="/photo" className="view-all">VIEW ALL PHOTOS</Link>
        </Reveal>
        {!loading && photos.length === 0 && <p className="empty-note">Abhi tak koi photo add nahi hui.</p>}
        <div className="grid grid-mosaic">
          {photos.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <div className="card" onClick={() => setActive({ src: p.url, caption: p.caption, type: "photo" })}>
                <img src={p.url} alt={p.caption} loading="lazy" />
                <div className="card-caption">{p.caption}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="films-section">
        <Reveal as="div" className="section-head">
          <h2>Latest Films</h2>
          <Link href="/video" className="view-all">VIEW ALL VIDEOS</Link>
        </Reveal>
        {!loading && videos.length === 0 && <p className="empty-note" style={{ color: "#cfc7ba" }}>Abhi tak koi video add nahi hui.</p>}
        <div className="grid grid-3">
          {videos.map((v, i) => (
            <Reveal key={v.id} delay={i * 80}>
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
