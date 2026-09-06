"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Footer from "../components/Footer.jsx"
import Lightbox from "../components/Lightbox.jsx"
import { supabase } from "../lib/supabaseClient.js"

const SLIDE_TIME = 5000

function HeroSlider({ slides }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_TIME)
    return () => clearInterval(t)
  }, [slides.length])

  if (slides.length === 0) {
    return (
      <div className="hero glass" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Abhi tak koi reel add nahi hui — admin panel se add karein.</p>
      </div>
    )
  }

  const slide = slides[index]

  return (
    <div className="hero">
      <motion.div
        key={index}
        className="slide"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {slide.type === "video" || slide.type === "reel" ? (
          <video src={slide.url} autoPlay muted loop playsInline />
        ) : (
          <img src={slide.url} alt={slide.caption} />
        )}
      </motion.div>

      <div className="slide-dots">
        {slides.map((_, i) => (
          <button key={i} className={i === index ? "active" : ""} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`}>
            {i === index && (
              <motion.span
                className="fill"
                key={index}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_TIME / 1000, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="hero-copy">
        <div>
          <span className="slide-tag">Featured</span>
          <h1>{slide.caption || "Recent work"}</h1>
        </div>
        <Link href="/contact" className="btn btn-solid">Book a shoot</Link>
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
        supabase.from("media").select("*").eq("type", "photo").order("created_at", { ascending: false }).limit(4),
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
      <HeroSlider slides={reels} />

      <div className="section-head">
        <h2>Recent photography</h2>
        <Link href="/photo" className="btn">View all photos</Link>
      </div>
      {!loading && photos.length === 0 && <p style={{ marginTop: 20 }}>Abhi tak koi photo add nahi hui.</p>}
      <div className="grid grid-mosaic">
        {photos.map((p) => (
          <div className="card" key={p.id} onClick={() => setActive({ src: p.url, caption: p.caption, type: "photo" })}>
            <img src={p.url} alt={p.caption} loading="lazy" />
            <div className="card-caption">{p.caption}</div>
          </div>
        ))}
      </div>

      <div className="section-head">
        <h2>Latest films</h2>
        <Link href="/video" className="btn">View all videos</Link>
      </div>
      {!loading && videos.length === 0 && <p style={{ marginTop: 20 }}>Abhi tak koi video add nahi hui.</p>}
      <div className="grid grid-3">
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
