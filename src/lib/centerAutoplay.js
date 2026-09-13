"use client"

const registry = new Set()
let ticking = false
let listenerAdded = false

function centerDistance(el) {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  if (rect.bottom <= 0 || rect.top >= vh) return null
  const visibleRatio =
    (Math.min(rect.bottom, vh) - Math.max(rect.top, 0)) / rect.height
  if (visibleRatio < 0.5) return null
  const elCenter = rect.top + rect.height / 2
  return Math.abs(elCenter - vh / 2)
}

function update() {
  ticking = false
  let closest = null
  let closestDist = Infinity

  registry.forEach((entry) => {
    const el = entry.el
    if (!el || !document.body.contains(el)) return
    const dist = centerDistance(el)
    if (dist !== null && dist < closestDist) {
      closestDist = dist
      closest = entry
    }
  })

  registry.forEach((entry) => {
    const el = entry.el
    if (!el) return
    if (entry === closest) {
      if (el.paused) {
        el.muted = !entry.sound
        el.play().catch(() => {
          el.muted = true
          el.play().catch(() => {})
        })
      }
    } else if (!el.paused) {
      el.pause()
    }
  })
}

function onScroll() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(update)
  }
}

export function registerAutoplayVideo(el, { sound = false } = {}) {
  if (!el) return () => {}
  const entry = { el, sound }
  registry.add(entry)

  if (!listenerAdded) {
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    listenerAdded = true
  }

  onScroll()

  return () => {
    registry.delete(entry)
    if (!el.paused) el.pause()
  }
}
