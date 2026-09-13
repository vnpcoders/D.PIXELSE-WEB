"use client"

import { useEffect, useRef, useState } from "react"
import { registerAutoplayVideo } from "../lib/centerAutoplay.js"

export default function ReelCard({ reel, onOpen, mode = "scroll" }) {
  const videoRef = useRef(null)
  const [isTouch, setIsTouch] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setIsTouch(!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
  }, [])

  useEffect(() => {
    if (mode !== "scroll" || !isTouch) return
    return registerAutoplayVideo(videoRef.current, { sound: false })
  }, [mode, isTouch])

  const useHover = mode === "hover" || (mode === "scroll" && !isTouch)

  const hoverHandlers = useHover
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
