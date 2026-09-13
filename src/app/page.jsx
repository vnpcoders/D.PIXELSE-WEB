"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Footer from "../components/Footer.jsx"
import Lightbox from "../components/Lightbox.jsx"
import Reveal from "../components/Reveal.jsx"
import ReelCard from "../components/ReelCard.jsx"
import VideoCard from "../components/VideoCard.jsx"
import { supabase } from "../lib/supabaseClient.js"

function HeroReels({ reels }) {
  const [current, setCurrent] = useState(0)
  const videoRefs = useRef([])

  useEffect(() => {
    const v = videoRefs.current[current]
    if (v) {
      v.currentTime = 0
      v.play().catch(() => {})
    }
  }, [current, reels.length])

  if (reels.length === 0) {
    return (
      <div className="hero" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#e7ded2" }}>Abhi tak koi reel add nahi hui — admin panel se add karein.</p>
      </div>
    )
  }

  return (
    <div className="hero">
      {reels.map((r, i) => (
        <div className={`slide ${i === current ? "active" : ""}`} key={r.id}>
          <video
            ref={(el) => (videoRefs.current[i] = el)}
            muted
            playsInline
            preload="auto"
            src={r.url}
            onEnded={() => setCurrent((c) => (c + 1) % reels.length)}
          />
        </div>
      ))}

      <div className="hero-copy">
        <h1>{reels[current]?.caption || "D.PIXELSS"}</h1>
        <p className="hero-sub">
          We capture more than photographs — we capture emotions, stories, and
          unforgettable moments.
        </p>
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
          <h2>Candid</h2>
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
          <h2>Films</h2>
          <Link href="/video" className="view-all">VIEW ALL VIDEOS</Link>
        </Reveal>
        {!loading && videos.length === 0 && <p className="empty-note" style={{ color: "#cfc7ba" }}>Abhi tak koi video add nahi hui.</p>}
        <div className="grid grid-3">
          {videos.map((v, i) => (
            <Reveal key={v.id} delay={i * 80}>
              <VideoCard video={v} onOpen={(item) => setActive({ src: item.url, caption: item.caption, type: "video" })} />
            </Reveal>
          ))}
        </div>
      </section>

      <section>
        <Reveal as="div" className="section-head">
          <h2>Reels</h2>
          <Link href="/reels" className="view-all">VIEW ALL REELS</Link>
        </Reveal>
        {!loading && reels.length === 0 && <p className="empty-note">Abhi tak koi reel add nahi hui.</p>}
        <div className="grid grid-reels">
          {reels.slice(0, 4).map((r) => (
            <ReelCard key={r.id} reel={r} onOpen={(item) => setActive({ src: item.url, caption: item.caption, type: "reel" })} />
          ))}
        </div>
      </section>

      <Footer />
      <Lightbox item={active} onClose={() => setActive(null)} />
    </>
  )
}
