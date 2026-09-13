"use client"

import { useRef, useState } from "react"

export default function VideoCard({ video, onOpen }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const hoverHandlers = {
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

  return (
    <div className="card" onClick={() => onOpen?.(video)} {...hoverHandlers}>
      <video
        ref={videoRef}
        src={video.url}
        muted
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
