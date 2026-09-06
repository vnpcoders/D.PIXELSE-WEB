"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = item ? "hidden" : ""
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="lightbox-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="lightbox-box"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {item.type === "video" || item.type === "reel" ? (
              <video src={item.src} controls autoPlay />
            ) : (
              <img src={item.src} alt={item.caption || ""} />
            )}
            {item.caption && <div className="lightbox-caption">{item.caption}</div>}
            <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
