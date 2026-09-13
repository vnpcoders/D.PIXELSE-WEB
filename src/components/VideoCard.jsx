"use client"

import { useEffect, useRef, useState } from "react"
import { registerAutoplayVideo } from "../lib/centerAutoplay.js"

export default function VideoCard({ video, onOpen }) {
  const videoRef = useRef(null)
  const [isTouch, setIsTouch] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setIsTouch(!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
  }, [])

  useEffect(() => {
    if (!isTouch) return
    return registerAutoplayVideo(videoRef.current, { sound: true })
  }, [isTouch])

  const hoverHandlers = !isTouch
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
    <div className="card" onClick={() => onOpen?.(video)} {...hoverHandlers}>
      <video
        ref={videoRef}
        src={video.url}
        muted={!isTouch}
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
