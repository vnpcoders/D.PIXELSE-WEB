"use client"

import { useEffect, useRef, useState } from "react"

export default function ReelCard({ reel, onOpen }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { threshold: [0, 0.6, 1] }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="card reel-card" onClick={() => onOpen?.(reel)}>
      <video
        ref={videoRef}
        src={reel.url}
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={(e) => {
          if (e.target.currentTime === 0) e.target.currentTime = 0.01
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && <span className="play-badge">▶</span>}
      <div className="card-caption">{reel.caption}</div>
    </div>
  )
}
