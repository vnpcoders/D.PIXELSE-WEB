"use client"

import { useEffect, useRef, useState } from "react"

export default function ReelCard({ reel, onOpen, mode = "scroll" }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (mode !== "scroll") return
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
  }, [mode])

  const hoverHandlers =
    mode === "hover"
      ? {
          onMouseEnter: () => {
            const el = videoRef.current
            if (el) {
              el.currentTime = 0
              el.play().catch(() => {})
            }
          },
          onMouseLeave: () => {
            const el = videoRef.current
            if (el) el.pause()
          },
        }
      : {}

  return (
    <div className="card reel-card" onClick={() => onOpen?.(reel)} {...hoverHandlers}>
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
