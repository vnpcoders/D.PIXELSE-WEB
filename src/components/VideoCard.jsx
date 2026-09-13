"use client"

import { useEffect, useRef, useState } from "react"

export default function VideoCard({ video, onOpen }) {
  const videoRef = useRef(null)
  const [isTouch, setIsTouch] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setIsTouch(!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
  }, [])

  useEffect(() => {
    if (!isTouch) return
    const el = videoRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          el.muted = false
          el.play().catch(() => {
            el.muted = true
            el.play().catch(() => {})
          })
        } else {
          el.pause()
        }
      },
      { threshold: [0, 0.6, 1] }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isTouch])

  const hoverHandlers = !isTouch
    ? {
        onMouseEnter: () => {
          const el = videoRef.current
          if (el) {
            el.muted = true
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
    <div className="card" onClick={() => onOpen?.(video)} {...hoverHandlers}>
      <video
        ref={videoRef}
        src={video.url}
        playsInline
        loop
        preload="auto"
        onLoadedData={(e) => {
          if (e.target.currentTime === 0) e.target.currentTime = 0.01
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && <span className="play-badge">▶</span>}
      <div className="card-caption">{video.caption}</div>
    </div>
  )
}
